var disp = angular.module("display", []);
disp.directive("displayStock", function() {
  return {
    restrict: "E",
    scope: {
      result: "=",
      isCustomer: '=customer',
      showClass: '&onDisplay',
      close: '&onClose'
    },
    templateUrl: "/templates/stock"
  };
});