const express = require('express');
const router = express.Router();
const path = require('path');
const ipApi = require('../services/ip-api');

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
        })
        .catch(error => {
            console.error(error);
            res.send(error);
        });
});

module.exports = router;
