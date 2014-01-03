'use strict';

/* Controllers */

function PreyAdminController($scope, $http, $timeout) {

  $scope.preyTimes = []; 
  $scope.selectedPrayTimes = {}; 
  $scope.selectedDay = 1; 
  $scope.selectedMonth = 1;
  $scope.selectedYear = 1;  

  $scope.getPrayTimes = function () {
    $http({
      url : '/api/prayer/year/'+ $scope.selectedYear +'/month/'+ $scope.selectedMonth+'/day/' + $scope.selectedDay,
      method: 'GET',
      headers : 'Content-Type : application/json'
    }).success(function(data){
          $scope.preyTimes = data; 
    }); 
  }
 


  $scope.savePrey = function () {
    $scope.preyTimes.year = $scope.selectedYear;
    $scope.preyTimes.month = $scope.selectedMonth;
    $scope.preyTimes.day = $scope.selectedDay;

    $http({
      url : '/admin/api/prayer',
      method: 'POST',
      data : $scope.preyTimes,
      headers: {'Content-Type': 'application/json'}
    }).success(function(data){
         $scope.preyTimes = data;
    }); 
  }

  $scope.addPrey = function () {
    $scope.preyTimes.preylist.push({'name' : $scope.newPreyName, 'time' : $scope.newPreyTime}); 
  }


  $scope.today = function() {
    $scope.dt = new Date();
    $scope.selectedDay = $scope.dt.getDate();
    $scope.selectedMonth = $scope.dt.getMonth() + 1 ;
    $scope.selectedYear = $scope.dt.getFullYear();
  };
  
  $scope.today();
  $scope.getPrayTimes(); 


  $scope.open = function() {
    $timeout(function() {
      $scope.opened = true;
    });
  };

  $scope.$watch('dt', function() {
     $scope.selectedDay = $scope.dt.getDate();
     $scope.selectedMonth = $scope.dt.getMonth() + 1 ;
     $scope.selectedYear = $scope.dt.getFullYear();
     $scope.getPrayTimes();
  
   });

}


function HolidaysAdminController($scope, $http, $timeout) {

  $scope.holidays = []; 

  /*
  $scope.newHolidayName = "";
  $scope.newHolidayFrom; 
  $scope.newHolidayTo;
  $scope.newHolidayAppFrom; 
  $scope.newHolidayAppTo; 
  
  */
  
  $scope.addHoliday = function () {
    var holiday = {fromMonth : $scope.fromMonth, toMonth : $scope.toMonth, fromDay : $scope.fromDay, toDay : $scope.toDay, hours : $scope.hours, minuttes : $scope.min};
    $scope.holidays.push(holiday);
  };


  /*

  int fromMonth;
  int toMonth;
  int fromDay;
  int toDay;
  DateTime updated;
  int hours; 
  int minuttes; 
  */

  

  $scope.getHolidays = function () {
    $http({
      url : '/api/holidays',
      method: 'GET',
      headers : 'Content-Type : application/json'
    }).success(function(data){
          $scope.holidays = data; 
    }).error(function(data){
       alert("Kunne ikke hente fredagsbønner fra serveren. Prøv igjen senere");
    }); 
  }

  $scope.saveHolidays = function () {
    $http({
      url : '/admin/api/holidays',
      method: 'POST',
      data : $scope.holidays,
      headers: {'Content-Type': 'application/json'}
    }).success(function(data){
         //$scope.preyTimes = data;
    }).error(function(data){
       alert("Kunne ikke lagre fredagsbønner til serveren. Prøv igjen senere");
    }); 
  }

  $scope.getHolidays();

  /*
  $scope.$watch('dt', function() {
    $scope.selectedDay = $scope.dt.getDate();
    $scope.selectedMonth = $scope.dt.getMonth() + 1 ;
    $scope.selectedYear = $scope.dt.getFullYear();
   });
*/

}


function NewsAdminController($scope, $http, $timeout) {

  $scope.news = []; 
  $scope.newArticleImage; 
  $scope.image; 
  
  $scope.priority = [
    {name:'Forsiden 1', value: 2},
    {name:'Forsiden 2', value : 1}
  ];


  $scope.addNews = function () {
    if($scope.pri)
       var newNewsItem  = {title : $scope.newTitle, text : $scope.newText, ingress : $scope.newIngress, imageText : $scope.newImageText, author : $scope.newAuthor, pri : $scope.pri.value };
    else 
       var newNewsItem  = {title : $scope.newTitle, text : $scope.newText, ingress : $scope.newIngress, imageText : $scope.newImageText, author : $scope.newAuthor};
    $scope.saveNews(newNewsItem);
  };

  $scope.getNews = function () {
    $http({
      url : '/api/news',
      method: 'GET',
      headers : 'Content-Type : application/json'
    }).success(function(data){
          $scope.news = data; 
    }); 
  }

  $scope.saveNews = function (news) {
    $http({
      url : '/admin/api/news',
      method: 'POST',
      transformRequest: function (data) {
                var formData = new FormData();
                //need to convert our json object to a string version of json otherwise
                // the browser will do a 'toString()' on the object which will result 
                // in the value '[Object object]' on the server.
                formData.append("model", angular.toJson(data.model));
                formData.append("file", data.file);
                return formData;
      },
      data : {model : news, file : $scope.newArticleImage},
      headers: {'Content-Type': false}
    }).success(function(data){
        $scope.news.push(news);
    }); 
  }

  $scope.$on("fileSelected", function (event, args) {
       var reader = new FileReader();
        $scope.$apply(function () {            
            //add the file object to the scope's files collection
            $scope.newArticleImage = args.file;
      // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
              $scope.image = e.target.result;
               $scope.$apply();
            };
          })();
        });
        reader.readAsDataURL( $scope.newArticleImage);

  });


  $scope.getNews();

}