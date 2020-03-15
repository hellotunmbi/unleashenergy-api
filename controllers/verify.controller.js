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
      { _id: id, status: "unverified" },
      { status: "verified" },
      function(err, user) {
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
                name: "Purple Coin Investment",
                email: "support@purpcoininvest.com"
              },
              subject: "Welcome to PurpCoin Invest",
              text: "Welcome to Purple Coin Investment",
              html: `<div><img src="https://res.cloudinary.com/dlfaitrcf/image/upload/v1580859728/man-in-blue-suit-999267_g5wkho.jpg" /></div><br/>
						Howdy ${fullname},<br/><br/>
						Yippee!! You have been successfully registered on the PurpCoin Investment app.<br/><br/>
						You can begin your cryptocurrency investment right from the app.<br/><br/> <br/><br/>
						Yours,<br/><br/>
						<strong>Purple Coin Investment</strong>`
            };
            sgMail.send(msg);

            res.send(
              '<h3 style="margin: 2rem;"> Email Successfully Verified.<br/>You can login to the PurpCoinInvest app</h3>'
            );
          }
          // res.json(user);
        }
      }
    );
  }
};
