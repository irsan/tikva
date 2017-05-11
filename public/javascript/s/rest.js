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
        },
        followUp: {
            list : function(queries, onSuccess) {
                $http.post("/s/rest/followups", queries).then(function(response) {
                    if(response.status == 200) {
                        onSuccess(response.data);
                    } else {
                        //TODO handle error
                    }
                });
            },
            add : function(params, onSuccess) {
                $http.post("/s/rest/followup/add", params).then(function(response) {
                    if(response.status == 200) {
                        onSuccess(response.data);
                    } else {
                        //TODO handle error
                    }
                });
            }
        },
        serviceDate : {
            list : function(page, onSuccess) {
                $http.get("/s/rest/servicedates/" + page).then(function(response) {
                    if(response.status == 200) {
                        onSuccess(response.data);
                    } else {
                        //TODO handle error
                    }
                });
            }
        }
    };

    return restService;
});
