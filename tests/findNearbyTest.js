var app = require('../app');
var supertest = require('supertest');
var request = supertest(app);
var should = require('should');
var chai = require('chai');
var assert = chai.assert;
var UserLocation = global.dbHandle.getModel('userLocation');

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

describe('findNearby Controller', function () {

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
            "longitude": 98.7
        };
        var u1 = {
            "name": "aaaa",
            "latitude": 100,
            "longitude": 100
        };
        UserLocation.create(u3);
        done();
    });
    // it('should find citizens within 1 degree latitude and longitude', function (done) {
    //     request
    //         .get('/findNearby/getNearbyCitizens?lat=100&lgt=100')
    //         .expect(200)
    //         .expect('Content-Type', /json/)
    //         .end(function (err, res) {
    //             if (err) return done(err);
    //             var userLocations = res.body.userLocations;
    //             var nearbycitizens = {};
    //             for (var i = 0; i < userLocations.length; i++) {
    //                 nearbycitizens[userLocations[i].name] = true;
    //             }
    //             assert('AAA' in nearbycitizens, 'AAA should be the nearby citizen');
    //             assert('BBB' in nearbycitizens, 'BBB should be the nearby citizen');
    //             assert.equal('CCC' in nearbycitizens, false, 'CCC should not be the nearby citizen');
    //             done();
    //         });
    // });

    before(function (done) {
        //var User = global.dbHandle.getModel('user');
        // var u = {
        //     "username": "aaaa",
        //     "password": "12345678",
        //     "status": "undefined"
        // };
        // User.create(u);
        User.create(aaaUser);
        UserRole.create(aaaUserRole);
        done();
    });

    it('should find citizens within 1 degree latitude and longitude without logged in user', function (done) {
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
                req = agent1.get('/findNearby/getNearbyCitizens?lat=100&lgt=100');
                req.expect(200)
                    .expect('Content-Type', /json/)
                    .end(
                        function (err, res) {
                            if (err) return done(err);
                            var userLocations = res.body.userLocations;
                            var nearbycitizens = {};
                            for (var i = 0; i < userLocations.length; i++) {
                                nearbycitizens[userLocations[i].name] = true;
                            }
                            assert('AAA' in nearbycitizens, 'AAA should be the nearby citizen');
                            assert('BBB' in nearbycitizens, 'BBB should be the nearby citizen');
                            assert.equal('aaaa' in nearbycitizens, false, 'aaaa should not be the nearby citizen');
                            done();
                        }
                    );
            });
    });

    before(function (done) {
        var User = global.dbHandle.getModel('user');
        var u = {
            "username": "aaaa",
            "password": "12345678",
            "status": "undefined"
        };
        User.create(u);
        done();
    });

    it('should update online citizen\'s location', function (done) {
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

                req = agent1.post('/findNearby/updateUserLocation?lat=100&lgt=100');
                req.expect(200)
                    .expect('Content-Type', /json/)
                    .end(
                        function(){
                            var UserLocation = global.dbHandle.getModel('userLocation');
                            UserLocation.findOne({ 'name': 'aaaa'},
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

    before(function (done) {
        var MapEvent = global.dbHandle.getModel('mapEvent');
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
        MapEvent.create(e1);
        var e2 = {
            "name": "Event2",
            "latitude": 100.05,
            "longitude": 99.95,
            "description": "test",
            "expiretime": date
        };
        MapEvent.create(e2);
        var e3 = {
            "name": "Event3",
            "latitude": 102.2,
            "longitude": 99.7,
            "description": "test",
            "expiretime": date
        };
        MapEvent.create(e3);
        User.create(aaaUser);
        UserRole.create(aaaUserRole);
        done();
    });

    it('should find nearby events', function (done) {
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
                req = agent1.get('/findNearby/getNearbyEvents?lat=100&lgt=100');
                req.expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        else{
                            var nearbyEvents = {};
                            var mapEvents = res.body.mapEvents;
                            for (var i = 0; i < mapEvents.length; i++) {
                                nearbyEvents[mapEvents[i].name] = true;
                            }
                            assert('Event1' in nearbyEvents, 'Event1 should be the nearby citizen');
                            assert('Event2' in nearbyEvents, 'Event2 should be the nearby citizen');
                            assert.equal('Event3' in nearbyEvents, false, 'Event3 should not be the nearby citizen');
                            done();
                        }
                    });
            });
    });

    before(function (done) {
        global.dbHandle.clearDB(
        );
        done();
    });

    it('should add new event', function (done) {
        request
            .post('/findNearby/addEvent?name=NewEvent&description=tessssst&duration=24&lat=101&lgt=100.1')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                else{
                    var MapEvent = global.dbHandle.getModel('mapEvent');
                    MapEvent.findOne({ 'name': 'NewEvent'},
                        function(err, data){
                            if(err) done(err);
                            else{
                                assert.equal(data.name, "NewEvent", "event name should be NewEvent");
                                assert.equal(data.description, "tessssst", "description should be tessssst");
                                assert.equal(data.latitude, 101, "latitude should be 101");
                                assert.equal(data.longitude, 100.1, "longitude should be 100.1");
                                done();
                            }
                        }
                    );
                }
            });
    });

    it('should add new event with image', function (done){
        request
            .post('/findNearby/addEventWithImage')
            .field('name', 'NewEvent1')
            .field('description', 'tessssst')
            .field('duration', 24)
            .field('lat', 101)
            .field('lgt', 100.1)
            .attach('file', 'tests/fire.jpg')
            //.expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                else{
                    var MapEvent = global.dbHandle.getModel('mapEvent');
                    MapEvent.findOne({'name': 'NewEvent1'},
                        function(err, data){
                            if(err) done(err);
                            else{
                                assert.equal(data.name, "NewEvent1", "event name should be NewEvent");
                                assert.equal(data.description, "tessssst", "description should be tessssst");
                                assert.equal(data.latitude, 101, "latitude should be 101");
                                assert.equal(data.longitude, 100.1, "longitude should be 100.1");
                                assert(data.imgUrl, "imgUrl should not be empty");
                                done();
                            }
                        }
                    );
                }
            });
    });

    it('should get location by address', function (done) {
        request
            .get('/findNearby/getLocationByAddress?addr=Mountain+View')
            .expect(200)
            .end(function(err, res) {
                assert(res);
                done();
            });

    });

    it('render the find Nearby page when user logged in', function (done) {
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
                req = agent1.get('/findNearby/');
                req.expect(200)
                    .expect('Content-Type', 'text/html')
                    .end(
                        function(err, res){
                            var html = res.res.text;
                            assert(res.res.text.includes('Citizens Nearby'));
                            done();
                        }
                    );
            });


    });

    // it('should render join community page when user is not logged in', function (done) {
    //     request
    //         .get('/findNearby/')
    //         .expect(200)
    //         .end(function(err, res) {
    //             var html = res.res.text;
    //             assert(html.includes("Join Community"));
    //             done();
    //         });

    // });

});