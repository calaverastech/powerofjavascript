var service = angular.module("gameservices", []);
service.factory("gameGenerator", [ "$resource", function($resource) {
    var generateGame = function(codelength, duplicates) {
    	return $resource("/generategame/:codelength.:duplicates", {codelength: codelength, duplicates: duplicates, format: 'jsonp'});
	};
	return {
		generateGame: generateGame
	};
}
]);