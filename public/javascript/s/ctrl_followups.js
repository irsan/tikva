var app = angular.module('TikvaApp');

app.controller('followupsCtrl', function ($scope, $rootScope, $log) {
    $rootScope.selectedMenu = 'followups';

    $log.debug("FOLLOW UPS CTRL");
});