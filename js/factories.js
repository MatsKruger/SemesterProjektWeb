'use strict';

/* Place your global Factory-service in this file */

angular.module('bonierFactories', []).
        factory('InfoFactory', function () {
            var info = "Hello World from a Factory";
            var getInfo = function getInfo() {
                return info;
            };
            return {
                getInfo: getInfo
            };
        })
        .factory('AuthFactory', function () {

            var user = {};

            function setUser(input){
                user = input;
                console.log("current user: ");
                console.log(user);
            }
            
            function getUser(){
                return user;
            }
            
            function resetUser(){
                user = {};
            }

            return {
                setUser: setUser,
                getUser: getUser,
                resetUser: resetUser
            };

        });
