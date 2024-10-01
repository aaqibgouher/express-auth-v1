const jwt = require("jsonwebtoken");

const JWT_SECRET = "thisIsMySecretForJWT";

const generateToken = (payload) => {
  const token = jwt.sign(
    payload,
    JWT_SECRET, // Secret key
    { expiresIn: "1h" } // Token expiry
  );

  return token;
};

module.exports = {
  generateToken,
};
