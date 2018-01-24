const express = require('express');
const router = express.Router();
const path = require('path');
const ipApi = require('../services/ip-api');
const db = require('../services/database');

/* GET home page. */
router.get('/', function (req, res, next) {
    // get parameters and defaults
    let format = req.query.format || 'json';
    if (format == 'text') format = 'csv'; // translate text to csv for ip-api
    const ip = req.query.ip || req.ip;
    const geo = req.query.geo || false;

    ipApi.lookup(format, ip)
        .then(result => {
            if (format == 'csv') format = 'text'; // translate csv back to text
            res.type(format).send(result);

            return db.addIp(ip, result); // save ip address
        })
        .catch(error => {
            if (error.code != 'ER_DUP_ENTRY') { // duplicaton is ok for IP addresses
                console.error(error);
                res.json({ result: 'error', message: error });
            }
        });
});

module.exports = router;
