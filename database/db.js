var db = {};
db.userRole = {};
var dbUserRole = require('./dbUserRole.js');
db.userRole.save = dbUserRole.save;
db.userRole.get = dbUserRole.get;
db.userRole.updateUserName = dbUserRole.updateUserName;
db.userRole.updateAccountStatus = dbUserRole.updateAccountStatus;
db.userRole.updatePrivilege = dbUserRole.updatePrivilege;


module.exports = db;