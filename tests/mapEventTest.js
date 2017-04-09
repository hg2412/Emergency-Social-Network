process.env.NODE_ENV = 'test';
var app = require('../app');
var supertest = require('supertest');
var request = supertest(app);
var should = require('should');
var chai = require('chai');
var assert = chai.assert;
var mapEvent = require("../models/mapEvent");
var MapEventModel = global.dbHandle.getModel('mapEvent');

describe('Map Event Model', function () {
    before(function (done) {
        global.dbHandle.clearDB();
        var date = new Date();
        date.setHours(date.getHours() + 24);
        var e1 = {
            "name": "Event1",
            "latitude": 100,
            "longitude": 100,
            "description": "test",
            "expiretime": date
        };
        MapEventModel.create(e1);
        var e2 = {
            "name": "Event2",
            "latitude": 100.05,
            "longitude": 99.95,
            "description": "test",
            "expiretime": date
        };
        MapEventModel.create(e2);
        var e3 = {
            "name": "Event3",
            "latitude": 102.2,
            "longitude": 99.7,
            "description": "test",
            "expiretime": date
        };
        MapEventModel.create(e3);
        done();
    });

    it('should find events within 1 degree latitude and longitude', function (done) {
        mapEvent.getNearbyEvents(100, 100, 1,
            function(data){
                var nearbyEvents = {};
                var mapEvents = data;
                for (var i = 0; i < mapEvents.length; i++) {
                    nearbyEvents[mapEvents[i].name] = true;
                }
                assert('Event1' in nearbyEvents, 'Event1 should be the nearby citizen');
                assert('Event2' in nearbyEvents, 'Event2 should be the nearby citizen');
                assert.equal('Event3' in nearbyEvents, false, 'Event3 should not be the nearby citizen');
                done();
            }
        );
    });

    before(function (done) {
        global.dbHandle.clearDB();
        done();
    });

    it('should add new event', function (done) {
        var duration = 24;
        var date = new Date();
        date.setHours(date.getHours() + duration);
        var event = {
            "name": "Fire",
            "latitude": 101,
            "longitude": 100.1,
            "description": "fire at NASA Research Park",
            "expiretime": date,
            "imgUrl": "public/upload/1479294689435.jpeg"
        };

        mapEvent.addEvent(event,
            function(){
                var MapEvent = global.dbHandle.getModel('mapEvent');
                MapEvent.findOne({ 'name': 'Fire'},
                    function(err, data){
                        if(err) done(err);
                        else{
                            assert.equal(data.name, "Fire", "event name should be NewEvent");
                            assert.equal(data.description, "fire at NASA Research Park", "description should be tessssst");
                            assert.equal(data.latitude, 101, "latitude should be 101");
                            assert.equal(data.longitude, 100.1, "longitude should be 100.1");
                            assert.equal(data.imgUrl, "public/upload/1479294689435.jpeg", "imgUrl should be public/upload/1479294689435.jpeg");
                            done();
                        }
                    }
                );
            }
        );
    });

});