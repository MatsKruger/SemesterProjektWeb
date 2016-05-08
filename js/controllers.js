var app = angular.module('bonierControllers', []);

app.controller('resultListCtrl', function($scope, searchResultFactory, cartFactory, $http, $location) {
    $scope.result = searchResultFactory.getSearchResult();
    $scope.search = searchResultFactory.getSearchParameters();

    $scope.$watch(function () { return searchResultFactory.getSearchResult() }, function (newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.result = searchResultFactory.getSearchResult();
        }
    });

    $scope.addToCart = function(flight) {
        cartFactory.addItem(flight);
        $location.url('/booking');
    }

    searchResultFactory.search({origin: "CPH", date: "2016-05-27T00:00:00.000Z", numberOfSeats: 1});

});

app.controller('bookingCtrl', function($scope, cartFactory, $http) {
    $scope.items = [{"date":"2016-05-27T15:00:00.000Z","numberOfSeats":1,"traveltime":60,"totalPrice":70,"origin":"CPH","destination":"SXF","flightID":"2216-1464375600000","flightNumber":"COL2216","airline":"AngularJS Airline","$$hashKey":"object:17"}];//cartFactory.getItems();
    $scope.bookee = {
        name: undefined,
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
            reserveeName: $scope.bookee.name,
            reserveeEmail: $scope.bookee.email,
            reserveePhone: $scope.bookee.phone
        };
        $scope.items.forEach(function(item) {
            bookingParams.flightID = item.flightID;
            console.log(bookingParams);
            $http.post(apiUrl + 'api/booking', JSON.stringify(bookingParams)).then(function(response, status) {
                console.log(response);
            },function(data, status) {
                console.log("unhandled error");
            });
            // console.log(item);
        });
    }
});

app.controller('searchCtrl', function($scope, searchResultFactory, $http) {
    $scope.minDate = new Date();
    $scope.outbound = new Date($scope.minDate);
    $scope.minSeats = 1;
    $scope.maxSeats = 20;
    $scope.seats = $scope.minSeats;
    $scope.from = '';
    $scope.to = '';
    var cached = {
        from: null,
        to: null
    };
    $scope.validate = function() {
        if (Date.parse(this.outbound) < Date.parse(this.minDate)) $scope.outbound = $scope.minDate;
        if (!$scope.seats || $scope.seats < $scope.minSeats) $scope.seats = $scope.minSeats;
        if (!$scope.seats || $scope.seats < $scope.minSeats) $scope.seats = $scope.minSeats;
    }
    $scope.search = function() {
        if (!$scope.outbound || !$scope.from || !$scope.seats) {
            return;
        }
        var date = new Date($scope.outbound);
        var dateUTC = date.getTime() - (date.getTimezoneOffset() * 60000);

        var isoDate = new Date(dateUTC).toISOString();
        console.log(isoDate);
        var searchParameters = {
            "origin": $scope.from.iata,
            "destination": $scope.to.iata || undefined,
            "date": isoDate,
            "numberOfSeats": $scope.seats
        };
        //todo check input before post request
        searchResultFactory.search(searchParameters);
        searchParameters.date = $scope.date
        searchResultFactory.saveSearchParameters(searchParameters)
    };
    $('.find-flights').on('focus', 'input', function() {
        if (this.classList.contains('md-datepicker-input')) {

        }
    });
    $('.find-flights').on('blur', 'input', function() {
        $scope.validate();
    });
    autocomplete('autocompleteFrom', 'from');
    autocomplete('autocompleteTo', 'to');

    function autocomplete(id, scopeName) {
        id = '#' + id;
        $(id).autocomplete({
            source: function(request, response) {
                $.getJSON(apiUrl + 'api/airport?q=' + request.term).then(response);
            },
            appendTo: $(id).closest('.group'),
            minLength: 2,
            select: function(event, ui) {
                $scope[scopeName] = ui.item;
                this.value = ui.item.name + ', ' + ui.item.city + ' ' + ui.item.country;
                this.blur();
                return false;
            },
            focus: function(event, ui) {
                return false;
            }
        })
        .keypress(function() {
            // console.log($scope.from);
        })
        .focus(function(){
            cached[scopeName] = $scope[scopeName];
            $(this).autocomplete("instance").search($(this).val());
        })
        .blur(function(){
            if ($scope[scopeName] && cached[scopeName] === $scope[scopeName]) {
                this.value = $scope[scopeName].name + ', ' + $scope[scopeName].city + ' ' + $scope[scopeName].country;
            }
            cached[scopeName] = null;
        })
        .autocomplete( "instance" )._renderItem = function( ul, item ) {
            return $("<li>")
                .attr("data-value", item.iata)
                .append(item.name + ', ' + item.city + ' ' + item.country)
                .appendTo(ul);
        };
    }

});

var errorGlyph = '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> '
var successGlyph = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> '

app.controller('formController', ['$scope', '$http', function($scope, $http, $window) {
    $scope.create = function(user) {
        $('#registration .alert').remove();
        //validation
        if (user.userName == undefined || user.firstName == undefined || user.lastName == undefined || user.email == undefined || user.password.trim() === "" || user.passwordRep.trim() === "") {
            $('#registration .alert').remove();
            $('#registration').prepend('<div class="alert alert-danger id="message-box">' + errorGlyph + 'Please fill all the fields with a valid input</div>');
            return;
        } else if (user.password.length < 6) {
            $('#registration .alert').remove();
            $('#registration')
                .prepend('<div class="alert alert-danger id="message-box">' + errorGlyph + 'Password length needs to be at least 6 characters long</div>');
            return;
        } else if (user.password !== user.passwordRep) {
            $('#registration .alert').remove();
            $('#registration').prepend('<div class="alert alert-danger id="message-box">' + errorGlyph + 'Passwords do not match</div>');
            return;
        }

        //creation post call
        //delete user.passwordRep;
        $http.post('/SemesterProject/api/user', user)
            .success(function(data) {
                var dataBool = data === "ok";
                $('#registration .alert').remove();
                $('#registration').prepend('<div class="alert ' + (dataBool ? 'alert-success' : 'alert-danger') + '" id="message-box">' + (dataBool ? successGlyph : errorGlyph) + (dataBool ? 'Account created' : 'Username taken') + '</div>');
                if (dataBool) {
                    $('#createUserForm').remove();
                }
            });
    };
}]);
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
            console.log(JSON.stringify(searchParameters), 'dsa');
            console.log("in search factory");
            var deferred = $q.defer();
            $http.post(baseUrl, JSON.stringify(searchParameters)).then(function(response, status) {
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
            console.log("getting search result");
            return searchResult;
        },
        saveSearchParameters: function(data) {
            searchParameters = data;
            console.log("saving parameters " + data);
        },
        getSearchParameters: function(data) {
            console.log("getting search parameters");
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

app.controller('adminCtrl', function($http, $window, jwtHelper, $scope) {
    var init = function() {
        var token = $window.sessionStorage.id_token;
        if (token) {
            // function in auth.js
            initializeFromToken($scope, $window.sessionStorage.id_token, jwtHelper);
        }
    };
    init();

    $scope.users = [];
    $http.get('api/user/all')
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
