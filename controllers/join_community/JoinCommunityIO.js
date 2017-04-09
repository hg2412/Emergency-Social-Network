var user = require('../../models/user');
var userRole = require('../../models/userRole');
var privateChatMessage = require('../../models/privateChatMessage');
var chatMessage = require('../../models/chatMessage');

var Sockets = require('../sockets/sockets.js');

var IOBehavior = function(io) {
    this.io = io;
};


IOBehavior.prototype.getTime = function() {
    var date = new Date();
    var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) ;
    return time.toString();
};


IOBehavior.prototype.init = function() {
    var __this = this;
    this.clients = {};
    this.io.on("connection", function(socket){
        var client = {
            socket: socket,
            name: "",
            online: false,
            status: "wrong",
        };

        socket.on("changeStatus", function(status) {
            client.status = status;
            __this.clients[client.name] = client;
            user.setUserStatus(client.name, client.status);
        });

        socket.on("add_user_name", function(username){
            user.getUserStatus(username, function (status) {
                client.name = username;
                client.online = true;
                client.status = status;
                console.log(client.status);
                __this.clients[username] = client;
                socket.emit("setInitStatus", username, client.status);
            });
            Sockets[username] = socket;
        });

        socket.on("setUsername",function(username){
            Sockets[username]=socket;
            console.log("username:"+username+socket.id);
        });

        socket.on("setUsername",function(username){
            Sockets[username]=socket;
            console.log("username:"+username+socket.id);
        });

        socket.on("load_directory", function(){
                var userDir = [];
                var counter = 0;
                var num = Object.keys(__this.clients).length;
                for (var username in __this.clients) {
                    if (username == "") {
                        continue;
                    }
                    userRole.getUser(username, function(rs) {
                        var _username = rs.username;
                        if (rs.accountStatus == "active") {
                            userDir.push({"username": _username, "online": __this.clients[_username].online, "status": __this.clients[_username].status});
                        }
                        counter++;
                        if (counter == num) {
                            socket.emit("user_directory", userDir);
                        }
                    });
                } 
        });

        socket.on("leave", function(){
            client.online = false;
            __this.clients[client.name] = client;
        });
        
    });
};

module.exports = IOBehavior;
