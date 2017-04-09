var User = global.dbHandle.getModel("user");
var Role = global.dbHandle.getModel("userRole");
var userOnlineInfo = require('../models/userOnlineInfo.js');

module.exports = function(req, res, next) {
    var username = req.session.user.username;
    User.findOne({ 'username': username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
            res.redirect('/');
        } else {
            Role.findOne({'username': username}, function (err, user) {
                if (err) {
                    res.redirect('/');
                } else if (!user) {
                    res.redirect('/');
                } else if (user.accountStatus === 'inactive') {
                    if (!req.session.user) {
                        console.log('not req.session.user');
                    }
                    if (req.session.user) {
                        console.log('req.session.user');
                        userOnlineInfo.logout(req.session.user.username);
                        req.session.user = null;
                    }
                    res.send(500, "Inactive User!");
                } else {
                    return next();
                }
            });
        }
    });
};