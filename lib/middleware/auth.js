const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];

  if (token || typeof token !== "undefined") {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        return res.status(400).json({
          message: err.message
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(400).json({
      message: "No Token Provided"
    });
  }
};

/**
 *
 *
 * @param {Array} roles
 * @returns
 */
function authorize(roles) {
  return function(req, res, next) {
    if (roles.indexOf(req.user.role) <= -1) {
      return res
        .status(401)
        .json({ message: "You don't have appropriate rights" });
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
