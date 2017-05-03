var app = angular.module('TikvaApp');

app.controller('followupsCtrl', function ($scope, $rootScope, $log, rest) {
    $rootScope.selectedMenu = 'followups';

    $log.debug("FOLLOW UPS CTRL");

    $scope.actions = {
        listFollowUps : function() {
            rest.followUp.list(function(response) {
                $log.debug("THE FILLLOOOWWW", response);
            });
        },
        init : function() {
            $scope.actions.listFollowUps();
        }
    }

    $scope.actions.init();
});