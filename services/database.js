const orm = require("orm");

///////////////////////////////////
// Database credentials, settings
// https://github.com/dresende/node-orm2/wiki
///////////////////////////////////
const username = 'ipweb';
const password = '1234';
const host = 'localhost';
const dbname = 'ip_geo';
const debug = 'true';
///////////////////////////////////

var _db;
var _Ip;
var _Comments;
orm.connectAsync(`mysql://${username}:${password}@${host}/${dbname}?debug=${debug}`)
    .then(db => {
        _db = db;

        _Ip = db.define("ip", {
            id: { type: 'serial', key: true },
            ip: { type: "text", size: 20, required: true, unique: true },
            data: { type: "object" },
            post_date: { type: "date", time: true, required: true }
        });

        _Comments = db.define("comments", {
            id: { type: 'serial', key: true },
            ip_id: { type: "integer", index: true }, // TODO: it doesn't create the index!!!
            post_date: { type: "date", time: true, required: true },
            comment: { type: "text", big: true, required: true },
        });

        _Comments.hasOne('ip', _Ip, { reverse: 'comments' });

        // db.drop(); // recreate the database
        db.syncPromise()
            .catch(err => {
                throw err;
            });
    })
    .catch(err => {
        throw err;
    });

const dbFunctions = {
    addIp: function (ip, data) {
        return new Promise((resolve, reject) => {
            if (!ip.trim()) {
                reject('Parameter not specified: ip');
                return;
            }
            _Ip.create({
                ip: ip,
                data: data,
                post_date: new Date()
            }, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    },

    getIp: function(ip) {
        return new Promise((resolve, reject) => {
            _Ip.one({ ip: ip }, (err, ipItem) => {
                if (err) { throw err; }

                if (ipItem) {
                    _Comments.find({ip_id: ipItem.id}, (err, comments) => {
                        if (err) { throw err; }
                        ipItem.comments = comments;
                        resolve(ipItem);
                    });
                }
                else {
                    resolve(null);
                }
            });
        });
    },

    getIpComments: function (ip) {
        return new Promise((resolve, reject) => {
            dbFunctions.getIp(ip)
            .then(ipItem => {
                if (!ipItem) { // no comments if no ip record
                    resolve([]);
                    return;
                }
                
                _Comments.find({ip_id: ipItem.id}, (err, comments) => {
                    if (err) { throw err; }
                    resolve(comments);
                });
            })
            .catch(err => { throw err; });
        });
    },

    getIpCommentsById: function (id) {
        return new Promise((resolve, reject) => {
            _Comments.find({ip_id: id}, (err, comments) => {
                if (err) { throw err; }
                resolve(comments);
            });
        });
    },
            
    addIpComments: function(ip, comment) {
        return new Promise((resolve, reject) => {
            dbFunctions.getIp(ip)
            .then(ipItem => {
                if (!ipItem) { // no comments if no ip record
                    resolve(false);
                    return;
                }

                _Comments.create({
                    ip_id: ipItem.id,
                    post_date: new Date(),
                    comment: comment
                }, (err, result) => {
                    if (err) { throw err; }
                    resolve(result);
                });
            })
            .catch(err => { throw err; });            
        });
    }    
};

module.exports = dbFunctions;