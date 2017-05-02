var app = angular.module('TikvaApp');

app.factory('rest', function($http) {
    var restService = {
        carecell : {
            list : function(onSuccess) {
                $http.get("/s/rest/carecell/list").then(function(response) {
                    if(response.status == 200) {
                        onSuccess(response.data);
                    } else {
                        //TODO handle error
                    }
                });
            }
        }
    }

    return restService;
});