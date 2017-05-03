var app = angular.module('TikvaApp');

app.controller('followupsCtrl', function ($scope, $rootScope, $location, $log, rest) {
    $rootScope.selectedMenu = 'followups';
    $rootScope.hideMainMenu = false;

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

app.controller('newFollowUpCtrl', function($scope, $rootScope, $mdDialog, $location, $log, rest, Upload) {
    $log.debug("NEW FOLLOW UP CONTROLLER");
    $rootScope.hideMainMenu = true;

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
        addFollowup : function() {
            rest.ftv.add($scope.data.ftv, function(response) {
                $log.info("ADD FTV", response);
            });
        },
        backToFollowUps : function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to cancel add a follow up?')
                .textContent('If you leave now, all information that has been entered will be gone.')
                .ariaLabel('Cancel')
                .targetEvent(ev)
                .ok("Yes")
                .cancel("No");

            $mdDialog.show(confirm).then(function() {
                $location.path("/followups");
            }, function() {});
        }
    }

    $scope.$watch('file', function () {
        $log.info("TRYING UPLOADE", $scope.file);
        // if($scope.file) {
        //     $scope.actions.uploadImportCountries();
        //     Upload.upload({
        //         url: '/upload',
        //         data : {
        //             file : $scope.file
        //         }
        //     }).then(function(resp) {
        //         $log.info("UPLOADED", resp);
        //         if(resp.status == 200) {
        //             var data = resp.data;
        //             if(data.status == "Ok") {
        //                 var uploadId = data.data._id;
        //                 rest.country.import(uploadId, function(response) {
        //                     if(response.status == "Ok") {
        //                         $scope.actions.list(1);
        //                     }
        //
        //                     $scope.show.topBar = true;
        //                     $scope.show.importCountries = false;
        //                     $scope.show.uplodingImportCountries = false;
        //
        //                 });
        //             }
        //         }
        //     }, null, function (evt) {
        //         $scope.data.uploading = parseInt(100.0 * evt.loaded / evt.total);
        //     });
        // }
    });

    $scope.actions.listCarecells();
})