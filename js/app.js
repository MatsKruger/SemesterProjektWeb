var apiUrl = 'http://localhost:8080/Backend/';
var bonierApp = angular.module('bonierApp', [
    'ngRoute',
    'ngAnimate',
    'angular-jwt',
    'ui.bootstrap.modal',
    'ui.bootstrap.tpls',
    'bonierControllers',
    'bonierSecurity',
    'bonierFactories',
    'bonierFilters',
    'ngMaterial'
]);

bonierApp.config(function($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
    $routeProvider.
    when('/', {
        templateUrl: 'partials/frontPage.html',
        controller: 'frontPageCtrl'
    }).
    when('/flights', {
        templateUrl: 'partials/result-list.html',
        controller: 'resultListCtrl'
    }).
    when('/booking', {
        templateUrl: 'partials/booking.html',
        controller: 'bookingCtrl'
    }).
    when('/contact', {
        templateUrl: 'partials/contact.html',
        controller: 'contactCtrl'
    }).
    // when('/start', {
    //     templateUrl: 'partials/start.html',
    //     controller: 'searchCtrl'
    // }).
    // when('/register', {
    //     templateUrl: 'partials/registration.html',
    //     controller: 'formController'
    // }).
    when('/profile', {
        templateUrl: 'partials/profile.html',
        controller: 'profileCtrl'
    }).
    when('/admin', {
        templateUrl: 'partials/admin.html',
        controller: 'adminCtrl'
    }).
    when('/admin/:username', {
        templateUrl: 'partials/admin-details.html',
        controller: 'adminDetailsCtrl'
    }).
    when('/mybookings', {
        templateUrl: 'partials/mybookings.html',
        controller: 'myBookingsCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });
});
bonierApp.directive('boniernavbar', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/navbar.html'
    };
});

bonierApp.directive("bonierlogin", function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/login.html'
    };
});
bonierApp.directive("messages", function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/messages.html'
    };
});
