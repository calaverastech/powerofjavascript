var game = angular.module('gamecontrollers', ['gameservices', 'gamedisplay']);
game.controller("GameController", ['$scope', '$http', '$localStorage', 'gameGenerator', 'flash', function($scope, $http, $localStorage, gameGenerator, flash) {
	    $scope.start = function() {
	    	$scope.isLoading = true;
	    	$scope.won = false;
	    	gameGenerator.generateGame($scope.$options.codelength, $scope.$options.duplicates).query().$promise.then((successCallback = function(result) {
	    		$scope.$game.codelength = $scope.$options.codelength;
	    		$scope.$game.duplicates = $scope.$options.duplicates;
	    		$scope.$game.codelengthArr = new Array($scope.$game.codelength);
	    		$scope.$game.result = result;
	    		$scope.$game.play[0] = {step:new Array($scope.$game.codelength), check: {position: 0, color: 0}};
	    		$scope.isLoading = false;
	    	}), errorCallback = function(response) {
	    		console.log("Can't generate a game");
	    		$scope.isLoading = false;
	    	});
	    };
	    $scope.onDragComplete=function(data,evt){
	        console.log("drag success, data:", data);
	    };
	    $scope.onDropComplete=function(data,evt){
	        console.log("drop success, data:", data);
	    };
	    $scope.addBall = function(ball, position) {
	       _($scope.$game.play).last().step[position] = ball;
	    };
	    $scope.check = function() {
	    	//console.log("play", JSON.stringify($scope.$game.play));
	    	var last = _($scope.$game.play).last();
	    	_(last.step).each(function(b, index) {
	    		if(angular.equals(b, this[index])) {
	    			last.check.position += 1;
	    		} else if(this.indexOf(b) >= 0) {
	    			last.check.color += 1;
	    		}
	    	}, $scope.$game.result);
	    	
	    	if($scope.isCompleted()) {
	    		$scope.won = angular.equals(last.check.position, $scope.$game.codelength);
	    		alert("Congratulations, you won!");
	    	} else {
		    	//if not completed, add a new row
	    		$scope.$game.play.push({step:new Array($scope.$game.codelength), check: {position: 0, color: 0}});
	    	}
	    };
	    $scope.checkResult = function(position, color) {
	    	var posArr = _.map(new Array(position), function(c) {return 1;});
	    	var colorArr = _.map(new Array(color), function(i) {return 0;});
	    	var emptyArr = _.map(new Array($scope.$game.codelength - posArr.length - colorArr.length), function(e) {return -1;});
	    	return posArr.concat(colorArr).concat(emptyArr);
	    };
	    $scope.isCompleted = function() {
	    	return ($scope.$game.play.length === $scope.maxStep) || ( $scope.$game.play.length > 0 && angular.equals(_($scope.$game.play).last().check.position, $scope.$game.codelength));
	    };
	    $http.get("/gameparams").success(function(data) {
	    	$scope.balls = JSON.parse(data.ballstr);
	    	$scope.codelengths = JSON.parse(data.codestr);
	    	$scope.$options = $localStorage.$default({codelength: $scope.codelengths[0], duplicates: false});
	    	$scope.$game = {play: []};
	    	//$scope.$game = $localStorage.$default({codelength: $scope.codelengths[0], duplicates: false});
	    	$scope.maxStep = 10;
	    	$scope.stepNums = _.range($scope.maxStep);
	    	$scope.isLoading = false;
	    	$scope.start();
	    });
	}
]);