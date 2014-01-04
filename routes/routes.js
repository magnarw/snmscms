
HolidaysProvider = require('../dao/HolidaysProvider').HolidaysProvider;
EpisodeProvider = require('../dao/EpisodeProvider').EpisodeProvider;
NewsProvider = require('../dao/NewsProvider').NewsProvider;
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






var episodeProvider= new PreyProvider('46.137.184.176', 27017);
var holidaysProvider= new HolidaysProvider('46.137.184.176', 27017);
var newsProvider= new NewsProvider('46.137.184.176', 27017);


exports.findPrey = function (req, res) {
  episodeProvider.findPrey(req.params.year,req.params.month,req.params.day, function (error, preys){

    var formatedPreys = []; 

    if(error || preys.length === 0) {
        console.log("Could not find prey times for year " + req.params.year + " day " + req.params.month + " day " + req.params.day);
        console.log("Will attempt to fetch from server");
        request.get({url:'http://api.xhanch.com/islamic-get-prayer-time.php?lng=10&lat=59&yy='+req.params.year+'&mm='+req.params.month+'&gmt=1&m=json',json:true}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var preysForDay = body[req.params.day];
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


exports.findNews = function (req, res) {
  if(req.params.id) {
    newsProvider.findSingleNews(req.params.id,function (error, news){
    if(error || news.length === 0) {
        res.json("error");
    }
    else { 
      res.json(news);
    }
  });
  } else { 
  var pageSize = req.query.pageSize;
  var pageNumber = req.query.pageNumber;
  newsProvider.findNews(function (error, news){
    if(error || news.length === 0) {
        res.json([]);
    }
    else { 
      res.json(news);
    }
  },pageSize,pageNumber);
 }
}

exports.saveNews = function (req, res) {

  var uploadnewImage = req.query.imageHasChanged;

  if(uploadnewImage === "true") { 
  appDir = path.dirname(require.main.filename);
    var tempPath = req.files.file.path;
    targetPath = path.resolve(appDir +'/public/uploads/' +req.files.file.name);
     if (path.extname(req.files.file.name).toLowerCase() === '.jpg' || path.extname(req.files.file.name).toLowerCase() === '.gif'  || path.extname(req.files.file.name).toLowerCase() === '.png') {
        fs.rename(tempPath, targetPath, function(err) {
            console.log(err)
            if (err) throw err;
            console.log("Upload completed!");
          });
    }
    var json = JSON.parse(req.body.model);
    var news = {'title' : json.title, 'text' : json.text, 'createdDate' : new Date(),  'pri' : json.pri, 'ingress' : json.ingress, 'imageText' : json.imageText, 'author' : json.author, 'imgUrl' : 'http://46.137.184.176:3000/uploads/' + req.files.file.name }
    if(json._id) {
      news._id = json._id; 
    }
    newsProvider.saveNews(news,function(error, result){
      res.json({'message' : 'This went ok'}); 
  });
  } else {
    var json = JSON.parse(req.body.model);
    var news = {'title' : json.title, 'text' : json.text, 'createdDate' : new Date(),  'pri' : json.pri, 'ingress' : json.ingress, 'imageText' : json.imageText, 'author' : json.author, 'imgUrl' : json.imgUrl};
    if(json._id) {
      news._id = json._id; 
    }
    newsProvider.saveNews(news,function(error, result){
      res.json({'message' : 'This went ok'}); 
    });
  }
}



exports.removeNews = function (req, res) {
    var json = JSON.parse(req.body.model);
    var news = req.body;
    newsProvider.removeNews(news,function(error, result){
      res.json({'message' : 'This went ok'}); 
  });
}



