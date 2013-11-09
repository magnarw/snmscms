var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var BSON = require('mongodb').BSONPure;




NewsProvider = function (host, port) {
	this.db = new Db('snms', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
	this.db.open(function(){});
}


 NewsProvider.prototype.getCollection = function(callback) {
  this.db.collection('news', function(error, news_collection) {
    if( error ) callback(error);
    else callback(null, news_collection);
  });
};



NewsProvider.prototype.findNews = function(callback) {
    this.getCollection(function(error, news_collection) {
      if( error ) callback(error)
      else {
          var objects = news_collection.find();
          console.log(objects);
        
          objects.toArray(function(error, results) {
         // console.log("Dette er result: " + results)
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


NewsProvider.prototype.findSingleNews = function(id, callback) {
    this.getCollection(function(error, news_collection) {
      if( error ) callback(error)
      else {
          var objects = news_collection.find({_id : id});
          console.log(objects);
          objects.toArray(function(error, results) {
         // console.log("Dette er result: " + results)
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


/*
NewsProvider.prototype.removeNews = function(news, callback) {
    this.getCollection(function(error, news_collection) {
      if( error ) callback(error)
      var objId = ObjectID.createFromHexString(news._id);
      news_collection.remove({'_id' : objId}, function() {
            callback(null, news);
      });
};
*/

NewsProvider.prototype.saveNews = function(news, callback) {
    this.getCollection(function(error, news_collection) {
      if( error ) callback(error)
      else {
          if(news._id) { 
            var objId = ObjectID.createFromHexString(news._id);
            news_collection.remove({'_id' : objId});
          }
          news.createdDate = new Date();
          news_collection.save(news, function() {
            callback(null, news);
          });
        }
    });
};



exports.NewsProvider = NewsProvider;