var controllers = angular.module('controllers', ["siyfion.sfTypeahead", 'services', 'animations', 'display']);
controllers.controller("GeneralController", [
  '$scope', '$location', 'currencyObj', function($scope, $location, currencyObj) {
    $scope.up_or_down = function(obj, arrow) {
      var num = parseFloat(obj);
      var up = (!!arrow && !!num && num !== 0 ? "glyphicon glyphicon-arrow-up" : "") + " up";
      var down = (!!arrow && !!num && num !== 0 ? "glyphicon glyphicon-arrow-down" : "") + " down";
      return ((num > 0) ? up : down);
    };
    $scope.currencyOptions = {
      highlight: true
    };
    $scope.amount1 = 1;
    $scope.amount2 = 0;
    var loc = $location.protocol() + "://" + $location.host() + ":" + $location.port();
    var currKey = "curr";
    var currencies = currencyObj.getData(loc + "/currencies", currKey);
    currencies.initialize();
    $scope.currenciesDataset = {
      name: "currencies",
      displayKey: currKey,
      source: currencies.ttAdapter(),
      templates: {
        suggestion: function(currency) {
          return "<p>" + currency.name + "</p>";
        }
      }
    };
  }
]);
controllers.controller("ClockController", [
  '$scope', '$interval', function($scope, $interval) {
    $scope.clock = Date.now();
    $scope.tickInterval = 1000;
    var tick = function() {
      $scope.clock = Date.now();
    };
    $interval(tick, $scope.tickInterval);
  }
]);
controllers.controller("FinancesController", [
  '$scope', '$location', 'socketObj', 'flash', function($scope, $location, socketObj, flash) {
    flash.to("finances").info = "Loading stock data...";
    socketObj.on("finances", function(data) {
      flash.to("finances").info = "";
        $scope.results = data;
    });
  }
]);
controllers.controller("StockController", [
  '$scope', '$location', 'stockData', 'flash', function($scope, $location, stockData, flash) {
    var getStock = function(model, flash, stock) {
      var errorCallback, refresh, successCallback;
      $scope.isLoading = true;
      refresh = false;
      if (angular.isUndefined(stock)) {
        stock = $scope.pluck($scope[model], "Symbol");
        refresh = true;
      }
      return stockData.getData(stock).then((successCallback = function(response) {
        var quote;
        try {
          quote = response.data.query.results.quote;
          if (!angular.isArray(quote)) {
            quote = [quote];
          }
          if (refresh) {
            $scope[model] = [];
          }
          angular.forEach(quote, function(q) {
            $scope[model].push(q);
          });
          if (!refresh) {
            $scope.ticker = "";
          }
          $scope.isLoading = false;
        } catch (e) {
          console.log("Request Failed: result is ", response.data.query.results);
          flash.error = "Yahoo Finance stock information currently is not available. Try again later.";
          $scope.isLoading = false;
        }
      }), errorCallback = function(response) {
           console.log("Error");
      });
    };
    $scope.isCustomer = true;
    $scope.isLoading = false;
    $scope.customResults = [];
    $scope.show = function(item) {
      item = angular.uppercase(item);
      if ($scope.contains($scope.pluck($scope.customResults, "Symbol"), item)) {
        flash.to("stock").error = "This item is already in the selection";
      } else {
        getStock("customResults", flash.to("stock"), item);
      }
    };
    $scope.removeTicker = function(index) {
      $scope.customResults.splice(index, 1);
    };
    $scope.refresh = function() {
      getStock("customResults", flash.to("stock"));
    };
  }
]);
controllers.controller("CurrenciesController", [
  '$scope', 'socketObj', 'flash', function($scope, socketObj, flash) {
    socketObj.on("majorCurrencies", function(data) {
      $scope.results = data;
    });
  }
]);
controllers.controller("CurrencyConverterController", [
  '$scope', 'currencyConverter', 'flash', function($scope, currencyConverter, flash) {
    var convertAmount = function(amount, curr1, curr2, model) {
      var errorCallback, successCallback;
      $scope.isLoading = true;
      currencyConverter.convert(curr1, curr2).then((successCallback = function(response) {
        try {
          var rate = response.data.query.results.rate;
          flash.info = "";
          $scope.isLoading = false;
          $scope[model] = amount * parseFloat(rate.Rate);
        } catch (e) {
          console.log("Request Failed: result is ", response.data.query.results);
          flash.error = "Yahoo Finance exchange rates currently are not available. Try again later.";
          $scope.isLoading = false;
        }
      }), errorCallback = function(response) {
        console.log("Error");
      });
    };
    $scope.isLoading = false;
    $scope.convert = function(type) {
      if (!!$scope.currency1.curr && $scope.currency1.curr.length >= 3 && !!$scope.currency2.curr && $scope.currency2.curr.length >= 3) {
        if (type === "amount1" && $scope.amount2 > 0) {
          convertAmount($scope.amount2, $scope.currency2.curr, $scope.currency1.curr, "amount1");
        } else if (type === "amount2" && $scope.amount1 > 0) {
          convertAmount($scope.amount1, $scope.currency1.curr, $scope.currency2.curr, "amount2");
        }
      }
    };
  }
]);