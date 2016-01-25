/* jshint -W097 */
'use strict';

describe('Finances App', function() {
	
  beforeEach(function() {
    browser.get("/");
  });
  
  it("should show standard stocks and currencies", function() {
	//element(by.css("#finances .alert-message")).getText().then(function(text) {
	//	expect(text).toBe("Loading stock data...");
	//});
	browser.wait(function() {
		return element(by.css("#standardStocks li")).isPresent();
	}, 3000);
    var stockList = element(by.id("standardStocks")).all(by.repeater("result in results"));
    expect(stockList.count()).toBe(4);
    
    browser.wait(function() {
    	return element(by.css("#standardCurrencies tr td")).isPresent();
    }, 3000);
    var currencyList = element(by.css("#standardCurrencies thead")).all(by.repeater("result in results"));
    expect(currencyList.count()).toBe(9);
    
  });
  
  it("should add/remove a custom stock", function() {
	  browser.wait(function() {
		return element(by.model("ticker")).isDisplayed();
	  }, 3000);
	  var ticker = element(by.model("ticker"));
	  ticker.sendKeys("WMMVF");
	  element(by.id("submitTicker")).click();
	  browser.wait(function() {
		return element(by.css("#customStocks li")).isPresent();
	  }, 3000);
	  
	  var customUl = element(by.id("customStocks"));
	  var stockList = customUl.all(by.repeater("result in $customResults.stocks"));
	  expect(stockList.count()).toBe(1);
	  
	  ticker.sendKeys("WMMVF");
	  element(by.id("submitTicker")).click();
	  ticker.clear();
	  expect(stockList.count()).toBe(1);
	  
	  ticker.sendKeys("^NQRU0001AUDT");
	  element(by.id("submitTicker")).click();
	  ticker.clear();
	  expect(stockList.count()).toBe(2);
	  
	  customUl.all(by.css(".close")).first().click();
	  expect(stockList.count()).toBe(1);
  });
  
  if("should calculate exchange rates", function() {
	  element(by.model("amount2")).sendKeys(0);
	  element(by.model("currency1")).sendKeys("USD");
	  element(by.model("currency2")).sendKeys("EUR");
	  element(by.model("amount1")).sendKeys(10);
	  
	  expect(element(by.model("amount2"))).not.toBe(0);
	  
  });
  
});