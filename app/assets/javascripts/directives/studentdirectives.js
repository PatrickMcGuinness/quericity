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
student_quizlib.directive("studentLinegraph",function(){
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
student_quizlib.directive("studentBargraph",function(){
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

student_quizlib.directive("showBargraph",function(){
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
student_quizlib.directive("showLinegraph",function(){
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
