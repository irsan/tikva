var app = angular.module('TikvaApp');

app.controller('followupsCtrl', function ($scope, $rootScope, $mdBottomSheet, $log, rest) {
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
        showNewFollowUp : function() {
            $mdBottomSheet.show({
                templateUrl: '/tpl/s_newfollowup',
                controller: 'newFollowUpCtrl',
                clickOutsideToClose: false
            }).then(function(clickedItem) {
                $log.info("clicked", clickedItem);
            }).catch(function(error) {
                // User clicked outside or hit escape
            });
        },
        init : function() {
            $scope.actions.listFollowUps();
        }
    }

    $scope.actions.init();
});

app.controller('newFollowUpCtrl', function($scope, $log) {
    $log.debug("NEW FOLLOW UP CONTROLLER");
})