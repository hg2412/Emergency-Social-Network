var express = require('express');
var router = express.Router();
var isAuthenticated = require('../../middlewares/authenticate.js');


function getTime() {
    var date = new Date();
    var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) ;
    return time.toString();
}

module.exports = function(passport){

	router.get('/', isAuthenticated,function(req, res){
		if(req.session.user){
			res.render('postAnnouncement');
		} else{
			res.render('joincommunity', {newUser: true});
		}
	});

	router.route('/post')
	.post(function(req, res,next){
		passport.authenticate('coordinatorPrivilege', function(err, user, info) {
			if (err) { return next(err); }
			if(info){
				if(info.message === "Not coordinator"){

					//res.send(500,'showPrivilegeAlert');
					res.send({status: "privilege"});
				}
			}
			if(!info){
				var Announcement = global.dbHandle.getModel("announcement");
				var username = req.body.username;
				var newAnnouncement = req.body.newAnnouncement;
				var time = getTime();
				Announcement.create({
					"username": username,
					"content": newAnnouncement,
					"timestamp": time
				}, function(err, announcement){
					res.send({"announcement": announcement});
				});
			}
		})(req, res, next);
	});

	router.route('/latest')
	.get(function(req, res,next){
		var username = req.session.user.username;
		var Role = global.dbHandle.getModel("userRole");
		Role.findOne({'username': username}, function (err, user) {
			if (err) { return next(err); }
			if (!user) {
				return res.redirect('/');
			}
			if (user.accountStatus === 'inactive') {
				res.send({status: "invalid"});
			}
			if(user.privilege === 'citizen'){
				res.send({status: "privilege"});
			}
			else{
				var Announcement = global.dbHandle.getModel("announcement");
				var query = Announcement.find({});
				query.limit(10);
				query.sort({"_id": -1});
				query.exec(function(err, rs){
					res.send({"announcement": rs});
				});
			}
		});
	});

	return router;
};
