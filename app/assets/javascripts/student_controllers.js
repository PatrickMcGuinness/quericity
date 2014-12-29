// we have three controllers at line AllQuestionsTimeLimit , line# 540 and line # 784, go throught the each 
// controller to see in detail of merging it.
// In berief yes they can be merged to one. duplicate code can be removed.
// But remmber we can merge these but we cant merge it to preview controller. 
// That Preview controller is for teacher side not for students. That one is seperate.


student_quizlib.controller('SettingsCtrl', ['$scope','User','fileUpload',function($scope,User,fileUpload){
  $scope.user = User.get_current_user()
  $scope.submitted = false
  $scope.loading = false
  $scope.saveUser = function(isValid){
    $scope.submitted = true
    if(isValid){
      $scope.user = User.update($scope.user.id, $scope.user)
    }
  }
    
  $scope.uploadFile = function(){
      var file = $scope.myFile;
      
      var uploadUrl = "/users/"+ $scope.user.id + "/upload_image";
      $scope.loading = true
      fileUpload.uploadFileToUrl(file, uploadUrl);
  };

  $scope.$on("profile_pic_Changed",function(event,profile_pic){
    $scope.user.profile_pic = profile_pic
    $scope.loading = false
  })

}]);

student_quizlib.controller('TakeQuizCtrl', ['$scope','ServedQuiz','Sharing','TimeDisplay','FormatData','QuizStatus',function($scope,ServedQuiz,Sharing,TimeDisplay,FormatData,QuizStatus){
    ServedQuiz.student_mixed_quizzes().$promise.then(function(data){
	
     
    	$scope.served_quizzes = data
		
		FormatData.statusFormat(data)
 	 

   
    })

}]);

student_quizlib.controller('FinishQuizCtrl', ['$scope','ServedQuiz','Sharing','TimeDisplay','FormatData','QuizStatus',function($scope,ServedQuiz,Sharing,TimeDisplay,FormatData,QuizStatus){
    ServedQuiz.student_started_quizzes().$promise.then(function(data){
     
    	$scope.served_quizzes = data
		
		FormatData.statusFormat(data)
 	 

   
    })

}]);





student_quizlib.controller('ReportsCtrl', ['$scope','ServedQuiz','Sharing','User','FormatData',function($scope,ServedQuiz,Sharing,User,FormatData){
    
	    this.tab = 1;
    
	    this.selectTab = function (setTab){
	    	this.tab = setTab;
	    };
	    this.isSelected = function(checkTab) {
	    	return this.tab === checkTab;
	    };
		
	User.get_current_user().$promise.then(function(data){
      $scope.student_id = data.id
      
		ServedQuiz.student_attempted_quizzes().$promise.then(function(data){
     
	    	$scope.served_quizzes = data
		
			FormatData.statusFormat(data)
 	    
	    })
    })
	
	 
}]);

student_quizlib.controller('StudentLineGraphCtrl',['$scope','User',function($scope,User){
	
  $scope.$watch('student_id', function() {
    if($scope.student_id != undefined){
      User.dashboard_line_graph_data($scope.student_id).$promise.then(function(data){
        $scope.averages = data.quizzes
        $scope.$broadcast("Student_Line_Graph_Ready")
      })
    }  
  })  
}]);

student_quizlib.controller('StudentBarGraphCtrl', ['$scope','User',function($scope,User){
  $scope.$watch('student_id',function(){
    if($scope.student_id != undefined){
      User.dashboard_bar_graph_data($scope.student_id).$promise.then(function(data){
        $scope.scores = data.quizzes
        $scope.names = data.names
        $scope.maxscores = data.maxscores
        $scope.$broadcast("Student_Bar_Graph_Ready");
      })
    }
  }) 
}]);

student_quizlib.controller('QuizDetailCtrl', ['$scope','ServedQuiz','$routeParams','TimeDisplay',function($scope,ServedQuiz,$routeParams,TimeDisplay){
  $scope.student_id = $routeParams.student_id
  ServedQuiz.student_quiz_report($routeParams.id,$routeParams.student_id).$promise.then(function(data){
    $scope.student_quiz_report = data
    $scope.student_quiz_report.served_at = TimeDisplay.get_date(data.served_quiz.created_at)
    $scope.student_quiz_report.start_time = TimeDisplay.get_date(data.served_quiz.date)
    $scope.student_quiz_report.end_time = TimeDisplay.get_date(data.served_quiz.close_date)
  }) 

}]);

