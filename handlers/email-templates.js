const otpMessage = {};

const registerSuccessMessage = (fullname) => `Dear ${fullname},<br/><br/>
    Thank you for registering on the Unleash Energy App.<br/><br/>
    Our services includes:<br/><br/>
    <ul>
        <li>Order Gas Refill and get it delivered to your doorstep</li>
        <li>Request our maintenance services</li>
        <li>Purchase quality gas-related equipments</li>
        <li>Talk to us about gas-related service</li>
    </ul><br/><br/>
    All these services can be performed on our Unleash Energy app, available on Playstore(Android) and Appstore(iOS)<br/><br/>
    `;

const verifyEmailMessage = (fullname) => `Dear ${fullname},<br/><br/>
    Thank you for registering on the Unleash Energy App.<br/><br/>
    Our services includes:<br/><br/>
    <ul>
        <li>Order Gas Refill and get it delivered to your doorstep</li>
        <li>Request our maintenance services</li>
        <li>Purchase quality gas-related equipments</li>
        <li>Talk to us about gas-related service</li>
    </ul><br/><br/>
    All these services can be performed on our Unleash Energy app, available on Playstore(Android) and Appstore(iOS)<br/><br/>
    `;

const orderSuccessMessage = (fullname) => {};

module.exports = { registerSuccessMessage, verifyEmailMessage };
