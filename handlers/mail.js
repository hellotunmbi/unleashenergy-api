import { otpEmail, registerSuccessEmail } from "./email-templates";
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const EmailService = {
  sendOTPEmail(email, fullname, message) {
    const { email, fullname } = req.body;
    const msg = {
      to: email,
      from: {
        email: "support@purpcoininvest.com",
        name: "Purple Coin Investment"
      },
      subject: "Verify Your Email - Unleash Energy",
      text: "Unleash Energy - Confirm Your Email",
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
};

exports.default = EmailService;
