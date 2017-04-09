module.exports.save = function(user, callback) {
    var modelUserRole = global.dbHandle.getModel("userRole");
    modelUserRole.create(user, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            if (callback) {
                callback();
            }
        }
    });
};

module.exports.get = function(username, callback) {
    var modelUserRole = global.dbHandle.getModel("userRole");
    var query = modelUserRole.findOne({"username": username});
    query.exec(function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (callback) {
                callback(user);
            }
        }
    });
};

module.exports.updateUserName = function(oldUserName, newUserName, callback) {
    var modelUserRole = global.dbHandle.getModel("userRole");
    var conditions = {username: oldUserName}
      , update = { $set: { username: newUserName }}
      , options = { multi: true};
    var query = modelUserRole.update(conditions, update, options);
    query.exec(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            if (callback) {
                callback();
            }
        }
    });
};

module.exports.updateAccountStatus = function(username, accStatus, callback) {
    var modelUserRole = global.dbHandle.getModel("userRole");
    var conditions = {username: username}
      , update = { $set: {accountStatus: accStatus }}
      , options = {multi: true};
    var query = modelUserRole.update(conditions, update, options);
    query.exec(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            if (callback) {
                callback();
            }
        }
    });
};


module.exports.updatePrivilege = function(username, privilege, callback) {
    var modelUserRole = global.dbHandle.getModel("userRole");
    var conditions = {username: username}
      , update = { $set: { privilege: privilege }}
      , options = {multi: true};
    var query = modelUserRole.update(conditions, update, options);
    query.exec(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            if (callback) {
                callback();
            }
        }
    });
};