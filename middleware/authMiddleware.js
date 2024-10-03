const { verifyToken } = require("../utils/jwt");
const db = require("../database");

/*
    1) fetch token (done)
        a) Validations:
            - token is required (done)
            - token decode (done)
            - if not decode, invalid token (done)
    2) Check if user exist by id, if not throw err
    3) Once done, next ()
*/
const isAuthenticated = async (req, res, next) => {
  try {
    console.log("Middleware");
    // 1) fetch token
    const { authorization: token } = req.headers;

    if (!token) throw "Token is required";

    const decoded = await verifyToken(token);
    console.log(decoded, "from decode *****");

    const getUserQuery = `SELECT * FROM users where id = ?`;

    const [result] = await db.query(getUserQuery, [decoded.id]);

    if (!result || !result.length) throw "Invalid token, user not found";

    const user = result[0];
    delete user.password;
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 400, error });
  }
};

module.exports = {
  isAuthenticated,
};
