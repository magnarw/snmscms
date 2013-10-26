'use strict';

/* Controllers */

function PreyAdminController($scope, $http, $timeout) {

  $scope.preyTimes = []; 
  $scope.selectedPrayTimes = {}; 
  $scope.selectedDay = 1; 
  $scope.selectedMonth = 1;
  $scope.selectedDay = 1;  

  $scope.getPrayTimes = function () {
    $http({
      url : '/api/prayer/year/2013/month/10/day/27',
      method: 'GET',
      headers : 'Content-Type : application/json'
    }).success(function(data){
          $scope.preyTimes = data.preylist; 
          $scope.initPrayTimesGrid(1,1,1);
    }); 
  }
 

  $scope.initPrayTimesGrid = function(day,month,year){
    $scope.selectedPrayTimes = []; 
    var prayTimes =  $scope.preyTimes; 
    //for(var key in prayTimes) {
     $scope.selectedPrayTimes = prayTimes; 
    //}

  };

  $scope.addPrey = function () {
    $scope.selectedPrayTimes.push({'name' : $scope.newPreyName, 'time' : $scope.newPreyTime}); 
    $snewPreyName
  }


  $scope.getPrayTimes(); 

  $scope.gridOptions = { 
        data: 'selectedPrayTimes',
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        columnDefs: [{field: 'name', displayName: 'Navn på bønn', enableCellEdit: false}, 
                     {field:'time', displayName:'Tidspunkt', enableCellEdit: true}]
  };

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.open = function() {
    $timeout(function() {
      $scope.opened = true;
    });
  };

  $scope.$watch('dt', function() {
      $scope.initPrayTimesGrid($scope.dt.getDay(),1,1);  
   });

}

