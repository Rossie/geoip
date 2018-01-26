const express = require('express');
const router = express.Router();
const path = require('path');
const ipApi = require('../services/ip-api');
const db = require('../services/database');

/* GET home page. */
router.get('/', function (req, res, next) {
    // get parameters and defaults
    var format = req.query.format || 'json'; // default json
    if (format == 'text') format = 'csv'; // translate text to csv for ip-api
    const ip = req.query.ip || req.ip; // default own ip
    var geo = req.query.geo && req.query.geo != '0' && req.query.geo != 'false'; // default geo is false

    if (!geo && ip == req.ip && format == 'json') {
        res.json({ ip: req.ip });
    }
    else {
        ipApi.lookup(format, ip)
            .then(ipString => {
                if (format == 'csv') format = 'text'; // translate csv back to text

                new Promise((resolve, reject) => {
                    var ipJson;

                    // if not json format was requested, get the json format
                    if (format != 'json') {
                        ipApi.lookup('json', ip)
                            .then(ipJsonString => {
                                ipJson = JSON.parse(ipJsonString);
                                resolve(ipJson);
                            });
                    }
                    else {
                        ipJson = JSON.parse(ipString);
                        resolve(ipJson);
                    }
                }).then((ipJson) => {
                    if (ipJson.status != "success") {
                        res.status(400); // set Bad Request
                    }

                    if (!geo && ipJson.status == "success") {
                        switch (format) {
                            case 'json':
                                ipString = `{"ip": ${ipJson.query}}`;
                                break;
                            case 'xml':
                                ipString = '<?xml version="1.0" encoding="UTF-8"?>' +
                                    '<query>' +
                                    `<query><![CDATA[${ipJson.query}]]></query>` +
                                    '</query>';
                                break;
                            case 'text':
                                ipString = ipJson.query;
                                break;
                        }
                    }

                    res.type(format).send(ipString); // send result data with format  <--- SEND

                    if (ipJson.status == "success") {
                        return db.addIp(ip, ipJson); // save ip data to DB
                    }
                })
                    .catch(error => {
                        if (error.code != 'ER_DUP_ENTRY') { // duplicaton is ok for IP addresses
                            console.error(error);
                            res.status(500).json({ result: 'error', message: error });
                        }
                    });
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ result: 'error', message: error });
            });
    }

});

module.exports = router;
