var app = angular.module('TikvaApp');

app.factory('rest', function($http) {
    var restService = {
        carecell : {
            list : function(onSuccess) {
                $http.get("/s/rest/carecell/list").then(function(response) {
                    console.log(response);
                });
            }
        }
    }

    return restService;
});
