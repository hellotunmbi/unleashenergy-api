const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middlewares/async.middleware");
const ErrorResponse = require("../utils/errorResponse");
const moment = require("moment");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const emailService = require("../handlers/mail");

const Jusibe = require("jusibe");

// ---------------------------------------------------------

const jusibe = new Jusibe(
  process.env.JUSIBE_PUBLIC_KEY,
  process.env.JUSIBE_ACCESS_TOKEN
);

// ---------------------------------------------------------
// LOGIN USER...

exports.login = asyncHandler(async (req, res, next) => {
  const phone = req.body.phone;

  // Check if phone is sent from API
  if (!phone) {
    res.json({
      status: 400,
      data: {
        message: "phone number required",
      },
    });
    return;
  }

  const user = await User.findOne({ phone: phone });

  console.log("User", user);

  if (!user) {
    // Generate OTP...
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otp_expiry = moment().add(1, "day");

    // Save to DB...
    const savedUser = await User.create({
      phone: phone,
      status: "pending",
      role: "user",
      authCode: otp,
      otp_expiry,
    });

    sendOTPSMS(phone, otp);

    res.json({
      status: 200,
      data: {
        message: "User registered",
        phone,
      },
      // sms: smsSent.body
    });
  } else {
    const newOTP = generateOTP();
    const otp_expiry = moment().add(1, "day");

    sendOTPSMS(phone, newOTP);

    const regenOTP = await User.findOneAndUpdate(
      { phone },
      { authCode: newOTP, otp_expiry }
    );
    res.json({
      status: 200,
      data: {
        message: "User found but needs to login",
        phone,
      },
    });
    // }
  }
});

// ---------------------------------------------------------
// Verify OTP...

exports.verifyOTP = asyncHandler(async (req, res, next) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    res.json({
      status: 400,
      data: {
        message: "Phone Number and OTP required",
      },
    });
    return;
  }

  // Check with your phone and otp
  // if found and status is not active, return message and status
  // If found and status is active, return message and user data
  const verifiedOTP = await User.findOne({
    phone,
    authCode: otp,
    otp_expiry: { $gte: moment() },
  });

  if (!verifiedOTP) {
    res.json({
      status: 400,
      data: {
        message: "Invalid OTP or OTP Expired",
      },
    });
  } else {
    if (verifiedOTP["status"] && verifiedOTP["status"] != "active") {
      res.json({
        status: 200,
        data: {
          message: "OTP Verified but user not active yet",
          status: verifiedOTP["status"],
        },
      });
      return;
    } else if (verifiedOTP["status"] && verifiedOTP["status"] === "active") {
      const token = jwt.sign(
        {
          id: verifiedOTP._id,
          phone,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1y" }
      );
      res.json({
        status: 200,
        data: {
          message: "User found. You can login",
          user: verifiedOTP,
          token,
        },
      });
    } else {
      res.json({
        status: 400,
        data: {
          message: "Unable to verify OTP",
        },
      });
    }
  }
});

// ---------------------------------------------------------
// Register User...

exports.register = asyncHandler(async (req, res, next) => {
  const { fullname, email, phone } = req.body;
  if (!fullname || !email) {
    res.json({
      status: 400,
      data: {
        message: "Full Name and Email Address are required",
      },
    });
  }

  const registered = await User.findOneAndUpdate(
    { phone },
    { fullname, email, status: "active" },
    { new: true }
  );

  const token = jwt.sign(
    {
      id: registered._id,
      phone,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1y" }
  );

  sendEmail("registration", email, fullname);

  res.json({
    status: 200,
    data: {
      message: "User successfully registered",
      user: registered,
      token,
    },
  });
});

// ---------------------------------------------------------
// Generate OTP...

generateOTP = () => Math.floor(Math.random() * 9000);

// ---------------------------------------------------------
// Resend OTP...

exports.resendOTP = asyncHandler(async (req, res, next) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return next(
      new ErrorResponse("Expecting phone and otp but got incomplete data", 400)
    );
  }

  sendOTPSMS(phone, otp);

  res.json({
    status: 200,
    data: {
      message: "OTP Resent",
    },
  });
});

// ---------------------------------------------------------
// Send OTP SMS...

sendOTPSMS = async (phone, otp) => {
  // Send OTP as SMS...
  var payload = {
    to: phone,
    from: "Unleash Energy",
    message: `Unleash Energy OTP Code is ${otp}`,
  };

  const smsSent = await jusibe.sendSMS(payload);
  console.log(`SMS SENT TO: ${phone}`, smsSent.body);
};

// ---------------------------------------------------------
// Send Email Address...

sendEmail = (mailType, recipient, fullname) => {
  if (!recipient || !mailType || !fullname) {
    console.log("Incomplete body parameters to send email");
    return;
  }

  switch (mailType) {
    case "registration":
      emailService.sendRegistrationSuccessEmail(recipient, fullname);
      break;
    case "Papayas":
      console.log("Mangoes and papayas are $2.79 a pound.");
      break;
    default:
      console.log("No email available to be sent");
  }
};

// ---------------------------------------------------------
