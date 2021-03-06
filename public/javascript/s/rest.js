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
        sp : {
            list : function(queries, onSuccess) {
                $http.post("/s/rest/sp/list", queries).then(function(response) {
                    if(response.status == 200) {
                        onSuccess(response.data);
                    } else {
                        //TODO handle error
                    }
                });
            }
        },
        followUp: {
            list : function(queries, page, onSuccess) {
                $http.post("/s/rest/followups/" + page, queries).then(function(response) {
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
            },
            get : function(uuid, onSuccess) {
                $http.get("/s/rest/followup/" + uuid).then(function(response) {
                    if(response.status == 200) {
                        onSuccess(response.data);
                    } else {
                        //TODO handle error
                    }
                });
            },
            addNote : function(uuid, params, onSuccess) {
                $http.post("/s/rest/followup/" + uuid + "/add_note", params).then(function(response) {
                    if(response.status == 200) {
                        onSuccess(response.data);
                    } else {
                        //TODO handle error
                    }
                });
            },
            assign : function(uuid, params, onSuccess) {
                $http.post("/s/rest/followup/" + uuid + "/assign", params).then(function(response) {
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
