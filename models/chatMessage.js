var chatMessage = {};

chatMessage.saveChatMessage = function(message){
    var chatMessage = global.dbHandle.getModel("chatMessage");
    chatMessage.create({
        "senderName": message.user,
        "message": message.text,
        "timestamp": message.time,
        "status": message.messageStatus
    }, function(err, doc){
        if(err){
            console.log(err);
        }

    });
};


chatMessage.sendLatestMessages = function(num, callback){
    var chatMessage = global.dbHandle.getModel("chatMessage");
    var query = chatMessage.find({});
    query.skip(num);
    query.limit(10);
    query.sort({"_id": -1});
    query.exec(function(err, rs){
        if(err){
            console.log(err);
        }
        else{
            callback(rs);
            // chatMessage.find(function(err, result){
            //     socket.emit("addLatestMessages", rs);
            // });
        }
    });
};

module.exports = chatMessage;