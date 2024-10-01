const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET, // Secret key
    { expiresIn: "1h" } // Token expiry
  );

  return token;
};

module.exports = {
  generateToken,
};
