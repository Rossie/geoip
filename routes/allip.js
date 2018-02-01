const express = require('express');
const router = express.Router();

// test valid IP: https://regexr.com/3k1rm
var ipTestRx = '(\\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\\b)';
var defaultUri = '/allip/0.0.0.0-255.255.255.255';
var ipParts = '(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)';

router.get('/', function (req, res, next) {
    res.redirect(defaultUri);
});

router.get('/:ip1-:ip2', function (req, res, next) {
    let ip1 = req.params.ip1 || '';
    let ip2 = req.params.ip2 || '';
    // test if IP parameters are valid
    if (![ip1, ip2].every(ip => (new RegExp(ipTestRx, 'ig')).test(ip))) {
        res.redirect(defaultUri);
        return;
    }

    // '1.2.3.4' => [ 1, 2, 3, 4 ]
    var ipArr1 = ip2arr(ip1);
    var ipArr2 = ip2arr(ip2);

    // find the first different octet where need to iterate through
    actIdx = ipArr1.findIndex((oct, idx) => oct != ipArr2[idx]);

    // generate IP range pairs
    let ipRangeLink = [];
    let ipRangeText = [];
    let fromOct = ipArr1[actIdx];
    let toOct = ipArr2[actIdx];
    for (let i = fromOct; i <= toOct; i++) {
        ipArr1[actIdx] = i;
        ipArr2[actIdx] = i;
        ipRangeLink.push(ipArr1.join('.') + (actIdx < 3 ? '-' + ipArr2.join('.') : ''));
        ipRangeText.push(ipArr1.join('.') + (actIdx < 3 ? ' - ' + ipArr2.join('.') : ''));
    }

    res.render('allip', { data: { ipRangeLink: ipRangeLink, ipRangeText: ipRangeText } });
});

router.get('/:ip', function (req, res, next) {
    res.redirect('/ips/' + req.params.ip);
});

// Converts IP string to array: '1.2.3.4' => [ 1, 2, 3, 4 ]
function ip2arr(ip) {
    return (new RegExp(ipParts, 'ig')).exec(ip).slice(1, 5).map(strVal => ~~strVal);
}

// COMMENT These not need anymoore, but good for have it for the future
// Decomposition of IPv4 address from decimal notation to its binary value.
/*function ip2int(oct1, oct2, oct3, oct4) {
    if (typeof oct1 === 'string') {
        return ip2int(...ip2arr(oct1));
    }
    return ~~oct1 << 3 * 8 | ~~oct2 << 2 * 8 | ~~oct3 << 8 | ~~oct4;
}

function int2ip(ipInt) {
    return (ipInt >>> 3 * 8) + '.' + ((ipInt >>> 2 * 8) & 255) + '.' + ((ipInt >>> 8) & 255) + '.' + (ipInt & 255);
}*/

module.exports = router;
