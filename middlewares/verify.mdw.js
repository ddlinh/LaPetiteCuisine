const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");

const verify = (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, "secret", function (err, decoded) {
      if (err) {
        res.redirect("/users/sign-in");
        throw createHttpError(err.message);
      }
      // const { decoded } = decoded;
      next();
    });
  } else {
    res.redirect("/users/sign-in");
  }
};
module.exports = verify;
