"use strict";
var chatMessage = require('../../models/chatMessage');
var timeHelper = require('../../helpers/time');

var chatPubliclyIO = function(io) {
    this.io = io;
};

chatPubliclyIO.prototype.init = function () {
    this.io.on("connection", function(socket) {
        socket.on("getLatestMessages",function(num){
            let callback = function(rs){
                socket.emit("addLatestMessages", rs);
            };
            chatMessage.sendLatestMessages(num, callback);
        });

        socket.on("sendPublicMessage", function(msg) {
            var time = timeHelper.getTime();
            var message = {
                "user": msg.user,
                "text": msg.text,
                "time": time,
                "messageStatus": msg.messageStatus
            };
            socket.broadcast.emit("addPublicMessage", message);
            socket.emit("addPublicMessage",message);
            chatMessage.saveChatMessage(message);
        });
    });
};

module.exports = chatPubliclyIO;