student_quizlib.controller('QuizListCtrl', ['$scope','ServedQuiz','Sharing','TimeDisplay','FormatData','QuizStatus',function($scope,ServedQuiz,Sharing,TimeDisplay,FormatData,QuizStatus){
  
  ServedQuiz.student_served_quizzes().$promise.then(function(data){
      $scope.all_quizzes = data
      $scope.served_quizzes = data
    
	  FormatData.statusFormat($scope.served_quizzes)
  })

  ServedQuiz.student_pending_quizzes().$promise.then(function(data){
      $scope.pending_quizzes = data
    
	  FormatData.statusFormat($scope.pending_quizzes)
  })

  ServedQuiz.student_attempted_quizzes().$promise.then(function(data){
      $scope.attempted_quizzes = data
   
	  FormatData.statusFormat($scope.attempted_quizzes)
  })

  ServedQuiz.student_started_quizzes().$promise.then(function(data){
      $scope.started_quizzes = data
    
	  FormatData.statusFormat($scope.started_quizzes)
  })

  $scope.toggle_title = function(){
    if($scope.title == false){
      $scope.title = true
    }
    else{
      $scope.title = false
    }
  }
  $scope.toggle_teacher_name = function(){
    if($scope.teacher_name == false){
      $scope.teacher_name = true
    }
    else{
      $scope.teacher_name = false
    }
  }
  $scope.toggle_subject = function(){
    if($scope.subject_title == false){
      $scope.subject_title = true
    }
    else{
      $scope.subject_title = false
    }
  }
  
  $scope.toggle_status = function(){
    if($scope.status == false){
      $scope.status = true
    }
    else{
      $scope.status = false
    }
  }
  
  $scope.show_pending_quizzes = function(){
    $scope.served_quizzes = $scope.pending_quizzes
  }
  $scope.show_all_quizzes = function(){
    $scope.served_quizzes = $scope.all_quizzes
  }
  $scope.show_attempted_quizzes = function(){
    $scope.served_quizzes = $scope.attempted_quizzes
  }
  $scope.show_started_quizzes = function(){
    $scope.served_quizzes = $scope.started_quizzes
  }


}]);

student_quizlib.controller('AnswersCtrl', ['$scope','ServedQuiz','Sharing','$routeParams','Answer',function($scope,ServedQuiz,Sharing,$routeParams,Answer){
  $scope.served_quiz_id = $routeParams.id
  ServedQuiz.get($routeParams.id).$promise.then(function(data){
    $scope.served_quiz = data
    $scope.served_quiz.student_sharing = Sharing.student_sharing(data.id)
    $scope.served_quiz.answers = Answer.student_answers_in_served_quiz($scope.served_quiz.id)

  })

}]);

student_quizlib.controller('QuizAttemptCtrl', ['$scope','ServedQuiz','Sharing','$routeParams',function($scope,ServedQuiz,Sharing,$routeParams){
  $scope.served_quiz_id = $routeParams.id
	
	
  ServedQuiz.get($routeParams.id).$promise.then(function(data){
    $scope.served_quiz = data
    $scope.served_quiz.student_sharing = Sharing.student_sharing(data.id)
    $scope.served_quiz.questions_to_attempt = ServedQuiz.questions_to_attempt(data.id)
    var obj = new Date($scope.served_quiz.close_date)

    $scope.served_quiz.close_date = obj.getDate() +"/" + (obj.getMonth()+1) +"/"+obj.getFullYear()
    // var obj = new Date($scope.served_quiz.end_time)

    if(obj.getMinutes() < 10){
      $scope.served_quiz.end_time = obj.getHours() + ":" + "0" + obj.getMinutes()
    }
    else{
      $scope.served_quiz.end_time = obj.getHours() + ":" + obj.getMinutes()
    }
  })
  
  $scope.timer = { counter: 0, minutes: 0 }
  $scope.changeStatus = function(){
    $scope.served_quiz.student_sharing.status = 4
    $scope.served_quiz.student_sharing.status_in_string = 'PARTIAL'
    Sharing.update($scope.served_quiz.id, $scope.served_quiz.student_sharing.id,$scope.served_quiz.student_sharing)
  }

}]);

