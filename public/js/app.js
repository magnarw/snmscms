'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters','episodeService','ngResource','ui.bootstrap','ngGrid','myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when("/preytimes", {templateUrl: "views/prey.html", controller: PreyAdminController});
    //$locationProvider.html5Mode(true);
  }]);