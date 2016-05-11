'use strict';

/* Place your global Factory-service in this file */

angular.module('bonierFactories', [])
    .factory('InfoFactory', function() {
        var info = "Hello World from a Factory";
        var getInfo = function getInfo() {
            return info;
        };
        return {
            getInfo: getInfo
        };
    })
    .factory('AuthFactory', function() {

        var user = {};

        function setUser(input) {
            user = input;
            console.log("current user: ");
            console.log(user);
        }

        function getUser() {
            return user;
        }

        function resetUser() {
            user = {};
        }

        return {
            setUser: setUser,
            getUser: getUser,
            resetUser: resetUser
        };

    })
    .factory('MessagesFactory', function() {
        var messages = [];
        var observerCallbacks = [];

        function notifyObservers() {
            angular.forEach(observerCallbacks, function(callback) {
                callback();
            });
        }

        return {
            addMessage: function(type, message) {
                let body = {
                    type: type,
                    text: message
                };
                messages.unshift(body);
                // messages.push(body);
                // let index = messages.length - 1;
                setTimeout(function(){
                    this.removeMessage();
                }.bind(this), 5000);
                notifyObservers();
            },
            removeMessage: function(index) {
                messages.pop();
                // messages.splice(index, 1);
                notifyObservers();
            },
            getMessages: function() {return messages},
            registerObserver: function(callback) {
                observerCallbacks.push(callback);
            }
        }
    })
