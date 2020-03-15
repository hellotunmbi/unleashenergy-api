const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authCtrl = require("../routes/user.route");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const bitcore = require("bitcore-lib");

const Address = bitcore.Address;
const PrivateKey = bitcore.PrivateKey;
const PublicKey = bitcore.PublicKey;
const Networks = bitcore.Networks;

// REGISTER...
exports.register = async function(req, res) {
  const { fullname, email } = req.body;
  const status = "unverified";

  // Generate wallet and investment addresses
  const wallet = await this.generateAddress();

  try {
    const userData = {
      fullname,
      email,
      status,
      wallet
    };

    let user = new User(userData);

    await User.register(user, req.body.password);
    const id = user._id;

    const token = jwt.sign(
      {
        id,
        fullname,
        email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1w" }
    );

    const hostURL = "https://purpcoin-api.herokuapp.com/api/verify/";

    //Send verification email...
    const msg = {
      to: email,
      from: {
        email: "support@purpcoininvest.com",
        name: "Purple Coin Investment"
      },
      subject: "Verify Your Email - PurpCoinInvest",
      text: "PurpCoin Invest App - Confirm Your Email",
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
    user.hash = "";
    user.salt = "";
    user["wallet"].privateKey = "";

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

generateAddress = () => {
  var privateKey = PrivateKey();
  var publicKey = PublicKey(privateKey);
  var addressRaw = Address(publicKey, Networks.livenet);
  let address = addressRaw.toString();

  // console.log("Private Key", privateKey.bn);

  data = {
    privateKey: privateKey.bn.toString(),
    accountNo: address
  };

  return data;
};

function sendEmail() {
  const { email, fullname } = req.body;
  const msg = {
    to: email,
    from: {
      email: "support@purpcoininvest.com",
      name: "Purple Coin Investment"
    },
    subject: "Verify Your Email - PurpCoinInvest",
    text: "PurpCoin Invest App - Confirm Your Email",
    html: `Dear ${fullname},<br/><br/>
    				We have received your request to create an account on PurpCoin Invest App.<br/><br/>
    				Kindly confirm your email to complete your registration process by clicking the button below:<br/><br/>
    				<a href="#"><button style="padding: 1rem 2rem; font-size: 1rem; background-color: rgba(83, 28, 179, 0.57); color: #FFFFFF; border-radius: 4px">Verify Email</button></a>`
  };
  sgMail.send(msg);

  res.json({
    status: 200,
    message: "Mail sent successfully!!"
  });
}
