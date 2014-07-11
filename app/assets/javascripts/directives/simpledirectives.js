quizlib.directive("sortAndDrop",function(){
  return{
    link: function(scope,element,attrs){
      
      var adjustment
      
      $(".simple_with_animation").sortable({
        group: 'simple_with_animation',
        pullPlaceholder: false,
        // animation on drop
        onDrop: function  (item, targetContainer, _super) {
          var clonedItem = $('<li/>').css({height: 0})
          
          item.before(clonedItem)
          clonedItem.animate({'height': item.height()})
          
          item.animate(clonedItem.position(), function  () {
            clonedItem.detach()
            _super(item)
          })
          console.log(item)
          console.log(targetContainer)
          console.log($(item).attr("id"))
          console.log(targetContainer.target[0].id)
        },

        // set item relative to cursor position
        onDragStart: function ($item, container, _super) {
          console.log("drag start")
          var offset = $item.offset(),
          pointer = container.rootGroup.pointer

          adjustment = {
            left: pointer.left - offset.left,
            top: pointer.top - offset.top
          }

          _super($item, container)
        },
        onDrag: function ($item, position) {
          console.log("drag")
          $item.css({
            left: position.left - adjustment.left,
            top: position.top - adjustment.top
          })
        }
      })
    }
  };
})

// quizlib.directive("sortable",function(){
//   return{
//     link: function(scope,element,attrs){
//       element.sortable({
//         update: function(){
//           $.ajax({
//             url: "/quiz_banks/change_question_positions",
//             method: "POST",
//             data: $(this).sortable("serialize"),                  
//           })
//         }
//       })
      
//     }
//   };
// })
// quizlib.directive("questionDraggable",function(){
//   return{
//     link: function(scope,element,attrs){
//        element.draggable({
//         containment : "#container",
//         helper : 'clone',
//         revert: 'invalid'
//       });
//     }
//   };
// })

// quizlib.directive("questionDroppable",function(){
//   return{
//     link: function(scope,element,attrs){
//       element.droppable({
//         hoverClass : 'ui-state-highlight',
//         drop : function(ev, ui) {
//           console.log("drop")
//           $(ui.draggable).clone().appendTo($(".questions-list"));
//           console.log($(ui.draggable))
//           $(ui.draggable).remove();
//           $(".question-item").draggable({
//             containment : "#container",
//             helper : 'clone',
//             revert : 'invalid'
//           });
//         }
//       });
//     }
//   };
// })

quizlib.directive("changeArrow",function(){
  return {
    link: function(scope,element,attrs){
      element.hover(function() {
        $(this).css('cursor','pointer');
      }, function() {
        $(this).css('cursor','auto');
      })
    }
  };
})

quizlib.directive("removeChildrenMargin",function(){
  return{
    link:function(scope,element,attrs){
      angular.forEach(element.children(),function(value,key){
        console.log(value)
        console.log($(value))
        $(value).css("margin", "0px");
      });
    }
  };
})

quizlib.directive("sectionRight",function(){
  return {
    restrict: "C",
    link: function(scope,element,attrs){
      element.bind("click",function(){
        element.addClass("hide")
        element.siblings().removeClass("hide")
        element.parents(".title-div").children(".questions-list-div").removeClass("hide")
        $(".list-questions").children("p").css("line-height","20px")
        // var children = element.parents(".title-div").find(".list-questions").children()
        // $.each(children,function(key,value){
        //   $(value).html((key + 1) + ") "+$(value).html())
        // })
      })
      
    }
  };
});

quizlib.directive("sectionDown",function(){
  return {
    restrict: "C",
    link: function(scope,element,attrs){
      element.bind("click",function(){
        element.addClass("hide")
        element.siblings().removeClass("hide")
        element.parents(".title-div").children(".questions-list-div").addClass("hide")
      })  
    }
  };
})
quizlib.directive("adjustWidth",function(){
  return {
    link: function(scope,element,attrs){
      $(".host").removeClass("col-xs-12")
    }
  };
});
quizlib.directive("selectQuestions",function(){
  return {
    restrict: 'A',
    link: function(scope,element,attrs){
      element.bind("click",function(){
        $(".question-checkbox").prop('checked', true);
      })
    }
  };
});

quizlib.directive("changeQuestionValue",function(){
  return{
    restrict: 'A',
    link: function(scope,element,attrs){
      element.bind("change",function(){
        $(".question-score").val(element.val())
      })
    }
  };
})

