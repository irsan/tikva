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
        onNoteKeyEnter : function() {
            if($scope.data.note.trim().length > 0) {
                rest.followUp.addNote($scope.data.followUp.uuid, { note : $scope.data.note }, function(response) {
                    $log.info("THE RESPONSE ADD NOTE", response);
                    if(response.status == "Ok") {
                        $scope.data.followUpNotes.splice(0, 0, response.data.followUpNote);
                    }
                });
            }
        },
        get : function() {
            rest.followUp.get($routeParams.uuid, function(response) {
                $log.info("GOT FOLLOW UP", response);
                if(response.status == 'Ok') {
                    $scope.data.followUp = response.data.followUp;
                    $scope.data.followUpNotes = response.data.followUpNotes;
                }
            });
        },
        init : function() {
            this.listCarecells();
            this.get();
        }
    };

    $scope.actions.init();
});