const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {

    let reqests = Object.keys(req.headers)
        .map(key => ({key: key, value: req.headers[key]}));

    res.render('myreq', {data: {reqests: reqests}});
});

module.exports = router;
