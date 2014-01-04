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



NewsProvider.prototype.findNews = function(callback, pageSize,pageNumber,filter) {
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
          console.log("Henter med filter : " + filter);
          if(filter === "1" || filter === "2" || filter === "3" )
            var objects = news_collection.find({cat : filter},options);
          else 
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



NewsProvider.prototype.removeNews = function(news, callback) {
    this.getCollection(function(error, news_collection) {
      if( error ) callback(error)
      var objId = ObjectID.createFromHexString(news._id);
      news_collection.remove({'_id' : objId}, function(error) {
            console.log("Dette er error "  + error);
            callback(null, news);
      });
});

}

NewsProvider.prototype.saveNews = function(news, callback) {
    this.getCollection(function(error, news_collection) {
      if( error ) callback(error)
      if (news.pri === 1 || news.pri === 2) {
      //if news allready exsists we have to remove this so I don't mess of our later update of news with similar pri 
      if (news._id) {
        var objId = ObjectID.createFromHexString(news._id);
        news_collection.remove({
          '_id': objId
        }, function (error, result) {
          if (error) {
            console.log(error);
            callback(error);
          } else {
            console.log("Har fjernet eksiterende nyhet. Vil prøve å oppdatere nyheter med samme pri");
            news_collection.update({pri : news.pri}, {$set : {pri : null}}, {w:1, multi : true}, function(error, num) {
            if(error){
              console.log("Oppdaterting av nyheter med samme pri gikk til helevete. Vil avbryte");
              callback(error); 
            }
            console.log("Har oppdatert " + num + " med samme pri."); 
            console.log("Vil nå lagre nyhet."); 
            news_collection.insert(news, function () {
                    
                    callback(null, news);
                  });
            });
          }
        });
      } else {
            news_collection.update({pri : news.pri}, {$set : {pri : null}}, {w:1, multi : true}, function(error, num) {
            if(error){
              console.log("Oppdaterting av nyheter med samme pri gikk til helevete. Vil avbryte");
              callback(error); 
            }
            console.log("Har oppdatert " + num + " med samme pri."); 
            console.log("Vil nå lagre nyhet."); 
            news_collection.insert(news, function () {
                  
                    callback(null, news);
                  });
            });
      }
  } else {
      if (news._id) {
        console.log("Nyhet har ingen pri, men må fjerne eksiternede nyhet med samme id");
        var objId = news_collection.db.bson_serializer.ObjectID.createFromHexString(news._id);
          console.log("title:" + objId);
        news.updatedDate = new Date();
        news._id = objId;
         news_collection.update({ _id :  news_collection.db.bson_serializer.ObjectID.createFromHexString(news._id) }, news, function (error,updated) {
      
        callback(null, news);
      });

      } else { 
      console.log("Lagrer ny nyhet uten pri");
      news_collection.insert(news, function () {
        
        callback(null, news);
      });
    }
  }
  });
}



/*
//find news with same id if 

NewsProvider.prototype.saveNews = function (news, callback) {
  this.getCollection(function (error, news_collection) {
    if (error) callback(error)
    //if new has pri -> then we have to update news with the same id. 
    if (news.pri === 1 || news.pri === 2) {
      //if news allready exsists we have to remove this so I don't mess of our later update of news with similar pri 
      if (news._id) {
        var objId = ObjectID.createFromHexString(news._id);
        news_collection.remove({
          '_id': objId
        }, function (error, result) {
          if (error) {
            console.log(error);
            callback(error);
          } else {
            console.log("Har fjernet eksiterende nyhet. Vil prøve å oppdatere nyheter med samme pri");
            news_collection.update({pri : news.pri}, {$set : {pri : null}}, {w:1, multi : true}, function(error, num) {
            if(error){
              console.log("Oppdaterting av nyheter med samme pri gikk til helevete. Vil avbryte");
              callback(error); 
            }
            console.log("Har oppdatert " + num + " med samme pri."); 
            console.log("Vil nå lagre nyhet."); 
            news_collection.save(news, function () {
                    callback(null, news);
                  });
            });
          }
        });
      }
    }
      } else {
        console.log("Trenger ikke å fjerne ekisterende nyhet da denne ikke finnes");
        var objectWithSamePri = news_collection.find({
          pri: news.pri
        });
        objectWithSamePri.toArray(function (error, results) {
          if (error) {
            console.log("Kunne ikke hente nyheter med samme pri");
            callback(error);
          } else {
            if (!results || results.length === 0) {
              console.log("Resultat av nyheter med samme pri var tomt. Vil nå lagre ny nyhet");
              news_collection.save(news, function () {
                callback(null, news);
              });
            } else {
              console.log("Resultat av nyheter med samme pri var " + results.length + " vil nå oppdatere");
              for (var x = 0; x < results.length; x++) {
                results[x].pri = null;
                news_collection.update(results[x], function () {
                  console.log("Oppdaterer nyhet " + x);
                  if (x === results.length - 1)
                    console.log("Forsøker å lagre ny nyhet");
               
              }
            }
          }
        });
      }
    } else {
      if (news._id) {
        console.log("Nyhet har ingen pri, men må fjerne eksiternede nyhet med samme id");
        var objId = ObjectID.createFromHexString(news._id);
        var oldNews = news_collection.find({
          'pri': news.pri
        });
        news_collection.remove({
          '_id': objId
        });
        news.updatedDate = new Date();
        news.createdDate = oldNews.createdDate;
      }
      console.log("Lagrer ny nyhet uten pri");
      news_collection.save(news, function () {
        callback(null, news);
      });

    }
  });
}





//1) Sjekk om nyheten har pri -> i så fall 
/*
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
                        news_collection.save(news, function() {
                             callback(null, news);
                      });
                    }
                    console.log("kommer hit");
                 //   results.push(news); 
                    for(var x = 0;x<results.length;x++) {
                      console.log(results[x]);
                       news_collection.update(results[x], function() {
                        if(x === results.length-1 )
                             news_collection.save(news, function() {
                             callback(null, news);
                           });
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


*/

exports.NewsProvider = NewsProvider;