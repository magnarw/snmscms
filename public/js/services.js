'use strict';

angular.module('episodeService', ['ngResource']).
    factory('Episode', function($resource){
   return $resource('http://localhost\\:3000/api/episodes/:episodeId', {}, {
	 	 query: {method:'GET', params:{episodeId:''}, isArray:true},	
		  post: {method:'POST'},
		  update: {method:'PUT', params: {episodeId: '@episodeId'}},
		  remove: {method:'DELETE'}
  });
});
