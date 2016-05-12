var app = angular.module('bonierControllers', []);

app.controller('resultListCtrl', function($scope, $rootScope, searchResultFactory, cartFactory, $http, $location, MessagesFactory) {
    $rootScope.bodyClass = 'page page-flights'
    $scope.result = searchResultFactory.getSearchResult();
    $scope = Object.assign($scope, searchResultFactory.getSearchParameters());
    // $scope.origin = $scope.search.origin;
    // $scope.destination = $scope.search.destination;
    if (!$scope.result.length) {
        MessagesFactory.addMessage('', 'Please fill the fields to search for flights');
        $('#autocompleteFrom').focus();
        $location.url('/');
    }
    $scope.$watch(function () { return searchResultFactory.getSearchResult() }, function (newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.result = searchResultFactory.getSearchResult();
        }
    });

    $scope.searchUpdate = function() {
        console.log('dadas', $scope.search);
        // if ($scope.search.origin == undefined || $scope.search.date == undefined || $scope.search.numberOfSeats == undefined) {
        //     console.log("a parameter undefined");
        //     //todo visually show which parameter is undefined
        //     return;
        // }


        var date = new Date($scope.date)
        var dateUTC = date.getTime() - (date.getTimezoneOffset() * 60000);
        var isoDate = new Date(dateUTC).toISOString();

        var searchParameters = {
            "origin": $scope.origin,
            "destination": $scope.destination,
            "date": isoDate,
            "numberOfSeats": $scope.numberOfSeats
        };
        console.log(searchParameters)

        //start loading animation here
        searchResultFactory.search(searchParameters).then(function(result) {
            console.log(result);
            $scope.result = result;
            console.log("new scope result " + $scope.result);
            //stop loading animation here
        });
    };

    $scope.addToCart = function(flight) {
        cartFactory.addItem(flight);
        $location.url('/booking');
    }

    autocomplete('autocomplete3', 'origin', $scope, $scope.searchUpdate);
    autocomplete('autocomplete4', 'destination', $scope, $scope.searchUpdate);

    //searchResultFactory.search({origin: "CPH", date: "2016-05-27T00:00:00.000Z", numberOfSeats: 1});

});
app.controller('myBookingsCtrl', function($scope, $rootScope, AuthFactory, $location, cartFactory, $http, MessagesFactory) {
    let user = AuthFactory.getUser();
    if (!user.isAuthenticated) {
        MessagesFactory.addMessage('', 'Please sign in to see your bookings')
        $('.login__username').focus();
        $location.url('/');
        return;
    }
    $rootScope.bodyClass = 'page page-mybookings';
    $scope.bookings;
    $http.get(apiUrl + 'api/booking').then(function(response) {
        $scope.bookings = response.data;
        console.log($scope.bookings);
    })
});
app.controller('frontPageCtrl', function($rootScope) {
    $rootScope.bodyClass = 'page page-front';
});
app.controller('contactCtrl', function($rootScope, $scope, MessagesFactory) {
    $rootScope.bodyClass = 'page page-contact';

    $scope.send = function() {
        MessagesFactory.addMessage('success', 'Your message has been send!');
        $('.form-contact').get(0).reset();
        console.log(this);
    }
});
app.controller('bookingCtrl', function($scope, cartFactory, $http, AuthFactory, MessagesFactory) {
    $scope.items =
    // [{
    //     "airline":"Bonier",
    //   "flightID": "26982038922503172498605383216",
    //   "date": "2016-06-27T20:00:00.000Z",
    //   "traveltime": 120,
    //   "flightNumber": "087",
    //   "destination": "STN",
    //   "origin": "CPH",
    //   "numberOfSeats": 1,
    //   "totalPrice": 16
    // }];
    cartFactory.getItems();
    $scope.bookee = {
        name: AuthFactory.getUser().username,
        email: undefined,
        phone: undefined
    }
    $scope.passengers = []
    for (var i = 0; i < $scope.items[0].numberOfSeats; i++) {
        $scope.passengers[i] = {
            firstName: undefined,
            lastName: undefined
        }
    }

    $scope.book = function() {
        var bookingParams = {
            passengers: $scope.passengers,
            userName: $scope.bookee.name,
            reserveeEmail: $scope.bookee.email,
            reservePhone: $scope.bookee.phone
        };
        // var bookingParams = {
        //     passengers: [{firstName: 'mats', lastName: 'kruger'}],
        //     userName: 'admin',
        //     reserveeEmail: 'mats@mats.com',
        //     reserveePhone: '21232123'
        // };
        $scope.items.forEach(function(item) {
            bookingParams.airline = item.airline;
            bookingParams.flightID = item.flightID;
            $http.post(apiUrl + 'api/booking', JSON.stringify(bookingParams)).then(function(response, status) {
                MessagesFactory.addMessage('success', 'Thank you for your booking, please check your mail for the ticket(s)');
            },function(data, status) {
                MessagesFactory.addMessage('danger', 'Something went wrong please try again');
            });
            // console.log(item);
        });
    }
});

