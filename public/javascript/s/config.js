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

app.directive('onSizeChanged', function ($window, $timeout) {
    return {
        restrict: 'A',
        scope: {
            onSizeChanged: '&'
        },
        link: function (scope, $element, attr) {
            var element = $element[0];

            cacheElementSize(scope, element);
            $window.addEventListener('resize', onWindowResize);

            function cacheElementSize(scope, element) {
                scope.cachedElementWidth = element.offsetWidth;
                scope.cachedElementHeight = element.offsetHeight;
            }

            function onWindowResize(init) {
                var isSizeChanged = scope.cachedElementWidth != element.offsetWidth || scope.cachedElementHeight != element.offsetHeight;
                if (isSizeChanged || init) {
                    cacheElementSize(scope, element);
                    var expression = scope.onSizeChanged();
                    expression(element);
                }
            };

            $timeout(function() { console.log("WAIIITTTTTTT") }, 2000);
        }
    }
});