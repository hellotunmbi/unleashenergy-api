const jwt = require("jsonwebtoken");
// require("dotenv").config({ path: "variables.env" });

exports.generateToken = (id, phone, email, role) => {
  const token = jwt.sign(
    {
      id,
      phone,
      email,
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1y" }
  );
  return token;
};

// exports.default = Helper;