app.controller('searchCtrl', function($scope, searchResultFactory, $http, MessagesFactory) {

    $scope.minDate = new Date();
    $scope.outbound = new Date($scope.minDate);
    $scope.minSeats = 1;
    $scope.maxSeats = 999;
    $scope.seats = $scope.minSeats;
    $scope.origin = {};
    $scope.destination = {};
    $scope.validate = function() {
        if (Date.parse(this.outbound) < Date.parse(this.minDate)) $scope.outbound = $scope.minDate;
        if (!$scope.seats || $scope.seats < $scope.minSeats) $scope.seats = $scope.minSeats;
        if (!$scope.seats || $scope.seats < $scope.minSeats) $scope.seats = $scope.minSeats;
    }
    $scope.search = function() {
        if (!$scope.outbound || !$scope.origin || !$scope.seats) {
            MessagesFactory.addMessage('', 'Please fill out all the fields');
            return;
        }
        var date = new Date($scope.outbound);
        var dateUTC = date.getTime() - (date.getTimezoneOffset() * 60000);
        var isoDate = new Date(dateUTC).toISOString();
        var searchParameters = {
            "origin": $scope.origin,
            "destination": $scope.destination || undefined,
            "date": isoDate,
            "numberOfSeats": $scope.seats
        };
        //todo check input before post request
        searchResultFactory.search(searchParameters);
        searchParameters.date = $scope.outbound
        searchResultFactory.saveSearchParameters(searchParameters)
    };
    $('.find-flights').on('focus', 'input', function() {
        if (this.classList.contains('md-datepicker-input')) {

        }
    });
    $('.find-flights').on('blur', 'input', function() {
        $scope.validate();
    });
    autocomplete('autocompleteFrom', 'origin', $scope);
    autocomplete('autocompleteTo', 'destination', $scope);

});

var errorGlyph = '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> '
var successGlyph = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> '

app.factory('cartFactory', function() {
    var items = [];
    // var total = 0;

    return {
        getItems: function() {
            return items;
        },
        addItem: function(item) {
            items.push(item);
        }
    };
});
app.factory('searchResultFactory', function($http, $location, $q) {
    var searchResult = [];
    var searchParameters = [];
    var baseUrl = apiUrl + "api/flight";

    return {
        searchResult: searchResult,
        search: function(searchParameters) {
            fromattedSearchParameters = {
                "origin": searchParameters.origin.iata,
                "destination": searchParameters.destination.iata || undefined,
                "date": searchParameters.date,
                "numberOfSeats": searchParameters.numberOfSeats
            };
            var deferred = $q.defer();
            $http.post(baseUrl, JSON.stringify(fromattedSearchParameters)).then(function(response, status) {
                searchResult = response.data;
                $location.url('/flights');
                deferred.resolve(response.data);
            },function(data, status) {
                console.log("unhandled error");
                deferred.reject(data);
            });
            return deferred.promise;
        },
        getSearchResult: function() {
            // console.log("getting search result");
            return searchResult;
        },
        saveSearchParameters: function(data) {
            searchParameters = data;
            // console.log("saving parameters " + data);
        },
        getSearchParameters: function(data) {
            // console.log("getting search parameters");
            return searchParameters;
        }
    };
});

app.controller('profileCtrl', function($http, $window, jwtHelper, $scope) {
    var init = function() {
        var token = $window.sessionStorage.id_token;
        if (token) {
            // function in auth.js
            initializeFromToken($scope, $window.sessionStorage.id_token, jwtHelper);
        }
    };
    init();

    $scope.user = {};
    $http.get('api/user/' + $scope.username)
        .success(function(data) {
            console.log(data);
            $scope.user = data;
        })
        .error(function(data) {
            console.log(data);
            console.log("handle this error");
        });

    $http.get('api/booking')
        .success(function(data) {
            console.log(data);
        })
        .error(function(data) {
            console.log(data);
        });
});

app.controller('adminCtrl', function($http, $window, jwtHelper, $scope, AuthFactory) {
    // var init = function() {
    //     var token = $window.sessionStorage.id_token;
    //     if (token) {
    //         // function in auth.js
    //         initializeFromToken($scope, $window.sessionStorage.id_token, jwtHelper);
    //     }
    // };
    // init();
    $scope.adminUser = AuthFactory.getUser();

    $scope.users = [];
    $http({
        method: 'GET',
        url: apiUrl + 'api/user/all',
        headers: {

        }
    })
    .success(function(data) {
        console.log(data);
        $scope.users = data;
    })
    .error(function(data) {
        console.log(data);
    });
});

app.controller('adminDetailsCtrl', function($scope, $routeParams, $http) {
    $scope.username = $routeParams.username;
    //todo get bookings the user in routeParams
    $http.get('api/booking')
        .success(function(data) {
            console.log(data);
        })
        .error(function(data) {
            console.log(data);
        });
});
app.controller('messagesCtrl', function($rootScope, $scope, MessagesFactory) {
    _this = this;
    $scope.messages = [];
    let messages = document.querySelector('.messages');
    $scope.close = function(index) {
        MessagesFactory.removeMessage(index);
    };
    (function() {
        MessagesFactory.registerObserver(function() {
            $scope.messages = MessagesFactory.getMessages();
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        });
    })();
});
