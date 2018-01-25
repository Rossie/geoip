const express = require('express');
const router = express.Router();
const path = require('path');
const ipApi = require('../services/ip-api');
const db = require('../services/database');
var logic = require('../services/logic');

/* GET home page. */
router.get('/', function (req, res, next) {
    // get parameters and defaults
    var ip = (req.ip || '').trim();
    if (!ip) {
        res.redirect('/');
        return;
    }

    logic.getIpData(ip)
        .then(ipData => {
            res.render('index', { data: ipData });
        })
        .catch(error => {
            res.render('index', { data: { error: error } });
        });
});

router.post('/', function (req, res, next) {
    var ip = (req.body.ip || '').trim();
    if (!ip) {
        res.redirect('/');
    }
    else {
        res.redirect('/ips/' + ip);
    }
});

module.exports = router;
