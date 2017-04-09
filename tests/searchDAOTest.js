

var app = require('../app');

var should = require('should');
var expect = require('expect.js');
var searchDAO = require('../models/searchDAO.js');
var userOnlineInfo = require('../models/userOnlineInfo.js').userInfo;



describe('searchCitizenByUsername', function () {
    describe('#searchCitizenByUsername()', function (done) {
        before(function () {
            global.dbHandle.clearDB();
            var User = global.dbHandle.getModel("user");
            var u = {
                "username": "lalalalala",
                "password": "666666",
                "status": "undefined"
            };
            var u3 = {
                "username": "lalaa",
                "password": "666666",
                "status": "undefined"
            };
            User.create(u);
            User.create(u3);
            userOnlineInfo["lalalalala"] = "online";
            userOnlineInfo["lalaa"] = "online"
           // userInfo["lalalalala"] = "online";
            var u2 = {
                "username": "lala2",
                "password": "666666",
                "status": "undefined"
            };
            User.create(u2);
           // userInfo["lala2"] = "offline";
            userOnlineInfo["lala2"] = "offline"
        });
        it ('respond with matching records', function(done) {
            //todo
            
            var username = "lalaa";
           
            var callback = function(usersOnline, usersOffline){
                //res.send({"usersOnline": usersOnline, "usersOffline": usersOffline});
                //usersOffline.username.should.exist(username);
                expect(usersOnline[0].username).to.contain(username);

                done();
            }
            searchDAO.searchCitizenByUsername(username, callback);

        });
        it ('respond with matching records', function(done) {
            //todo
            
            
            var user2="lala2";
            var callback = function(usersOnline, usersOffline){
                //res.send({"usersOnline": usersOnline, "usersOffline": usersOffline});
                //usersOffline.username.should.exist(username);
                expect(usersOffline[0].username).to.contain(user2);
                
                done();
            }
            searchDAO.searchCitizenByUsername(user2, callback);

        });

    });
});


describe('searchCitizenByStatus', function () {
    describe('#searchCitizenByStatus()', function (done) {
        before(function () {
            global.dbHandle.clearDB();
            var User = global.dbHandle.getModel('user');
            var u = {
                "username": "lalalalala",
                "password": "666666",
                "status": "ok"
            };
            User.create(u);
            "lalalalala"
            userOnlineInfo["lalalalala"] = "online"
            var u2 = {
                "username": "lala2",
                "password": "666666",
                "status": "ok"
            };
            User.create(u2);
            userOnlineInfo["lala2"] = "offline"
        });
        it ('respond with matching records', function(done) {
            //todo
            var status = "ok";
            var callback = function(usersOnline, usersOffline){
               // res.send({"usersOnline": usersOnline, "usersOffline": usersOffline});
                //usersOffline.username.should.exist(username);
                expect(usersOnline[0].username).to.contain("lalalalala");
                expect(usersOffline[0].username).to.contain("lala2");
                done();
            }
            searchDAO.searchCitizenByStatus(status, callback);
        });

    });
});



describe('searchAnnouncement', function () {
    describe('#searchAnnouncement()', function (done) {
        before(function () {
            global.dbHandle.clearDB();
            var date = new Date();
            var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) ;
            var announcement = global.dbHandle.getModel('announcement');
            var u = {
                "username": "lalalalala",
                "content": "testnnouncement",
                "timestamp": time.toString()
               // "timestamp": "1991-"

            };
            announcement.create(u);
        });
        it ('respond with matching records', function(done) {
            
            var words = ["testnnouncement","abc"];
            var callback = function(announcements){
               // res.send({"announcements": announcements});
                //announcements.username.should.equal("lalalalala");
                expect(announcements[0].username).to.eql('lalalalala');
                done();
            }
            searchDAO.searchAnnouncement(words,callback);

        });

    });
});


describe('searchPublicMessages', function () {
    describe('#searchPublicMessages()', function (done) {
        before(function () {
            global.dbHandle.clearDB();
            var date = new Date();
            var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) ;
            
            var chatMessage = global.dbHandle.getModel('chatMessage');
            var Message = {
                senderName: 'hahaha',
                //receiver:'edian',
                message: 'testsearchPublicMessages',
                timestamp: time.toString(),
                status:'ok'
            };
            chatMessage.create(Message);
        });
        it ('respond with matching records', function(done) {
            //todo
            var words = ["testsearchPublicMessages"];
            var callback = function(publicMessages){
               // res.send({"publicMessages": publicMessages});
               // publicMessages.senderName.should.equal("hahaha");
                expect(publicMessages[0].senderName).to.eql('hahaha');
                done();
            };
            searchDAO.searchPublicMessages(words, callback);
        });

    });
});

describe('searchPrivateMessages', function () {
    describe('#searchPrivateMessages()', function (done) {
        before(function () {
            global.dbHandle.clearDB();
            var date = new Date();
            var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) ;
            var message = {
                senderName: 'hahaha',
                receiverName:'edian',
                message: 'testsearchchatPrivately',
                timestamp: time.toString(),
                status:'ok'
            };
            var chatPrivately = global.dbHandle.getModel('chatPrivately');
            chatPrivately.create(message);
        });
        it ('respond with matching records', function(done) {
            //todo
            var words = ["testsearchchatPrivately",'test'];
            var callback = function(privateMessages){
               // res.send({"privateMessages": privateMessages});
                //privateMessages.senderName.should.equal("hahaha");
                expect(privateMessages[0].senderName).to.eql('hahaha');
                done();
            };
            searchDAO.searchPrivateMessages(words, callback);
        });

    });
});

