
EpisodeProvider = require('../dao/EpisodeProvider').EpisodeProvider;
var fs = require('fs');
var path = require('path');
/*
	
*/

var episodeProvider= new EpisodeProvider('localhost', 27017);


exports.getPrayerTimesForDay = function (req, res) {
  res.json({"preylist" : [{"name" : "fajr", "time" : "2009-04-12T00:55:50"},{"name" : "sunrise", "time" : "2009-04-12T06:00:00"},{"name" : "zuhr", "time" : "2009-04-12T12:00:00"},{"name" : "asr", "time" : "2009-04-12T16:00:00"}]});
}


exports.getPrayerTimes = function (req,res ) {
  res.json({"1":{"fajr":"0-1:0-55","sunrise":"11:30","zuhr":"17:22","asr":"20:36","maghrib":"23:14","isha":"24:45"},"2":{"fajr":"0-1:0-56","sunrise":"11:32","zuhr":"17:22","asr":"20:35","maghrib":"23:12","isha":"24:43"},"3":{"fajr":"0-1:0-57","sunrise":"11:33","zuhr":"17:22","asr":"20:33","maghrib":"23:10","isha":"24:41"},"4":{"fajr":"0-1:0-59","sunrise":"11:34","zuhr":"17:21","asr":"20:32","maghrib":"23:08","isha":"24:39"},"5":{"fajr":"0-2:00","sunrise":"11:35","zuhr":"17:21","asr":"20:30","maghrib":"23:06","isha":"24:37"},"6":{"fajr":"00:0-1","sunrise":"11:37","zuhr":"17:21","asr":"20:29","maghrib":"23:04","isha":"24:35"},"7":{"fajr":"00:0-3","sunrise":"11:38","zuhr":"17:20","asr":"20:28","maghrib":"23:02","isha":"24:33"},"8":{"fajr":"00:0-4","sunrise":"11:39","zuhr":"17:20","asr":"20:26","maghrib":"23:01","isha":"24:32"},"9":{"fajr":"00:0-5","sunrise":"11:40","zuhr":"17:20","asr":"20:25","maghrib":"22:59","isha":"24:30"},"10":{"fajr":"00:0-6","sunrise":"11:42","zuhr":"17:20","asr":"20:24","maghrib":"22:57","isha":"24:28"},"11":{"fajr":"00:0-8","sunrise":"11:43","zuhr":"17:19","asr":"20:22","maghrib":"22:55","isha":"24:26"},"12":{"fajr":"00:0-9","sunrise":"11:44","zuhr":"17:19","asr":"20:21","maghrib":"22:53","isha":"24:24"},"13":{"fajr":"00:0-10","sunrise":"11:46","zuhr":"17:19","asr":"20:19","maghrib":"22:52","isha":"24:23"},"14":{"fajr":"00:0-11","sunrise":"11:47","zuhr":"17:19","asr":"20:18","maghrib":"22:50","isha":"24:21"},"15":{"fajr":"00:0-13","sunrise":"11:48","zuhr":"17:18","asr":"20:17","maghrib":"22:48","isha":"24:19"},"16":{"fajr":"00:0-14","sunrise":"11:49","zuhr":"17:18","asr":"20:15","maghrib":"22:46","isha":"24:18"},"17":{"fajr":"00:0-15","sunrise":"11:51","zuhr":"17:18","asr":"20:14","maghrib":"22:45","isha":"24:16"},"18":{"fajr":"00:0-16","sunrise":"11:52","zuhr":"17:18","asr":"20:13","maghrib":"22:43","isha":"24:14"},"19":{"fajr":"00:0-18","sunrise":"11:53","zuhr":"17:18","asr":"20:11","maghrib":"22:41","isha":"24:13"},"20":{"fajr":"00:0-19","sunrise":"11:55","zuhr":"17:17","asr":"20:10","maghrib":"22:40","isha":"24:11"},"21":{"fajr":"00:0-20","sunrise":"11:56","zuhr":"17:17","asr":"20:09","maghrib":"22:38","isha":"24:10"},"22":{"fajr":"00:0-21","sunrise":"11:57","zuhr":"17:17","asr":"20:07","maghrib":"22:36","isha":"24:08"},"23":{"fajr":"00:0-23","sunrise":"11:59","zuhr":"17:17","asr":"20:06","maghrib":"22:35","isha":"24:07"},"24":{"fajr":"00:0-24","sunrise":"12:00","zuhr":"17:17","asr":"20:05","maghrib":"22:33","isha":"24:05"},"25":{"fajr":"00:0-25","sunrise":"12:00","zuhr":"17:17","asr":"20:04","maghrib":"22:32","isha":"24:04"},"26":{"fajr":"00:0-26","sunrise":"12:01","zuhr":"17:16","asr":"20:02","maghrib":"22:30","isha":"24:02"},"27":{"fajr":"00:0-27","sunrise":"12:03","zuhr":"17:16","asr":"20:01","maghrib":"22:28","isha":"24:01"},"28":{"fajr":"00:0-29","sunrise":"12:04","zuhr":"17:16","asr":"20:00","maghrib":"22:27","isha":"23:59"},"29":{"fajr":"00:0-30","sunrise":"12:05","zuhr":"17:16","asr":"19:59","maghrib":"22:25","isha":"23:58"},"30":{"fajr":"00:0-31","sunrise":"12:07","zuhr":"17:16","asr":"19:58","maghrib":"22:24","isha":"23:57"},"31":{"fajr":"00:0-32","sunrise":"12:08","zuhr":"17:16","asr":"19:56","maghrib":"22:23","isha":"23:55"}});
}; 

exports.getAllEpisodes = function (req, res){

	episodeProvider.findAll(function(error, episodes){
      res.json(episodes);
  });
}

exports.getFileList = function (req, res){
  fs.readdir('/episodes', function (err, files) {
    var fileList = []; 
    if(err){ 
      console.log("Kunne ikke hente liste over episoder:" + err);
      res.json(fileList);
    }
    else { 
    for(var i = 0; i<files.length; i++){
      console.log(files[i]);
      fileList.push({'file' : files[i]})
    }
    res.json(fileList);}
  })
}



exports.saveEpisode = function (req, res){
	  var tempPath = req.files.file.path;
	  targetPath = path.resolve('/Users/Magnar/Desktop/kode/snusogkaffe/public/img/' +req.files.file.name);
	  if (path.extname(req.files.file.name).toLowerCase() === '.jpg') {
        fs.rename(tempPath, targetPath, function(err) {
            console.log(err)
            if (err) throw err;
            console.log("Upload completed!");
       		});
    	}
    var json = JSON.parse( req.body.model)

    var episode = { 'img' : 'img/' + req.files.file.name, 'text' : json.text, 'ingress' :  json.ingress, 'title' : json.ingress}; 
    console.log('Dette er episode:'  + episode);
	  episodeProvider.save(episode ,function(error, result){
      res.json({'message' : 'This went ok'}); 
  });
}


exports.index = function(req, res) {
    res.sendfile(__dirname + "/public/index.html"); // updated to reflect dir structure
};