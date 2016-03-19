/* jshint -W097 */
'use strict';

var _ = require('underscore');
//var q = require('q');

var LocalStorage = function () {
    this.getValue = function (key) {
        return browser.executeScript("return window.localStorage.getItem('" + key + "');");
    };

    this.get = function () {
        browser.executeScript("return window.localStorage;");
    };

    this.clear = function () {
        browser.executeScript("return window.localStorage.clear();");
    };
};

var ballNums = _.range(8);
var maxRows = 10;
//var EC = protractor.ExpectedConditions;

var getRandomNums = function(n, repeat) {
	var numSample = [];
	if(!!repeat) {
		_(n).times(function(n) {
			numSample.push(_.sample(ballNums));
		});
	} else {
		numSample = _.sample(ballNums, n);
	}
	return numSample;
};

//Function to convert RGB Color to hex
var rgbToHex = function(r, g, b) {
    
    if (r > 255 || g > 255 || b > 255)
    
    throw "Invalid color component";
    
    return ((r << 16) | (g << 8) | b).toString(16);
    
};

function getMethods(obj) {
	  var result = [];
	  for (var id in obj) {
	    try {
	      if (typeof(obj[id]) == "function") {
	        result.push(id + ": " + obj[id].toString());
	      }
	    } catch (err) {
	      result.push(id + ": inaccessible");
	    }
	  }
	  return result;
	}

