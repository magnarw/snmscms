var express = require('express'),
    routes  = require('./routes/routes'),
    path = require('path');
 
var app = express();

app.configure(function(){
   app.use(express.static(path.join(__dirname, 'public'))); 
});

  app.use(express.bodyParser({uploadDir:'/bilder/'}));
  app.use(express.methodOverride());


app.get('/api/holidays', routes.findHolidays);

app.post('/admin/api/holidays', routes.saveHolidays);



app.get('/api/prayer/year/:year/month/:month/day/:day', routes.findPrey);
app.post('/admin/api/prayer', routes.savePrey);

app.listen(3000);
console.log('Listening on port 3000...');