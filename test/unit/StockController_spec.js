/* jshint -W097 */
"use strict";

beforeEach(module("yahoofinances"));

describe("StockController", function() {
	
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
  
  var scope = null;
  var httpBackend = null;
  var stockData = null;
  var flash = null;
  var subscriber = jasmine.createSpy("subscriber1");
  var createController = null;
  var ctrl = null;
  var result = {};
  var ticker1 = "WMMVF";
  var ticker2 = ["^NQRU0001AUDT", "^GRNAM"];
  var tests = {};
  
  var YAHOO_FINANCE_URL_PATTERN1 = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in ("' + ticker1 + '")&format=json&env=store://datatables.org/alltableswithkeys&callback=JSON_CALLBACK';
  var YAHOO_FINANCE_URL_PATTERN2 = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in (' + prepareArray(ticker2) + ')&format=json&env=store://datatables.org/alltableswithkeys&callback=JSON_CALLBACK';
  
  beforeEach(inject(function($httpBackend, $rootScope, $controller, _stockData_, _flash_) {
    httpBackend = $httpBackend;
    stockData = _stockData_;
    scope = $rootScope.$new();
    flash = _flash_;
    flash.subscribe(subscriber, null, "stock");
    createController = function(add) {
      return $controller("StockController", {
        $scope: scope,
        stockData: add,
        flash: flash
      });
    };
    fixture.setBase('test/fixtures');
    this.fixtures = fixture.load("stocks.json", false);
    tests = this.fixtures;
    
    httpBackend.whenGET(/^templates\//).respond('200', '');
  }));
  
  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
    fixture.cleanup();
  });
  
  describe("unavailable service", function() {
    beforeEach(function() {
      httpBackend.whenJSONP(YAHOO_FINANCE_URL_PATTERN1).respond({
        query: {
          results: null
        }
      });
      ctrl = createController(stockData);
      scope.ticker = ticker1;
      scope.$digest();
    });
    
    it("should give a message", function() {
      scope.$apply(function() {
        scope.show(ticker1);
      });
      httpBackend.flush();
      expect(subscriber).toHaveBeenCalledWith("Yahoo Finance stock information currently is not available. Try again later.", 'error');
      expect(scope.$customResults.stocks.length).toBe(0);
    });
  });
  
  describe("available service", function() {
    beforeEach(function() {
      ctrl = createController(stockData);
    });
    describe("when adding a ticker", function() {
      beforeEach(inject(function() {
        result = {
          query: {
            results: {
              quote: tests.testStock1
            }
          }
        };
        httpBackend.whenJSONP(YAHOO_FINANCE_URL_PATTERN1).respond(result);
      }));
      
      it("should return a message if the item is already on the list", function() {
        scope.$customResults.stocks = [tests.testStock1];
        scope.show(ticker1);
        httpBackend.flush();
        expect(subscriber).toHaveBeenCalledWith("This item is already in the selection", 'error');
        expect(scope.$customResults.stocks.length).toBe(1);
      });
      
      it("should add 'WMMVF' to an empty list", function() {
        httpBackend.expectJSONP(YAHOO_FINANCE_URL_PATTERN1);
        stockData.getData(ticker1).then(function(response) {
          var quote = response.data.query.results.quote;
          expect(quote.Symbol).toBe('WMMVF');
          expect(quote).toEqual(tests.testStock1);
        });
        httpBackend.flush();
        scope.$apply(function() {
          scope.show(ticker1);
        });
        httpBackend.flush();
        expect(scope.$customResults.stocks.length).toBe(1);
        expect(scope.$customResults.stocks).toContain(tests.testStock1);
        expect(scope.$customResults.stocks[0].Symbol).toBe('WMMVF');
      });
      
      it("should add 'WMMVF' to the non-empty list", function() {
        scope.$customResults.stocks = [tests.testStock2, tests.testStock3];
        scope.$apply(function() {
          scope.show(ticker1);
        });
        httpBackend.flush();
        expect(scope.$customResults.stocks.length).toBe(3);
        expect(scope.$customResults.stocks).toContain(tests.testStock1);
        expect(scope.$customResults.stocks[2].Symbol).toBe('WMMVF');
      });
    });
    
    describe("when clicking on 'x'", function() {
      it("should remove the ticker from the custom list", function() {
        scope.$customResults.stocks = [tests.testStock1, tests.testStock2, tests.testStock3];
        httpBackend.flush();
        expect(scope.$customResults.stocks.length).toBe(3);
        scope.removeTicker(0);
        expect(scope.$customResults.stocks.length).toBe(2);
        expect(scope.$customResults.stocks).toEqual([tests.testStock2, tests.testStock3]);
        expect(scope.$customResults.stocks).not.toContain(tests.testStock1);
      });
    });
    
    describe("when refreshing the custom list", function() {
      beforeEach(inject(function() {
        result = {
          query: {
            results: {
              quote: [tests.testStock2_new, tests.testStock3_new]
            }
          }
        };
        httpBackend.whenJSONP(YAHOO_FINANCE_URL_PATTERN2).respond(result);
      }));
      
      it("should get new values", function() {
        scope.$customResults.stocks = [tests.testStock2, tests.testStock3];
        httpBackend.expectJSONP(YAHOO_FINANCE_URL_PATTERN2);
        stockData.getData(ticker2).then(function(response) {
          var quote = response.data.query.results.quote;
          expect(quote.length).toBe(2);
          expect(quote).toContain(tests.testStock2_new);
          expect(quote).toContain(tests.testStock3_new);
          expect(quote).toEqual([tests.testStock2_new, tests.testStock3_new]);
        });
        httpBackend.flush();
        scope.$apply(function() {
          scope.refresh();
        });
        httpBackend.flush();
        expect(scope.$customResults.stocks.length).toBe(2);
        expect(scope.$customResults.stocks).toContain(tests.testStock2_new);
        expect(scope.$customResults.stocks).toContain(tests.testStock3_new);
        expect(scope.$customResults.stocks).toEqual([tests.testStock2_new, tests.testStock3_new]);
      });
    });
  });
});