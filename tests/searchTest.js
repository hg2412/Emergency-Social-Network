var app = require('../app');
var supertest = require('supertest');

var request = supertest(app);
var should = require('should');
var chai = require('chai');
var assert = chai.assert;

var User = global.dbHandle.getModel("user");
var UserRole = global.dbHandle.getModel("userRole");

var aaaUser = {
    "username": "aaaa",
    "password": "12345678",
    "status" : "undefined"
};
var aaaUserRole = {
    "username": "aaaa",
    "privilege": "citizen",
    "accountStatus": "active"
};

describe('search controller', function () {

    before(function () {
        global.dbHandle.clearDB();
        var User = global.dbHandle.getModel('user');
        var u = {
            "username": "cccc",
            "password": "12345678",
            "status": "emergency"
        };
        User.create(u);
        var Announcement = global.dbHandle.getModel("announcement");
        var announ = {
            "username": "aaaa",
            "content": "hello world",
            "timestamp": "undefined"
        };
        Announcement.create(announ);
        var ChatPublic = global.dbHandle.getModel("chatMessage");
        var chatPublic = {
            "senderName": "aaaa",
            "message": "welcome to chat publicly",
            "timestamp": "undefined",
            "status": "undefined",
        };
        ChatPublic.create(chatPublic);
        var ChatPrivate = global.dbHandle.getModel("chatPrivately");
        var chatPrivate = {
            "senderName": "aaaa",
            "receiverName": "bbbb",
            "message": "welcome to chat privately",
            "timestamp": "undefined",
            "status": "undefined"
        };
        ChatPrivate.create(chatPrivate);
        User.create(aaaUser);
        UserRole.create(aaaUserRole);
    });

    it('search citizen with user name should return user list', function (done) {
        var agent1 = supertest.agent(app);
        var existUserData = {"username": "aaaa", "password": "12345678"};
        //login
        agent1
            .post('/login')
            .send(existUserData)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                assert.equal(res.body.status, "login");

                req = agent1.get('/search/citizenByUsername?username=cccc');
                req.expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(err, res) {
                        if (err) return done(err);
                        assert.equal(res.body.usersOffline[0].username, "cccc");
                        done();
                    });
            });
    });

    it('search citizen with status should return user list', function (done) {
        var agent1 = supertest.agent(app);
        var existUserData = {"username": "aaaa", "password": "12345678"};
        //login
        agent1
            .post('/login')
            .send(existUserData)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                assert.equal(res.body.status, "login");

                req = agent1.get('/search/citizenByStatus?status=emergency');
                req.expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(err, res) {
                        if (err) return done(err);
                        assert.equal(res.body.usersOffline[0].username, "cccc");
                        done();
                    });
            });
    });

    it('search citizen with announcement should return announcement list', function (done) {
        var agent1 = supertest.agent(app);
        var existUserData = {"username": "aaaa", "password": "12345678"};
        //login
        agent1
            .post('/login')
            .send(existUserData)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                assert.equal(res.body.status, "login");

                req = agent1.get('/search/announcement?words=["world"]');
                req.expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(err, res) {
                        if (err) return done(err);
                        assert.equal(res.body.announcements[0].content, "hello world");
                        done();
                    });
            });
    });

    it('search citizen with public messages should return public message list', function (done) {
        var agent1 = supertest.agent(app);
        var existUserData = {"username": "aaaa", "password": "12345678"};
        //login
        agent1
            .post('/login')
            .send(existUserData)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                assert.equal(res.body.status, "login");

                req = agent1.get('/search/publicMessages?words=["publicly"]');
                req.expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(err, res) {
                        if (err) return done(err);
                        assert.equal(res.body.publicMessages[0].message, "welcome to chat publicly");
                        done();
                    });
            });
    });

    it('search citizen with private messages should return private message list', function (done) {
        var agent1 = supertest.agent(app);
        var existUserData = {"username": "aaaa", "password": "12345678"};
        //login
        agent1
            .post('/login')
            .send(existUserData)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                assert.equal(res.body.status, "login");

                req = agent1.get('/search/privateMessages?words=["privately"]');
                req.expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(err, res) {
                        if (err) return done(err);
                        assert.equal(res.body.privateMessages[0].message, "welcome to chat privately");
                        done();
                    });
            });
    });

    it('render the search page when user logged in', function (done) {
        var agent1 = supertest.agent(app);
        var existUserData = {"username": "aaaa", "password": "12345678"};
        //login
        agent1
            .post('/login')
            .send(existUserData)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                assert.equal(res.body.status, "login");

                req = agent1.get('/search');
                req.expect(200)
                    .expect('Content-Type', 'text/html')
                    .end(
                        function(err, res){
                            var html = res.res.text;
                            assert(res.res.text.includes('search_result_container'));
                            done();
                        }
                    );
            });


    });

    // it('should render join community page when user is not logged in', function (done) {
    //     request
    //         .get('/search')
    //         .expect(200)
    //         .end(function(err, res) {
    //             var html = res.res.text;
    //             assert(html.includes("Join Community"));
    //             done();
    //         });

    // });




});

