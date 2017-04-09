var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash    = require('connect-flash');
global.dbHandle = require('./helpers/dbHandle');

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'secret',
    cookie:{
        maxAge: 1000*60*30
    }
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

require('./middlewares/passport.js')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(favicon());
app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.user = req.session.user;
  next();
});


app.use('/findNearby', require('./controllers/find_nearby/findNearby.js')(passport));
app.use('/announce', require('./controllers/post_announcement/announce.js')(passport));
app.use('/search', require('./controllers/search_information/search.js')(passport));


app.use('/admin', require('./controllers/administrator_profile/admin.js')(passport));

//app.use('/', require('./controllers/join_community/index.js'));


//app.use('/', require('./controllers/join_community/index.js'));
var routes = require('./controllers/join_community/index.js')(passport);
app.use('/',routes);

var JoinCommunityIO = require('./controllers/join_community/JoinCommunityIO');
var joinCommunityIO = new JoinCommunityIO(io);
joinCommunityIO.init();

var ChatPubliclyIO = require('./controllers/chat_publicly/ChatPubliclyIO');
var chatPubliclyIO = new ChatPubliclyIO(io);
chatPubliclyIO.init();

var ChatPrivatelyIO = require('./controllers/chat_privately/ChatPrivatelyIO');
var chatPrivatelyIO = new ChatPrivatelyIO(io);
chatPrivatelyIO.init();


global.dbHandle.clearDB();

module.exports = http;
