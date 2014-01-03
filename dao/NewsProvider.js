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



NewsProvider.prototype.findNews = function(callback, pageSize,pageNumber) {
    this.getCollection(function(error, news_collection) {
      if( error ) callback(error)
      else {

          var skip = pageSize*pageNumber;
          console.log("skip:" + skip +" limit:" + pageSize);
          var options = {
              "limit": pageSize,
              "skip": skip,
              "sort": [['pri','desc'], ['createdDate','-1']]
          };
          var objects = news_collection.find({},options);
          console.log("Henter nyheter");
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



//1) Sjekk om nyheten har pri -> i så fall 

NewsProvider.prototype.saveNews = function (news, callback) {
    this.getCollection(function(error, news_collection) {
      if( error ) callback(error)
      else {

          if(news.pri) {
            var objects = news_collection.find({pri : news.pri});
            objects.toArray(function(error, results) {
             // console.log("Dette er result: " + results)
              if( error ) callback(error)
              else {

                    if(news._id) { 
                        var objId = ObjectID.createFromHexString(news._id);
                        var oldNews = news_collection.find({'pri' : news.pri});
                        news_collection.remove({'_id' : objId});
                        news.updatedDate = new Date();
                        news.createdDate = oldNews.createdDate;
                    }
                    if(!results || results.length === 0){
                      results = []; 
                    }
                    console.log("kommer hit");
                    results.push(news); 
                    for(var x = 0;x<results.length;x++) {
                       news_collection.save(results[x], function() {
                        if(x === results.length-1)
                           callback(null, news);
                       });
                    }
              }
            });
          } else {
          if(news._id) { 
            var objId = ObjectID.createFromHexString(news._id);
            var oldNews = news_collection.find({'pri' : news.pri});
            news_collection.remove({'_id' : objId});
            news.updatedDate = new Date();
            news.createdDate = oldNews.createdDate;
          }
          news_collection.save(news, function() {
            callback(null, news);
          });
        }
      }
    });
};




exports.NewsProvider = NewsProvider;