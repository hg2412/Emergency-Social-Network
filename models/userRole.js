var userRole = {};
var db = require("../database/db");
userRole.createNewUser = function(username, privilege, accountStatus, callback) {
    var user = {
        "username": username,
        "privilege": privilege,
        "accountStatus": accountStatus
    };
    db.userRole.save(user, callback);
};

userRole.getUser = function(username, callback) {
    db.userRole.get(username, callback);
};

userRole.updateUserName = function(oldUserName, newUserName, callback) {
    db.userRole.updateUserName(oldUserName, newUserName, callback);
};

userRole.updateAccountStatus = function(username, accStatus, callback) {
    db.userRole.updateAccountStatus(username, accStatus, callback);
};

userRole.updatePrivilege = function(username, privilege, callback) {
    db.userRole.updatePrivilege(username, privilege, callback);
};

module.exports = userRole;