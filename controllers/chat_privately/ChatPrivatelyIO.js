"use strict";
var user = require('../../models/user');
var privateChatMessage = require('../../models/privateChatMessage');
var timeHelper = require('../../helpers/time');

var Sockets = require('../sockets/sockets.js');

var ChatPrivatelyIO = function(io) {
    this.io = io;
};

ChatPrivatelyIO.prototype.init = function() {
    var __this = this;
    this.io.on("connection", function(socket) {
        socket.on("getLatestPrivateMessages",function(num,userName,receiverName){
            let callback = function(rs){
                socket.emit("addLatestPrivateMessages", rs);
            };
            privateChatMessage.sendLatestPrivateMessages(num,userName,receiverName, callback);
        });
        
        socket.on("sendPrivateMessage", function(msg){
            var time = timeHelper.getTime();
            var message = {
                "user": msg.user,
                "receiver":msg.receiver,
                "text": msg.text,
                "time": time,
                "messageStatus": msg.messageStatus
            };
           // Console.log("receiver here"+message.receiver)
            //sockets[name]=socketid
            //this.io.sockets.socket(sockets[message.receiver]).emit("addPrivateMessage", message);
            //socket.broadcast.emit("addPrivateMessage", message);
            //this.io.to(Sockets["edian"]).emit("addPrivateMessage", message);
            if (Sockets[message.receiver]){
                console.log(message.receiver + " emit addPrivateMessage");
                Sockets[message.receiver].emit("addPrivateMessage", message);
            }else{
                console.log("No receiver in Sockets[]");
            }  
            socket.emit("addPrivateMyMessage",message);
            privateChatMessage.savePrivateChatMessage(message);
        });
    });
};


module.exports = ChatPrivatelyIO;