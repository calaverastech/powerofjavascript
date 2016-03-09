/* jshint -W097 */
'use strict';

describe("Games", function() {
	  beforeEach(function() {
		    browser.get("/mastermind");
	  });
	  
	  it("should show 4 hidden results, 10 rows with check forms, the pool of balls, and the game form on initialization", function() {
		  var top = element(by.id("game-results"));
		  var resultList = top.all(by.repeater("result in $game.results"));
		  expect(resultList.count()).toBe(4);
		  expect(resultList.first().getAttribute("class")).toBe("result_hidden");
		  //by.repeater("position in positions")
	  });
	  
	  it("should start a game with code length 4 and duplicates, and win it at step 5", function() {
		  
		  
	  });
	  
	  it("should start a game with code length 8 and no duplicates, and lose it", function() {
		  
	  });
});