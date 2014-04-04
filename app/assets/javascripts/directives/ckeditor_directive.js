quizlib.directive('ckEditor', [function () {
  return {
    require: '?ngModel',
    link: function ($scope, elm, attr, ngModel) {
      var ck = CKEDITOR.replace(elm[0]);

      ck.on('pasteState', function () {
          $scope.$apply(function () {
              ngModel.$setViewValue(ck.getData());
          });
      });

      ngModel.$render = function (value) {
          ck.setData(ngModel.$modelValue);
      };
    }
  };
}])

quizlib.directive('mathJax', [function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var el = element[0];
      console.log(el)
      return MathJax.Hub.Queue(["Typeset",MathJax.Hub,el]);
      
    }
  };
}])