var app = angular.module('TikvaApp');

app.controller('followupsCtrl', function ($scope, $rootScope, $routeParams, $location, $document, $timeout, $log, rest) {
    $rootScope.selectedMenu = 'followups';
    $rootScope.hideMainMenu = false;

    $log.debug("FOLLOW UPS CTRL", $routeParams);

    $scope.show = {
        chooseSunday : false,
        loading : false
    };

    $scope.data = {
        sunday : moment().startOf('week'),
        followUps : {
            count : 0,
            lastPage : 0,
            currentPage : 0,
            followUps : {}
        }
    };

    $scope.actions = {
        listFollowUps : function(page) {
            $scope.show.loading = true;
            rest.followUp.list({}, page, function(response) {
                $log.info("LIST FOLLOWUPS", response);
                if(response.status == "Ok") {
                    $scope.data.followUps = response.data;
                    $timeout(function() {
                        var lastEc = angular.element($document[0].querySelector("md-content.mainContent"));
                        lastEc[0].scrollTop = lastEc[0].scrollHeight;
                    });
                }
                $scope.show.loading = false;
            });
        },
        showNewFollowUp : function() {
            $location.path("/followup/add");
        },
        formatDate : function() {
            return $scope.data.sunday.locale('id').format("dddd, D MMM YYYY");
        },
        gotoFollowup : function(followUp) {
            $location.path('/followup/' + followUp.uuid);
        },
        init : function() {
            $scope.actions.listFollowUps(1);
        }
    };

    $scope.actions.init();
});

app.controller('newFollowUpCtrl', function($scope, $rootScope, $mdDialog, $location, $log, rest, Upload) {
    $log.debug("NEW FOLLOW UP CONTROLLER");
    $rootScope.hideMainMenu = true;

    $scope.data = {
        carecells : [],
        followUp : {
            serviceDate : moment().startOf('week').toDate(),
            profileImage : "https://jie-tikva.s3.amazonaws.com/user.svg"
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
        addFollowup : function(ev) {
            rest.followUp.add($scope.data.followUp, function(response) {
                $log.info("ADD FOLLOWUP", response);
                if(response.status == "Ok") {
                    var confirm = $mdDialog.confirm()
                        .title('Follow Up sudah sukses ditambahkan')
                        .textContent('Mau masukkan Follow Up yang baru?')
                        .ariaLabel('Follow Up Added Successfully')
                        .targetEvent(ev)
                        .ok("Ya")
                        .cancel("Tidak");

                    $mdDialog.show(confirm).then(function() {
                        $scope.data.followUp = {
                            serviceDate : moment().startOf('week').toDate()
                        };
                    }, function() {
                        $location.path("/followups");
                    });
                }
            });
        },
        backToFollowUps : function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Apakah mau membatalkan untuk follow up baru?')
                .textContent('Jika batalkan sekarang, semua informasi yang telah diisi akan hilang.')
                .ariaLabel('Cancel')
                .targetEvent(ev)
                .ok("Ya")
                .cancel("Tidak");

            $mdDialog.show(confirm).then(function() {
                $location.path("/followups");
            }, function() {});
        }
    }

    $scope.$watch('file', function () {
        $log.info("TRYING UPLOADED", $scope.file);
        if($scope.file) {
            // $scope.actions.uploadImportCountries();
            Upload.upload({
                url: '/upload',
                data : {
                    file : $scope.file
                }
            }).then(function(resp) {
                $log.info("UPLOADED", resp.data);
                if(resp.status == 200) {
                    var data = resp.data;
                    if(data.status == "Ok") {
                        $scope.data.followUp.profileImage = data.data.file.location;
                        // var uploadId = data.data._id;
                        // rest.country.import(uploadId, function(response) {
                        //     if(response.status == "Ok") {
                        //         $scope.actions.list(1);
                        //     }
                        //
                        //     $scope.show.topBar = true;
                        //     $scope.show.importCountries = false;
                        //     $scope.show.uplodingImportCountries = false;
                        //
                        // });
                    }
                }
            }, null, function (evt) {
                $scope.data.uploading = parseInt(100.0 * evt.loaded / evt.total);
            });
        }
    });

    $scope.actions.listCarecells();
})