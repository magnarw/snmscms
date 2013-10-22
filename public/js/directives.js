'use strict';

/* Directives */


var directives = angular.module('myApp.directives', []);


directives.directive('fileUpload', function () {
    return {
        scope: true,        //create a new scope
        transclude : true,
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var image = event.target.files[0];
                //iterate files since 'multiple' may be specified on the element
                scope.$emit("fileSelected", { file: image });
                                                  
            });
        }
    };
});

