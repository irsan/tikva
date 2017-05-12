var app = angular.module('TikvaApp');

app.controller('followupCtrl', function ($scope, $rootScope, $routeParams, $location, $log, rest) {
    $rootScope.selectedMenu = 'followups';
    $rootScope.hideMainMenu = false;

    $log.debug("FOLLOW UP CTRL", $routeParams.uuid);

    $scope.show = {
    };

    $scope.data = {
    };

    $scope.actions = {
        backToFollowUps : function() {
            $location.path("/followups");
        },
        get : function() {
            rest.followUp.get($routeParams.uuid, function(response) {
                $log.info("GOT FOLLOW UP", response);
                if(response.status == 'Ok') {
                    $scope.data.followUp = response.data.followUp;
                }
            });
        },
        init : function() {
            this.get();
        }
    };

    $scope.actions.init();
});