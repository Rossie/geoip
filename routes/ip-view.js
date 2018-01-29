var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../services/database');
var logic = require('../services/logic');

/* GET home page. */
router.get('/:ip', function (req, res, next) {
    var ip = (req.params.ip || '').trim();

    // if no IP provided redirect to main page
    if (!ip) {
        res.redirect('/');
        return;
    }

    logic.getIpData(ip)
        .then(ipData => {
            res.render('ip-view', { data: logic.prepForView(ipData) });
        })
        .catch(error => {
            res.render('ip-view', { data: { error: error } });
        });
});

module.exports = router;
