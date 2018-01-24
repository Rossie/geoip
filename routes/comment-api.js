var express = require('express');
var db = require('../services/database');
var router = express.Router();

/* GET home page. */
router.get('/:ip', function (req, res, next) {
    const ip = req.params.ip || false;
    if (!ip) {
        res.json({ result: 'error', message: 'Parameter not specified: ip' });
        return;
    }

    db.getIpComments(ip)
        .then(comments => {
            res.json({ result: 'ok', comments: comments });
        })
        .catch(error => {
            res.json({ result: 'error', message: error });        
        });
});

router.post('/:ip', function (req, res, next) {
    const ip = req.params.ip || false;
    const comment = req.body.comment || false;

    if (!ip || !comment) {
        res.json({ result: 'error', message: 'Invalid parameters.' });
        return;
    }
    
    db.addIpComments(ip, comment)
    .then(result => {
        res.json({ result: 'ok', comment: result });
    });
});

module.exports = router;
