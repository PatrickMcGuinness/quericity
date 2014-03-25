quizlib.directive('enter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
            scope.$eval(attrs.enter);
        });
        event.preventDefault();
      }
    });
  };
});

quizlib.directive('clickunfold', function () {
  return {
    restrict: 'C',
    link: function (scope, element, attr) {
      element.bind('click', function () {
        if(element.next().hasClass("hide")){
          element.next().removeClass("hide")
        }
        else{
          element.next().addClass("hide")
        }
      })
    }
  }
});