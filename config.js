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
            to: 'rossie.g@gmail.com'
        }
    }
};

module.exports = config;