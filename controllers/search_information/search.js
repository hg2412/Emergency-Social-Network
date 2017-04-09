"use strict";
var express = require('express');
var router = express.Router();
var searchDAO = require('../../models/searchDAO.js');
var isAuthenticated = require('../../middlewares/authenticate.js');

module.exports = function(passport){
router.get('/', isAuthenticated,function(req, res){
 	//if(req.session.user){
 	 	res.render('searchInformation');
 	// }
 	// else{
 	// 	res.render("joincommunity", {newUser: true});
 	// }
});

router.get('/citizenByUsername', isAuthenticated,function(req, res){
	let username = req.query.username;
	let callback = function(usersOnline, usersOffline){
		res.send({"usersOnline": usersOnline, "usersOffline": usersOffline});
	};
	searchDAO.searchCitizenByUsername(username, callback);	
});

router.get('/citizenByStatus', isAuthenticated,function(req, res){
	let status = req.query.status;
	let callback = function(usersOnline, usersOffline){
		res.send({"usersOnline": usersOnline, "usersOffline": usersOffline});
	};
	searchDAO.searchCitizenByStatus(status, callback);
});

router.get('/announcement', isAuthenticated,function(req, res){
	let words = eval(req.query.words);
	let callback = function(announcements){
		res.send({"announcements": announcements});
	};
	searchDAO.searchAnnouncement(words, callback);
});

router.get('/publicMessages', isAuthenticated,function(req, res){
	let words = eval(req.query.words);
	let callback = function(publicMessages){
		res.send({"publicMessages": publicMessages});
	};
	searchDAO.searchPublicMessages(words, callback);
});

router.get('/privateMessages', isAuthenticated,function(req, res){
	let words = eval(req.query.words);
	let callback = function(privateMessages){
		res.send({"privateMessages": privateMessages});
	};
	searchDAO.searchPrivateMessages(words, callback);
});

return router;

};