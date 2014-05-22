quizlib.directive("showBargraph",function(){
  return {
    restrict: "C",
    link: function(scope,element,attrs){
      element.bind("click",function(){
        $(".bar-graph").removeClass("hide")
        $(".line-graph").addClass("hide")
        $(element[0]).addClass("hide")
        $(".show-linegraph").removeClass("hide")
      })
    }
  };
});
quizlib.directive("showLinegraph",function(){
  return {
    restrict: "C",
    link: function(scope,element,attrs){
      element.bind("click",function(){
        $(".bar-graph").addClass("hide")
        $(".line-graph").removeClass("hide")
        $(element[0]).addClass("hide")
        $(".show-bargraph").removeClass("hide")
        
      })
    }
  };
});

quizlib.directive("chooseImage",function(){
  return {
    restrict: "A",
    link: function(scope,element,attrs){
      element.bind("click",function(){
        $("#real-file").trigger("click")
      })
    }
  };
})

quizlib.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
                $("#pic-upload").trigger('click');
            });
        }
    };
}]);

quizlib.directive("studentLinegraph",function(){
  return {
    restrict: "E",
    replace: false,
    link: function(scope,element,attrs){
      
      scope.$on("Student_Line_Graph_Ready",function(){
        //var data = [65,55,22,34,67,88,90,78,65,44];
        var data = scope.averages
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 800 - margin.left - margin.right,
        height = 330 - margin.top - margin.bottom;
      

        var x = d3.scale.linear()
        .range([0,width])
        .domain([0,data.length])
        
        var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(data)])

        var graph = d3.select(".line-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var line = d3.svg.line()
        .x(function(d,i) { 
          //console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
          return x(i); 
        })
        .y(function(d) { 
          //console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
          return y(d); 
        })

        var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true).ticks(data.length).tickFormat(d3.format(',f'));
        // Add the x-axis.

        graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
   
        // create left yAxis
        var yAxis = d3.svg.axis().scale(y).ticks(4).orient("left");
        
        graph.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(-25,0)")
        .call(yAxis);
        
        graph.append("path").attr("d", line(data));
        
      })
    }
  };
});
quizlib.directive("quizBargraph",function(){
  return {
    restrict: "E",
    replace: false,
    link: function(scope,element,attrs){
      scope.$on("Quiz_Histogram_Ready",function(){
        
        var data = scope.students

        var margin = {top: 30, right: 30, bottom: 30, left: 40},
        width = 800 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

        var y = d3.scale.linear()
        .range([height,0])
        .domain([0, d3.max(data)])

        var x = d3.scale.ordinal()
        .domain(scope.averages)
        .rangeRoundBands([0, width], .1);

        var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

        var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left").ticks(d3.max(data)).tickFormat(d3.format(',f'));

        var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>Students:</strong> <span style='color:red'>" + d + "</span>";
        });
      
        var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
        chart.call(tip);
        
        var barWidth= width/data.length    
  
        var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

        bar.append("rect")
        .attr("y", function(d){return y(d);})
        .attr("height",function(d){return height - y(d)})
        .attr("width",barWidth - 1)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

        bar.append("text")
        .attr("x",barWidth/2)
        .attr("y",function(d){return y(d) + 3;})
        .attr("dy",".75em")
        .text(function(d){return d})
      
        chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

        chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      
      })
    }
  }
});

quizlib.directive("studentBargraph",function(){
  return {
    restrict: "E",
    replace: false,
    link: function(scope,element,attrs){
      
      scope.$on("Student_Bar_Graph_Ready",function(){
        //var data = [4, 8, 15, 16, 23, 42,30,23,20,10];
        var data = []
        var average_data = [4,5]

        angular.forEach(scope.scores,function(value,key){
          data.push({score: value, max_score: scope.maxscores[key]})
        })

        var margin = {top: 30, right: 30, bottom: 30, left: 40},
        width = 800 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
        
        var y = d3.scale.linear()
        .range([height,0])
        .domain([0, d3.max(scope.scores)])

        var x = d3.scale.ordinal()
        .domain(scope.names)
        .rangeRoundBands([0, width], .1);

        var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<div><strong>Total Marks:</strong> <span style='color:red'>" + d.max_score + "</span></div>"
                  + "<div><strong>Marks Obtained:</strong> <span style = 'color:green'>"+ d.score +"</span></div>";
        });

        var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

        var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
      
        var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        chart.call(tip);
  
        var barWidth= width/data.length    
  
        var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

        bar.append("rect")
        .attr("y", function(d){return y(d.score);})
        .attr("height",function(d){return height - y(d.score)})
        .attr("width",barWidth - 1)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

        bar.append("text")
        .attr("x",barWidth/2)
        .attr("y",function(d){return y(d.score) + 3;})
        .attr("dy",".75em")
        .text(function(d){return d.score})


      
        chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

        chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      })  
    }
  };
})


quizlib.directive("mathjaxBind", function() {
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

quizlib.directive('hideInfo',function(){
  return {
    restrict: 'A',
    link: function(scope,element,attrs){
      element.bind("click",function(event){
        if(element.next().hasClass("hide")){
          element.next().removeClass("hide")
          element.find("span").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up")
        }else{
          element.next().addClass("hide")
          element.find("span").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down")
        }
      });
    }
  };
})

quizlib.directive('timepick',function(){
  return {
    restrict: 'A',
    link: function(scope,element,attrs){
      element.timepicker()
      element.bind("click",function(event){
        element.val($(".bootstrap-timepicker-hour").val() + ":" +$(".bootstrap-timepicker-minute").val() + " "+ $(".bootstrap-timepicker-meridian").val())
      })
    }
  };
})
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
      element.bind('click', function () {
        var el = element[0]      
        if($(el).parents(".complete_row").siblings("ul").hasClass("hide")){
          $(el).parents(".complete_row").siblings("ul").removeClass("hide")
          $(el).children(".down").removeClass("hide")
          $(el).children(".right").addClass("hide")
        }
        else{
          $(el).parents(".complete_row").siblings("ul").addClass("hide")
          $(el).children(".right").removeClass("hide")
          $(el).children(".down").addClass("hide")
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
        trigger: 'manual',
        html: true,
        content: function() { return $compile(attrs.popoverHtml)(scope);},
        placement: attrs.popoverPlacement
      }).on('click',function(e){
          e.stopPropagation()
          $(this).popover("show")
          $(this).next().show()
          $(".popover-maker").not(this).next().hide()
      })
    }
  };
});

quizlib.directive('closePopovers',function(){
  return {
    restrict: 'A',
    link: function(scope,element,attrs){
      element.bind("click",function(){
        $(".popover-maker").next().hide()
      })
    }
  };
})





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


quizlib.directive('sectionDroppable', function() {
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
          var quiz_bank_id = $(this).data().quizBankId
          this.classList.remove('over');
          var item = document.getElementById(e.dataTransfer.getData('Text'));
          var previous_section_id = $(item).parents("ul").attr("id")
          if( $(item).parents("ul").children("li").length - 1 == 0){
            $(item).parents("ul").append("<li class = 'col-xs-12 no-record'>No questions in sections</li>")
          }
          $(this).children(".no-record").remove()
          $(this).append(item)
          scope.$apply(function(scope) {
            var fn = scope.drop();
            if ('undefined' !== typeof fn) {
              fn(item.id, binId,quiz_bank_id,previous_section_id);
            }
          });

          return false;
        },false
      );
    }
  }
});