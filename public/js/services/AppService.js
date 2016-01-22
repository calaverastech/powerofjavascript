
var service = angular.module("services", ["siyfion.sfTypeahead"]);
service.factory("socketObj", function($rootScope) {
  var socket = io.connect();
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
service.factory("currencyObj", function() {
  return {
    getData: function(url, key) {
      return new Bloodhound({
        datumTokenizer: function(d) {
          return Bloodhound.tokenizers.whitespace(d[key]);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: url
      });
    }
  };
});
service.factory("stockData", [
  "$http", function($http) {
    var YAHOO_FINANCE_URL_PATTERN = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in (TICKER)&format=json&env=store://datatables.org/alltableswithkeys&callback=JSON_CALLBACK';
    var prepareArray = function(arr) {
      var arr2 = [];
      if (!angular.isArray(arr)) {
        arr = [arr];
      }
      angular.forEach(arr, function(a) {
        arr2.push("\"" + a + "\"");
      });
      return arr2.join(",");
    };
    var getData = function(stock) {
      stock = prepareArray(stock);
      var url = YAHOO_FINANCE_URL_PATTERN.replace("TICKER", stock);
      return $http.jsonp(url);
    };
    return {
      getData: getData
    };
  }
]);
service.factory("currencyConverter", [
  "$http", function($http) {
    var YAHOO_FINANCE_URL_PATTERN = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.xchange where pair="PAIR"&format=json&env=store://datatables.org/alltableswithkeys&callback=JSON_CALLBACK';
    var convert = function(inCurr, outCurr) {
      var url;
      url = YAHOO_FINANCE_URL_PATTERN.replace("PAIR", inCurr.toUpperCase() + outCurr.toUpperCase());
      return $http.jsonp(url);
    };
    return {
      convert: convert
    };
  }
]);