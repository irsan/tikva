var app = angular.module('TikvaApp');

app.controller('followupsCtrl', function ($scope, $rootScope, $log, rest) {
    $rootScope.selectedMenu = 'followups';

    $log.debug("FOLLOW UPS CTRL");

    $scope.data = {
        followUps : {
            followUps : []
        }
    };

    $scope.actions = {
        listFollowUps : function() {
            rest.followUp.list(function(response) {
                $log.debug("THE FILLLOOOWWW", response);
                if(response.status == "Ok") {
                    $scope.data.followUps = response.data;
                }
            });
        },
        init : function() {
            $scope.actions.listFollowUps();
        }
    }

    $scope.actions.init();
});