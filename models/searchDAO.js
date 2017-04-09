"use strict";
var userOnlineInfo = require('./userOnlineInfo.js').userInfo;
var User = global.dbHandle.getModel("user");
var Announcement = global.dbHandle.getModel("announcement");
var ChatMessage = global.dbHandle.getModel("chatMessage");
var ChatPrivately = global.dbHandle.getModel("chatPrivately");

var searchDAO = {};

searchDAO.searchCitizenByUsername = function(username, callback){
	let regexUsername = new RegExp(username, 'i');
	User.find({"username": {$regex: regexUsername}}, function(err, users){
		let usersOnline = [];
		let usersOffline = [];
		for(let i in users){
			if(userOnlineInfo[users[i].username] == "online"){
				usersOnline.push(users[i]);
			}
			else{
				usersOffline.push(users[i]);
			}
		}
		usersOnline.sort(function(a, b){
			return a.username > b.username;
		});
		usersOffline.sort(function(a, b){
			return a.username > b.username;
		});
		callback(usersOnline, usersOffline);
	});
};

searchDAO.searchCitizenByStatus = function(status, callback){
	User.find({"status": status}, function(err, users){
		let usersOnline = [];
		let usersOffline = [];
		for(let i in users){
			if(userOnlineInfo[users[i].username] == "online"){
				usersOnline.push(users[i]);
			}
			else{
				usersOffline.push(users[i]);
			}
		}
		usersOnline.sort(function(a, b){
			return a.username > b.username;
		});
		usersOffline.sort(function(a, b){
			return a.username > b.username;
		});
		callback(usersOnline, usersOffline);
	});
};

searchDAO.searchAnnouncement = function(words,callback){
	let conds = [];
	for(let i in words){
		console.log(words[i]);
		conds.push({"content": {$regex: new RegExp("(^|[^\\w\\d])"+words[i]+"($|[^\\w\\d])", 'i')}});
	}
	let query = Announcement.find({$or:conds});

	query.sort({"_id": -1});
	query.exec(function(err, rs){
		callback(rs);
	});
};

searchDAO.searchPublicMessages = function(words, callback){
	let conds = [];
	for(let i in words){
		console.log(words[i]);
		conds.push({"message": {$regex: new RegExp("(^|[^\\w\\d])"+words[i]+"($|[^\\w\\d])", 'i')}});
	}
	let query = ChatMessage.find({$or:conds});
	query.sort({"_id": -1});
	query.exec(function(err, rs){
		callback(rs);
	});
};

searchDAO.searchPrivateMessages = function(words, callback){
	let conds = [];
	for(let i in words){
		console.log(words[i]);
		conds.push({"message": {$regex: new RegExp("(^|[^\\w\\d])"+words[i]+"($|[^\\w\\d])", 'i')}});
	}
	let query = ChatPrivately.find({$or:conds});
	query.sort({"_id": -1});
	query.exec(function(err, rs){
		callback(rs);
	});
};

module.exports = searchDAO;