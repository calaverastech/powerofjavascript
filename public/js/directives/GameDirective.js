var gamedisp = angular.module("gamedisplay", []);
gamedisp.directive("showCircle", function() {
	return {
		restrict: 'A',
		//scope: {
		//	showCircle: "&"
		//},
		scope: {},
		link: function(scope, elem, attrs) {
			var ctx = elem[0].getContext("2d");
			var x = attrs.width/2;
			var y = attrs.height/2;
			var r = attrs.width/2;
			var color = attrs.color;
			var text = attrs.text;
			var symbol = attrs.symbol;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, 2 * Math.PI, false);
			ctx.fillStyle = color;
		    ctx.fill();
	    	ctx.font = r + "px Arial";
		    if(!!text) {
		    	ctx.strokeText(text, x-r/4, y+r/4);
		    }
		    if(!!symbol) {
		    	ctx.strokeText(String.fromCharCode(parseInt(symbol, 16)), x-r/4, y+r/4);
		    }
		    ctx.lineWidth = 1;
		    ctx.strokeStyle = '#999999';
			ctx.stroke();
		}
	};
});
gamedisp.directive("checkResult", function() {
	return {
		restrict: "E",
		scope: {
			step: "=",
			$game: "="
		},
		templateUrl: "/templates/check"
	};
});