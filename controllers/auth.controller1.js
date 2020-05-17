const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middlewares/async.middleware");
const ErrorResponse = require("../utils/errorResponse");
const moment = require("moment");
const sgMail = require("@sendgrid/mail");
const axios = require("axios");

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
  const status = "pending";

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
  };

  let user = new User(userData);

  await User.register(user, req.body.password);
  const id = user._id;

  const token = jwt.sign(
    {
      id,
      phone,
      email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1y" }
  );

  const hostURL = "https://unleash-api.herokuapp.com/api/verify/";

  const msg = {
    to: email,
    from: {
      email: "support@unleashenergy.com",
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
