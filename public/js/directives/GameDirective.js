var gamedisp = angular.module("gamedisplay", []);
gamedisp.directive("showCircle", function() {
	return {
		restrict: 'A',
		scope: {
			color: "@"
		},
		link: function(scope, elem, attrs) {
			var ctx = elem[0].getContext("2d");
			var width = attrs.width;
			var height = attrs.height;
			var x = width/2;
			var y = height/2;
			var r = width/2;
			var color = attrs.color || "black";
			var text = attrs.text;
			var symbol = attrs.symbol;
			//ctx.beginPath();
			ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	    	ctx.font = r + "px Arial";
		    ctx.lineWidth = 1;
		    ctx.strokeStyle = '#888888';
			ctx.stroke();
			var gradient;
			switch($(elem).attr("gradient")) {
				case "1":
					gradient = ctx.createRadialGradient(x,y,r,0.1*x,0.1*y,0.1*r);
					gradient.addColorStop(1,"white");
					gradient.addColorStop(0,color);
					ctx.fillStyle = gradient;
					break;
				case "-1":
					gradient = ctx.createRadialGradient(x,y,r,0.9*x,0.9*y,0.9*r);
					gradient.addColorStop(0,"white");
					gradient.addColorStop(1,color);
					ctx.fillStyle = gradient;
					break;
				default:
					ctx.fillStyle = color;
				
			}
			ctx.fill();

		    scope.$watch(function() {
				return $(elem).attr("result");
		    }, function(newValue) {
		    	if(!!newValue) {
		    		ctx.fillStyle = newValue;
		    		ctx.fill();
					var print = "";
					if(!!symbol && symbol.length > 0) {
						print += String.fromCharCode(parseInt(symbol, 16));
					}
				    if(!!text && text.length > 0) {
				    	print += text;
				    }
				    if(print.length > 0) {
					    ctx.strokeStyle = 'darkblue';
				    	ctx.strokeText(print, x-r/4, y+r/4);
				    } 
		    	}
		    });
		    
			scope.$watch(function() {
				return $(elem).attr("src");
			}, function(newValue) {
				if(!!newValue) {
					//console.log("color", $(elem).attr("id"), newValue);
					//ctx.fillStyle = newValue;
					//ctx.fill();
					//var gradient = ctx.createRadialGradient(x,y,r,0.9*x,0.9*y,0.9*r);
					var srcx = !!$(elem).attr("in") ? -2 : 0;
					var srcy = srcx;
					var img = new Image();
					img.src = newValue;
					img.addEventListener('load', function() {
						//ctx.clearRect(0, 0, width, height);
						ctx.drawImage(img, srcx, srcy);
					}, false);
				}
			});
		}
	};
});
gamedisp.directive("checkResult", function() {
	return {
		restrict: "E",
		scope: {
			step: "=",
			$game: "=",
			isActiveRow: "&",
			check: "&"
		},
		templateUrl: "/templates/check"
	};
});
gamedisp.directive("alert", function() {
    return {
        restrict: 'E',
        transclude: true,
        replace:true,
        scope:true,
        templateUrl: "/templates/alert",
        link: function postLink(scope, element, attrs) {
            scope.$watch(attrs.visible, function(value){
            	if(value === true)
            		$(element).modal('show');
            	else
            		$(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function(){
            	scope.$apply(function(){
            		scope.$parent[attrs.visible] = true;
            	});
            });

            $(element).on('hidden.bs.modal', function(){
            	scope.$apply(function(){
            		scope.$parent[attrs.visible] = false;
            	});
            });
         }
     };
});