quizlib.directive("changeCloneOnHover",function(){
  return{
    restrict: 'A',
    link: function(scope,element,attrs){
      element.bind("mouseover",function(){
        element.attr("src","/assets/clone_hover.png")
      });
      element.bind("mouseout",function(){
        element.attr("src","/assets/clone.png")
      });
    }
  }
})
quizlib.directive("changeTransferOnHover",function(){
  return{
    restrict: 'A',
    link: function(scope,element,attrs){
      element.bind("mouseover",function(){
        element.attr("src","/assets/transfer_hover.png")
      });
      element.bind("mouseout",function(){
        element.attr("src","/assets/transfer.png")
      });
    }
  }
})
quizlib.directive("changeDeleteOnHover",function(){
  return{
    restrict: 'A',
    link: function(scope,element,attrs){
      element.bind("mouseover",function(){
        element.attr("src","/assets/delete_hover.png")
      });
      element.bind("mouseout",function(){
        element.attr("src","/assets/delete.png")
      });
    }
  }
})

quizlib.directive("changeEditOnHover",function(){
  return{
    restrict: 'A',
    link: function(scope,element,attrs){
      element.bind("mouseover",function(){
        element.attr("src","/assets/edit_hover.png")
      });
      element.bind("mouseout",function(){
        element.attr("src","/assets/edit.png")
      });
    }
  }
})

quizlib.directive("changeStartOnHover",function(){
  return{
    restrict: 'A',
    link: function(scope,element,attrs){
      element.bind("mouseover",function(){
        element.attr("src","/assets/start_hover.png")
      });
      element.bind("mouseout",function(){
        element.attr("src","/assets/start.png")
      });
    }
  }
})

quizlib.directive("changeStartDownOnHover",function(){
  return{
    restrict: 'A',
    link: function(scope,element,attrs){
      element.bind("mouseover",function(){
        element.attr("src","/assets/start_down_hover.png")
      });
      element.bind("mouseout",function(){
        element.attr("src","/assets/start_down.png")
      });
    }
  }
})

quizlib.directive("changeStarOnHover",function(){
  return{
    restrict: 'A',
    link: function(scope,element,attrs){
      element.bind("mouseover",function(){
        element.attr("src","/assets/star_hover.png")
      });
      element.bind("mouseout",function(){
        element.attr("src","/assets/star.png")
      });
    }
  }
})
quizlib.directive("changeStarEmptyOnHover",function(){
  return{
    restrict: 'A',
    link: function(scope,element,attrs){
      element.bind("mouseover",function(){
        element.attr("src","/assets/star_empty_hover.png")
      });
      element.bind("mouseout",function(){
        element.attr("src","/assets/star_empty.png")
      });
    }
  }
})


quizlib.directive("removeOption",function(){
  return {
    restrict: "A",
    link: function(scope,element,attrs){
      element.bind("click",function(){
        if(element.parents("tbody").children("tr").length > 2){
            element.parents("tr").remove()

        }
        else{
          alert("need at least two options")
        }
      })
    }
  };
})
quizlib.directive("hideSearch",function(){
  return {
    restrict: 'A',
    link: function(scope,element,attrs){
      if(window.innerWidth < 530){  
        element.addClass("hide")
      }
        if(window.innerWidth >= 530){
        element.removeClass("hide")
      }
      $(window).resize(function(){
        if(window.innerWidth < 530){  
          element.addClass("hide")
        }
        if(window.innerWidth >= 530){
          element.removeClass("hide")
        }
      })
    }
  };
})

quizlib.directive("checkResolution",function(){
  return {
    restrict: 'A',
    link: function(scope,element,attrs){
      if(window.innerWidth < 800){  
        element.addClass("hide")
      }
        if(window.innerWidth >= 800){
        element.removeClass("hide")
      }
      $(window).resize(function(){
        if(window.innerWidth < 800){  
          element.addClass("hide")
        }
        if(window.innerWidth >= 800){
          element.removeClass("hide")
        }
      })
    }
  };
})

