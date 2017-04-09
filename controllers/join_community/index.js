var express = require('express');
var router = express.Router();

var userOnlineInfo = require('../../models/userOnlineInfo.js');

var isAuthenticated = require('../../middlewares/authenticate.js');

var userTable = require('../../models/user.js');
var userRoleTable = require('../../models/userRole.js');


/*
 * GET home page.
 *
 * 1.   Every time we are at the edge of rending join community page,
 *      we check the session sent with req.
 * 2.   If no session, means that he is a new user,
 *      then we send a varible newUser with value 'true'
 *      so the ejs file can handle this page properly
 * 3.   If has session, means that he is an old user,
 *      then we send the varible newUser with value 'false'
 *      so the ejs file can handle this page properly
 *
 */
module.exports = function(passport){
router.get('/', function(req, res, next) {
    if (req.session.user) {
        res.render("joincommunity", {newUser: false});
    } else {
        res.render("joincommunity", {newUser: true});
    }
});

router.get('/chatPublicly', isAuthenticated,function(req, res) {
	if (req.session.user){
	    var User = global.dbHandle.getModel("user");
        var username = req.session.user.username;
        User.findOne({"username": username}, function(err, user) {
           if (user) {
               req.session.user.status = user.status;
               res.render('chatPublicly.ejs', {session:req.session});
           } else {
               res.send({status: "no_user"});
           }
        });
	} else {
		res.render('joincommunity', {newUser: true});
	}
});

router.get('/chatPrivately/:receiver', isAuthenticated,function(req, res) {
	if (req.session.user){
		var User = global.dbHandle.getModel("user");
		var receiver = req.params.receiver;
		var username = req.session.user.username;
  		//res.render('chatPrivately.ejs', {session:req.session, receiver: receiver});
  		User.findOne({"username": username}, function(err, user) {
           if (user) {
               req.session.user.status = user.status;
               res.render('chatPrivately.ejs', {session:req.session, receiver: receiver});
           } else {
               res.send({status: "no_user"});
           }
        });
	}else{
		res.render('joincommunity', {newUser: true});
	}
	// res.render('chatPublicly.ejs', {session:req.session});
});

router.route('/login')
.post(function(req, res,next){
	var User = global.dbHandle.getModel("user");
	var username = req.body.username;
	var password = req.body.password;

    // user has login
    userOnlineInfo.login(username);
    passport.authenticate('localvalid', function(err, user, info) {
        if(err) { return next(err); }
        if(info){
            if(info.message === 'Incorrect username'){
                res.send({status: "new_user"});
            }
            if(info.message === 'Invalid user'){
                res.send({status: "inactive"});
            }
        } else if(user){
            if(password === user.password){
                req.session.user = user;
                res.send({status: "login"});
            }
            else{
                res.send({status: "already_exist"});
            }
        } else{
            res.send({status: "new_user"});
        }
    })(req, res, next);
});

router.route('/register')
.post(function(req, res){
	var User = global.dbHandle.getModel('user');
	var username = req.body.username;
	var password = req.body.password;
	if (username === "ESNAdmin") {
		password = "admin";
		userRoleTable.createNewUser(username, "administrator", "active", function(user) {
			userTable.createNewUser(username, password, "ok", function(user) {
				req.session.user = user;
				res.send({status: true});
			});
		});
	} else {
		userTable.getUser(username, function (user) {
			if (user) {
				req.session.error = "Error: The username has already existed!";
				res.send({status: false});
			} else {
				userRoleTable.createNewUser(username, "citizen", "active", function () {
					userTable.createNewUser(username, password, "undefined", function (user) {
						req.session.user = user;
						res.send({status: true});
					});
				});
			}
		});
	}
});

router.route('/logout')
.get(function(req, res){
	if(req.session.user){
        userOnlineInfo.logout(req.session.user.username);
		req.session.user = null;
	}
	res.render("joincommunity", {newUser: true});
});

return router;

};
