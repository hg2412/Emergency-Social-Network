var user = {};

user.setUserStatus = function(username, status) {
    var _user = global.dbHandle.getModel("user");
    _user.update({"username": username}, {$set: {"status": status}}, function(err, res) {
        if (err) {
            console.log(err);
        }
    });
};

user.getUserStatus = function(username, callback) {
    var _user = global.dbHandle.getModel("user");
    _user.findOne({"username" : username}, function (err, __user) {
        if (err) {
            console.log(err);
        } else {
            var status;
            if (__user) {
                status =  __user.status;
            } else {
                status =  "undefined";
            }
            callback(status);
        }
    });
};



user.updateUserName = function(oldUserName, newUserName, callback) {
    var _user = global.dbHandle.getModel("user");
    var conditions = { username: oldUserName }
      , update = { $set: { username: newUserName }}
      , options = { multi: true };
    var query = _user.update(conditions, update, options);
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

user.updatePwd = function(username, pwd, callback) {
    var _user = global.dbHandle.getModel("user");
    var conditions = { username: username }
      , update = { $set: { password: pwd }}
      , options = { multi: true };
    var query = _user.update(conditions, update, options);
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


user.getUser = function(username, callback) {
    var _user = global.dbHandle.getModel("user");
    var query = _user.findOne({username: username});
    query.exec(function(err, rs) {
        if (err) {
            console.log(err);
        } else {
            if (callback) {
                callback(rs);
            }
        }
    });
};

user.getUserList = function(callback) {
    var _user = global.dbHandle.getModel("user");
    _user.find({}).select({username: 1, _id: 0}).sort({username: 1}).exec(function(err, rs) {
        if (err) {
            console.log(err);
        } else {
            if (callback) {
                var res = [];
                var len = rs.length;
                for (var i = 0; i < len; i++) {
                    res.push(rs[i].username);
                }
                callback(res);
            }
        }
    });
};


user.createNewUser = function(username, password, status, callback) {
    var _user = global.dbHandle.getModel("user");
    _user.create({
        username: username,
        password: password,
        status: status
    }, function(err, doc) {
        if(err) {
            console.log(err);
        } else {
            if (callback) {
                callback(doc);
            }
        }
    });
};

module.exports = user;
