var app = angular.module('TikvaApp');

app.config(['$mdDateLocaleProvider', function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function (date) {
        return date ? moment(date).format('DD/MM/YYYY') : '';
    };
    $mdDateLocaleProvider.parseDate = function (dateString) {
        var m = moment(dateString, 'DD/MM/YYYY', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    };
}]);

app.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/followups', {
            templateUrl: '/tpl/s_followups',
            controller: 'followupsCtrl'
        }).
        when('/followup', {
            templateUrl: '/tpl/s_followup',
            controller: 'followupCtrl'
        }).
        when('/followup/add', {
            templateUrl: '/tpl/s_newfollowup',
            controller: 'newFollowUpCtrl'
        }).
        otherwise({
            redirectTo: '/followups'
        });
    }
]);