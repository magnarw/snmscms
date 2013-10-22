var express = require('express'),
    routes  = require('./routes/routes'),
    path = require('path');
 
var app = express();

app.configure(function(){
   app.use(express.static(path.join(__dirname, 'public'))); 
});

  app.use(express.bodyParser({uploadDir:'/bilder/'}));
  app.use(express.methodOverride());

app.get('/api/prayer', routes.getPrayerTimes);
app.get('/api/prayer/*', routes.getPrayerTimesForDay);


app.listen(3000);
console.log('Listening on port 3000...');