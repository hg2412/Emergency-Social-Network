process.env.NODE_ENV = 'test';
var app = require('../app');
var supertest = require('supertest');
var request = supertest(app);
var should = require('should');
var chai = require('chai');
var assert = chai.assert;
var userLocation = require("../models/userLocation");
var UserLocation = global.dbHandle.getModel('userLocation');

describe('UserLocation Model', function () {
    before(function (done) {
        global.dbHandle.clearDB();
        
        var u1 = {
            "name": "AAA",
            "latitude": 100,
            "longitude": 100
        };
        UserLocation.create(u1);
        var u2 = {
            "name": "BBB",
            "latitude": 100.05,
            "longitude": 99.95
        };
        UserLocation.create(u2);
        var u3 = {
            "name": "CCC",
            "latitude": 102.2,
            "longitude": 99.7
        };
        UserLocation.create(u3);
        done();
    });
    it('should find nearby user within 1 degree latitude and longitude', function (done) {
        userLocation.getNearbyUsers(100, 100, 0.1,
            function(data){
                var nearbycitizens = {};
                var userLocations = data;
                for (var i = 0; i < userLocations.length; i++) {
                    nearbycitizens[userLocations[i].name] = true;
                }

                assert('AAA' in nearbycitizens, 'AAA should be the nearby citizen');
                assert('BBB' in nearbycitizens, 'BBB should be the nearby citizen');
                assert.equal('CCC' in nearbycitizens, false, 'CCC should not be the nearby citizen');
                done();
            }
        );
    });

    before(function (done) {
        global.dbHandle.clearDB();
        done();
    });

    it('should update user location', function (done) {
        var user = {
            'name': 'AAAA',
            'status': 'help',
            'latitude': 100,
            'longitude': 100,
        };

        userLocation.updateUserLocation(
            user,
            function(){
                var UserLocationModel = global.dbHandle.getModel("userLocation");
                UserLocationModel.findOne({ 'name': 'AAAA'},
                    function(err, data){
                        if(err) done(err);
                        else{
                            assert.equal(data.latitude, 100, "user aaaa's latitude should = 100");
                            assert.equal(data.longitude, 100, "user aaaa's longitude should = 100");
                            done();
                        }
                    }
                )
            }
        );
    });




});