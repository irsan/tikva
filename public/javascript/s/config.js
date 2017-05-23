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
        when('/followups/:week', {
            templateUrl: '/tpl/s_followups',
            controller: 'followupsCtrl'
        }).
        when('/followups/servicedate/:date', {
            templateUrl: '/tpl/s_followups_servicedate',
            controller: 'followupsServicedateCtrl'
        }).
        when('/followup/add', {
            templateUrl: '/tpl/s_newfollowup',
            controller: 'newFollowUpCtrl'
        }).when('/followup/:uuid', {
            templateUrl: '/tpl/s_followup',
            controller: 'followupCtrl'
        }).
        otherwise({
            redirectTo: '/followups'
        });
    }
]);

app.directive('onEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});