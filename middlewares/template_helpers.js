
function setup(req, res, next) {
    /**
     * Setting helper function to check wether the navigation item is active or not
     * It is used in views\blocks\navbar.ejs
     */
    res.locals.isNavItemActive = function(baseUrl) {
        if (baseUrl instanceof Array) {
            return baseUrl.indexOf(req.baseUrl) >= 0 ? 'active' : '';
        }
        else {
            return req.baseUrl == baseUrl ? 'active' : '';
        }
    };

    res.locals.getStatusCss = function(ipItem) {
        let cssMap = {
            statussuccess: 'text-success',
            statusfail: 'text-danger'
        };
        return cssMap[ipItem.key+ipItem.value];
    };
    
    next();
}

module.exports = setup;