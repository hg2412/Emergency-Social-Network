"use strict";
var express = require('express');
var router = express.Router();

var userLocation = require('../../models/userLocation.js');
var mapEvent = require('../../models/mapEvent.js');
var isAuthenticated = require('../../middlewares/authenticate.js');

var NodeGeocoder = require('node-geocoder');
var formidable = require('formidable');
var fs = require('fs');

var options = {
    provider: 'google',
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyD-l7YSyskBUxNvAvFZogWkPEAHfEjcjHI', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

module.exports = function(passport){
router.get('/', isAuthenticated,function(req, res){
 	//if(req.session.user){
 	 	res.render('findNearby');
 	// }
 	// else{
 	// 	res.render("joincommunity", {newUser: true});
 	// }
});

router.get('/getNearbyCitizens', isAuthenticated,function(req, res){
	var lat = parseInt(req.query.lat);
	var lgt = parseInt(req.query.lgt);
    var range = 1;
    userLocation.getNearbyUsers(lat, lgt, range, function(data){
            var result = [];
            for (var i = 0; i < data.length; i++){
                if (req.session.user.username != data[i].name)
                    result.push(data[i]);
            }

            res.send({userLocations: result});
        }
    );
});

router.get('/getNearbyEvents', isAuthenticated,function(req, res){
    var lat = parseInt(req.query.lat);
    var lgt = parseInt(req.query.lgt);
    var range = 1.0;
    mapEvent.getNearbyEvents(lat,lgt,range,
        function(data){

            res.send({mapEvents: data});
        }
    );
});

router.get('/getLocationByAddress', isAuthenticated,function(req, res){
    var addr = req.query.addr;
    geocoder.geocode(addr, function(err, result) {
        res.send(result);
    });

});

router.post('/updateUserLocation', function(req, res){
	var name = req.session.user.username;
    var status = req.session.status;
	var lat = req.query.lat;
    var lgt = req.query.lgt;
    var ul = {
        name: name,
        status: status,
        latitude: lat,
        longitude: lgt
    };
    userLocation.updateUserLocation(ul,
        function(){
            res.send("success");
        }
    );

});

router.post('/addEventWithImage', function(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = "public/upload/temp/";
    form.parse(req, function(error, fields, files){
        var file = files.file;
        var fName = (new Date()).getTime() + ".jpeg";
        var uploadDir = "public/upload/" + fName;
        fs.rename(file.path, uploadDir, function(err) {
            var name = fields.name;
            var description = fields.description;

            var lat = fields.lat;

            var lgt = fields.lgt;

            var duration = parseInt(fields.duration);

            var date = new Date();

            date.setHours(date.getHours() + duration);
            var imgUrl = uploadDir;
            var event = {
                "name": name,
                "latitude": lat,
                "longitude": lgt,
                "description": description,
                "expiretime": date,
                "imgUrl": imgUrl
            };

            mapEvent.addEvent(event,
                function(){
                    res.send("success");
                }
            );
        });
    });

});

router.post('/addEvent', function(req, res) {
    var name = req.query.name;
    var description = req.query.description;
    var lat = req.query.lat;
    var lgt = req.query.lgt;
    var duration = parseInt(req.query.duration);
    var date = new Date();
    date.setHours(date.getHours() + duration);
    var event = {
        "name": name,
        "latitude": lat,
        "longitude": lgt,
        "description": description,
        "expiretime": date
    };

    mapEvent.addEvent(event,
        function(){
            var data = {"status ": "success"};
            res.send(data);
        }
    );

});

return router;

};