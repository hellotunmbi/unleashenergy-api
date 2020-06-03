const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) return res.json({ status: 403, message: "No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err)
      return res.json({
        status: 500,
        message: "Failed to authenticate token.",
        err,
      });
    // if everything good, save to request for use in other routes
    req.id = decoded.id;
    req.phone = decoded.phone;
    next();
  });
};

exports.verifyAdminToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) return res.json({ status: 403, message: "No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.json({
        status: 500,
        message: "Failed to authenticate token.",
        err,
      });
    } else if (decoded.role !== "admin") {
      return res.json({
        status: 501,
        message: "You are not authorized access this portal.",
        err,
      });
    }
    // if everything good, save to request for use in other routes

    req.id = decoded.id;
    req.phone = decoded.phone;
    next();
  });
};
