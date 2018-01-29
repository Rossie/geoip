const config = require('../config');
const nodemailer = require('nodemailer');

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