describe("Games", function() {
	  //page elements
	  var resultList = null;
	  var stepList = null;
	  var check1 = null;
	  var check2 = null;
	  var ok = null;
	  var pool = null;
	  var form = null;
	  var codelength = null;
	  var duplicates = null;
	  var newgame = null;
	  var messageBox = null;
	  
	  beforeEach(function() {
		    browser.get("/mastermind");
		    browser.executeScript('window.localStorage.clear();');
		    browser.driver.manage().window().maximize();
		    
			browser.wait(function() {
				return element(by.css("#game-results td")).isPresent();
			}, 3000);
		    
			//game results
			resultList = element.all(by.repeater("result in $game.displayResult track by $index"));
			
			//game steps
			stepList = element.all(by.repeater("step in stepNums.slice().reverse()"));
			
			//currect game row
			getRow(9);
			
			//pool of balls
			var selection = element(by.id("selection"));
			pool = selection.all(by.repeater("(ball, color) in balls"));
			
			//options form
			form = selection.element(by.tagName("form"));
			codelength = form.element(by.tagName("select"));
			duplicates = form.element(by.model("$options.duplicates"));
			newgame = form.element(by.tagName("button"));
			
			//message box
			messageBox = element(by.id("alert"));
	  });
	  
	  var getRow = function(n) {
		  if(n < maxRows) {
			  //currentRow = stepList.get(n);
			  element.all(by.repeater("step in stepNums.slice().reverse()")).then(function(rows) {
				  check1 = rows[n].all(by.repeater("j in $game.play[step].checkArr.slice(0, $game.codelength/2)"));
				  check2 = rows[n].all(by.repeater("j in $game.play[step].checkArr.slice($game.codelength/2, $game.codelength)"));
				  ok = rows[n].element(by.tagName("button"));
			  });
		  }
	  };
	  
	  function playGame(codelen, dup, done) {
		  //select options
		  form.all(by.tagName("option")).then(function(opts) {
			  _(opts).each(function(opt) {
				  opt.getText().then(function(t) {
					  if(t == codelen) {
						  opt.click();
					  }
				  });
			  });
		  });
		  if(!!dup) {
			  duplicates.click();
		  }
		  //generate game
		  newgame.click();
		  
		  browser.wait(function() {
			  return stepList.last().all(by.repeater("i in $game.codelengthArr")).then(function(elems) {
				  return elems.length == codelen;
			  });
		  }, 3000);
		  
		  var isCompleted = false;
		  
		  stepList.then(function(rows) {
			  _(rows.reverse()).each(function(row, step) {
				  getRow(9-step);
				  var ballNums = getRandomNums(codelen, dup);
				  row.all(by.repeater("i in $game.codelengthArr")).then(function(holes) {
					  _(holes).each(function(h, index) {
						  var hole = h.element(by.tagName("canvas"));
						  var ball = pool.get(ballNums[index]).element(by.tagName("canvas"));
					  
						  //browser.actions()
					  	//	.mouseMove(ball, {x: 0, y: 0})
					  	//	.mouseDown()
					  	//	.mouseMove(hole)
					  	//	.mouseUp()
					  	//	.perform(); 
						  browser.actions().dragAndDrop(ball, hole).perform();
						  //console.log("drop finished ", index);
						  	  
						  //browser.pause();
					  });
				  }).then(function() {
					  
					  ok.click();
					  
					  browser.sleep(500);
					  
					  expect(messageBox.isDisplayed()).toBe(false);
					  
					  var win = false;
					  messageBox.isDisplayed().then(function(v) {
						  if(v) {
							  messageBox.getText().then(function(t) {
								  win = (t.indexOf("Congratulations") >= 0);
							  });
					  	  }
					  });
					  isCompleted = (win || step === 10);
					  if(isCompleted) {
						  done();
					  }
				  });	  
			  });
		  });
	  }
  
	  it("should show 4 hidden results by default, 10 rows of holes, verification table and a button in the currect row, the pool of balls, and the game options form on initialization", function() {
		  //result box
		  expect(resultList.count()).toBe(4);
		  var resultDiv = resultList.first().element(by.tagName("div"));
		  resultDiv.getCssValue("background-image").then(function(url) {
			  var p = url.replace('url("', "").replace('")', "").endsWith("/css/images/lock.png");
			  expect(p).toBe(true);
		  });
		  //game steps control
		  expect(stepList.count()).toBe(10);
		  var currentRow = stepList.last().all(by.repeater("i in $game.codelengthArr"));
		  expect(currentRow.count()).toBe(4);
		  
		  //black color
		  var canvas = currentRow.first().element(by.tagName("canvas"));
		  expect(canvas.getAttribute("color")).not.toBeTruthy();
		  canvas.getAttribute("width").then(function(width) {
			canvas.getAttribute("height").then(function(height) {
				browser.driver.executeScript(function() {
					var can = document.querySelector('#game canvas');
					var ctx = can.getContext("2d");
					var x = ctx.canvas.clientWidth/2;
					var y = ctx.canvas.clientHeight/2;
					var data = ctx.getImageData(x, y, 1, 1).data;
					return data;
				}).then(function(result) {
				    var hex = "#" + ("000000" + rgbToHex(result[0], result[1], result[2])).slice(-6);
					//light gray
					expect(hex.toUpperCase()).toEqual("#000000");
				});
			 });
		  });
		  
		  //check button
		  check1.count().then(function(c1) {
			  check2.count().then(function(c2) {
				  expect(c1 + c2).toBe(4);
			  });
		  });

		  expect(ok.isPresent()).toBe(true);
		  
		  //selection of balls
		  expect(pool.count()).toBe(8);
		  //expect(pool.first().getAttribute("ng-drag")).toBe(true);

		  //game options form
		  expect(codelength.all(by.tagName("option")).count()).toBe(3);
		  expect(codelength.$('option:checked').getText()).toEqual("4");  
		  expect(duplicates.getAttribute("checked")).not.toBeTruthy();
		  expect(newgame.isPresent()).toBe(true);
	  });
	  
//	  it("should generate and play a game, codelength 4 with duplicates, check each step, and display results in the end", function(done) {
		  
//		  playGame(4, true, done);
		  
//	  });
	  
//	  it("should generate and play a game, codelength 6 without duplicates, check each step, and display results in the end", function() {
		  
//		  playGame(6, false);
		  
//	  });
	  
});