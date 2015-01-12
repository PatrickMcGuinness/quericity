student_quizlib.directive('fileModel', ['$parse', function ($parse) {
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


student_quizlib.directive("checkActive",function($route){
  return{
    link: function(scope,element,attrs){
      $(".header-link").removeClass("active")
      if($route.current.activetab == "manage"){
        $(".manage-link").addClass("active")
      }
      
      if($route.current.activetab == "dashboard"){
        $(".dashboard-link").addClass("active")
      }
      if($route.current.activetab == "quiz"){
        $(".takequiz-link").addClass("active")
      }
      if($route.current.activetab == "groups"){
        $(".classes-link").addClass("active")
      }
      if($route.current.activetab == "reports"){
        $(".reports-link").addClass("active")
      }
    }
  };
})

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

student_quizlib.directive("addCustomClass",function(){
  return {
    restrict: 'A',
    link: function(scope, element,attr){
      if(window.innerWidth < 990){
        element.removeClass("custom_width")
      }
      if(window.innerWidth > 990 && window.innerWidth < 1200){
        element.addClass("custom_width")
      }
      if(window.innerWidth > 1300){
        element.addClass("custom_width")
      }
      
      $(window).resize(function(){
        console.log(window.innerWidth)
        if(window.innerWidth < 990){
          element.removeClass("custom_width")
        }
        if(window.innerWidth > 990 && window.innerWidth < 1200){
          element.addClass("custom_width")
        }
        if(window.innerWidth > 1300){
          element.addClass("custom_width")
        }
      });
    }
  };
});

student_quizlib.directive("chooseImage",function(){
  return {
    restrict: "A",
    link: function(scope,element,attrs){
      element.bind("click",function(){
        $("#real-file").trigger("click")
      })
    }
  };
})

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
student_quizlib.directive("studentLinegraph",['FormatData',function(FormatData){
  return {
    restrict: "E",
    replace: false,
    link: function(scope,element,attrs){
      
      scope.$on("Student_Line_Graph_Ready",function(){
        //var data = [65,55,22,34,67,88,90,78,65,44];
        var data = scope.averages

  
	    graphData = FormatData.makePLotData(data)
	    var dataset = [
	                { label: "Performance Over Time", data: graphData, points: { symbol: "triangle"} }
	  			  ]

	  	var options = {
	  	            series: {
	  	                lines: {
	  	                    show: true
	  	                },
	  	                points: {
	  	                    radius: 3,
	  	                    fill: true,
	  	                    show: true
	  	                }
	  	            },
	  	            xaxis: {
	                
	  	                tickLength: 0,
	  	                axisLabel: "quizzes in chronological order",
	  	                axisLabelUseCanvas: true,
	  	                axisLabelFontSizePixels: 12,
	  	                axisLabelFontFamily: 'Verdana, Arial',
	  	                axisLabelPadding: 20
	  	            },
	  	            yaxis: {
	  	                axisLabel: "Percentage Marks",
	  	                axisLabelUseCanvas: true,
	  	                axisLabelFontSizePixels: 12,
	  	                axisLabelFontFamily: 'Verdana, Arial',
	  	                axisLabelPadding: 1
	               
	  	            },
	  	            legend: {
	  	                noColumns: 0,
	  	                labelBoxBorderColor: "#000000",
	  	                position: "nw"
	  	            },
	  	            grid: {
	  	                hoverable: true,
	  	                borderWidth: 2,
	  	                borderColor: "#633200",
	  	                backgroundColor: { colors: ["#ffffff", "#EDF5FF"] }
	  	            },
	  	            colors: ["#FF0000", "#0022FF"]
	  	        };

	  			$.plot(element, dataset,options);
        
      })
    }
  };
}]);
student_quizlib.directive("studentBargraph",[ 'FormatData',function(FormatData){
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
		  
	  
	  yAxisData = FormatData.makePLotData(scope.scores)
	  xAxisData = FormatData.makePLotData(scope.names)
    

	  var dataset = [
		    { label: "Performance in each quiz", data: yAxisData, color: "#5482FF" }
	  ];
          			
	 
	  var options = {
	 	 series: {
	 	     bars: {
	 	         show: true
	 	     }
	 	 },
	 	 bars: {
	 	     align: "center",
	 	     barWidth: 0.5
	 	 },
	 	 xaxis: {
	 	     axisLabel: "Quizzes",
	 	     axisLabelUseCanvas: true,
	 	     axisLabelFontSizePixels: 12,
	 	     axisLabelFontFamily: 'Verdana, Arial',
	 	     axisLabelPadding: 10,
	 	     ticks: xAxisData
	 	 },
	 	 yaxis: {
	 	     axisLabel: "Score",
	 	     axisLabelUseCanvas: true,
	 	     axisLabelFontSizePixels: 12,
	 	     axisLabelFontFamily: 'Verdana, Arial',
	 	     axisLabelPadding: 3,
			 tickDecimals: 0,
			 min: 0
				  		   
	 	   
	 	 },
	 	 legend: {
	 	     noColumns: 0,
	 	     labelBoxBorderColor: "#000000",
	 	     position: "nw"
	 	 },
	 	 grid: {
	 	     hoverable: true,
	 	     borderWidth: 2,
	 	     backgroundColor: { colors: ["#ffffff", "#EDF5FF"] }
	 	 }
	 }; 	

	   
	$.plot(element, dataset,options);   

       
      })  
    }
  };
}])

student_quizlib.directive("showBargraph",function(){
  return {
    restrict: "C",
    link: function(scope,element,attrs){
      element.bind("click",function(){
		$(".show-bargraph").addClass("disabled")
        $(".bar-graph").removeClass("hide")
        $(".line-graph").addClass("hide")
        $(".show-linegraph").removeClass("disabled")
      })
    }
  };
});
student_quizlib.directive("showLinegraph",function(){
  return {
    restrict: "C",
    link: function(scope,element,attrs){
      element.bind("click",function(){
		$(".show-linegraph").addClass("disabled")
        $(".bar-graph").addClass("hide")
        $(".line-graph").removeClass("hide")
        $(".show-bargraph").removeClass("disabled")
        
      })
    }
  };
});
