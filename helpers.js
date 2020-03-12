const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// require("dotenv").config({ path: "variables.env" });

const Helper = {
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },

  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },

  generateToken(fullname, email) {
    const token = jwt.sign(
      {
        fullname,
        email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1w" }
    );
    return token;
  }
};

exports.default = Helper;
