/* jshint -W097 */
'use strict';

var controllers, yahoofinances;
var yahoofinances = angular.module('yahoofinances', [
   //'templates', 
   'ngRoute', 
   'angular-underscore', 
   'ngResource', 
   'controllers', 
   'ngAnimate', 
   'angular-flash.service', 
   'angular-flash.flash-alert-directive', 
   'ui.bootstrap',
   'ngStorage'
]);

yahoofinances.config([
  '$httpProvider', '$routeProvider', function($httpProvider, $routeProvider) {

    $routeProvider.when('/', {
      templateUrl: "templates/index",
      controller: 'GeneralController'
    });
    //$httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.withCredentials = true;
    //delete $httpProvider.defaults.headers.common["X-Requested-With"];
    //$httpProvider.defaults.headers.common["Accept"] = "application/json";
    //$httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    
    //$locationProvider.html5Mode(true);
  }
]);
var controllers = angular.module('controllers', []);

// Declare app level module which depends on filters, and services
