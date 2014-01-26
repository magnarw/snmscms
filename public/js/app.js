'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters','episodeService','ngResource','ui.bootstrap','ngGrid','myApp.directives','ui.bootstrap.datetimepicker','angularFileUpload']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when("/preytimes", {templateUrl: "views/prey.html", controller: PreyAdminController});
    $routeProvider.when("/holidays", {templateUrl: "views/holidays.html", controller: HolidaysAdminController});
    $routeProvider.when("/news", {templateUrl: "views/news.html", controller: NewsAdminController});
    //$locationProvider.html5Mode(true);
  }]);