/* jshint -W097 */
"use strict";

beforeEach(module("mastermind"));

describe("GameController", function() {
	var scope = null;
	var httpBackend = null;
	var gameGenerator = null;
	var localStorage = null;
	var store = {};
	var flash = null;
	var timeout = null;
	var subscriber = jasmine.createSpy("subscriber1");
	var createController = null;
	var ctrl = null;
	var tests = {};
	var gameURL = /^\/generategame\/.*\?format=jsonp/;
	
	beforeEach(inject(function($httpBackend, $rootScope, $controller, $timeout, $localStorage, _gameGenerator_, _flash_) {
	    httpBackend = $httpBackend;
	    scope = $rootScope.$new();
	    gameGenerator = _gameGenerator_;
	    localStorage = $localStorage;
	    store = {};
	    flash = _flash_;
	    flash.subscribe(subscriber, null, "step");
	    createController = function() {
	    	return $controller("GameController", {
	    			$scope: scope,
	    			gameGenerator: gameGenerator,
	    			flash: flash
	    		});
	    };
	    timeout = $timeout;
        //httpBackend.flush();
	    fixture.setBase('test/fixtures');
	    this.fixtures = fixture.load("games.json", false);
	    tests = this.fixtures;
	    httpBackend.whenGET("/gameparams").respond(200, {status: "success", ballstr: '{"red":"Red","green":"Green","blue":"Blue","yellow":"Yellow","brown":"Maroon","orange":"DarkOrange","black":"Black","white":"White"}', codestr: "[4,6,8]"});
	    
	    //var store = {};

	    //spyOn(localStorage, 'getItem').andCallFake(function (key) {
	    //  return store[key];
	    //});
	    //spyOn(localStorage, 'setItem').andCallFake(function (key, value) {
	    //  return store[key] = value + '';
	    //});
	    //spyOn(localStorage, 'clear').andCallFake(function () {
	    //    store = {};
	    //});
	}));
	
	afterEach(function() {
	    httpBackend.verifyNoOutstandingExpectation();
	    httpBackend.verifyNoOutstandingRequest();
	    fixture.cleanup();
	});
	
	function addBalls(arr) {
		arr.forEach(function(b, i) {
			scope.addBall(b, i);
		});
	}
	
	function playGame(steps) {
		steps.forEach(function(s) {
			addBalls(s.step);
			scope.check();
		});
	}
	
	describe("initialization", function() {
		it("should create a default game of codelength 4 and duplicates set to false", function() {
		    httpBackend.whenGET(gameURL).respond();
		    httpBackend.expectGET(gameURL);
		    scope.$apply(function() {
				ctrl = createController();
			});
	        httpBackend.flush();
	        expect(scope.$game.codelength).toBe(4);
	        expect(scope.$game.duplicates).toBe(false);
		});
		
	});
	

	describe("code length 4, with duplicates, game won", function() {
		var test1 = {};
			
		beforeEach(function(done) {
			test1 = tests.gamewon;
		    httpBackend.whenGET(gameURL).respond(test1.result);
		    scope.$apply(function() {
		    	ctrl = createController();
		    });
	    	httpBackend.flush();
			//scope.$digest();
		    httpBackend.expectGET(gameURL);
			setTimeout(function() {
		    	scope.$apply(function() {
		    		scope.$options = {codelength: test1.codelength, duplicates:test1.duplicates};
			    	scope.start(); 
		    	});
		    	httpBackend.flush();
		    	done();
		    }, 500);
		});
	
		it("should have codelength equal to 4, duplicates to true, and the result to be ['red', 'blue', 'white', 'red']", function() {
			expect(scope.$game.codelength).toBe(4);
			expect(scope.$game.duplicates).toBe(true);
			expect(scope.$game.result.length).toBe(4);
			expect(scope.$game.result[0]).toBe("red");
			expect(scope.$game.result[1]).toBe("blue");
			expect(scope.$game.result[2]).toBe("white");
			expect(scope.$game.result[3]).toBe("red");
		});
			
		describe("play the game", function() {
			var steps = {};
			
			beforeEach(function() {
				steps = test1.play;
			});
				
			it("should check correctly 2 steps", function() {
				expect(scope.$game.play.length).toBe(1);
				addBalls(steps[0].step);
				scope.check();
				expect(scope.$game.play.length).toBe(2);
				expect(scope.$game.play[0].check.position).toBe(1);
				expect(scope.$game.play[0].check.color).toBe(1);
				addBalls(steps[1].step);
				expect(scope.$game.play.length).toBe(2);
				scope.check();
				expect(scope.$game.play.length).toBe(3);
				expect(scope.$game.play[1].check.position).toBe(2);
				expect(scope.$game.play[1].check.color).toBe(1);
			});
				
			it("should win after 5 steps", function() {
				playGame(steps);
				expect(scope.$game.play.length).toBe(5);
				expect(scope.$game.play[4].check.position).toBe(4);
				expect(scope.$game.play[4].check.color).toBe(0);
			});
		});
			
	});
		
	describe("code length 6, without duplicates, game lost", function() {
		var test2 = {};
			
		beforeEach(function(done) {
			test2 = tests.gamelost;
		    httpBackend.whenGET(gameURL).respond(test2.result);
		    	scope.$apply(function() {
		    	ctrl = createController();
		    });
	    	httpBackend.flush();
			//scope.$digest();
		   httpBackend.expectGET(gameURL);
		   setTimeout(function() {
		    	scope.$apply(function() {
		    		scope.$options = {codelength: test2.codelength, duplicates: test2.duplicates};
		    		scope.start();
		    	});
		    	httpBackend.flush();
		    	done();
		   }, 500);
		});
						
		it("should have codelength equal to 6, duplicates to false, the result to be ['green', 'red', 'orange', 'black', 'white', 'blue']", function() {
			expect(scope.$game.codelength).toBe(6);
			expect(scope.$game.duplicates).toBe(false);
			expect(scope.$game.result.length).toBe(6);
			expect(scope.$game.result[0]).toBe("green");
			expect(scope.$game.result[1]).toBe("red");
			expect(scope.$game.result[2]).toBe("orange");
			expect(scope.$game.result[3]).toBe("black");
			expect(scope.$game.result[4]).toBe("white");
			expect(scope.$game.result[5]).toBe("blue");
		});
			
		describe("play the game", function() {
			var steps = {};
			
			beforeEach(function() {
				steps = test2.play;
			});
			
			it("should check correctly 2 steps", function() {
				expect(scope.$game.play.length).toBe(1);
				addBalls(steps[0].step);
				scope.check();
				expect(scope.$game.play.length).toBe(2);
				expect(scope.$game.play[0].check.position).toBe(0);
				expect(scope.$game.play[0].check.color).toBe(4);
				addBalls(steps[1].step);
				expect(scope.$game.play.length).toBe(2);
				scope.check();
				expect(scope.$game.play.length).toBe(3);
				expect(scope.$game.play[1].check.position).toBe(2);
				expect(scope.$game.play[1].check.color).toBe(2);
			});
			
			it("should lose", function() {
				playGame(steps);
				expect(scope.$game.play.length).toBe(10);
				expect(scope.$game.play[9].check.position).not.toBe(6);
				expect(scope.$game.play[9].check.position).toBe(4);
				expect(scope.$game.play[9].check.color).toBe(2);
			});
		});
			
	});
	
});