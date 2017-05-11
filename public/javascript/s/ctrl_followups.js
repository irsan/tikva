var app = angular.module('TikvaApp');

app.controller('followupsCtrl', function ($scope, $rootScope, $routeParams, $location, $log, rest) {
    $rootScope.selectedMenu = 'followups';
    $rootScope.hideMainMenu = false;

    $log.debug("FOLLOW UPS CTRL", $routeParams);

    $scope.show = {
        chooseSunday : false
    };

    $scope.data = {
        sunday : moment().startOf('week'),
        followUps : {
            count : 0,
            lastPage : 0,
            currentPage : 0
        },
        followUpsByDate : {
            data : {},
            set : function(followUps) {
                var followUpsByDate = this;
                followUps.forEach(function(followUp) {
                    var serviceMoment = moment(followUp.serviceDate);
                    var key = serviceMoment.format("YYYYMMDD");
                    if(!followUpsByDate.data[key]) {
                        followUpsByDate.data[key] = {
                            serviceDate : serviceMoment.toDate(),
                            followUps : []
                        };
                    }
                    followUpsByDate.data[key].followUps.push(followUp);
                });

                var lastEc = angular.element($document[0].querySelector("md-content.mainContent"));
                lastEc[0].scrollTop = lastEc[0].scrollHeight;
            }
        }
    };

    $scope.actions = {
        listFollowUpPage : function(page) {
            rest.followUp.listPage({}, page, function(response) {
                $log.info("LIST FOLLOWUPS", response);
                if(response.status == "Ok") {
                    $scope.data.followUps = response.data;
                    if(response.data.count > 0) {
                        $scope.data.followUpsByDate.set(response.data.followUps);
                    }
                }
            });
        },
        listFollowUps : function() {
            rest.followUp.list({ date : $scope.data.sunday.toDate() }, function(response) {
                if(response.status == "Ok") {
                    $scope.data.followUps = response.data;
                }
            });
        },
        showNewFollowUp : function() {
            $location.path("/followup/add");
        },
        formatDate : function() {
            return $scope.data.sunday.locale('id').format("dddd, D MMM YYYY");
        },
        prevWeek : function() {
            $scope.data.sunday.subtract(1, 'weeks');
            this.listFollowUps();
        },
        nextWeek : function() {
            $scope.data.sunday.add(1, 'weeks');
            this.listFollowUps();
        },
        selectServiceDate : function() {
            $location.path('/followups/servicedate/' + $scope.data.sunday.format('YYYYMMDD'));
        },
        gotoFollowup : function(followUp) {
            $location.path('/followup');
        },
        init : function() {
            // $scope.actions.listFollowUps($scope.data.sunday);
            $scope.actions.listFollowUpPage(1);
        }
    }

    $scope.actions.init();
});

app.controller('newFollowUpCtrl', function($scope, $rootScope, $mdDialog, $location, $log, rest, Upload) {
    $log.debug("NEW FOLLOW UP CONTROLLER");
    $rootScope.hideMainMenu = true;

    $scope.data = {
        carecells : [],
        followUp : {
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
            rest.followUp.add($scope.data.followUp, function(response) {
                $log.info("ADD FOLLOWUP", response);
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

app.controller('followupsServicedateCtrl', function($scope, $rootScope, $mdDialog, $location, $log, rest, Upload) {
    $log.info("FOLLOW UPS Service date");

    $rootScope.selectedMenu = 'followups';
    $rootScope.hideMainMenu = true;

    $scope.show = {
    };

    $scope.data = {
    };

    $scope.actions = {
        backToFollowUps : function() {
            $location.path("/followups");
        },
        listServiceDates : function(page) {
            rest.serviceDate.list(page, function(response) {
                $log.info("THE RESPONSE", response);
            })
        },
        init : function() {
            this.listServiceDates(1);
        }
    };

    $scope.actions.init();
});