var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var BSON = require('mongodb').BSONPure;




PreyProvider = function (host, port) {
	this.db = new Db('snms', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
	this.db.open(function(){});
}


 PreyProvider.prototype.getCollection = function(callback) {
  this.db.collection('snms', function(error, prey_collection) {
    if( error ) callback(error);
    else callback(null, prey_collection);
  });
};



PreyProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, prey_collection) {
      if( error ) callback(error)
      else {
        prey_collection.find().toArray(function(error, results) {
          console.log("Dette er result: " + results)
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

PreyProvider.prototype.findPrey = function(year, month, day, callback) {
    console.log(year);
    console.log(month);
    console.log(day);
    this.getCollection(function(error, prey_collection) {
      if( error ) callback(error)
      else {
          prey_collection.find({"year" : parseInt(year), "month" : parseInt(month) , "day" : parseInt(day)}).toArray(function(error, results) {
          console.log("Dette er result: " + results)
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};



PreyProvider.prototype.save = function(prey, callback) {
    this.getCollection(function(error, prey_collection) {
      if( error ) callback(error)
      else {
        if(prey._id) { 
          var objId = ObjectID.createFromHexString(prey._id);
          prey_collection.remove({'_id' : objId});
         }
        prey_collection.save(prey, function() {
          callback(null, prey);
        });
   
      }
    });
};

exports.PreyProvider = PreyProvider;