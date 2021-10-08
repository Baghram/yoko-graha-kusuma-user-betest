const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const authentication = (req, res, next) => {
  try {
    const token = req.headers.token;
    let authenticated = jwt.verify(token, secret);
    req.authenticated = authenticated;
    return next();
  } catch (error) {
    return res.status(400).json({
      message: "Authentication Failed",
      error: error.message,
    });
  }
};

module.exports = authentication;
