angular.module('bonierSecurity', [])
        .controller('AppLoginCtrl', function ($scope, $rootScope, $http, $window, $location, $uibModal, jwtHelper, AuthFactory, MessagesFactory) {
            $scope.user = {};
            $rootScope.$on('logOutEvent', function () {
                $scope.logout();
            });

            $scope.$on("NotAuthenticatedEvent", function (event, res) {
                $scope.$emit("logOutEvent");

                if (typeof res.data.error !== "undefined" && res.data.error.message) {
                    if (res.data.error.message.indexOf("No authorization header") === 0) {
                        MessagesFactory.addMessage('danger', "You are not authenticated to perform this operation. Please login");
                    }
                    else {
                        MessagesFactory.addMessage('danger', res.data.error.message);
                    }
                }
                else {
                    MessagesFactory.addMessage("You are not authenticated");
                }

            });

            $scope.$on("NotAuthorizedEvent", function (event, res) {
                if (typeof res.data.error !== "undefined" && res.data.error.message) {
                    MessagesFactory.addMessage('danger', res.data.error.message);
                }
                else {
                    MessagesFactory.addMessage('danger', "You are not authorized to perform the requested operation");
                }
            });

            $scope.$on("HttpErrorEvent", function (event, res) {
                if (typeof res.data.error !== "undefined" && res.data.error.message) {
                    MessagesFactory.addMessage('danger', res.data.error.message);
                }
                else {
                    MessagesFactory.addMessage('danger', "Unknown error during http request");
                }
            });

            clearUserDetails($scope, AuthFactory);

            $scope.login = function () {
                $http.post(apiUrl + 'api/login', $scope.user)
                        .success(function (data) {
                            $window.sessionStorage.id_token = data.token;
                            initializeFromToken($scope, $window.sessionStorage.id_token, jwtHelper, AuthFactory);
                            $location.path("#");
                            AuthFactory.setUser({isAuthenticated:$scope.isAuthenticated,isAdmin:$scope.isAdmin,isUser:$scope.isUser,username:$scope.username});
                        })
                        .error(function (data) {
                            delete $window.sessionStorage.id_token;
                            clearUserDetails($scope, AuthFactory);
                            AuthFactory.resetUser();
                        });
            };

            $scope.register = function() {
                $('#registration .alert').remove();
                // validation
                if ($scope.user.username == undefined || $scope.user.firstName == undefined || $scope.user.lastName == undefined || $scope.user.email == undefined || $scope.user.password.trim() === "") {
                    console.log(MessagesFactory);
                    MessagesFactory.addMessage('danger', 'Please fill all the fields with a valid input');
                    // $('#registration .alert').remove();
                    // $('#registration').prepend('<div class="alert alert-danger id="message-box">' + errorGlyph + 'Please fill all the fields with a valid input</div>');
                    return;
                } else if ($scope.user.password.length < 6) {
                    $('#registration .alert').remove();
                    $('#registration')
                        .prepend('<div class="alert alert-danger id="message-box">' + errorGlyph + 'Password length needs to be at least 6 characters long</div>');
                    return;
                }
                var registerParams = $scope.user;
                registerParams.userName = registerParams.username;
                // delete registerParams.username;

                //creation post call
                //delete user.passwordRep;
                $http.post(apiUrl + 'api/user', registerParams)
                    .success(function(data) {
                        $scope.login();
                    });
            };

            $rootScope.logout = function () {
                $scope.isAuthenticated = false;
                $scope.isAdmin = false;
                $scope.isUser = false;
                delete $window.sessionStorage.id_token;
                $location.path("#");
                $location.path("/view1");
                AuthFactory.resetUser();
            };

            $rootScope.openErrorModal = function (text) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'errorModal.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.error = text;
                        $scope.ok = function () {
                            $uibModalInstance.close();
                        };
                    },
                    size: 'sm'
                });
            };

            //This sets the login data from session store if user pressed F5 (You are still logged in)
            var init = function () {
                var token = $window.sessionStorage.id_token;
                if (token) {
                    initializeFromToken($scope, $window.sessionStorage.id_token, jwtHelper, AuthFactory);
                }
            };
            init();// and fire it after definition
        })
        .factory('AuthInterceptor', function ($rootScope, $q) {
            return {
                responseError: function (response) {
                    var name = "";
                    switch (response.status) {
                        case 401:
                            name = "NotAuthenticatedEvent";
                            break;
                        case 403:
                            name = "NotAuthorizedEvent";
                            break;
                        default :
                            name = "HttpErrorEvent";
                    }
                    $rootScope.$broadcast(name, response);
                    return $q.reject(response);
                }
            };
        })
        .config(function Config($httpProvider, jwtInterceptorProvider) {
            jwtInterceptorProvider.tokenGetter = function () {
                return sessionStorage.getItem('id_token');
            };
            $httpProvider.interceptors.push('jwtInterceptor');
        });



function initializeFromToken($scope, token, jwtHelper, authFactory) {
    $scope.isAuthenticated = true;
    var tokenPayload = jwtHelper.decodeToken(token);
    $scope.username = tokenPayload.username;
    $scope.isAdmin = false;
    $scope.isUser = false;
    tokenPayload.roles.forEach(function (role) {
        if (role === "Admin") {
            $scope.isAdmin = true;
        }
        if (role === "User") {
            $scope.isUser = true;
        }
    });
    authFactory.setUser({isAuthenticated:$scope.isAuthenticated,isAdmin:$scope.isAdmin,isUser:$scope.isUser,username:$scope.username});
}

function clearUserDetails($scope, authFactory) {
    $scope.username = "";
    $scope.isAuthenticated = false;
    $scope.isAdmin = false;
    $scope.isUser = false;
}
