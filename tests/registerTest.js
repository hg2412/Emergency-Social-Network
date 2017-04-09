var app = require('../app');
var supertest = require('supertest');

var request = supertest(app);
var should = require('should');
var chai = require('chai');
var assert = chai.assert;

var existUserData = {"username": "aaaa", "password": "12345678"};
var nonExistUserData = {"username": "cccc", "password": "12345678"};

describe('register controller', function () {

    before(function () {
        global.dbHandle.clearDB();
        var User = global.dbHandle.getModel('user');
        var u = {
            "username": "aaaa",
            "password": "12345678",
            "status": "undefined"
        };
        User.create(u);
    });

    it('register with exist user should return false', function (done) {
        request
            .post('/register')
            .send(existUserData)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                assert.equal(res.body.status, false);
                done();
            });
    });

    it('register with non-exist user should return true', function (done) {
        request
            .post('/register')
            .send(nonExistUserData)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                assert.equal(res.body.status, true);
                done();
            });
    });
});
