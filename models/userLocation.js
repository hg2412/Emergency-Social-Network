var UserLocationModel = global.dbHandle.getModel("userLocation");
var userLocation = {};

userLocation.getNearbyUsers = function(lat, lgt, range, callback){
    UserLocationModel.find({
        latitude: { $gt: lat - range, $lt: lat + range },
        longitude: { $gt: lgt - range, $lt: lgt + range },
    }, function(err, data){
        callback(data);
    });
};

userLocation.updateUserLocation = function( u, callback){
    var query = {name: u.name};
        update = u;
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

    UserLocationModel.findOneAndUpdate(query, update, options, function(error, result) {
        console.log("Update user location Success!");
        callback();

    });
};

module.exports = userLocation;