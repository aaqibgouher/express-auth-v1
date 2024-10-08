const db = require("../database");
const { isValidEmail, generateOtp } = require("../utils/common");
const { generateToken } = require("../utils/jwt");
const { sendOtpEmailUtils } = require("../utils/nodemailer");

// STEPS
/*
    1) Fetch body data (done)
    2) validations
        - check for required fields (done)
        - check user by email (done)
        - create user
        - return success msg
*/
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // validations
    if (!firstName || !firstName.trim()) throw "First name is required";
    if (!lastName || !lastName.trim()) throw "Last name is required";
    if (!email || !email.trim()) throw "Email is required";
    if (!password || !password.trim()) throw "Password is required";
    if (!isValidEmail(email)) throw "Email is not valid";

    // check user by email
    const getUserQuery = `SELECT * FROM users where email = ?`;

    const [result] = await db.query(getUserQuery, [email]);

    if (result && result.length) {
      throw "Email already exists";
    }

    const insertQuery = `insert into users (email, password, firstName, lastName) values (?, ?, ?, ?) `;
    const [insertResult] = await db.query(insertQuery, [
      email,
      password,
      firstName,
      lastName,
    ]);

    res.json({
      status: 200,
      message: "Successfully registered",
      data: { insertResult },
    });
  } catch (error) {
    console.log(error, "from register");
    res.status(400).json({ status: 400, error });
  }
};

/*
  1) Fetch data from request (done)
  2) Validations:
    - email required, valid: (done)
    - check user exists by email, if not throw error: (done)
    - check if users otp already verified, if verified, then show otp already verified: (done)
    - send otp
      - generate otp: 6 digit: (done)
      - send email with otp (done)
      - update user -> otp
      - return otp sent
*/
const sendOtpEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // validations
    if (!email || !email.trim()) throw "Email is required";
    if (!isValidEmail(email)) throw "Email is not valid";

    // check if user exists by email
    const getUserQuery = `SELECT * FROM users where email = ?`;

    const [result] = await db.query(getUserQuery, [email]);

    if (!result || !result?.length)
      throw "User not found by email, please register";

    const user = result[0];

    if (user.isOtpVerified) throw "Otp already verified";

    // otp generated
    const otp = generateOtp();
    console.log(otp, "OTP *****");

    // send email
    await sendOtpEmailUtils(email, otp);

    // update user -> otp
    const updateQuery = `UPDATE users SET otp = ? WHERE id = ?`;
    const [updateResult] = await db.query(updateQuery, [otp, user.id]);

    res.json({
      status: 200,
      message: "Successfully send otp in email",
      data: { updateResult },
    });
  } catch (error) {
    console.log(error, "from register");
    res.status(400).json({ status: 400, error });
  }
};

/*
  1) Fetch request body payload (done)
  2) Validation:
    - Basic (done)
    - Advance:
      - check user exist by email, if not throw error (done)
      - check if otp already verified, if verified throw, otp already verified (done)
      - compare otp (req) with otp (db), if not equal, throw otp invalid (done)
  3) Update user -> isOtpVerified set true, otp -> ""
*/
const verifyOtp = async (req, res) => {
  try {
    // destructure
    const { email, otp } = req.body;

    // validations
    if (!email || !email.trim()) throw "Email is required";
    if (!isValidEmail(email)) throw "Email is not valid";
    if (!otp || !otp.trim()) throw "OTP is required";
    if (otp.length !== 6) throw "OTP must be 6 digits";

    // check if user exists by email
    const getUserQuery = `SELECT * FROM users where email = ?`;

    const [result] = await db.query(getUserQuery, [email]);

    if (!result || !result?.length)
      throw "User not found by email, please register";

    // extract first user
    const user = result[0];

    if (user.isOtpVerified)
      throw "Otp already verified, you can proceed to login";

    // if otp not matched
    if (otp !== user.otp) throw "Otp invalid";

    // update isOtpVerified & Otp
    const updateQuery = `UPDATE users SET isOtpVerified = ?, otp = ?, isActive = ? WHERE id = ?`;
    const [updateResult] = await db.query(updateQuery, [
      true,
      "",
      true,
      user.id,
    ]);

    res.json({
      status: 200,
      message: "Successfully verify otp",
      data: { updateResult },
    });
  } catch (error) {
    console.log(error, "from verify otp");
    res.status(400).json({ status: 400, error });
  }
};

/*
  1) Destructure request body (done)
  2) Validations
    - Basic: email/password is required (done)
    - Advance: 
      - check if user exist by email (done)
      - check if otp is verified or not (done)
      - check if user -> isActive is true/false, if inactive throw error (done)
      - check if pass matched pass (db) (done)
  3) Generate token
    - method to generate a token
  4) return user detail in the res + token
*/
const login = async (req, res) => {
  try {
    // data
    const { email, password } = req.body;

    // validations
    if (!email || !email.trim()) throw "Email is required";
    if (!isValidEmail(email)) throw "Email is not valid";
    if (!password || !password.trim()) throw "Password is required";

    // check if user exists by email
    const getUserQuery = `SELECT * FROM users where email = ?`;

    const [result] = await db.query(getUserQuery, [email]);

    if (!result || !result.length) throw "Email not found, please register";

    const user = result[0];

    // check if otp is verified or not
    if (!user.isOtpVerified) throw "Otp is not verfied, please verify";

    // check if user is active/inactive
    if (!user.isActive) throw "User is inactive, please contact to admin";

    // check if password matched or not
    if (password !== user.password) throw "Email/Password is incorrect";

    // generate token
    const token = generateToken({ id: user.id, email: user.email });

    res.json({
      status: 200,
      message: "Successfully login",
      data: {
        id: user.id,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.log(error, "from verify otp");
    res.status(400).json({ status: 400, error });
  }
};

const getMe = async (req, res) => {
  try {
    res.json({
      status: 200,
      message: "Successfully login",
      data: { userInfo: req.user },
    });
  } catch (error) {
    console.log(error, "from verify otp");
    res.status(400).json({ status: 400, error });
  }
};

module.exports = {
  register,
  sendOtpEmail,
  verifyOtp,
  login,
  getMe,
};
