const express = require('express');
const router = express.Router();
const mail = require('../services/mail');
const config = require('../config');

router.get('/', function (req, res, next) {
    res.render('contact');
});

/////////////////////////////
// Message Guard
/////////////////////////////
var msgCount = {};
router.post('/', function (req, res, next) {
    if (!msgCount[req.ip]) msgCount[req.ip] = 0;
    if (msgCount[req.ip] >= config.contactus.banCount) {
        req.flash('mail_error', {
            // COMMENT Please put spaces before and after binary operators
            // COMMENT I told before clearly, in any IDE it is just one keyboard shortcut to format your code.
            mgs: `Too many messages from your IP, please try again after ${~~(config.contactus.clearTimeout / 1000 / 60)} minutes.`
        });
        res.redirect('/contact');
    }
    else {
        next();
    }
});

// COMMENT Not ideal, but as an ad-hoc solution it is ok.
// clear counter interval
setInterval(() => {
    msgCount = {};
}, config.contactus.clearTimeout);

// COMMENT Please put a space after parantheses
router.post('/', function (req, res, next) {
    let input_name = req.body.name;
    let input_email = req.body.email;
    let input_phone = req.body.phone;
    let input_message = req.body.message;

    mail.sendMail(input_email, '[ipzen.io] User message',
        `name: ${input_name} <${input_email}>\n` +
        `phone: ${input_phone}\n` +
        `message: ${input_message}`
    )
        .then(result => {
            req.flash('mail_success', 'Your message has been successfully sent to us, thank you.');
            msgCount[req.ip]++;
            res.redirect('/contact');
        })
        .catch(err => {
            console.log(err);
            req.flash('mail_error', {
                mgs: 'Error: Your message hasn\'t been sent.',
                errObj: err
            });
            res.redirect('/contact');
        });
});

module.exports = router;
