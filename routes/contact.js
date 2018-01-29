const express = require('express');
const router = express.Router();
const mail = require('../services/mail');

router.get('/', function (req, res, next) {

    res.render('contact');
});

router.post('/', function(req, res, next){
    let input_name = req.body.name;
    let input_email = req.body.email;
    let input_phone = req.body.phone;
    let input_message = req.body.message;

    mail.sendMail(input_email, '[ipzen.io] User message', 
        `name: ${input_name} <${input_email}>\n`+
        `phone: ${input_phone}\n`+
        `message: ${input_message}`
    )
        .then(result => {
            console.log(result);
            req.flash('mail_success', 'Your message has been successfully sent to us, thank you.');
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
