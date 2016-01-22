var anim = angular.module("animations", []);
anim.directive("animateOnPriceChange", function($animate, $timeout) {
  return function(scope, elem, attr) {
    scope.$watch(attr.animateOnPriceChange, function(nv, ov) {
      if (nv !== 0) {
        var c = (nv > 0 ? "change-up" : "change-down");
        $animate.addClass(elem, c).then(function() {
          $timeout((function() {
            $animate.removeClass(elem, c);
          }), 300);
        });
      }
    });
  };
});
anim.directive("animateOnXchange", function($animate, $timeout) {
  return function(scope, elem, attrs) {
    scope.$watch(attrs.animateOnXchange, function(nv, ov) {
      if (nv !== ov) {
        var c = "change-model";
        $animate.addClass(elem, c).then(function() {
          $timeout((function() {
            $animate.removeClass(elem, c);
          }), 300);
        });
      }
    });
  };
});