var chatPrivately = {};

chatPrivately.savePrivateChatMessage = function(message){
    var privateChatMessage = global.dbHandle.getModel("chatPrivately");
    privateChatMessage.create({
        "senderName": message.user,
        "receiverName":message.receiver,
        "message": message.text,
        "timestamp": message.time,
        "status": message.messageStatus
    }, function(err, doc){
        if(err){
            console.log(err);
        }

    });
};


chatPrivately.sendLatestPrivateMessages = function(num,sender,receiver, callback){
    var chatMessage = global.dbHandle.getModel("chatPrivately");
    var query = chatMessage.find({$or:[{'senderName':sender,'receiverName':receiver},{'senderName':receiver,'receiverName':sender}]});
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
            //     socket.emit("addLatestPrivateMessages", rs);
            // });
        }
    });
};

module.exports = chatPrivately;