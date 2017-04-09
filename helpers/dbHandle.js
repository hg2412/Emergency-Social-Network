var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');
var schemas = require('./schemas');


for(var m in schemas){
	mongoose.model(m, new Schema(schemas[m]));
}

mongoose.Promise = global.Promise;
var MONGODB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/ESN';

mongoose.connect(MONGODB_URL);

module.exports = {
	getModel: function(name){
		return mongoose.model(name);
	},
	clearDB: function() {
		for (var i in mongoose.connection.collections) {
			mongoose.connection.collections[i].remove(function () {
			});
		}

	}
};