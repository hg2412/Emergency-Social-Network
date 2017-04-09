var app = require('../app');
var supertest = require('supertest');
var request = supertest(app);
var should = require('should');
var chai = require('chai');
var assert = chai.assert;

var existUserData = {"username": "aaaa", "password": "12345678"};
var nonExistUserData = {"username": "bbbb", "password": "12345678"};
var wrongPasswordData = {"username": "aaaa", "password": "123456"};
var invalidUserData = {"username": "dddd", "password": "12345678"};

describe('login controller', function () {
    before(function () {
        global.dbHandle.clearDB();
        var User = global.dbHandle.getModel('user');
        var UserRole = global.dbHandle.getModel("userRole");
        var u = {
            "username": "aaaa",
            "password": "12345678",
            "status": "ok"
        };
        var uRole = {
            "username":"aaaa",
            "privilege":"citizen",
            "accountStatus":"active"
        };
        var invalidu = {
            "username": "dddd",
            "password": "12345678",
            "status": "ok"
        };
        var invalidRole = {
            "username":"dddd",
            "privilege":"citizen",
            "accountStatus":"inactive"
        };
        User.create(u);
        User.create(invalidu);
        UserRole.create(uRole);
        UserRole.create(invalidRole);
    });

    // todo: How to assure the user exists
    it('login with exist user should return login status', function (done) {
        request
            .post('/login')
            .send(existUserData)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                assert.equal(res.body.status, "login");
                done();
            });
    });
    it('login with invalid user should return inactive status', function (done) {
        request
            .post('/login')
            .send(invalidUserData)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                assert.equal(res.body.status, "inactive");
                done();
            });
    });

    it('login with non-exist user should return new_user', function (done) {
        request
            .post('/login')
            .send(nonExistUserData)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                assert.equal(res.body.status, "new_user");
                done();
            });
    });

    it('login with wrong password should return already_exist status', function (done) {
        request
            .post('/login')
            .send(wrongPasswordData)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                assert.equal(res.body.status, "already_exist");
                done();
            });
    });

    it('should log out', function (done) {
        var agent1 = supertest.agent(app);
        var existUserData = {"username": "aaaa", "password": "12345678"};
        //login
        agent1
            .post('/login')
            .send(existUserData)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                assert.equal(res.body.status, "login");
                req = agent1.get('/logout');
                req.expect(200)
                    .end(function () {
                            done();
                    });
            });
    });
});