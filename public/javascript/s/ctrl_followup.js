var app = angular.module('TikvaApp');

app.controller('followupCtrl', function ($scope, $rootScope, $routeParams, $mdDialog, $location, $log, rest) {
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
                        $scope.data.followUpNotes.push(response.data.followUpNote);
                        delete $scope.data.note;
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
        assignSP : function(ev) {
            $mdDialog.show({
                controller : 'followUpAssignDialogCtrl',
                templateUrl: '/tpl/s_dialog_followup_assign',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen : true,
                locals : {
                    followUp : $scope.data.followUp
                }
            }).then(function(data) {
                $log.info("ASSIGNMENT DATA", data);
            }, function() {
                $log.info("CANCEL FILTER");
            });
        },
        init : function() {
            this.listCarecells();
            this.get();
        }
    };

    $scope.actions.init();
});

app.controller('followUpAssignDialogCtrl', function($scope, $mdDialog, $log, rest, followUp) {
    $log.info("ASSIGN SP", followUp);

    $scope.data = {
        followUp : followUp
    };

    $scope.actions = {
        back : function() {
            $mdDialog.cancel();
        },
        listCarecells : function() {
            rest.carecell.list(function (response) {
                if (response.status == "Ok") {
                    $scope.data.carecells = response.data.carecells;
                }
            });
        },
        listSPs : function() {
            if($scope.data.carecell) {
                let queries = {
                    carecells : [ $scope.data.carecell ]
                };
                $log.info("CACEEEEEEEEEEE", $scope.data.carecell, queries);
                rest.sp.list(queries, function (response) {
                    $log.info("SP LIST RESPONSE", response);
                    // if (response.status == "Ok") {
                    //     $scope.data.sps = response.data.sps;
                    //     $scope.show.sps = $scope.data.filter.allCarecells || $scope.data.filter.carecells.length > 0;
                    //     $log.info($scope.show);
                    // }
                });
            }
        },
        init : function() {
            this.listCarecells();
        }
    };

    $scope.actions.init();
});