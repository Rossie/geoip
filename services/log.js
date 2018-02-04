var mail = require('./mail');
var config = require('../config');

var oldError = console.error;
function ipzenError(message, ...params) {
    // invode old error, to output to stderr
    oldError(message, ...params);
    // send parameters and stack trace by mail
    var msg = [message, ...params].join('\n') + '\n' + getStackTrace();
    mail.sendMail('', `[${config.SITE_NAME}][ERROR] Error happened`, msg);
}
// replace original error with mine
console.error = ipzenError;

// https://stackoverflow.com/questions/6715571/how-to-get-result-of-console-trace-as-string-in-javascript-with-chrome-or-fire
var getStackTrace = function () {
    var obj = {};
    Error.captureStackTrace(obj, getStackTrace);
    return obj.stack;
};

module.exports = ipzenError;