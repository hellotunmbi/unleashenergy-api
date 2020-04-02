const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middlewares/async.middleware");

// LOGIN...
exports.login = asyncHandler(async (req, res, next) => {
  const phone = req.body.phone;

  // Check if phone is sent from API
  if (!phone) {
    res.json({
      status: 400,
      data: {
        message: "phone number required"
      }
    });
    return;
  }

  const user = await User.findOne({ phone: phone });

  console.log("User", user);

  if (!user) {
    //Save user to db with generated OTP
    // Return OTP to response
    const otp = Math.floor(Math.random() * 9000);

    const savedUser = await User.create({
      phone: phone,
      status: "pending",
      role: "user",
      authCode: otp
    });

    // TODO: Send OTP as sms and email

    res.json({
      status: 200,
      data: {
        message: "User registered",
        otp
      }
    });
  } else {
    // Check user status. If 'active', log them in
    // If not active, send OTP
    if (user["status"] && user["status"] === "active") {
      // Log in User

      const token = jwt.sign(
        {
          id: user._id,
          phone
        },
        process.env.JWT_SECRET,
        { expiresIn: "1y" }
      );

      res.json({
        status: 200,
        data: {
          message: "User found. You can login",
          user,
          token
        }
      });
    } else {
      // sendOTP(user["_id"]);

      const newOTP = generateOTP();

      const regenOTP = await User.findOneAndUpdate(
        { phone },
        { authCode: newOTP }
      );
      res.json({
        status: 200,
        data: {
          message: "User hasnt been activated",
          otp: newOTP
        }
      });
    }
  }
});

exports.verifyOTP = asyncHandler(async (req, res, next) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    res.json({
      status: 400,
      data: {
        message: "Phone Number and OTP required"
      }
    });
    return;
  }

  const verifiedOTP = await User.findOne({ phone, authCode: otp });

  if (verifiedOTP) {
    res.json({
      status: 200,
      data: {
        message: "Successfully Verified",
        otp: verifiedOTP.authCode
      }
    });
  } else {
    res.json({
      status: 400,
      data: {
        message: "Invalid OTP",
        user: verifiedOTP.authCode
      }
    });
  }
});

// const token = jwt.sign(
//   {
//     id,
//     fullname,
//     email
//   },
//   process.env.JWT_SECRET,
//   { expiresIn: "1y" }
// );

exports.register = asyncHandler(async (req, res, next) => {
  const { fullname, email, phone } = req.body;
  if (!fullname || !email) {
    res.json({
      status: 400,
      data: {
        message: "Full Name and Email Address are required"
      }
    });
  }

  const registered = await User.findOneAndUpdate(
    { phone },
    { fullname, email, status: "active" }
  );

  const token = jwt.sign(
    {
      id: registered._id,
      phone
    },
    process.env.JWT_SECRET,
    { expiresIn: "1y" }
  );

  res.json({
    status: 200,
    user: registered,
    token
  });
});

generateOTP = () => Math.floor(Math.random() * 9000);

// customErrorHandler = (fields, errorMessage) => {
//   if(typeof fields == Array) {

//   }
// }
