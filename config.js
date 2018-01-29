var config = {
    SITE_NAME: "ipzen.io",
    SITE_TITLE: "IP Query and Geolocation",

    ///////////////////////////////////
    // Database credentials, settings
    ///////////////////////////////////
    username: 'ipweb',
    password: '1234',
    host: 'localhost',
    dbname: 'ip_geo',
    debug: 'true',

    ///////////////////////////////////
    // Mail
    ///////////////////////////////////
    mail: {
        // https://nodemailer.com/smtp/
        smtpConfig: {
            host: 'smtp.yandex.com',
            port: 465,
            secure: true, // upgrade later with STARTTLS
            auth: {
                user: 'support@ipzen.io',
                pass: 'e4a18970ef3ccf9d'
            }
        },
        // https://nodemailer.com/message/
        messageDefaults: {
            from: 'support@ipzen.io',
            to: 'support@ipzen.io'
        }
    },

    ///////////////////////////////////
    // Contact Us
    ///////////////////////////////////
    contactus: {
        banCount: 1, // permits sending message after this count of messages
        clearTimeout: 60 * 30 * 1000 // permits sendig messages for this time of milliseconds
    },
};

module.exports = config;