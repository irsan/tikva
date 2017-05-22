var app = angular.module('TikvaApp');

app.controller('followupCtrl', function ($scope, $rootScope, $routeParams, $location, $log, rest) {
    $rootScope.selectedMenu = 'followups';
    $rootScope.hideMainMenu = true;

    $log.debug("FOLLOW UP CTRL", $routeParams.uuid);

    $scope.show = {
        edit : false
    };

    $scope.data = {
    };

    $scope.actions = {
        backToFollowUps : function() {
            $location.path("/followups");
        },
        listCarecells : function() {
            rest.carecell.list(function (response) {
                if (response.status == "Ok") {
                    $scope.data.carecells = response.data.carecells;
                }
            });
        },
        get : function(init) {
            rest.followUp.get($routeParams.uuid, function(response) {
                $log.info("GOT FOLLOW UP", response);
                if(response.status == 'Ok') {
                    $scope.data.followUp = response.data.followUp;
                    if(init) {
                        $scope.actions.onProfileImageResized(document.getElementById('profileImageWrapper'));
                    }
                }
            });
        },
        onProfileImageResized : function(element) {
            $log.info("ON PROFILE IMAGE RESIZED", element.offsetWidth, element.offsetHeight);
            element.style.backgroundSize = element.offsetWidth + "px " + element.offsetHeight + "px";
        },
        init : function() {
            this.listCarecells();
            this.get(true);
        }
    };

    $scope.actions.init();
});