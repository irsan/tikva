var app = angular.module('TikvaApp');

app.controller('followupsCtrl', function ($scope, $rootScope, $location, $log, rest) {
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
            $location.path("/followup/add");
        },
        init : function() {
            $scope.actions.listFollowUps();
        }
    }

    $scope.actions.init();
});

app.controller('newFollowUpCtrl', function($scope, $log, rest) {
    $log.debug("NEW FOLLOW UP CONTROLLER");

    $scope.data = {
        carecells : [],
        ftv : {
            serviceDate : moment().startOf('week').toDate()
        }
    };

    $scope.actions = {
        listCarecells : function() {
            rest.carecell.list(function (response) {
                if (response.status == "Ok") {
                    $scope.data.carecells = response.data.carecells;
                }
            });
        },
        addFTV : function() {
            rest.ftv.add($scope.data.ftv, function(response) {
                $log.info("ADD FTV", response);
            });
        }
    }

    $scope.actions.listCarecells();
})