student_quizlib.controller('AllQuestionsTimeLimit', ['$scope','$timeout','ServedQuiz','Sharing','Grade','Answer','Attempt',function($scope,$timeout,ServedQuiz,Sharing, Grade,Answer,Attempt){
  // timer section for time limt
	
  
  $scope.time_running = true
  
  $scope.onTimeout = function(){  
    if($scope.timer.counter == 0){
      if($scope.timer.minutes == 0){
        $timeout.cancel(mytimeout);
        $scope.served_quiz.student_sharing.status = 2
        $scope.served_quiz.student_sharing.status_in_string = "COMPLETED"
        Sharing.update($scope.served_quiz.id, $scope.served_quiz.student_sharing.id,$scope.served_quiz.student_sharing)
      }
      if($scope.timer.minutes > 0){
        $scope.timer.counter = 59
        $scope.timer.minutes = $scope.timer.minutes - 1
      }   
    }else{
      $scope.timer.counter--;
    }
    mytimeout = $timeout($scope.onTimeout,1000);
  }

  $scope.timer.counter = 60
  $scope.timer.minutes = $scope.served_quiz.duration - 1
  var mytimeout = $timeout($scope.onTimeout,1000);
  
  $scope.$on('$destroy', function(){
    $timeout.cancel(mytimeout);
  });
  /////////
  /// for redirecting to some other page during quiz
  $scope.$on('$locationChangeStart', function( event ) {
    if($scope.served_quiz.student_sharing.status_in_string != "COMPLETED"){
      var answer = confirm("Leaving this page will mark quiz as completed. Are you sure you want to leave this page?")
      if (!answer) {
        event.preventDefault();
      }
      if(answer){
        $scope.served_quiz.student_sharing.status = 2
        $scope.served_quiz.student_sharing.status_in_string = "COMPLETED"
        Sharing.update($scope.served_quiz.id, $scope.served_quiz.student_sharing.id,$scope.served_quiz.student_sharing)

      }
    }  
  });
  ///////////////////

  //result analyser till end
  //$scope.served_quiz.answers = Answer.student_answers_in_served_quiz($scope.served_quiz.id)

  $scope.submit = function(cloned_questions){
    /* loop through all the submitted answers*/
	  
	  /*check the remaining questions */
      var check_status = function(){
        if($scope.served_quiz.questions_to_attempt.length == 0){
          $scope.served_quiz.student_sharing.status = 2
          $scope.served_quiz.student_sharing.status_in_string = "COMPLETED"
          Sharing.update($scope.served_quiz.id, $scope.served_quiz.student_sharing.id,$scope.served_quiz.student_sharing)
        }
      }
    
    angular.forEach(cloned_questions,function(question,key){
      /* Grade only questions with given answers */
 
		Answer.grade(question,$scope.served_quiz.id,function(questionsToAttempt){
			$scope.served_quiz.questions_to_attempt = questionsToAttempt
			check_status()
		});
	
    })
    
    

    $scope.served_quiz.answers = Answer.student_answers_in_served_quiz($scope.served_quiz.id)
  }
}]);

student_quizlib.controller('EnrolGroupCtrl',['$scope','Group','StudentGroup','User',function($scope,Group,StudentGroup,User){
   $scope.all_groups = []
   $scope.selected_groud_id = 0 
   $scope.enrol_group = false 
   $scope.show_password = false
   $scope.grop_data = []
   Group.all_groups_of_student().$promise.then(function(data){
     $scope.all_groups_of_student = data
    })

   Group.all_groups().$promise.then(function(data){
    console.log(data)
    angular.forEach(data,function(value,key){
      console.log('in')
      $scope.all_groups.push({id: value.id, title: value.title})
      
    })
  })

  $scope.AddGroup = function(selected_group_id){
    $scope.selected_group_id = selected_group_id
    console.log($scope.selected_group_id)
  }

   $scope.enrol= function(){
    console.log($scope.selected_group_id)
    if($scope.show_password == true )
    {

    }
    if($scope.selected_group_id  != undefined){
      Group.enrol_in_the_group($scope.selected_group_id,$scope.code).$promise.then(function(data){
          $scope.grop_data = data
          $scope.all_groups_of_student.push(data)
          $scope.enrol_group = false
    
    })
        } 
   }

}]);  

