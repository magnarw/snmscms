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
  this.db.collection('jumma', function(error, holidays_collection) {
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


HolidaysProvider.prototype.removeJumma = function(news, callback) {
    this.getCollection(function(error, holidays_collection) {
      if( error ) callback(error)
      var objId = ObjectID.createFromHexString(news._id);
      holidays_collection.remove({'_id' : objId}, function(error) {
            console.log("Dette er error "  + error);
            callback(null, news);
      });
});

}



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