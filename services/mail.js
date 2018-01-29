const config = require('../config');
const nodemailer = require('nodemailer');

/* 
- In the contact page, please use this smtp:
support@ipzen.io
pass: e4a18970ef3ccf9d
That is, when someone fills the contact form, nodejs sends us an email using this smtp.
The mail dns is assigned to Yandex, so you should use yandex smtp address.
https://yandex.com/support/mail/mail-clients.html
 */

let transporter = nodemailer.createTransport(config.mail.smtpConfig, config.mail.messageDefaults);

// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error(error);
    } else {
        console.log(config.mail.smtpConfig.host + ' server is ready to take our messages');
    }
});

var mailFunctions = {
    sendMail: function(from, subject, txtMsg){
        return new Promise((resolve, reject) => {
            // https://nodemailer.com/message/
            transporter.sendMail({
                replyTo: from,
                subject: subject,
                text: txtMsg
            }, (err, info) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(info);
                }
            });
        });
    }
};

module.exports = mailFunctions;