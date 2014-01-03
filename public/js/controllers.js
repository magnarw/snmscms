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

  /*
  $scope.addNews = function () {
    if($scope.pri)
       var newNewsItem  = {title : $scope.newTitle, text : $scope.newText, ingress : $scope.newIngress, imageText : $scope.newImageText, author : $scope.newAuthor, pri : $scope.pri.value };
    else 
       var newNewsItem  = {title : $scope.newTitle, text : $scope.newText, ingress : $scope.newIngress, imageText : $scope.newImageText, author : $scope.newAuthor};
    $scope.saveNews(newNewsItem);
  };
  */

  $scope.getNews = function () {
    $http({
      url : '/api/news',
      method: 'GET',
      headers : 'Content-Type : application/json'
    }).success(function(data){
          $scope.news = data; 
    }); 
  }

  //TODO : Post with a query paramter if the image has not been changed. 
  $scope.saveNews = function (news) {
    if($scope.pri) 
      news.pri = $scope.pri.value; 

    var urlToPost = '/admin/api/news?imageHasChanged=false';
    if($scope.imageHasChanged){
      urlToPost =  '/admin/api/news?imageHasChanged=true'
    }

    $http({
      url : urlToPost,
      method: 'POST',
      transformRequest: function (data) {
                var formData = new FormData();
                formData.append("model", angular.toJson(data.model));
                formData.append("file", data.file);
                return formData;
      },
      data : {model : news, file : $scope.newArticleImage},
      headers: {'Content-Type': false}
    }).success(function(data){
        //TODO : Loop through all news to see if it's allready exsists in the list, if not add it. 
        var shouldAdd = true; 
        for(var i; i <$scope.news.length;i++) {
          if($scope.selectedNews._id === news._id) {
            shouldAdd = false; 
          }
        }
        if(shouldAdd)
         $scope.news.push(news);
        alert("Nyhet har blitt lagret på servern");
    }).error(function (error) {
       alert("Noe gikk galt ved lagring av nyhet. Kontakt Magnar på 46793283"); 
    }); 
  };


  $scope.editNews = function (news) {
    $scope.imageHasChanged = false;
    $scope.image = news.imgUrl;
    $scope.selectedNews = news; 
    $scope.pri = null;
    if(news.pri) {

      for(var i = 0; i<$scope.priority.length;i++) {
        if($scope.priority[i].value===news.pri){
          console.log("Kommer inn her");
          $scope.pri = $scope.priority[i];
        }
      }
    }

  };


  //1) Du trenger ikke å laste opp bildet på nytt. Bare sjekk at det ikke har blitt endret. 
  $scope.$on("fileSelected", function (event, args) {
       var reader = new FileReader();
        $scope.$apply(function () {            
            //add the file object to the scope's files collection
            $scope.newArticleImage = args.file;
      // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
              $scope.image = e.target.result;
               $scope.imageHasChanged = true;
               $scope.$apply();
            };
          })();
        });
        reader.readAsDataURL( $scope.newArticleImage);

  });


  $scope.getNews();

}