student_quizlib.controller('AllQuestionsAnswerAfterQuizCtrl', ['$scope','ServedQuiz','Sharing','Answer','Attempt',function($scope,ServedQuiz,Sharing,Answer,Attempt){
 
  //timer section (duplicate with upper can be merged carefully).
 $scope.time_running = true
  
 
  $scope.timer.counter = 60
  $scope.timer.minutes = $scope.served_quiz.duration - 1
  var mytimeout = $timeout($scope.onTimeout,1000);
  
  $scope.$on('$destroy', function(){
    $timeout.cancel(mytimeout);
  });
  // location change section. (duplicate)
  $scope.$on('$locationChangeStart', function( event ) {
    if($scope.served_quiz.student_sharing.status_in_string != "COMPLETED"){
      var answer = confirm("Leaving this page will mark quiz as completed. Are you sure you want to leave this page?")
      if (!answer) {
        event.preventDefault();
      }
      if(answer){
        $scope.served_quiz.student_sharing.status = 2
        $scope.served_quiz.student_sharing.status_in_string = "COMPLETED"
        Sharing.update($scope.served_quiz.id, $scope.served_quiz.student_sharing.id,$scope.served_quiz.student_sharing)

      }
    }  
  });

  // result section (duplicate)
  $scope.served_quiz.answers = Answer.student_answers_in_served_quiz($scope.served_quiz.id)

  $scope.submit = function(cloned_questions){
    /* loop through all the submitted answers*/
    console.log(cloned_questions)
    angular.forEach(cloned_questions,function(question,key){
      /* Grade only questions with given answers */
        
        
		Answer.grade(question,$scope.served_quiz.id,function(questionsToAttempt){
			$scope.served_quiz.questions_to_attempt = questionsToAttempt
			check_status()
		});
    })
    
    /*check the remaining questions*/
    var check_status = function(){
      if($scope.served_quiz.questions_to_attempt.length == 0){
        $scope.served_quiz.student_sharing.status = 2
        $scope.served_quiz.student_sharing.status_in_string = "COMPLETED"
        Sharing.update($scope.served_quiz.id, $scope.served_quiz.student_sharing.id,$scope.served_quiz.student_sharing)
      }
    }
    $scope.served_quiz.answers = Answer.student_answers_in_served_quiz($scope.served_quiz.id)
  }

}]);

