/* jshint -W097 */
"use strict";

beforeEach(module("yahoofinances"));

describe("CurrencyConverterController", function() {

  var scope = null;
  var httpBackend = null;
  var currencyConverter = null;
  var flash = null;
  var createController = null;
  var ctrl = null;
  var amount = 10;
  var newamount = -1;
  var YAHOO_FINANCE_URL_PATTERN1 = "https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.xchange where pair=\"EURUSD\"&format=json&env=store://datatables.org/alltableswithkeys&callback=JSON_CALLBACK";
  var YAHOO_FINANCE_URL_PATTERN2 = "https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.xchange where pair=\"USDEUR\"&format=json&env=store://datatables.org/alltableswithkeys&callback=JSON_CALLBACK";
  
  var convertAmount = function(a, rateobj) {
    var rate = rateobj.data.query.results.rate;
    return a * rate.Rate;
  };
  
  beforeEach(inject(function($httpBackend, $rootScope, $controller, _currencyConverter_, _flash_) {
    httpBackend = $httpBackend;
    currencyConverter = _currencyConverter_;
    scope = $rootScope.$new();
    scope.currency1 = {
      curr: "EUR"
    };
    scope.currency2 = {
      curr: "USD"
    };
    flash = _flash_;
    
    createController = function(conv) {
      return $controller("CurrencyConverterController", {
        $scope: scope,
        currencyConverter: conv,
        flash: flash
      });
    };
    
    httpBackend.whenGET(/^templates\//).respond('200', '');
  }));
  
  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });
  
  describe("non-available service", function() {
    beforeEach(function() {
      httpBackend.whenJSONP(YAHOO_FINANCE_URL_PATTERN1).respond({
        query: {
          results: null
        }
      });
      ctrl = createController(currencyConverter);
      scope.amount1 = amount;
      scope.$digest();
    });
    
    it("should return a message", function() {
      scope.$apply(function() {
        scope.convert("amount2");
      });
      
      httpBackend.flush();
      
      expect(flash.error).toBe("Yahoo Finance exchange rates currently are not available. Try again later.");
    });
  });
  
  describe("available service", function() {
    it("should convert 10 EUR to 10.878 USD", function() {

      httpBackend.whenJSONP(YAHOO_FINANCE_URL_PATTERN1).respond({
        query: {
          results: {
            rate: {
              id: "EURUSD",
              Name: "EUR/USD",
              Rate: 1.0878,
              Date: "1/12/2016",
              Time: "8:37am",
              Ask: 1.0878,
              Bid: 1.0878
            }
          }
        }
      });
      httpBackend.expectJSONP(YAHOO_FINANCE_URL_PATTERN1);
      
      currencyConverter.convert("EUR", "USD").then(function(response) {
        newamount = convertAmount(amount, response);
        expect(newamount.toFixed(3)).toBe("10.878");
      });
      httpBackend.flush();
      
      
      ctrl = createController(currencyConverter);
      scope.amount1 = amount;
      scope.$digest();
      scope.$apply(function() {
        scope.convert("amount2");
      });
      httpBackend.flush();
      
      expect(scope.amount2.toFixed(3)).toBe("10.878");
    });
    
    it("should convert 10 USD to 9.194 EURO", function() {

      httpBackend.whenJSONP(YAHOO_FINANCE_URL_PATTERN2).respond({
        query: {
          results: {
            rate: {
              id: "USDEUR",
              Name: "USD/EUR",
              Rate: 0.9194,
              Date: "1/13/2016",
              Time: "7:53pm",
              Ask: 0.9195,
              Bid: 0.9194
            }
          }
        }
      });
      httpBackend.expectJSONP(YAHOO_FINANCE_URL_PATTERN2);
      currencyConverter.convert("USD", "EUR").then(function(response) {
        newamount = convertAmount(amount, response);
        expect(newamount.toFixed(3)).toBe("9.194");
      });
      httpBackend.flush();
      ctrl = createController(currencyConverter);
      scope.amount2 = amount;
      scope.$digest();
      scope.$apply(function() {
        scope.convert("amount1");
      });
      httpBackend.flush();
        expect(scope.amount1.toFixed(3)).toBe("9.194");
    });
  });
});