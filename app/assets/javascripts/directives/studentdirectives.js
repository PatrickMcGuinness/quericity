student_quizlib.directive("showActiveTag",function(){
  return {
    restrict: 'A',
    link: function(scope, element,attr){
      element.bind("click",function(){
        $(".tag_quiz a").removeClass("active")
        element.addClass("active")
      })
    }
  };
});

student_quizlib.directive("mathjaxBind", function() {
  return {
    restrict: "A",
    controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
      $scope.$watch($attrs.mathjaxBind, function(value) {
        var $script = angular.element("<script type='math/tex'>")
            .html(value == undefined ? "" : value);
        var $small_script = $($($($script[0].innerHTML)[0]).find("span")[0]).html()
        $small_script = String($small_script).substring(2,String($small_script).length -1);
        $script.html("")
        $script.append($small_script)
        $element.html("")
        var new_element = $($element[0]).append($(value))
        $(new_element).find("span.math-tex").after($script).remove("span.math-tex")
        MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
      });
    }]
  };
});