student_quizlib.controller('NumberOfQuestionsNOTimeLimit', ['$scope','ServedQuiz','Sharing','Answer','Grade','Attempt',function($scope,ServedQuiz,Sharing,Answer,Grade,Attempt){
 //// the number of question one time required on page and to move to and fro in them
  $scope.final_answer = false
  $scope.show_next = true
  $scope.show_previous = false
  $scope.total_questions = []
  $scope.all_questions_to_save = []
  $scope.questions_to_show_on_page = []
  $scope.ans_submit = 
  $scope.quiz_start_pressed = true


  ServedQuiz.get($scope.served_quiz_id).$promise.then(function(data){
    $scope.served_quiz = data
    $scope.served_quiz.questions_to_show = []
    $scope.served_quiz.student_sharing = Sharing.student_sharing(data.id)
    ServedQuiz.questions_to_attempt(data.id).$promise.then(function(data){
      $scope.served_quiz.questions_to_attempt = data
      // these are the total questions that student have to attempt
      $scope.total_questions  = $scope.served_quiz.questions_to_attempt

      if($scope.served_quiz.questions_to_attempt.length > $scope.served_quiz.questions_per_page){
        for(var i = 0; i < $scope.served_quiz.questions_per_page; i ++){
          $scope.served_quiz.questions_to_show.push($scope.served_quiz.questions_to_attempt[i])
        }
      }
      else{
        angular.forEach($scope.served_quiz.questions_to_attempt,function(value,key){
          $scope.served_quiz.questions_to_show.push(value)
        })
      }
      $scope.questions_to_show_on_page = $scope.served_quiz.questions_to_show
    })
    $scope.served_quiz.answers = Answer.student_answers_in_served_quiz($scope.served_quiz.id)
  })

 


  
   $scope.previous_questions = function(){
      $scope.questions_to_show_on_page = []
      $scope.final_answer = false
      $scope.show_next= true
      console.log($scope.served_quiz.questions_per_page)
      console.log($scope.all_questions_to_save.length)
      console.log($scope.served_quiz.questions_per_page)

      if ($scope.all_questions_to_save.length <= $scope.served_quiz.questions_per_page)
      {
        $scope.show_previous= false
      }
      for(var i = 0; i < $scope.served_quiz.questions_per_page; i++)
      {
        $scope.all_questions_to_save.pop()
      }
  
      var new_number = parseInt($scope.all_questions_to_save.length)+ parseInt($scope.served_quiz.questions_per_page)

      for(var j = $scope.all_questions_to_save.length; j <  new_number; j++){
        $scope.questions_to_show_on_page.push($scope.served_quiz.questions_to_attempt[j])
      }
    }




  $scope.next_questions = function(question_to_save){
    $scope.questions_to_show_on_page = []
    $scope.show_previous = true



    angular.forEach(question_to_save,function(answered_question,key){
      console.log($scope.all_questions_to_save)
      $scope.all_questions_to_save.push(answered_question)

    })
    var new_number = parseInt($scope.all_questions_to_save.length) + parseInt($scope.served_quiz.questions_per_page)

    if(new_number < $scope.served_quiz.questions_to_attempt.length){
      for(var i = $scope.all_questions_to_save.length; i < new_number;i++){
         if($scope.served_quiz.questions_to_attempt[i] != undefined){
          $scope.questions_to_show_on_page.push($scope.served_quiz.questions_to_attempt[i])
        }
      }
    }
    else{
      for(var i = $scope.all_questions_to_save.length; i < $scope.served_quiz.questions_to_attempt.length; i++){
        if($scope.served_quiz.questions_to_attempt[i]!= undefined){
          $scope.questions_to_show_on_page.push($scope.served_quiz.questions_to_attempt[i])
        }
        
      }
    }

    if ($scope.all_questions_to_save.length >= $scope.served_quiz.questions_to_attempt.length-$scope.served_quiz.questions_per_page)
    {
      $scope.show_next = false
      $scope.final_answer = true
    }

  }


 // reulst analyzer again. this is almost duplicate but first 7 lines are different and required
  $scope.submit = function(questions_to_show_on_page){
    $scope.quiz_start_pressed = false
    /* loop through all the submitted answers*/
     $scope.final_answer = false
      $scope.show_next= false
      $scope.show_previous = false
      $scope.ans_submit = false
    angular.forEach(questions_to_show_on_page,function(answered_question,key){
      
      $scope.all_questions_to_save.push(answered_question)

    })
    
    angular.forEach($scope.all_questions_to_save,function(question,key){
      /* Grade only questions with given answers */
		
		Answer.grade(question,$scope.served_quiz.id,function(questionsToAttempt){
			$scope.served_quiz.questions_to_attempt = questionsToAttempt
			
		});
    })
    
    $scope.served_quiz.student_sharing.status = 2
    $scope.served_quiz.student_sharing.status_in_string = "COMPLETED"
    Sharing.update($scope.served_quiz.id, $scope.served_quiz.student_sharing.id,$scope.served_quiz.student_sharing)
    $scope.served_quiz.answers = Answer.student_answers_in_served_quiz($scope.served_quiz.id)
  }

}]);

