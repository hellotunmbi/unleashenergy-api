const User = require("../models/User");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// UPDATE SINGLE USER
exports.confirmUserAccount = (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.send('<h2 style="margin: 2rem;"> Invalid User Account </h2>');
  } else {
    User.findOneAndUpdate(
      { _id: id, status: "pending" },
      { status: "active" },
      function (err, user) {
        if (err) {
          res.send('<h3 style="margin: 2rem;"> Unable to verify email </h3>');
        } else {
          if (!user) {
            res.send(
              '<h3 style="margin: 2rem;">Your email has already been verified</h3>'
            );
          } else {
            const { fullname, email } = user;

            const msg = {
              to: email,
              from: {
                name: "Unleash Energy",
                email: "support@unleashenergy.com",
              },
              subject: "Welcome to Unleash Energy",
              text: "Welcome to Unleash Energy",
              html: `<div><img src="https://res.cloudinary.com/dlfaitrcf/image/upload/v1580859728/man-in-blue-suit-999267_g5wkho.jpg" /></div><br/>
						Dear ${fullname},<br/><br/>
            Thank you for registering on the Unleash Energy App.<br/><br/>
            Our services includes:<br/><br/>
            <ul>
                <li>Order Gas Refill and get it delivered to your doorstep</li>
                <li>Request our maintenance services</li>
                <li>Purchase quality gas-related equipments</li>
                <li>Talk to us about gas-related service</li>
            </ul><br/><br/>
            All these services can be performed on our Unleash Energy app, available on Playstore(Android) and Appstore(iOS)<br/><br/>
            `,
            };
            sgMail.send(msg);

            res.send(
              '<h3 style="margin: 2rem;"> Email Successfully Verified.<br/>You can login to the Unleash Energy app</h3>'
            );
          }
          // res.json(user);
        }
      }
    );
  }
};
