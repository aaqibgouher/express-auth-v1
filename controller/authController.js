const db = require("../database");
const { isValidEmail } = require("../utils/common");

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

module.exports = {
  register,
};