quizlib.directive("updateResolution",function(){
  return {
    restrict: 'A',
    link: function(scope,element,attrs){
      if(window.innerWidth < 800){
        element.addClass("col-xs-12").removeClass("col-xs-9")
      }
      if(window.innerWidth >= 800){
        element.removeClass("col-xs-12").addClass("col-xs-9")
      }
      
      $(window).resize(function(){
        if(window.innerWidth < 800){
          element.addClass("col-xs-12").removeClass("col-xs-9")
        }
        if(window.innerWidth >= 800){
          element.removeClass("col-xs-12").addClass("col-xs-9")
        }
      })
    }
  };
})
quizlib.directive("addOption",['$compile',function($compile){
  return {
    restrict: 'A',
    link: function(scope,element,attrs){
      element.bind("focus",function(){
        if(element.parents("tr").is(":last-child")){
          scope.add_mcq_input()
          input_number = element.parents('tbody').children('tr').length + 1
          var html = "<tr><td><div class = 'form-group mar-top-10' ng-model = 'mcq_options["+input_number+"]' required add-option><input name = 'input"+input_number+"' type = 'text' class = 'form-control'></div></td><td><div class = 'form-group mar-top-10'><input type='radio' name='correct' ng-model = 'radio' value = '"+input_number+"' ng-click = 'add_correct_option("+input_number+")' ng-init = 'radio = "+input_number+"'></div></td><td><span class = 'glyphicon glyphicon-remove mar-top-20' style = 'color:red;' remove-option ng-click = 'remove_mcq_input("+input_number+")'></span></td></tr>";        
          var el = angular.element(html);
          compiled = $compile(el);
          compiled(scope)
        }
      })
    }
  };
}])
quizlib.directive("editAddOption",['$compile',function($compile){
  return {
    restrict: 'A',
    link: function(scope,element,attrs){
      element.bind("focus",function(){
        if(element.parents("tr").is(":last-child")){
          scope.$apply(function (){
            scope.$eval(attrs.editAddOption);
          });
          input_number = element.parents('tbody').children('tr').length + 1;
          var html = "<tr><td><div class = 'form-group mar-top-10' ng-model = 'mcq_options["+input_number+"]' required add-option><input name = 'input"+input_number+"' type = 'text' class = 'form-control'></div></td><td><div class = 'form-group mar-top-10'><input type='radio' name='correct' ng-model = 'radio' value = '"+input_number+"' ng-click = 'add_correct_option("+input_number+")' ng-init = 'radio = "+input_number+"'></div></td><td><span class = 'glyphicon glyphicon-remove mar-top-20' style = 'color:red;' remove-option ng-click = 'remove_mcq_input("+input_number+")'></span></td></tr>";        
          var el = angular.element(html);
          compiled = $compile(el);
          compiled(scope)
        }
      })
    }
  };
}])

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
        })
        .y(function(d) { 
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
          $(el).parents(".complete_row").addClass("active")
        }
        else{
          $(el).parents(".complete_row").siblings("ul").addClass("hide")
          $(el).children(".right").removeClass("hide")
          $(el).children(".down").addClass("hide")
          $(el).parents(".complete_row").removeClass("active")
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

quizlib.directive('changeCloseDate',function(){
  return {
    restrict: 'A',
    link: function(scope,element,attr){
      element.bind("click",function(){
        if(element.is(":checked")){
          $(".close-date").css("z-index","-1")
          var obj = new Date(scope.served_quiz.date)
          var date = new Date(obj.getFullYear(), obj.getMonth() + 1,obj.getDate(), obj.getHours(), obj.getMinutes())
          scope.served_quiz.close_date = date
        }
        else{
          $(".close-date").css("z-index","1")
        }
      })
    }
  };
})

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
      }).on('mouseover',function(e){
          e.stopPropagation()
          $(this).popover("show")
          $(this).next().show()
          $(".popover-maker").not(this).next().hide()
          if($(this).hasClass("private-quiz-bank")){
            $(".popover").addClass("private-popover-div").removeClass("shared-popver-div")
            $(".popover-content").addClass("private-popover-content-div").removeClass("shared-popover-content-div")
          }
          if($(this).hasClass("shared-quiz-bank")){
            $(".popover").removeClass("private-popover-div").addClass("shared-popver-div")
            $(".popover-content").removeClass("private-popover-content-div").addClass("shared-popover-content-div")
          }
      })
    }  
  };
});

quizlib.directive('toolPopover', function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {
      scope.label = attrs.popoverLabel;
      angular.element(el).popover({
        trigger: 'click',
        html: true,
        content: function() { return $compile(attrs.popoverHtml)(scope);},
        placement: attrs.popoverPlacement
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
          console.log(e.dataTransfer.getData('Text'))
          var item = document.getElementById(e.dataTransfer.getData('Text'));
          console.log(item);
          console.log($(this))
          $(this).parent("li").children('ul').append("<li><div class = 'complete_row'></div></li>")
          $(this).parent("li").children("ul").children("li").last().children(".complete_row").append($(item))
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