const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authCtrl = require("./user.controller");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// REGISTER...
exports.register = async function(req, res) {
  const { fullname, email } = req.body;
  const status = "unverified";

  // Generate wallet and investment addresses
  const wallet = await this.generateAddress();
  const investment = await this.generateAddress();

  const walletKey = wallet.pkey;

  try {
    const userData = {
      fullname,
      email,
      wallet: wallet,
      investment: investment,
      status,
      wkey: walletKey
    };

    let user = new User(userData);

    // res.json({
    //   status: 200,
    //   data: user
    // });

    await User.register(user, req.body.password);
    const id = user._id;

    const token = jwt.sign(
      {
        fullname,
        email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1w" }
    );

    const hostURL = "https://mycrypto-api.herokuapp.com/api/verify/";

    //Send verification email...
    const msg = {
      to: email,
      from: {
        email: "support@purpcoininvest.com",
        name: "Purple Coin Investment"
      },
      subject: "Verify Your Email - PurpCoinInvest",
      text: "Welcome to PurpCoin Invest App",
      html: `Dear ${fullname},<br/><br/>
    				We have received your request to create an account on PurpCoin Invest App.<br/><br/>
    				Kindly confirm your email to complete your registration process by clicking the button below:<br/><br/>
    				<a href="${hostURL}${id}"><button style="padding: 1rem 2rem; font-size: 1rem; background-color: rgba(83, 28, 179, 0.57); color: #FFFFFF; border-radius: 4px">Verify Email</button></a>`
    };
    sgMail.send(msg);

    res.json({
      status: 200,
      data: {
        message: "Successfully Registered",
        token,
        user
      }
    });
  } catch (err) {
    res.json({
      status: 400,
      data: {
        message: "Unable to register. Try again",
        error: err
      }
    });
  }
};


// LOGIN...
exports.login = (req, res, next) => {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }

    const { fullname, email, status } = user;
    const id = user._id;

    if (!user) {
      res.json({
        status: 404,
        data: {
          message: "Invalid Login Credentials",
          err
        }
      });
    } else if (status === "unverified") {
      res.json({
        status: 401,
        data: {
          message:
            "Account Not Verified. Check your email for Verification Link"
        }
      });
    } else if (status === "verified") {
      const token = jwt.sign(
        {
          fullname,
          email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1w" }
      );

      res.json({
        status: 200,
        data: {
          message: "Successfully Logged In",
          user,
          token,
          info
        }
      });
    } else {
      res.json({
        status: 400,
        data: {
          message: "User cannot be authenticated."
        }
      });
    }
  })(req, res, next);
};