// load all the things we need

var LocalStrategy   = require('passport-local').Strategy;
var passport = require('passport');

var User = global.dbHandle.getModel("user");
var Role = global.dbHandle.getModel("userRole");

var UserTable = require("../models/user");
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        User.find({ where: { 'username' : user.username }}).then(function(user){
            done(null, user);
        });
    });

    //determine if user is in the database
    passport.use('local', new LocalStrategy(
    function(username, password, done) {
        User.findOne({"username": username}, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }
            return done(null, user);
        });
        }
    ));


    //determine if user is in the database and is valid
    passport.use('localvalid', new LocalStrategy(
        function(username, password, done) {
            User.findOne({'username': username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username' });
                }
                Role.findOne({ 'username': username }, function (err, user1) {
                    if (err) { return done(err); }
                    if (!user1) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    if (user1.accountStatus=='inactive') {
                        return done(null, false, { message: 'Invalid user' });
                    }
                    return done(null, user);
                });
            });
        }
    ));

    //determine if user is valid
    passport.use('valid', new LocalStrategy(
        function(username, password, done) {
            Role.findOne({"username": username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (user.accountStatus=='inactive') {
                    return done(null, false, { message: 'Invalid user.' });
                }
                return done(null, user);
            });
        }
    ));

    //determine user privilege is admin
    passport.use('adminPrivilege', new LocalStrategy({
        usernameField : 'oldUserName',
        passwordField : 'password',
        passReqToCallback : true
    }, function(req, oldUserName, newUserName, password, privilege, done) {
            var username = req.session.user.username;
            Role.findOne({"username": username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (user.accountStatus === 'inactive') {
                    return done(null, false, { message: 'Invalid user.' });
                }
                if(user.privilege !== 'administrator'){
                    return done(null, false, { message: 'Not administrator' });
                }
                return done(null, user);
            });
        }
    ));

    passport.use('getadminPrivilege', new LocalStrategy({
        usernameField : null,
        passwordField : null,
        passReqToCallback : true
    }, function(req, done) {
        var username=req.session.user.username;
        Role.findOne({"username": username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.accountStatus === 'inactive') {
                return done(null, false, { message: 'Invalid user' });
            }
            if(user.privilege !== 'administrator'){
                return done(null, false, { message: 'Not administrator' });
            }
                return done(null, user);
            });
        }
    ));

    //determine user privilege is at least coordinator
    passport.use('coordinatorPrivilege', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'newAnnouncement',
        passReqToCallback : true
    }, function(req, username, newAnnouncement, done) {
        Role.findOne({"username": username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }
            if (user.accountStatus == 'inactive') {
                return done(null, false, {message: 'Invalid user'});
            }
            if (user.privilege == 'citizen') {
                return done(null, false, {message: 'Not coordinator'});
            }
            return done(null, user);
        });
    }));


    passport.use('getcoordinatorPrivilege', new LocalStrategy(function(req, done) {
        var username=req.session.user.username;
        Role.findOne({"username": username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.accountStatus=='inactive') {
                return done(null, false, { message: 'Invalid user' });
            }
            if(user.privilege=='citizen'){
                return done(null, false, { message: 'Not coordinator' });
            }
            return done(null, user);
        });
    }));

};