quizlib.directive("mathjaxBind", function() {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            $scope.$watch($attrs.mathjaxBind, function(value) {
                //debugger;
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

quizlib.directive('hideonenter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown", function (event) {
      if(event.which === 13) {
        $("#create-repo-div").addClass("hide")
        $(".title-edit").addClass("hide")
        event.preventDefault();
      }
    });
  };
});

quizlib.directive('showtitleedit', function () {
  return function (scope, element, attrs) {
    element.bind("click", function (event) {
        var el = element[0]
        $(el).parents(".complete_row").next(".title-edit").removeClass("hide")
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

quizlib.directive('showhide', function () {
  return {
    restrict: 'C',
    link: function (scope, element, attr) {
      console.log("hello")
      element.bind('click', function () {
        var el = element[0]      
        console.log($(el).parents(".complete_row"))
        if($(el).parents(".complete_row").siblings("ul").hasClass("hide")){
          $(el).parents(".complete_row").siblings("ul").removeClass("hide")
        }
        else{
          $(el).parents(".complete_row").siblings("ul").addClass("hide")
        }
      })
    }
  }
});

quizlib.directive('rightclickunfold', function () {
  return {
    restrict: 'C',
    link: function (scope, element, attr) {
      element.bind('contextmenu', function () {
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
quizlib.directive('shownewsection', function () {
  return {
    restrict: 'C',
    link: function (scope, element, attr) {
      element.bind('click', function () {
        $(".new-section-div").removeClass("hide")
      })
    }
  }
});
quizlib.directive('hidenewsection', function () {
  return {
    restrict: 'C',
    link: function (scope, element, attr) {
      element.bind('click', function () {
        $(".new-section-div").addClass("hide")
      })
    }
  }
});

quizlib.directive('ngRightClick', function($parse) {
  return function(scope, element, attrs) {
    var fn = $parse(attrs.ngRightClick);
    element.bind('contextmenu', function(event) {
        scope.$apply(function() {
            event.preventDefault();
            fn(scope, {$event:event});
        });
    });
  };
});


quizlib.directive('hidecreaterepo', function () {
  return {
    restrict: 'C',
    link: function (scope, element, attr) {
      element.bind('click', function (e) {
        var el = angular.element( document.querySelector( '#create-repo-div' ) );
        el.addClass("hide")
        var el = angular.element( document.querySelector( '#new-repo-holder' ) );
        el.addClass("hide")
        e.stopPropagation()
      })
    }
  }
});
quizlib.directive('showcreaterepo', function () {
  return {
    restrict: 'C',
    link: function (scope, element, attr) {
      element.bind('click', function () {
        var el = angular.element( document.querySelector( '#create-repo-div' ) );
        el.removeClass("hide")
        var el = angular.element( document.querySelector( '#new-repo-holder' ) );
        el.removeClass("hide")
      })
    }
  }
});

quizlib.directive('customPopover', function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {
      scope.label = attrs.popoverLabel;
      angular.element(el).popover({
        trigger: 'click',
        html: true,
        content: function() { return $compile(attrs.popoverHtml)(scope);},
        //content: attrs.popoverHtml,
        placement: attrs.popoverPlacement
      });
    }
  };
});



quizlib.directive('draggable', function() {
    return function(scope, element) {
      var el = element[0];

      el.draggable = true;

      el.addEventListener('dragstart',
        function(e) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('Text', this.id);
          this.classList.add('drag');
          return false;
        },false
      );

      el.addEventListener('dragend',
        function(e) {
          this.classList.remove('drag');
          return false;
        },false
      );
    }
});

quizlib.directive('droppable', function() {
  return {
    scope: {
      drop: '&',
      bin: '=' // bi-directional scope
    },
    link: function(scope, element) {
      var el = element[0];
      el.addEventListener('dragover',
        function(e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) e.preventDefault();
          this.classList.add('over');
          return false;
        },false
      );
      el.addEventListener('dragenter',
        function(e) {
          this.classList.add('over');
          return false;
        },false
      );

      el.addEventListener('dragleave',
        function(e) {
          this.classList.remove('over');
          return false;
        },false
      );
      el.addEventListener('drop',
        function(e) {
          if (e.stopPropagation) e.stopPropagation();
          var binId = this.id;
          this.classList.remove('over');
          var item = document.getElementById(e.dataTransfer.getData('Text'));
          $(this).parent("li").children('ul').append("<li></li>")
          $(this).parent("li").children("ul").children("li").last().append($(item))
          scope.$apply(function(scope) {
            var fn = scope.drop();
            if ('undefined' !== typeof fn) {
              fn(item.id, binId);
            }
          });

          return false;
        },false
      );
    }
  }
});