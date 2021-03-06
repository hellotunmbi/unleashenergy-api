const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middlewares/async.middleware");
const ErrorResponse = require("../utils/errorResponse");
const moment = require("moment");
const sgMail = require("@sendgrid/mail");
const axios = require("axios");
const Helper = require("../helpers");

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
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }

    const { fullname, email, phone, status, role } = user;
    const id = user._id;

    if (!user) {
      res.json({
        status: 400,
        data: {
          message: "Invalid Login Credentials",
          err,
        },
      });
    } else if (status === "pending" && role === "user") {
      res.json({
        status: 401,
        data: {
          message:
            "Account Not Verified. Check your email for Verification Link",
        },
      });
    } else if (status === "active" && role === "user") {
      // Generate token...
      const token = Helper.generateToken(id, phone, email, role);

      res.json({
        status: 200,
        data: {
          message: "Successfully Logged In",
          user,
          token,
          info,
        },
      });
    } else {
      res.json({
        status: 400,
        data: {
          message: "User cannot be authenticated.",
        },
      });
    }
  })(req, res, next);
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
      // TODO: Generate token here...

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
  const status = "pending";
  const role = "user";

  if (!fullname || !email) {
    res.json({
      status: 400,
      data: {
        message: "Full Name and Email Address are required",
      },
    });
  }

  const userData = {
    fullname,
    email,
    phone,
    status,
    role,
  };

  let user = new User(userData);
  await User.register(user, req.body.password);

  const id = user._id;

  const hostURL = "http://api.unleashenergyapp.com/api/verify/";

  const msg = {
    to: email,
    from: {
      email: "support@unleashenergyapp.com",
      name: "Unleash Energy",
    },
    subject: "Verify Your Email - Unleash Energy",
    text: "Complete your registration by verifying your email address",
    html: `Dear ${fullname},<br/><br/>
    				We have received your request to create an account on Unleash Energy.<br/><br/>
    				Kindly confirm your email to complete your registration process by clicking the button below:<br/><br/>
            <a href="${hostURL}${id}"><button style="padding: 1rem 2rem; font-size: 1rem; background-color: #0b1f3a; color: #FFFFFF; border-radius: 4px">Verify Email</button></a><br/><br/>
            -------<br/>
            Unleash Energy`,
  };
  sgMail.send(msg);

  res.json({
    status: 200,
    data: {
      message: "User successfully registered",
      user,
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
  // Send OTP as SMS using Jusibe...
  // var payload = {
  //   to: phone,
  //   from: "Unleash Energy",
  //   message: `Unleash Energy OTP Code is ${otp}`,
  // };

  // const smsSent = await jusibe.sendSMS(payload);
  // console.log(`SMS SENT TO: ${phone}`, smsSent.body);

  const message = `Your OTP Code is ${otp}`;

  const smsURL = `http://www.smslive247.com/http/index.aspx?cmd=sendmsg&sessionid=bc655dce-9971-4897-bf5b-fd997d271fe8&message=${message}&sender=Unleash&sendto=${phone}&msgtype=0`;

  axios
    .get(smsURL)
    .then((response) => {
      console.log(`SMS SENT TO: ${phone}`);
    })
    .catch((error) => {
      console.log("ERROR IN SENDING SMS::", error);
    });
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
    case "verifyemail":
      emailService.sendVerifyEmailMessage(recipient, fullname);
      break;
    default:
      console.log("No email available to be sent");
  }
};

// ---------------------------------------------------------
