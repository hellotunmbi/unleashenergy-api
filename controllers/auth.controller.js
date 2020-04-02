const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middlewares/async.middleware");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Jusibe = require("jusibe");

const jusibe = new Jusibe(
  process.env.JUSIBE_PUBLIC_KEY,
  process.env.JUSIBE_ACCESS_TOKEN
);

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
    var payload = {
      to: phone,
      from: "Unleash Energy",
      message: `Your Unleash Energy registration OTP Code is ${otp}`
    };

    // const smsSent = await jusibe.sendSMS(payload);
    jusibe
      .sendSMS(payload)
      .then(res => console.log("SENT", res.body))
      .catch(err => console.log("ERROR", err.body));

    // console.log(smsSent.body);

    res.json({
      status: 200,
      data: {
        message: "User registered",
        otp,
        phone
      }
      // sms: smsSent.body
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

exports.sendEmail = (req, res) => {
  const msg = {
    to: "hellotunmbi@gmail.com",
    from: "Unleash Energy <info@unleashenergy.com>",
    subject: "Test Email with Unleash",
    text: "intro title header",
    html: "This is a test email with Unleash Energy"
  };
  sgMail
    .send(msg)
    .then(sent => {
      res.json({
        message: "Email Sent Successfully"
      });
    })
    .catch(err =>
      res.json({
        message: "Unable to send message"
      })
    );
};
