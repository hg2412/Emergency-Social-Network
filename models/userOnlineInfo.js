var User = global.dbHandle.getModel("user");
var users = {};

users.userInfo = {};

User.find({}, function(err, user){
    for(var i in user){
        var username = user[i].username;
        users.userInfo[username] = "offline";
    }
});

users.login = function(userName) {
    this.userInfo[userName] = "online";
};
users.logout  = function(userName) {
    this.userInfo[userName] = "offline";
};

users.getAllOnline = function() {
    var onlineUsers = [];
    for (var userName in users.userInfo) {
        if (this.userInfo[userName] == "online") {
            onlineUsers.push(userName);
        }
    }
    onlineUsers.sort();
    return onlineUsers;
};

users.getAllOffline = function() {
    var offlineUsers = [];
    for (var userName in users.userInfo) {
        if (this.userInfo[userName] == "offline") {
            offlineUsers.push(userName);
        }
    }
    offlineUsers.sort();
    return offlineUsers;
};

module.exports = users;