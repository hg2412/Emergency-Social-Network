var app = require('../app');
var expect = require('expect.js');
var should = require('should');
var supertest = require('supertest');
var request = supertest(app);
var chai = require('chai');
var assert = chai.assert;

var User = global.dbHandle.getModel("user");
var UserRole = global.dbHandle.getModel("userRole");

var hahaUser = {
    "username": "hahaha",
    "password": "123456",
    "status": "undefined"
};
var hahaLogin = {
    "username": "hahaha",
    "password": "123456"
};
var hahaUserRole = {
    "username": "hahaha",
    "privilege": "citizen",
    "accountStatus" : "active"
};
var aaaUser = {
    "username": "aaa",
    "password": "123456",
    "status" : "undefined"
};
var aaaUserRole = {
    "username": "aaa",
    "privilege": "citizen",
    "accountStatus": "active"
};
var adminUser = {
    "username": "ESNAdmin",
    "password": "admin",
    "status": "ok"
};
var adminUserRole = {
    "username": "ESNAdmin",
    "privilege": "administrator",
    "accountStatus": "active"
};

describe('admin controller',function(){
    describe('#displayUserList()',function(){
        before(function() {
            global.dbHandle.clearDB();
            User.create(hahaUser);
            User.create(adminUser);
            UserRole.create(adminUserRole);
        });
        it('should display user list',function(done){
            var agent2 = supertest.agent(app);
            agent2
                .post("/login")
                .send(adminUser)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    req = agent2.get('/admin/userlist');
                    req.expect(200)
                        .expect('Content-Type', /json/)
                        .end(
                            function(err, res){
                                assert.equal(res.body.userlist[1], "hahaha");
                                done();
                            }
                        );
                });
        });
    });
    
    describe('#postModifiedUserInfo()',function() {
        before(function () {
            global.dbHandle.clearDB();
            User.create(hahaUser);
            User.create(adminUser);
            UserRole.create(hahaUserRole);
            UserRole.create(adminUserRole);
        });
        it('post Modified User Info with same user name', function (done) {
            var agent2 = supertest.agent(app);
            var hahaUser1 = {
                "oldUserName": "hahaha",
                "newUserName": "hahaha",
                "password": "12345678",
                "privilege": "coordinator",
                "accountStatus": "inactive"
            };
            agent2
                .post("/login")
                .send(adminUser)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    req = agent2.post('/admin/userInfo').send(hahaUser1);
                    req.expect(200)
                        .expect('Content-Type', /json/)
                        .end(
                            function (err, res) {
                                if (err) return done(err);
                                assert.equal(res.body.status, true);
                                done();
                            }
                        );
                });
        });
    });
    describe('#postModifiedUserInfo()', function () {
        before(function () {
            global.dbHandle.clearDB();
            User.create(adminUser);
            User.create(hahaUser);
            User.create(aaaUser);
            UserRole.create(adminUserRole);
            UserRole.create(hahaUserRole);
            UserRole.create(aaaUserRole);
        });
        it('post Modified User Info with existing user name', function (done) {
            var agent2 = supertest.agent(app);
            var hahaUser1 = {
                "oldUserName": "hahaha",
                "newUserName": "aaa",
                "password": "12345678",
                "privilege": "coordinator",
                "accountStatus": "inactive"
            };
            agent2
                .post("/login")
                .send(adminUser)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    req = agent2.post('/admin/userInfo').send(hahaUser1);
                    req.expect(200).expect('Content-Type', /json/)
                        .end(
                            function(err, res){
                                if (err) return done(err);
                                assert.equal(res.body.status, false);
                                done();
                            }
                        );
                });
        });
    });

    describe("#postModifiedUserInfo()", function() {
        before(function () {
            global.dbHandle.clearDB();
            User.create(hahaUser);
            User.create(aaaUser);
            User.create(adminUser);
            UserRole.create(hahaUserRole);
            UserRole.create(aaaUserRole);
            UserRole.create(adminUserRole);
        });
        it('post Modified User Info with no exist user name', function (done) {
            var agent2 = supertest.agent(app);
            var hahaUser1 = {
                "oldUserName": "hahaha",
                "newUserName": "jjj",
                "password": "12345678",
                "privilege": "coordinator",
                "accountStatus": "inactive"
            };
            agent2
                .post("/login")
                .send(adminUser)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    req = agent2.post('/admin/userInfo').send(hahaUser1);
                    req.expect(200).expect('Content-Type', /json/)
                        .end(
                            function(err, res){
                                assert.equal(res.body.status, true);
                                done();
                            }
                        );
                });
        });
    });

    describe("#postModifiedUserInfo()", function() {
        before(function() {
            global.dbHandle.clearDB();
            User.create(hahaUser);
            UserRole.create(hahaUserRole);
        });
        it('citizen or coordinator cannot enter admin controller', function (done) {
            var agent2 = supertest.agent(app);
            agent2
                .post("/login")
                .send(hahaLogin)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    req = agent2.get('/admin').expect(500);
                    req.expect('Content-Type', /text-plain/i)
                        .end(
                            function(err, res){
                                assert.equal(res.body, "Low Privilege");
                                done();
                            }
                        );
                    done();
                });
        });
    });
});