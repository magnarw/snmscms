var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var BSON = require('mongodb').BSONPure;




HolidaysProvider = function (host, port) {
	this.db = new Db('snms', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
	this.db.open(function(){});
}


 HolidaysProvider.prototype.getCollection = function(callback) {
  this.db.collection('holidays', function(error, holidays_collection) {
    if( error ) callback(error);
    else callback(null, holidays_collection);
  });
};



HolidaysProvider.prototype.findHolidays = function(callback) {
    this.getCollection(function(error, holidays_collection) {
      if( error ) callback(error)
      else {
          var objects = holidays_collection.find();
          console.log(objects);
        
          objects.toArray(function(error, results) {
         // console.log("Dette er result: " + results)
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


HolidaysProvider.prototype.saveHolidays = function(holidays, callback) {
    this.getCollection(function(error, holidays_collection) {
      if( error ) callback(error)
      else {
       for(x in holidays ){ 
          var holiday = holidays[x];
          if(holiday._id) { 
            var objId = ObjectID.createFromHexString(holiday._id);
            holidays_collection.remove({'_id' : objId});
          }
          holidays_collection.save(holiday, function() {
            callback(null, holiday);
          });
        }
      }
    });
};

exports.HolidaysProvider = HolidaysProvider;