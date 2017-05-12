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
        init : function() {
        }
    }

    $scope.actions.init();
});