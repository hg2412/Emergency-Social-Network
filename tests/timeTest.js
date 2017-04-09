/**
 * Created by Haoxiang on 11/27/16.
 */
var app = require('../app');
var supertest = require('supertest');

var request = supertest(app);
var should = require('should');
var chai = require('chai');
var assert = chai.assert;
var time = require('../helpers/time.js')

describe('time helper', function () {
    it('time helper should return string of current time', function (done) {
        assert(time.getTime());
        done();
    });
});