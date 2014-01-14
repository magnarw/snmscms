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


directives.directive('googlePlaces', function(){
                return {
                    restrict:'E',
                    replace:true,
                    // transclude:true,
                    scope: {lat:'=',lng : '=', address : '='},
                    template: '<input id="google_places_ac" name="google_places_ac" type="text" class="form-control" id="inputNavn" placeholder="Addresse for event"/>',
                    link: function($scope, elm, attrs){
                        var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
                        google.maps.event.addListener(autocomplete, 'place_changed', function() {
                            var place = autocomplete.getPlace();
                            $scope.lat = place.geometry.location.lat();
                            $scope.lng = place.geometry.location.lng();
                            $scope.address = $("#google_places_ac").val();
                            $scope.$apply();
                        });
                    }
                }
});
