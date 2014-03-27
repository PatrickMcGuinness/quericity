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
      element.bind('click', function () {
        var el = angular.element( document.querySelector( '#create-repo-div' ) );
        el.addClass("hide")
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
        content: attrs.popoverHtml,
        placement: attrs.popoverPlacement
      });
      //console.log(scope)
      //console.log(angular.element(el))
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
          $(this).parents("li").children('ul').append("<li></li>").children("li").last().append($(item))
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