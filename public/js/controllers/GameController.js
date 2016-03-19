var game = angular.module('gamecontrollers', ['gameservices', 'gamedisplay']);
game.controller("GameController", ['$scope', '$http', '$localStorage', 'gameGenerator', 'flash', function($scope, $http, $localStorage, gameGenerator, flash) {
	    function addRow() {
    		$scope.$game.play.push({step:new Array($scope.$game.codelength), check: {positions: 0, colors: 0}, checkArr: angular.copy($scope.$game.codelengthArr)});
	    }
	    function getFilledArr(arr, reds, whites, callback) {
	    	_.times(reds, function(n) {
	    		arr[n] = "red";
	    	});
	    	_.times(whites, function(n) {
	    		arr[n+reds] = "white";
	    	});
	    	if(callback) {
	    		callback();
	    	}
	    }
	    function colorsHash(arr) {
	    	return _(arr).countBy(function(c) {
	    		return c;
	    	});
	    }
	    function getImgPath(name) {
	    	return "/css/images/"+name+".png";
	    }
	    $scope.toggleAlert = function(message){
	        $scope.$game.message = message;
	        $scope.showModal = !$scope.showModal;
	    };
	    $scope.getBackgroundImgStyle = function(name) {
	    	return {"background-image": "url('" + getImgPath(name) + "')"};
	    };
	    $scope.start = function() {
	    	$scope.isLoading = true;
		    $scope.showModal = false;
	    	$scope.$game = {play:[], message: ""};
	    	$scope.$game.won = false;
	    	gameGenerator.generateGame($scope.$options.codelength, $scope.$options.duplicates).query().$promise.then((successCallback = function(result) {
	    		$scope.$game.codelength = $scope.$options.codelength;
	    		$scope.$game.duplicates = $scope.$options.duplicates;
	    		$scope.$game.codelengthArr = new Array($scope.$game.codelength);
	    		$scope.$game.result = result;
	    		$scope.$game.displayResult = _(angular.copy($scope.$game.codelengthArr)).map(function() {return "lock";});
	    		$scope.$game.resultSymbol = "2665";
	    		addRow();
	    		$scope.isLoading = false;
	    	}), errorCallback = function(response) {
	    		//alert("Can't generate a game");
	    		$scope.toggleAlert("Can't generate a game");
	    		$scope.isLoading = false;
	    	});
	    };
	    $scope.isDropSupported = function(step) {
	    	return step === $scope.$game.play.length - 1;
	    };
	    $scope.onDropComplete=function(data,evt){
	        var target = evt.target;
	        //cell number in the row
	        var index = $(target).attr("num");
	        if(!!target && target.nodeName.toUpperCase() == "CANVAS") {
	        	$scope.addBall(data, index);
	        	$(target).attr("src", getImgPath(data));
	        	$(target).attr("in", true);
	        }
	    };
	    $scope.addBall = function(ball, position) {
	       _($scope.$game.play).last().step[position] = ball;
	    };
	    $scope.check = function() {
    		$scope.$game.message = "";
	    	var last = _($scope.$game.play).last();
	    	//the row is not filled completely
	    	if(_(last.step).compact().length < last.step.length) {
	    		//alert("The row is not completed!");
	    		$scope.toggleAlert("The row is not completed!");
	    		return;
	    	}
	    	//correct colors (total)
	    	var resultHash = colorsHash($scope.$game.result);
	    	var stepHash = colorsHash(last.step);
	    	var colorCount = 0;
	    	
	    	_.chain(resultHash).keys().each(function(c) {
	    		if(_(this).has(c)) {
	    			colorCount += Math.min(this[c], resultHash[c]);
	    		}
	    	}, stepHash).value();
	    	
	    	//correct positions
	    	last.check.positions = _($scope.$game.result).countBy(function(r, index) {
	    		return angular.equals(r, this[index]);
	    	}, last.step)["true"] || 0;
	    	
	    	//correct colors
	    	last.check.colors = colorCount - last.check.positions;
	    	
	    	//_($scope.$game.result).each(function(r, index) {
	    	//	if(angular.equals(r, this[index])) {
	    	//		last.check.positions += 1;
	    	//	} else if(this.indexOf(r) >= 0) {
	    	//		last.check.colors += 1;
	    	//	}
	    	//}, last.step);
	    	
	    	//display the check result
	    	getFilledArr(last.checkArr, last.check.positions, last.check.colors);
	    	
		    if($scope.isCompleted()) {
		    	//the game is completed
		    	$scope.$game.won = angular.equals(last.check.positions, $scope.$game.codelength);
		    	//display the solution
		    	$scope.$game.resultSymbol = "";
		    	$scope.$game.displayResult = angular.copy($scope.$game.result);
		    	//console.log($scope.$game.displayResult);
		    	if($scope.$game.won) {
		    		//alert("Congratulations, you won!");
		    		$scope.toggleAlert("Congratulations, you won!");
		    	}
		    } else {
			    //if not completed, add a new row
		    	addRow();
		    }
	    };
	    $scope.isActiveRow = function(step) {
	    	return !$scope.$game.won && !!$scope.$game.play[step] && !$scope.$game.play[step+1];
	    };
	    $scope.isCompleted = function() {
	    	return ($scope.$game.play.length === $scope.maxStep) || ( $scope.$game.play.length > 0 && angular.equals(_($scope.$game.play).last().check.positions, $scope.$game.codelength));
	    };
	    $http.get("/gameparams").success(function(data) {
	    	$scope.balls = JSON.parse(data.ballstr);
	    	$scope.codelengths = JSON.parse(data.codestr);
	    	$scope.$options = $localStorage.$default({codelength: $scope.codelengths[0], duplicates: false});
	    	$scope.maxStep = 10;
	    	$scope.stepNums = _.range($scope.maxStep);
	    	$scope.start();
	    });
	}
]);