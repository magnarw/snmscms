var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;




EpisodeProvider = function (host, port) {
	this.db = new Db('snusogkaffe', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
	this.db.open(function(){});
}


EpisodeProvider.prototype.getCollection = function(callback) {
  this.db.collection('episode_collection', function(error, episode_collection) {
    if( error ) callback(error);
    else callback(null, episode_collection);
  });
};


//find all episodes
EpisodeProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, episode_collection) {
      if( error ) callback(error)
      else {
        episode_collection.find().toArray(function(error, results) {
          console.log("Dette er result: " + results)
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};



EpisodeProvider.prototype.save = function(episode, callback) {
    this.getCollection(function(error, episode_collection) {
      if( error ) callback(error)
      else {
        episode_collection.insert(episode, function() {
          callback(null, episode);
        });
      }
    });
};

exports.EpisodeProvider = EpisodeProvider;