"use strict";
var express = require('express');
var router = express.Router();
var userTable = require('../../models/user.js');
var userRoleTable = require('../../models/userRole.js');
var isAuthenticated = require('../../middlewares/authenticate.js');


module.exports = function(passport){

    var userExist = function(username, callback) {
        userTable.getUser(username, function (userInfo) {
            if (callback) {
                if(!userInfo) {
                    callback(false);
                } else {
                    callback(true);
                }
            }
        });
    };

    router.get('/', isAuthenticated, function (req, res,next) {
        if (!req.session.user) {
            res.render("joincommunity", {newUser: true});
        } else {
            var username = req.session.user.username;
            var Role = global.dbHandle.getModel("userRole");
            Role.findOne({'username': username}, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.redirect('/');
                }
                if (user.accountStatus === 'inactive') {
                    res.send(500, 'Inactive User!');
                } else if (user.privilege !== 'administrator') {
                    res.send(500, 'Low Privilege!');
                } else {
                    res.render('admin');
                }
            });
        }
    });

    router.get('/userlist', isAuthenticated, function (req, res,next) {
        var username = req.session.user.username;
        var Role = global.dbHandle.getModel("userRole");
        Role.findOne({'username': username}, function (err, user) {
            if (err) { return next(err); }
            if (!user) {
                return res.redirect('/');
            }
            if (user.accountStatus === 'inactive') {
                res.send(500, 'Inactive User!');
            } else if(user.privilege !== 'administrator'){
                res.send(500, 'Low Privilege!');
            } else {
                userTable.getUserList(function(userlist) {
                    res.send({"userlist": userlist});
                });
            }
        });
    });

    router.get('/userInfo', isAuthenticated, function (req, res,next) {
        var username = req.session.user.username;
        var Role = global.dbHandle.getModel("userRole");
        Role.findOne({'username': username}, function (err, users) {
            if (err) { return next(err); }
            if (!users) {
                return res.redirect('/');
            }
            if (users.accountStatus === 'inactive') {
                res.send(500, 'Inactive User!');
            } else if(users.privilege !== 'administrator'){
                res.send(500, 'Low Privilege!');
            } else {
                let username = req.query.username;
                let user = {};
                userRoleTable.getUser(username, function(userRoleInfo) {
                    if(userRoleInfo) {
                        user.username = userRoleInfo.username;
                        user.privilege = userRoleInfo.privilege;
                        user.accountStatus = userRoleInfo.accountStatus;
                        userTable.getUser(username, function (userInfo) {
                            user.password = userInfo.password;
                            if (userInfo) {
                                res.render('userInfo', {user: user});
                            } else {
                                res.render('admin');
                            }
                        });
                    } else {
                        res.render('admin');
                    }
                });
            }
        });
    });

    router.route('/userInfo').post(function(req, res,next) {
        var username = req.session.user.username;
        var Role = global.dbHandle.getModel("userRole");
        Role.findOne({'username': username}, function (err, user) {
            if (err) { return next(err); }
            if (!user) {
                return res.redirect('/');
            }
            if (user.accountStatus === 'inactive') {
                res.send(500, 'Inactive User!');
            } else if(user.privilege !== 'administrator'){
                res.send(500, 'Low Privilege!');
            } else {
                let oldUserName = req.body.oldUserName;
                let newUserName = req.body.newUserName;
                let password = req.body.password;
                let privilege = req.body.privilege;
                let accountStatus = req.body.accountStatus;
                if (oldUserName === newUserName) {
                    userTable.updatePwd(newUserName, password);
                    userRoleTable.updatePrivilege(newUserName, privilege);
                    userRoleTable.updateAccountStatus(newUserName, accountStatus);
                    res.send({status: true});
                } else {
                    userExist(newUserName, function(exist) {
                        if (exist) {
                            res.send({status: false});
                        } else {
                            userTable.updateUserName(oldUserName, newUserName);
                            userTable.updatePwd(newUserName, password);
                            userRoleTable.updateUserName(oldUserName, newUserName);
                            userRoleTable.updatePrivilege(newUserName, privilege);
                            userRoleTable.updateAccountStatus(newUserName, accountStatus);
                            res.send({status: true});
                        }
                    })
                }
            }
        });
    });

    return router;
};