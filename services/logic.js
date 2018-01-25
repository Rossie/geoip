var db = require('./database');
var ipApi = require('./ip-api');

var logic = {
    getIpData: function (ip) {
        return new Promise((resolve, reject) => {
            db.getIp(ip)
                .then(dbresult => {
                    if (dbresult) {
                        resolve(dbresult);
                    }
                    else {
                        return ipApi.lookup('json', ip);
                    }
                })
                .then(ipLookupResultStr => {
                    if (ipLookupResultStr == undefined) { return; }

                    let ipData = JSON.parse(ipLookupResultStr);
                    if (ipData.status == "success") {
                        return db.addIp(ip, ipData); // save ip address
                    }
                    else {
                        resolve({ ip: ip, data: ipData });
                    }
                })
                .then(addResult => {
                    if (addResult) {
                        return db.getIp(ip);
                    }
                })
                .then(dbresult => {
                    if (dbresult) {
                        resolve(dbresult);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};

module.exports = logic;