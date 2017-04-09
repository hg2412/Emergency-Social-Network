var EventModel = global.dbHandle.getModel("mapEvent");
mapEvent = {};

mapEvent.getNearbyEvents = function(lat, lgt, range, callback){
    var date = new Date();
    console.log(date);
    EventModel.find({
        latitude: { $gt: lat - range, $lt: lat + range },
        longitude: { $gt: lgt - range, $lt: lgt + range },
        expiretime: {$gt: date}
    }, function(err, data){
        callback(data);
    });
};

mapEvent.addEvent = function( event, callback){
    EventModel.create(event,
        function(err){
                callback();
        }
    );
};

module.exports = mapEvent;