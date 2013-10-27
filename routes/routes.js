
HolidaysProvider = require('../dao/HolidaysProvider').HolidaysProvider;
EpisodeProvider = require('../dao/EpisodeProvider').EpisodeProvider;
var fs = require('fs');
var path = require('path');
var request = require('request');
/*
	
*/


var options = {
  host: 'api.xhanch.com',
  path: '/islamic-get-prayer-time.php?lng=127&lat=90&yy=2017&mm=3&gmt=2&m=json',
   method: 'GET',
    headers: {
        'Content-Type': 'text/html; charset=UTF-8'
    }
};






var episodeProvider= new PreyProvider('localhost', 27017);
var holidaysProvider= new HolidaysProvider('localhost', 27017);


exports.findPrey = function (req, res) {
  episodeProvider.findPrey(req.params.year,req.params.month,req.params.day, function (error, preys){

    var formatedPreys = []; 

    if(error || preys.length === 0) {
        console.log("Could not find prey times for year " + req.params.year + " day " + req.params.month + " day " + req.params.day);
        console.log("Will attempt to fetch from server");
        request.get({url:'http://api.xhanch.com/islamic-get-prayer-time.php?lng=127&lat=90&yy=2017&mm=3&gmt=2&m=json',json:true}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var preysForDay = body["1"];
          for (var key in preysForDay) { 
              if (preysForDay.hasOwnProperty(key)) {
                 formatedPreys.push({name : key, time : req.params.year + "-" + req.params.month + "-" + req.params.day +"T" + preysForDay[key]+':00'});
              }
          }
          res.json({'preylist' : formatedPreys});
        }
        else 
        { 
          res.json({"error" : "could not find data"});
        }
      })
    }
    else { 
      res.json(preys[0]);
    }
  });

}


exports.findHolidays = function (req, res) {
  holidaysProvider.findHolidays(function (error, holidays){
    if(error || holidays.length === 0) {
        res.json([]);
    }
    else { 
      res.json(holidays);
    }
  });

}

exports.saveHolidays = function (req, res) {
    var holidays = req.body;
    holidaysProvider.saveHolidays(holidays,function(error, prey){
      res.json({'message' : 'This went ok'}); 
  });
}


exports.savePrey = function (req, res) {
    console.log('Dette er prey:'  + req.body);
    var prey = req.body;

	  episodeProvider.save(prey ,function(error, prey){
      res.json({'message' : 'This went ok'}); 
  });
}


exports.index = function(req, res) {
    res.sendfile(__dirname + "/public/index.html"); // updated to reflect dir structure
};