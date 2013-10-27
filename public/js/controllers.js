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
    var holiday = {name : $scope.newHolidayName, from : $scope.dtFrom, to : $scope.dtTo, appFrom : $scope.dtAppFrom, appTo : $scope.dtAppTo};
    $scope.holidays.push(holiday);
  };

  $scope.today = function() {
    $scope.dtFrom = new Date();
    $scope.dtTo = new Date();
    $scope.dtAppTo = new Date();
    $scope.dtAppFrom = new Date();
  };
  
  $scope.today();

  $scope.open = function() {
    $timeout(function() {
      $scope.opened = true;
    });
  };

  $scope.getHolidays = function () {
    $http({
      url : '/api/holidays',
      method: 'GET',
      headers : 'Content-Type : application/json'
    }).success(function(data){
          $scope.holidays = data; 
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