student_quizlib.controller('NumberOfQuestionsTimeLimit', ['$scope','$timeout','ServedQuiz','Sharing','Answer','Grade','Attempt',function($scope,$timeout,ServedQuiz,Sharing,Answer,Grade,Attempt){
  // this is for both number of question and timeout. This is the combination of both can be merged!
  $scope.time_running = true
  $scope.quiz_start_pressed = true
  ServedQuiz.get($scope.served_quiz_id).$promise.then(function(data){
    $scope.served_quiz = data
    $scope.served_quiz.questions_to_show = []
    $scope.served_quiz.student_sharing = Sharing.student_sharing(data.id)
    ServedQuiz.questions_to_attempt(data.id).$promise.then(function(data){
      $scope.served_quiz.questions_to_attempt = data
      if($scope.served_quiz.questions_to_attempt.length > $scope.served_quiz.questions_per_page){
        for(var i = 0; i < $scope.served_quiz.questions_per_page; i ++){
          $scope.served_quiz.questions_to_show.push($scope.served_quiz.questions_to_attempt[i])
        }
      }
      else{
        angular.forEach($scope.served_quiz.questions_to_attempt,function(value,key){
          $scope.served_quiz.questions_to_show.push(value)
        })
      }

    })
    $scope.served_quiz.answers = Answer.student_answers_in_served_quiz($scope.served_quiz.id)
  })
  
  $scope.onTimeout = function(){
    
    if($scope.timer.counter == 0){
      if($scope.timer.minutes == 0){
        $timeout.cancel(mytimeout);
        if($scope.served_quiz.student_sharing.status_in_string != "COMPLETED"){
          $scope.served_quiz.student_sharing.status = 2
          $scope.served_quiz.student_sharing.status_in_string = "COMPLETED"
          Sharing.update($scope.served_quiz.id, $scope.served_quiz.student_sharing.id,$scope.served_quiz.student_sharing)
        }
      }
      if($scope.timer.minutes > 0){
        $scope.timer.counter = 59
        $scope.timer.minutes = $scope.timer.minutes - 1
      }
        
    }else{
      $scope.timer.counter--;
    }
    mytimeout = $timeout($scope.onTimeout,1000);
  }

  $scope.timer.counter = 60
  $scope.timer.minutes = $scope.served_quiz.duration - 1
  var mytimeout = $timeout($scope.onTimeout,1000);

  $scope.$on('$destroy', function(){
    $timeout.cancel(mytimeout);
  });
  
  $scope.$on('$locationChangeStart', function( event ) {
    if($scope.served_quiz.student_sharing.status_in_string != "COMPLETED"){
      var answer = confirm("Leaving this page will mark quiz as completed. Are you sure you want to leave this page?")
      if (!answer) {
        event.preventDefault();
      }
      if(answer){
        //$timeout.cancel(mytimeout);
        $scope.served_quiz.student_sharing.status = 2
        $scope.served_quiz.student_sharing.status_in_string = "COMPLETED"
        Sharing.update($scope.served_quiz.id, $scope.served_quiz.student_sharing.id,$scope.served_quiz.student_sharing)

      }
    }  
  });

  // result analyser. similar to first and second controller.
  
  $scope.submit = function(cloned_questions){
    /* loop through all the submitted answers*/
    console.log(cloned_questions)
    angular.forEach(cloned_questions,function(question,key){
      /* Grade only questions with given answers */
      if(question.answer != null){
  		Answer.grade(question,$scope.served_quiz.id,function(questionsToAttempt){
  			$scope.served_quiz.questions_to_attempt = questionsToAttempt
  			check_more_questions()
  		}); 
      }  
    })
   
    /*check the remaining questions*/
    var check_more_questions = function(){
      $scope.served_quiz.questions_to_show = []
      if($scope.served_quiz.questions_to_attempt.length == 0){
        $scope.served_quiz.student_sharing.status = 2
        $scope.served_quiz.student_sharing.status_in_string = "COMPLETED"
        Sharing.update($scope.served_quiz.id, $scope.served_quiz.student_sharing.id,$scope.served_quiz.student_sharing)
      }
      else{
        if($scope.served_quiz.questions_to_attempt.length > $scope.served_quiz.questions_per_page){
          for(i = 0; i < $scope.served_quiz.questions_per_page; i ++){
            $scope.served_quiz.questions_to_show.push($scope.served_quiz.questions_to_attempt[i])
          }
        }
        else{
          angular.forEach($scope.served_quiz.questions_to_attempt,function(value,key){
            $scope.served_quiz.questions_to_show.push(value)
          })
        }
      }
    }  
    $scope.served_quiz.answers = Answer.student_answers_in_served_quiz($scope.served_quiz.id)
  }
}]);