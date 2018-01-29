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
    },
    sortIpQuery: function(queryArray) {
        return queryArray.sort(function(a,b){
            return getItemWeight(a.key) - getItemWeight(b.key);
        });
    },
    objectToArray: function (obj){
        return Object.keys(obj)
            .map(key => ({key:key, value: obj[key]}));
    },
    prepForView: function(ipData) {
        ipData.lat = ipData.data.lat;
        ipData.lon = ipData.data.lon;
        let dataArray = logic.objectToArray(ipData.data);
        ipData.data = logic.sortIpQuery(dataArray);
        return ipData;
    }
};

function getItemWeight(keyName){
    let weights = {
        query: 0,
        lat: 1,
        lon: 2,
        country: 3,
        countryCode: 4,
        regionName: 5,
        region: 6,
        city: 7,
        zip: 8,
        timezone: 9
    };
    return weights.hasOwnProperty(keyName) ? weights[keyName] : 9999;
}

module.exports = logic;