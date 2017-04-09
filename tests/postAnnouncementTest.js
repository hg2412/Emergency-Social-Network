var app = require('../app');
var supertest = require('supertest');

var request = supertest(app);
var should = require('should');
var chai = require('chai');
var assert = chai.assert;
var data = {"username": "aaaa", "newAnnouncement": "announcement"};
var User = global.dbHandle.getModel('user');
var UserRole = global.dbHandle.getModel('userRole');
var Announcement = global.dbHandle.getModel('announcement');
var aaaaUser = {
    "username": "aaaa",
    "password": "12345678",
    "status": "undefined"
};
var aaaaLogin = {
    "username": "aaaa",
    "password": "12345678"
};
var aaaaUserRole = {
    "username": "aaaa",
    "privilege": "coordinator",
    "accountStatus": "active"
};
var bbbbUser = {
    "username": "bbbb",
    "password": "12345678",
    "status": "undefined"
};
var bbbbUserRole = {
    "username": "bbbb",
    "privilege": "administrator",
    "accountStatus": "active"
};
var bbbbLogin = {
    "username": "bbbb",
    "password": "12345678",
};
var aaaaAnnoucement = {
    "username": "bbbb",
    "content": "xxxxx",
    "timestamp": "2016-11-30"
};
describe('announcement controller', function () {
    describe('#render announcement page', function() {
        before(function () {
            global.dbHandle.clearDB();
            User.create(aaaaUser);
            UserRole.create(aaaaUserRole);
        });
        it('render the public announcement page when user with coordinator logged in', function (done) {
            var agent1 = supertest.agent(app);
            //login
            agent1
                .post('/login')
                .send(aaaaLogin)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    req = agent1.get('/announce');
                    req.expect(200)
                        .expect('Content-Type', 'text/html')
                        .end(
                            function(err, res){
                                var html = res.res.text;
                                assert(res.res.text.includes('announcement'));
                                done();
                            }
                        );
                });
        });
    });
    describe("#render announcement page", function() {
        before(function () {
            global.dbHandle.clearDB();
            User.create(bbbbUser);
            UserRole.create(bbbbUserRole);
        });
        it('render the public announcement page when user with administrator logged in', function (done) {
            var agent1 = supertest.agent(app);
            //login
            agent1
                .post('/login')
                .send(bbbbLogin)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.status, "login");
                    req = agent1.get('/announce');
                    req.expect(200)
                        .expect('Content-Type', 'text/html')
                        .end(
                            function(err, res){
                                var html = res.res.text;
                                assert(res.res.text.includes('announcement'));
                                done();
                            }
                        );
                });
        });
    });
    describe("#getAnnouncement()", function() {
        before(function () {
            global.dbHandle.clearDB();
            User.create(aaaaUser);
            UserRole.create(aaaaUserRole);
            Announcement.create(aaaaAnnoucement);
        });
        it('get latest announcement', function (done) {
            var agent1 = supertest.agent(app);
            //login
            agent1
                .post('/login')
                .send(aaaaLogin)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.status, "login");
                    req = agent1.get('/announce/latest');
                    req.expect(200)
                        .expect('Content-Type', /json/)
                        .end(
                            function(err, res){
                                assert.equal(res.body.announcement[0].content, aaaaAnnoucement.content);
                                done();
                            }
                        );
                });
        });
    });
    describe("#postAnnouncement()", function() {
        before(function () {
            global.dbHandle.clearDB();
            User.create(aaaaUser);
            UserRole.create(aaaaUserRole);
        });
        it('post announcement', function (done) {
            var agent1 = supertest.agent(app);
            //login
            agent1
                .post('/login')
                .send(aaaaLogin)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.status, "login");
                    req = agent1.post('/announce/post').send(data);
                    req.expect(200)
                        .expect('Content-Type', /json/)
                        .end(
                            function(err, res){
                                assert.equal(res.body.announcement.content, data.newAnnouncement);
                                done();
                            }
                        );
                });
        });
    });
});
