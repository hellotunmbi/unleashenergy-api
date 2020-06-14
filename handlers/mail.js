const { registerSuccessMessage } = require("./email-templates");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendRegistrationSuccessEmail = (email, fullname) => {
  const msg = {
    to: email,
    from: {
      email: "support@unleashenergyapp.com",
      name: "Unleash Energy",
    },
    subject: "Registration Successful - Unleash Energy",
    text: "Thank you for registering on Unleash Energy App",
    html: registerSuccessMessage(fullname),
  };
  sgMail.send(msg);

  console.log({
    status: 200,
    message: "Mail sent successfully!!",
    recipient: email,
  });
};

exports.sendVerifyEmailMessage = (email, fullname) => {
  const msg = {
    to: email,
    from: {
      email: "support@unleashenergyapp.com",
      name: "Unleash Energy",
    },
    subject: "Verify Your Email - Unleash Energy",
    text: "Complete your registration by verifying your email address",
    html: verifyEmailMessage(fullname),
  };
  sgMail.send(msg);

  console.log({
    status: 200,
    message: "Mail sent successfully!!",
    recipient: email,
  });
};

// exports.default = EmailService;
