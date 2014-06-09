quizlib.controller('MenuCtrl', ['$scope','$route',function($scope,$route){
  $scope.$route = $route 
}]);

quizlib.controller('SettingsCtrl', ['$scope','User','fileUpload',function($scope,User,fileUpload){
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

quizlib.controller('PasswordCtrl', ['$scope','User',function($scope,User){
  $scope.user = User.get_current_user()
  $scope.submitted = false
  $scope.savePassword = function(isValid){
    $scope.submitted = true
    if(isValid){
      $scope.user = User.update($scope.user.id, $scope.user)
    }
  } 
}]);


quizlib.controller('StudentLineGraphCtrl',['$scope','User',function($scope,User){
  $scope.$watch('student_id', function() {
    if($scope.student_id != undefined){
      User.line_graph_data($scope.student_id).$promise.then(function(data){
        $scope.averages = data.quizzes
        $scope.$broadcast("Student_Line_Graph_Ready")
      })
    }  
  })  
}]);

quizlib.controller('StudentBarGraphCtrl', ['$scope','User',function($scope,User){
  $scope.$watch('student_id',function(){
    if($scope.student_id != undefined){
      User.bar_graph_data($scope.student_id).$promise.then(function(data){
        $scope.scores = data.quizzes
        $scope.names = data.names
        $scope.maxscores = data.maxscores
        $scope.$broadcast("Student_Bar_Graph_Ready");
      })
    }
  }) 
}]);


quizlib.controller("QuizHistogramCtrl",['$scope','ServedQuiz',function($scope,ServedQuiz){
  $scope.$watch('quiz_id',function(){
    if($scope.quiz_id != undefined){
      ServedQuiz.histogram_data($scope.quiz_id).$promise.then(function(data){
        $scope.averages = data.averages
        $scope.students = data.students
        $scope.$broadcast("Quiz_Histogram_Ready");
      })
    }
  })
}])


quizlib.controller('StudentReportCtrl', ['$scope','$routeParams','User',function($scope,$routeParams,User){

  if($routeParams.student_id == undefined){
    User.get_served_students().$promise.then(function(data){
      if(data.length > 0){
        $scope.student_id = data[0].id
        $scope.student_detail = User.get_student_details(data[0].id)
      }
    })
  }
  else{
    $scope.student_id  = $routeParams.student_id
    $scope.student_detail = User.get_student_details($routeParams.student_id)
  }
}]);
quizlib.controller('QuizReportCtrl', ['$scope','ServedQuiz','$routeParams','TimeDisplay',function($scope,ServedQuiz,$routeParams,TimeDisplay){
  if($routeParams.quiz_id == undefined){
    ServedQuiz.first_served_quiz().$promise.then(function(data){
      $scope.quiz_detail = data
      $scope.quiz_id = data.served_quiz.id
      $scope.quiz_detail.served_at = TimeDisplay.get_date(data.served_quiz.created_at)
      $scope.quiz_detail.start_time = TimeDisplay.get_date(data.served_quiz.date)
      $scope.quiz_detail.end_time = TimeDisplay.get_date(data.served_quiz.close_date)
    })
  }else{
    ServedQuiz.quiz_report($routeParams.quiz_id).$promise.then(function(data){
      $scope.quiz_detail = data
      $scope.quiz_id = data.served_quiz.id
      $scope.quiz_detail.served_at = TimeDisplay.get_date(data.served_quiz.created_at)
      $scope.quiz_detail.start_time = TimeDisplay.get_date(data.served_quiz.date)
      $scope.quiz_detail.end_time = TimeDisplay.get_date(data.served_quiz.close_date)
    })
  } 
}]);
quizlib.controller('StudentBarCtrl', ['$scope','User',function($scope,User){
  $scope.students = User.get_served_students() 
}]);
quizlib.controller('QuizBarCtrl', ['$scope','ServedQuiz',function($scope,ServedQuiz){
  ServedQuiz.all().$promise.then(function(data){
    $scope.quizzes = data.result
  }) 
}]);

quizlib.controller('QuizDetailCtrl', ['$scope','ServedQuiz','$routeParams','TimeDisplay',function($scope,ServedQuiz,$routeParams,TimeDisplay){
  $scope.student_id = $routeParams.student_id
  ServedQuiz.student_quiz_report($routeParams.id,$routeParams.student_id).$promise.then(function(data){
    $scope.student_quiz_report = data
    $scope.student_quiz_report.served_at = TimeDisplay.get_date(data.served_quiz.created_at)
    $scope.student_quiz_report.start_time = TimeDisplay.get_date(data.served_quiz.date)
    $scope.student_quiz_report.end_time = TimeDisplay.get_date(data.served_quiz.close_date)
  }) 

}]);


quizlib.controller('GradeListQuizCtrl', ['$scope','$modal','$rootScope','ServedQuiz','ClonedQuizBank','QuizBank','Sharing','QuizStatus','TimeDisplay',function($scope,$modal,$rootScope,ServedQuiz,ClonedQuizBank,QuizBank,Sharing,QuizStatus,TimeDisplay){
  
  $.removeCookie("my_assessments")
  $.removeCookie("shared_assessments")
  $.removeCookie("starred_assessments")
  $.removeCookie("main_repo")
  
  $scope.served_quizzes = []
  ServedQuiz.all().$promise.then(function(data){
    $scope.served_quizzes = data.result
    angular.forEach($scope.served_quizzes,function(value,key){
      
      var obj1 = new Date(value.local_date)
      value.local_date = TimeDisplay.get_date(value.local_date)
      
      var obj2 = new Date(value.local_close_date)
      value.local_close_date = TimeDisplay.get_date(value.local_close_date)
      
      value.attempted_answers = ServedQuiz.attempted_answers(value.id)
      ServedQuiz.graded_answers(value.id).$promise.then(function(data){
        value.graded_answers = data
      })
    })
  })
  $rootScope.cancel = function () {
    $rootScope.modalInstance.dismiss('cancel');
  };
  $scope.invited_students = function (served_quizId){  
    ServedQuiz.invited(served_quizId).$promise.then(function(data){
      $rootScope.items = data
      $rootScope.modalInstance = $modal.open({
        templateUrl: 'Modal.html' 
      });
    })   
  }
  $scope.pending_students = function (served_quizId){  
    ServedQuiz.pending(served_quizId).$promise.then(function(data){
      $rootScope.items = data
      $rootScope.modalInstance = $modal.open({
        templateUrl: 'Modal.html' 
      });
    })   
  }
  $scope.completed_students = function (served_quizId){  
    ServedQuiz.completed(served_quizId).$promise.then(function(data){
      $rootScope.items = data
      $rootScope.modalInstance = $modal.open({
        templateUrl: 'Modal.html' 
      });
    })   
  }
  $scope.toggle_title = function(){
    if($scope.title == false){
      $scope.title = true
    }else{
      $scope.title = false
    }
  }
}]);

quizlib.controller('GradeQuestionCtrl', ['$scope','$routeParams','ServedQuiz','Answer',function($scope,$routeParams,ServedQuiz,Answer){
  $scope.answers_to_grade = ServedQuiz.questions_to_grade($routeParams.id)
  $scope.correct = function(answer){
    answer.graded_by_teacher = 1
    answer.is_correct = true
    Answer.update(answer.id,answer).$promise.then(function(){
      index = $scope.answers_to_grade.indexOf(answer)
      $scope.answers_to_grade.splice(index,1)
    })
  }
  $scope.wrong = function(answer){
    answer.graded_by_teacher = 1
    answer.is_correct = false
    Answer.update(answer.id,answer).$promise.then(function(){
      index = $scope.answers_to_grade.indexOf(answer)
      $scope.answers_to_grade.splice(index,1)
    })
  }
}]);

quizlib.controller('ServeQuizCtrl', ['$scope','$rootScope', '$modal','ServedQuiz','ClonedQuizBank','QuizBank','Sharing','QuizStatus','TimeDisplay','Message',function($scope,$rootScope, $modal,ServedQuiz,ClonedQuizBank,QuizBank,Sharing,QuizStatus,TimeDisplay,Message){
  $.removeCookie("my_assessments")
  $.removeCookie("shared_assessments")
  $.removeCookie("starred_assessments")
  $.removeCookie("main_repo")
  $scope.served_quizzes = []

  ServedQuiz.all().$promise.then(function(data){
    $scope.served_quizzes = data.result
    angular.forEach($scope.served_quizzes,function(value,key){
      var obj1 = new Date(value.local_date)
      value.local_date = TimeDisplay.get_date(value.local_date)
      
      var obj2 = new Date(value.local_close_date)
      value.local_close_date = TimeDisplay.get_date(value.local_close_date)

      value.status = QuizStatus.get_status(obj1,obj2,value.close_status)
    })
  })
  
  $scope.alert = Message.get_message("ServeQuizCtrl")
  
  $scope.remove_alert = function(){
    $scope.alert = undefined
    Message.remove_message_by_controller("ServeQuizCtrl")
  }

  $rootScope.cancel = function () {
    $rootScope.modalInstance.dismiss('cancel');
  };

  $scope.close_quiz = function(served_quiz){
    served_quiz.status = 1
    ServedQuiz.update(served_quiz.id, served_quiz).$promise.then(function(data){
      index = $scope.served_quizzes.indexOf(served_quiz)
      served_quiz.status = "Serving Completed"
      served_quiz.close_status = 1 
      $scope.served_quizzes[index] = served_quiz
    })
    

  }
  $scope.invited_students = function (served_quizId){  
    ServedQuiz.invited(served_quizId).$promise.then(function(data){
      $rootScope.items = data
      $rootScope.modalInstance = $modal.open({
        templateUrl: 'Modal.html' 
      });
    })   
  }
  $scope.pending_students = function (served_quizId){  
    ServedQuiz.pending(served_quizId).$promise.then(function(data){
      $rootScope.items = data
      $rootScope.modalInstance = $modal.open({
        templateUrl: 'Modal.html' 
      });
    })   
  }
  $scope.completed_students = function (served_quizId){  
    ServedQuiz.completed(served_quizId).$promise.then(function(data){
      $rootScope.items = data
      $rootScope.modalInstance = $modal.open({
        templateUrl: 'Modal.html' 
      });
    })   
  }
}]);

quizlib.controller('PreviewServeQuizCtrl', ['$scope','$routeParams','$timeout','QuizBank','Question','QuestionOption',function($scope,$routeParams,$timeout,QuizBank,Question,QuestionOption){
}]);

quizlib.controller('PreviewQuizCtrl', ['$scope','$routeParams','$timeout','QuizBank','Question','QuestionOption',function($scope,$routeParams,$timeout,QuizBank,Question,QuestionOption){
  $.removeCookie("my_assessments")
  $.removeCookie("shared_assessments")
  $.removeCookie("starred_assessments")
  $.removeCookie("main_repo")

  $scope.quiz_bank_id = $routeParams.id
  $scope.show_options = true
  $scope.quiz_bank = QuizBank.get($scope.quiz_bank_id)
  $scope.questions = QuizBank.questions($scope.quiz_bank_id)
  $scope.show_questions = []
  $scope.show_timer = false
  $scope.submit = false
  $scope.show_answer = false
  $scope.questions_done = 0
  $scope.question_done = 0
  $scope.show_answers = []
  $scope.to_be_graded = []
  $scope.stopQuiz = function(){
    $scope.show_options = true
    $scope.show_timer = false
    $scope.show_questions = []
    $scope.show_answers = []
    $scope.to_be_graded = []
    $scope.option = {}
    $scope.show_answer = false
    $scope.submit = false
    $scope.counter = 0
    $scope.minutes = 0
    $scope.hours = 0
  }

  $scope.counter = 0;
  $scope.minutes = 0;
  $scope.hours = 0;
  $scope.onTimeout = function(){
    $scope.counter--;
    if($scope.counter == 0){
      $scope.counter = 60
      if($scope.minutes == 0){
        if($scope.hours != 0){
          $scope.hours = $scope.hours - 1
        }
        else{

        }
      }
      else{
        $scope.minutes = $scope.minutes - 1
      }
    }
    mytimeout = $timeout($scope.onTimeout,1000);
  }



  $scope.startQuiz = function(){
    $scope.show_options = false
    $scope.show_answer = false
    $scope.submit = true
    $scope.show_answers = []
    if($scope.option.all_questions == 1){
      angular.forEach($scope.questions,function(value,key){
        $scope.show_questions.push(value)
        $scope.show_questions[$scope.show_questions.length -1].question_options = QuestionOption.all($scope.quiz_bank_id,value.section_id,value.id)
      })  
    }
    if($scope.option.all_questions == 0){
      for(var i = 0; i < $scope.option.question_number; i++){
        if($scope.questions[i] != undefined){
          $scope.show_questions.push($scope.questions[i])
          $scope.show_questions[$scope.show_questions.length -1].question_options = QuestionOption.all($scope.quiz_bank_id,$scope.questions[i].section_id,$scope.questions[i].id)
          $scope.question_done = i + 1
        }
        else{
          $scope.questions_done = $scope.questions.length
        }
      }
    }
    if($scope.option.unlimited == 0){
      $scope.show_timer = true
      if($scope.option.duration_type == 1){
        //$scope.counter = ($scope.option.duration * 3600)
        $scope.counter = 60
        $scope.minutes = $scope.option.duration - 1
        mytimeout = $timeout($scope.onTimeout,1000);
      }
      if($scope.option.duration_type == 2){
        $scope.counter = ($scope.option.duration * 3600 * 60)
        mytimeout = $timeout($scope.onTimeout,1000);
      }
    }
  }
  $scope.submitQuestion = function(answered_questions){
    angular.forEach(answered_questions,function(question,key){
      if(question.question_type == 1){
        answer = {question_answer: question.question_options[0].is_correct, 
          answer: question.answer}
        if(question.question_options[0].is_correct == true && question.answer == 'true'){
          answer.correct = 'Correct'
        }
        else if(question.question_options[0].is_correct == false && question.answer == 'false'){
          answer.correct = 'Correct'
        }
        else{
          answer.correct = 'Incorrect'
        }
        $scope.show_answers.push(answer)
      }
      if(question.question_type == 2){
        answer = {}
        angular.forEach(question.question_options,function(value,key){
          if(question.answer == value.id){
            if(value.is_correct == true){
              answer.correct = 'Correct';
              answer.answer = value.answer;
            }
            if(value.is_correct == false){
              answer.correct = 'Incorrect';
              answer.answer = value.answer;
            }
          }
          if(value.is_correct == true){
            answer.question_answer = value.answer
          }

        })
        $scope.show_answers.push(answer)
      }
      if(question.question_type == 4){
        answer = {question_answer: question.question_options[0].answer,
          answer: question.answer}
        if(question.question_options[0].answer == question.answer){
          answer.correct = 'Correct'
        }else{
          answer.correct = 'Incorrect'
        }
        $scope.show_answers.push(answer)
      }
      if(question.question_type == 3){
        $scope.to_be_graded.push({question_answer: question.question_options[0].answer,answer: question.answer,status: "Will be graded later"})
      }
    })
    $scope.show_questions = []
    if($scope.question_done == $scope.questions.length){
      $scope.show_answer= true 
      $scope.submit = false
    }
    var new_number = parseInt($scope.option.question_number) + parseInt($scope.question_done)
    if(new_number < $scope.questions.length){
      for(var i = $scope.question_done; i < new_number;i++){
         if($scope.questions[i] != undefined){
          $scope.show_questions.push($scope.questions[i])
          $scope.show_questions[$scope.show_questions.length -1].question_options = QuestionOption.all($scope.quiz_bank_id,$scope.questions[i].section_id,$scope.questions[i].id)
          $scope.question_done = i + 1
        }
      }
    }
    else{
      for(var i = $scope.question_done; i < $scope.questions.length; i++){
        if($scope.questions[i] != undefined){
          $scope.show_questions.push($scope.questions[i])
          $scope.show_questions[$scope.show_questions.length -1].question_options = QuestionOption.all($scope.quiz_bank_id,$scope.questions[i].section_id,$scope.questions[i].id)
          $scope.question_done = i + 1
        }
        
      }
    }  
  }
  $scope.submitQuiz = function(answered_questions){
    $scope.show_options = false
    $scope.show_timer = false
    $scope.show_answers = []
    $scope.to_be_graded = []
    $scope.submit = false
    $scope.show_answer = true
    angular.forEach(answered_questions,function(question,key){
      if(question.question_type == 1){
        answer = {question_answer: question.question_options[0].is_correct, 
          answer: question.answer}
        if(question.question_options[0].is_correct == true && question.answer == 'true'){
          answer.correct = 'Correct'
        }
        else if(question.question_options[0].is_correct == false && question.answer == 'false'){
          answer.correct = 'Correct'
        }
        else{
          answer.correct = 'Incorrect'
        }
        $scope.show_answers.push(answer)
      }
      if(question.question_type == 2){
        answer = {}
        angular.forEach(question.question_options,function(value,key){
          if(question.answer == value.id){
            if(value.is_correct == true){
              answer.correct = 'Correct';
              answer.answer = value.answer
            }
            if(value.is_correct == false){
              answer.correct = 'Incorrect';
              answer.answer = value.answer;
            }
          }
          if(value.is_correct == true){
            answer.question_answer = value.answer
          }

        })
        $scope.show_answers.push(answer)
      }
      if(question.question_type == 4){
        answer = {question_answer: question.question_options[0].answer,
          answer: question.answer}
        if(question.question_options[0].answer == question.answer){
          answer.correct = 'Correct'
        }else{
          answer.correct = 'Incorrect'
        }
        $scope.show_answers.push(answer)
      }
      if(question.question_type == 3){
        //$scope.show_answers.push({question_type: 3})
        $scope.to_be_graded.push({question_answer: question.question_options[0].answer,answer: question.answer,status: "Will be graded later"})
      }
    })
    $scope.show_questions = []
  }
}]);

/*quizlib.controller('DatePickerCtrl', ['$scope',function($scope){
  $scope.today = function() {
    $scope.quiz.date = new Date();
    $scope.quiz.close_date = new Date()
  };
  $scope.today();

  $scope.showWeeks = false;
  
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.quiz.date = null;
    $scope.quiz.close_date = null
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
  $scope.format = $scope.formats[0];
}]);


quizlib.controller('TimePickerCtrl', ['$scope',function($scope){
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
}]); */

quizlib.controller('NewServeQuizCtrl', ['$scope','QuizBank','ServedQuiz','ClonedQuizBank','ClonedQuestion','ClonedQuestionOption','Group','User','Sharing','QuestionOption','$routeParams','$location','Message',function($scope,QuizBank,ServedQuiz,ClonedQuizBank,ClonedQuestion,ClonedQuestionOption,Group,User,Sharing,QuestionOption,$routeParams,$location,Message){
  
  $.removeCookie("my_assessments")
  $.removeCookie("shared_assessments")
  $.removeCookie("starred_assessments")
  $.removeCookie("main_repo")
  
  //$scope.show_question_list = true
  $scope.selected_questions = []
  //$scope.show_options = true
  $scope.group_students = []
  $scope.students_to_left = []
  $scope.students_to_right = []
  $scope.selected_students = []
  $scope.option_submitted = false
  $scope.quiz = {date: null, close_date: null}
  $scope.selects = {selected_group: null, selected_quiz: null}
  $scope.toggle_display = {show_question_list: true, show_options: true}
  $scope.currentStep = 1000
  $scope.served_quiz = {date: new Date(), close_date: (7).day().fromNow()}  // to make the angular js work weird

  QuizBank.all().$promise.then(function(data){
    $scope.quiz_banks = data.result
  })
  
  $scope.groups = Group.all()
  $scope.system_students = User.system_students()
  if($routeParams.selected_quiz != undefined){
    QuizBank.get($routeParams.selected_quiz).$promise.then(function(data){
      $scope.selects.selected_quiz = data
    })
    //$scope.selected_quiz = QuizBank.get($routeParams.selected_quiz)
  }
  $scope.$watch('selects.selected_quiz', function() {
    if($scope.selects.selected_quiz != undefined){
      $scope.quiz_bank_questions = QuizBank.questions($scope.selects.selected_quiz.id)
      QuizBank.get($scope.selects.selected_quiz.id).$promise.then(function(data){
        $scope.quiz_bank = data
        //$scope.served_quiz.instructions = data.instructions
      })
    }
  });

  $scope.$watch('selects.selected_group',function(){
    if($scope.selects.selected_group != undefined){
      $scope.selected_students = Group.students($scope.selects.selected_group.id)
    }
  })

  $scope.AddStudent = function(student){
    index = $scope.group_students.indexOf(student);
    if(index == -1){
      $scope.group_students.push(student);
    }
  }

  $scope.student_to_right = function(student){
    index = $scope.students_to_right.indexOf(student);
    if(index == -1){
      $scope.students_to_right.push(student)
    }
    else{
      $scope.students_to_right.splice(index,1)
    }
  }

  $scope.move_to_right = function(){
    angular.forEach($scope.students_to_right,function(value,key){
      var check = 0
      angular.forEach($scope.selected_students,function(select_student,key){
        if(value.id == select_student.id){
          check = 1;
        }
      })
      if(check != 1){
        $scope.selected_students.push(value)
        index = $scope.group_students.indexOf(value)
        $scope.group_students.splice(index,1)
      }
    })
    $scope.students_to_right = []
  }

  $scope.move_to_left = function(){
    angular.forEach($scope.students_to_left,function(value,key){
      index = $scope.selected_students.indexOf(value)
      $scope.selected_students.splice(index,1)
      $scope.group_students.push(value)
    })
    $scope.students_to_left = []
  }

  $scope.student_to_left = function(student){
    index = $scope.students_to_left.indexOf(student);
    if(index == -1){
      $scope.students_to_left.push(student)
    }
    else{
      $scope.students_to_left.splice(index,1)
    }
  }

  $scope.select_question = function(question){
    index = $scope.selected_questions.indexOf(question);
    if(index == -1){
      $scope.selected_questions.push(question);
    }
    else{
      $scope.selected_questions.splice(index,1);
    }
  }

  $scope.checkOptions = function(isValid){
    $scope.option_submitted = true
    if(isValid && $scope.served_quiz.infinite_duration != undefined && $scope.served_quiz.random != undefined && $scope.served_quiz.show_all_questions != undefined){
      $scope.toggle_display.show_options = false
    }
  }


  $scope.serveTheQuiz = function(){
    $scope.served_quiz.quiz_bank_id = $scope.selects.selected_quiz.id
    $scope.served_quiz.selected_questions = $scope.selected_questions
    $scope.served_quiz.selected_students = $scope.selected_students
    ServedQuiz.save($scope.served_quiz).$promise.then(function(data){
      Message.push_message({type: "success",msg: "You have successfully served quiz",controller: "ServeQuizCtrl"})
      $location.path("/served_quizzes")
    })
  }

}]);

quizlib.controller('GroupListCtrl', ['$scope','User','Group','StudentGroup','Message',function($scope,User,Group,StudentGroup,Message){
  $.removeCookie("my_assessments")
  $.removeCookie("shared_assessments")
  $.removeCookie("starred_assessments")
  $.removeCookie("main_repo")
  $scope.groups = []
  //$scope.students = User.get_students()
  Group.all().$promise.then(function(data){
    angular.forEach(data,function(value,key){
      var obj = new Date(value.updated_at)
      last_updated = obj.getDate() +"-" + (obj.getMonth() + 1) +"-"+obj.getFullYear()
      $scope.groups.push({id: value.id, title: value.title, count: value.students.length,last_updated:last_updated})
      
    })
  })
  
  $scope.alert = Message.get_message("GroupListCtrl")
  $scope.remove_alert = function(){
    $scope.alert = undefined
    Message.remove_message_by_controller("GroupListCtrl")
  } 
  
  $scope.removeGroup = function(group,idx){
    Group.delete(group.id)
    $scope.groups.splice(idx,1)
  }
  
  $scope.toggle_title = function(){
    if($scope.title == false){
      $scope.title = true
    }
    else{
      $scope.title = false
    }
  }
  
  $scope.toggle_count = function(){
    if($scope.count == false){
      $scope.count = true
    }else{
      $scope.count = false
    }
  }
  
  $scope.toggle_last_updated = function(){
    if($scope.last_updated == false){
      $scope.last_updated = true
    }else{
      $scope.last_updated = false
    }
  }

}]);

 
quizlib.controller('AddGroupCtrl', ['$scope','$location','User','Group','StudentGroup','Message',function($scope,$location,User,Group,StudentGroup,Message){
  
  $scope.students = User.get_students()
  $scope.selected_students = []
  $scope.system_students = User.system_students()
  $scope.submitted = false
  $scope.valid = false
  $scope.group = {title: null}
  $scope.user = User.get_current_user()
  $scope.currentStep = 1000
  
  User.get_current_user().$promise.then(function(data){
    $scope.user = data
    if($scope.user.show_tour == true){
      $scope.currentStep = 0
      $scope.start_tour = true
    }
    else{
      $scope.currentStep = 1000
      $scope.start_tour = false
    }
  });

  
  $scope.change_display = function(){
    if($scope.start_tour == true){
      $scope.start_tour = false
      $scope.user.show_tour = false
      User.update($scope.user.id, $scope.user)
    }
    else{
      $scope.start_tour = true
      $scope.user.show_tour = true
      User.update($scope.user.id,$scope.user)
    }
  } 
  
  $scope.AddStudent = function(student){
    var check = 0
    if(student.id != undefined){
      angular.forEach($scope.students,function(value,key){
        if(value.id == student.id){
          check = 1;
        }
      })
      if(check == 0){
        $scope.students.push(student)
      }  
    }
  }
  $scope.saveGroup = function(isValid){
    $scope.submitted = true
    if(isValid && $scope.valid){
      Group.save($scope.group).$promise.then(function(data){
        angular.forEach($scope.selected_students,function(value,key){
          StudentGroup.save({student_id: value.id,group_id: data.id})
        })
        Message.push_message({type: "success",msg: "You have successfully created group",controller: "GroupListCtrl"})
        $location.path("/groups")
      })
    }
  }
  $scope.selected_student = function(student){
    index = $scope.selected_students.indexOf(student);
    if(index == -1){
      $scope.selected_students.push(student)
    }
    else{
      $scope.selected_students.splice(index,1)
    }
    if($scope.selected_students.length > 0){
      $scope.valid = true
    }
    else{
      $scope.valid = false
    }
  }
}]);
quizlib.controller('ViewGroupCtrl', ['$scope','$routeParams','Group',function($scope,$routeParams,Group){
  Group.get($routeParams.id).$promise.then(function(data){
    $scope.group = data
    var obj = new Date($scope.group.updated_at)
    $scope.group.updated_at = obj.getDate() +"-" + (obj.getMonth() + 1) +"-"+obj.getFullYear()
    var obj = new Date($scope.group.created_at)
    $scope.group.created_at = obj.getDate() +"-" + (obj.getMonth() + 1) +"-"+obj.getFullYear()
  })
}]); 
quizlib.controller('EditGroupCtrl', ['$scope','$location','$routeParams','User','Group','StudentGroup','Message',function($scope,$location,$routeParams,User,Group,StudentGroup,Message){
  
  $scope.students = []
  $scope.selected_students = []
  
  $scope.submitted = false
  $scope.valid = false

  Group.get($routeParams.id).$promise.then(function(data){
    $scope.group = data
    $scope.students = data.students
  })

  
  $scope.init = function(){
    User.get_current_user().$promise.then(function(data){
      $scope.user = data
      if($scope.user.show_tour == true){
        $scope.currentStep = 0
      }
      else{
        $scope.currentStep = 1000
      }
    })
  }

  $scope.system_students = User.system_students()

  $scope.AddStudent = function(student){
    var check = 0
    if(student.id != undefined){
      angular.forEach($scope.students,function(value,key){
        if(value.id == student.id){
          check = 1;
        }
      })
      if(check == 0){
        $scope.students.push(student)
      }  
    }
  }
  $scope.saveGroup = function(isValid){
    $scope.submitted = true
    if(isValid && $scope.valid){
      Group.update($scope.group.id,$scope.group).$promise.then(function(data){
        angular.forEach($scope.student_groups,function(value,key){
          StudentGroup.delete(value.id)
        })
        angular.forEach($scope.selected_students,function(value,key){
          StudentGroup.save({student_id: value.id,group_id: $scope.group.id})
        })
        Message.push_message({type: "success",msg: "You have successfully edited group",controller: "GroupListCtrl"})
        $location.path("/groups")
      })

      
    }
  }
  $scope.selected_student = function(student){
    index = $scope.selected_students.indexOf(student);
    if(index == -1){
      $scope.selected_students.push(student)
    }
    else{
      $scope.selected_students.splice(index,1)
    }
    if($scope.selected_students.length > 0){
      $scope.valid = true
    }
    else{
      $scope.valid = false
    }
  }
}]);
quizlib.controller('ShowQuizBankCtrl', ['$scope','$routeParams','QuizBank','Repository','User','QuestionTopic','Topic','Section','FavouriteQuiz','Message', function($scope,$routeParams, QuizBank, Repository, User,QuestionTopic,Topic,Section,FavouriteQuiz,Message) {
  $scope.my_assessments = Repository.all()
  $scope.shared_quiz_banks = QuizBank.shared_quiz_banks()
  $scope.quiz_bank_id = $routeParams.id
  $scope.tags = []
  $scope.starred_quiz_banks = []
  $scope.is_quiz_view = true
  $scope.current_user = User.get_current_user()
  
  QuizBank.get($routeParams.id).$promise.then(function(data){
    var obj = new Date(data.created_at)
    var obj2 = new Date(data.updated_at)
    $scope.quiz_bank = data
    $scope.created_at = obj.getDate() +"-" + obj.getMonth() +"-"+obj.getFullYear()
    $scope.updated_at = obj2.getDate() +"-" + obj2.getMonth() +"-"+obj2.getFullYear()   
  })

  Repository.default_repo().$promise.then(function(data){
    $scope.main_repo_quizzes = QuizBank.repo_quiz_banks(data.result.id)
  })
  FavouriteQuiz.all().$promise.then(function(data){
    angular.forEach(data.result,function(value,key){
      $scope.starred_quiz_banks.push(QuizBank.get(value.quiz_bank_id))
    })
  })

  $scope.alert = Message.get_message("ShowQuizBankCtrl")
  
  $scope.remove_alert = function(){
    $scope.alert = undefined
    Message.remove_message_by_controller("ShowQuizBankCtrl")
  }

  $scope.deleteQuiz = function(){
    QuizBank.delete($scope.quiz_bank_id)
  }
  
}]);

quizlib.controller("Navigation",['$scope',function($scope){
  

  $scope.no_starred_cookie = function(){
    if($.cookie("starred_assessments") == undefined){
      return true;}
    else{return false;}
  }
  $scope.no_shared_cookie = function(){
    if($.cookie("shared_assessments") == undefined){return true;}
    else{return false;}
  }
  $scope.no_main_repo_cookie = function(){
    if($.cookie("main_repo") == undefined){return true}
    else{return false}
  }

  $scope.no_my_assessments_cookie = function(){
    if($.cookie("my_assessments") == undefined){return true}
    else{return false}
  }


  $scope.update_status = function(state){
    if(state == "my_assessments"){
      if($.cookie("my_assessments") == undefined){
        $.cookie("my_assessments", "my_assessments");
      }
      else{
        $.removeCookie("my_assessments");
      }
      
    }
    if(state == "main_repo"){
      if($.cookie("main_repo") == undefined){
        $.cookie("main_repo","main_repo")
      }
      else{
        $.removeCookie("main_repo");
      }
    }
    if(state == "shared_assessments"){
      if($.cookie("shared_assessments") == undefined){
        $.cookie("shared_assessments","shared_assessments")
      }
      else{
        $.removeCookie("shared_assessments");
      }
    }
    if(state == "starred_assessments"){
      if($.cookie("starred_assessments") == undefined){
        $.cookie("starred_assessments","starred_assessments")
      }
      else{
        $.removeCookie("starred_assessments");
      }
    }  
  }

}]);
quizlib.controller("ManageCtrl",['$scope','QuizBank','Repository','User','QuestionTopic','Topic','FavouriteQuiz','Message',function($scope, QuizBank, Repository, User,QuestionTopic,Topic,FavouriteQuiz,Message){

  $scope.quiz_banks = [] 
  $scope.show_new_repo_div = false
  $scope.starred_quiz_banks = []
  $scope.repository = {title: null}
  $scope.my_assessments = []
  
  Repository.all().$promise.then(function(data){
    $scope.my_assessments = data
    angular.forEach(data,function(value,key){
      value.quiz_banks = QuizBank.repo_quiz_banks(value.id)
    })
    
  })

  $scope.alert = Message.get_message("ManageCtrl")
  
  $scope.remove_alert = function(){
    $scope.alert = undefined
    Message.remove_message_by_controller("ManageCtrl")
  }
  
  $scope.init = function(){
    User.get_current_user().$promise.then(function(data){
      $scope.user = data
      if($scope.user.show_tour == true){
        $scope.currentStep = 0
      }
      else{
        $scope.currentStep = 1000
      }
    })
  }

  $scope.toggle_title = function(){
    if($scope.quiz_title == false){
      $scope.quiz_title = true
    }
    else{
      $scope.quiz_title = false
    }
  }

  $scope.toggle_name = function(){
    if($scope.owner_name == false){
      $scope.owner_name = true
    }else{
      $scope.owner_name = false
    }
  }
  $scope.toggle_tags = function(){
    if($scope.quiz_tag == false){
      $scope.quiz_tag = true
    }
    else{
      $scope.quiz_tag = false
    }
  }

  $scope.deleteRepo = function(repo){
    Repository.delete(repo.id)
  }
  $scope.editRepo = function(repo){
    Repository.update(repo.id,repo)
  }
  $scope.addRepo = function(){
    $scope.show_new_repo_div = false
    Repository.save($scope.repository).$promise.then(function(data){
      $scope.my_assessments.push(data)
      $scope.repository = {}
    })
    
  }

  $scope.shared_quiz_banks = QuizBank.shared_quiz_banks()
  FavouriteQuiz.all().$promise.then(function(data){
    angular.forEach(data.result,function(value,key){
      $scope.starred_quiz_banks.push(QuizBank.get(value.quiz_bank_id))
    })
  })


  Repository.default_repo().$promise.then(function(data){
    $scope.main_repo_quizzes = QuizBank.repo_quiz_banks(data.result.id)
  })

  $scope.current_user = User.get_current_user()
  
  QuizBank.quiz_banks_list().$promise.then(function(data){
    $scope.quiz_banks = data
    angular.forEach(data, function(value, key){
      FavouriteQuiz.is_favourite(value.id).$promise.then(function(data){
        value.is_favourite = data.result
      })
    });
  })

  
  $scope.make_public = function(quiz){
    quiz.public = 1
    QuizBank.update(quiz.id,quiz)
    $scope.shared_quiz_banks.push(quiz)
  }
  $scope.make_private = function(quiz){
    quiz.public = 0
    QuizBank.update(quiz.id,quiz)
    index = $scope.shared_quiz_banks.indexOf(quiz);
    $scope.shared_quiz_banks.splice(index,1)
  }
  $scope.make_favourite = function(quiz_bank){
    FavouriteQuiz.save({quiz_bank_id: quiz_bank.id})
    quiz_bank.is_favourite = true
    $scope.starred_quiz_banks.push(quiz_bank)
  }
  $scope.make_unfavourite = function(quiz_bank){
    FavouriteQuiz.delete(quiz_bank.id)
    quiz_bank.is_favourite = false
    index = $scope.starred_quiz_banks.indexOf(quiz_bank);
    $scope.starred_quiz_banks.splice(index,1)
  }
  $scope.deleteRepo = function(repo){
    Repository.delete(repo.id)
    index = $scope.my_assessments.indexOf(repo);
    $scope.my_assessments.splice(index,1)  
  }
  $scope.deleteQuiz = function(quiz){
    index = $scope.quiz_banks.indexOf(quiz);
    $scope.quiz_banks.splice(index,1)
    QuizBank.delete(quiz.id)
  }
  $scope.handleDrop = function(quizId,repoId) {
    QuizBank.get(quizId).$promise.then(function(data){
      quiz_bank = data
      quiz_bank.repository_id = repoId
      QuizBank.update(quizId,quiz_bank)
    })
  }
  
}])

quizlib.controller("viewQuestionsCtrl",['$scope','Question','GlobalScope','QuestionOption',function($scope, Question,GlobalScope,QuestionOption){
  $scope.questions = Question.all($scope.quiz_bank_id,$scope.section_id)
  
  $scope.$on("question_id_Changed",function(event,question_id){
    $scope.question_id = question_id;
    $scope.questions = Question.all($scope.quiz_bank_id,$scope.section_id)
  })
  $scope.$on('my-sorted',function(ev,val){
    $scope.questions.splice(val.to, 0, $scope.questions.splice(val.from, 1)[0]);
  })
  
  $scope.$on('my-created',function(ev,val){
    $scope.questions.splice(val.to, 0,{name:'#'+($scope.questions.length+1)+': '+val.name});
  })

}])

quizlib.controller("viewQuestionCtrl",['$scope','QuestionOption','Question','GlobalScope',function($scope,QuestionOption,Question,GlobalScope){
  
  $scope.show_details = false

  $scope.show_details_edit = false
  $scope.submitted = false
  $scope.show_options = function(section_id,question_id,question_type){
    $scope.show_details = true
    $scope.show_details_view = true
  }
  $scope.show_edit = function(){
    $scope.show_details_view = false;
    $scope.show_details = true
  }
  $scope.show_blank_edit = function(question){
    $scope.show_details_view = false
    statements = question.description.split("_")
    $scope.first_statement = statements[0]
    $scope.second_statement = statements[statements.length - 1]

  }
  $scope.hide_update = function(){$scope.show_details_view = true}
  
  $scope.edit_question = function(section_id,question_id,question,isValid){
    $scope.submitted = true
    if(isValid){
      Question.update($scope.quiz_bank_id,section_id,question_id,question)
      $scope.show_details_view = true
    }  
  }
  $scope.edit_blank = function(first_statement,second_statement,section_id,question_id,question,isValid){
    $scope.submitted = true
    if(isValid){
      question.description  = first_statement + "______" + second_statement
      Question.update($scope.quiz_bank_id,section_id,question_id,question)
      $scope.show_details_view = true
    }

  }
  $scope.edit_mcq = function(section_id,question_id,question,question_options){
    angular.forEach(question_options,function(value,key){
      if($scope.selected_option == value){value.is_correct = "true";}
      else{value.is_correct = "false";}
    })
    Question.update($scope.quiz_bank_id,section_id,question_id,question)
    $scope.show_details_view = true
  }
  
  $scope.delete_question = function(section_id,question_id,idx){
    Question.delete($scope.quiz_bank_id,section_id,question_id)
    $scope.questions.splice(idx, 1);
    $scope.show_details = false
  }
  
  $scope.select_option = function(option){
    $scope.selected_option = option
  }

}])



quizlib.controller("newQuestionCtrl",['$scope','Question','GlobalScope','QuestionOption',function($scope, Question, GlobalScope,QuestionOption){
  
  $scope.submitted = false
  
  $scope.$on('quiz_bank_id_Changed', function(event, quiz_bank_id) {
    $scope.quiz_bank_id = quiz_bank_id;
  });

  $scope.$on("section_id_Changed",function(event,section_id){
    $scope.section_id = section_id;
  })

  //$scope.selected_difficulty = {}

  $scope.mcq_options = ["", "","",""]

  $scope.removeData = function(){
    $scope.selected_difficulty = null
    $scope.selected_true_false_option = null
    $scope.blank = null
    $scope.input_1 = null
    $scope.input_0 = null
    $scope.input_2 = null
    $scope.input_3 = null
    $scope.radio = null
    CKEDITOR.instances['true_false_question_statement'].setData("")
    CKEDITOR.instances['first_statement'].setData("")
    CKEDITOR.instances['second_statement'].setData("")
    CKEDITOR.instances['description'].setData("")
    CKEDITOR.instances['open_ended_question_statement'].setData("")
    CKEDITOR.instances['answer'].setData("")
  }
  $scope.create_true_false = function(isValid){
    $scope.submitted = true
    if(isValid && $scope.selected_true_false_option != undefined){
      Question.save($scope.quiz_bank_id, $scope.section_id,
        {description: $scope.true_false_question_statement,section_id: $scope.section_id,
        question_type: 1,difficulty_level: $scope.selected_difficulty}).$promise.then(function(data){
          $scope.question_id  = data.id
          GlobalScope.set_question_id($scope.question_id)
          QuestionOption.save($scope.quiz_bank_id, $scope.section_id,$scope.question_id,
          {question_id: $scope.question_id, is_correct:$scope.selected_true_false_option}).$promise.then(function(){
            $scope.true_false_question_statement = null
            $scope.selected_difficulty = null
            $scope.selected_true_false_option = null
            $scope.submitted = false
            CKEDITOR.instances['true_false_question_statement'].setData("")
            $scope.hideQuestion()
          })
        })
        
       }
  }
  $scope.create_open_ended = function(isValid){
    $scope.submitted = true
    if(isValid){
      Question.save($scope.quiz_bank_id, $scope.section_id,
        {description: $scope.open_ended_statement,section_id: $scope.section_id,
        question_type: 3,difficulty_level: $scope.selected_difficulty}).$promise.then(function(data){
          $scope.question_id  = data.id
          GlobalScope.set_question_id($scope.question_id)
          QuestionOption.save($scope.quiz_bank_id, $scope.section_id,$scope.question_id,
          {question_id: $scope.question_id, answer:$scope.open_ended_answer}).$promise.then(function(){
            $scope.open_ended_statement = null
            $scope.open_ended_answer = null
            $scope.difficulty_level = null
            $scope.submitted = false
            CKEDITOR.instances['open_ended_question_statement'].setData("")
            CKEDITOR.instances['answer'].setData("")
            $scope.hideQuestion()
          })
        })
    }    
  }
  $scope.create_blank = function(isValid){
    $scope.submitted = true
    if(isValid){
      $scope.blank_statement = $scope.first_statement +"_______"+$scope.second_statement
      Question.save($scope.quiz_bank_id, $scope.section_id,
        {description: $scope.blank_statement,section_id: $scope.section_id,
        question_type: 4,difficulty_level: $scope.selected_difficulty}).$promise.then(function(data){
          $scope.question_id  = data.id
          GlobalScope.set_question_id($scope.question_id)
          QuestionOption.save($scope.quiz_bank_id, $scope.section_id,$scope.question_id,
          {question_id: $scope.question_id, answer:$scope.blank}).$promise.then(function(){
            $scope.first_statement = {}
            $scope.second_statement = {}
            $scope.blank = null
            $scope.selected_difficulty = null
            $scope.submitted = false
            CKEDITOR.instances['first_statement'].setData("")
            CKEDITOR.instances['second_statement'].setData("")
            $scope.hideQuestion() 
          })
        }) 
    }    
  }

  $scope.remove_mcq_input = function(index){
    if($scope.mcq_options.length > 2){
      $scope.mcq_options.splice(index,1)
    }
  }
  $scope.add_mcq_input = function(){
    $scope.mcq_options.push('')
  }

  $scope.add_correct_option = function(radio){
    $scope.correct_input = radio
  }
  
  $scope.create_mcq = function(isValid){
    $scope.submitted = true
    if(isValid){
      inputs = $scope.mcq_options
      Question.save($scope.quiz_bank_id, $scope.section_id,
        {description: $scope.question.description,section_id: $scope.section_id,
        question_type: 2,difficulty_level: $scope.selected_difficulty}).$promise.then(function(data){
          $scope.question_id = data.id
          GlobalScope.set_question_id($scope.question_id)
          for(var i = 0; i<(inputs.length) ; i++){
            if(inputs[i] != undefined){
              is_correct = true
              if($scope.correct_input == i){
                is_correct = true
              }
              else{
                is_correct = false
              }
              QuestionOption.save($scope.quiz_bank_id, $scope.section_id,$scope.question_id,
              {question_id: $scope.question_id, answer:inputs[i],is_correct: is_correct})
            }  
          }

        })
        $scope.selected_difficulty = null
        $scope.submitted = false
        $scope.radio = null
        $scope.input_0 = null
        $scope.input_1 = null
        $scope.input_2 = null
        $scope.input_3 = null
        CKEDITOR.instances['description'].setData("")
        $scope.hideQuestion()
    }

  }

}])

quizlib.controller("sectionCtrl",['$scope','$rootScope','Section','Question',function($scope,$rootScope,Section,Question){
  
  $scope.deleteSection = function(id,idx){
    $scope.quiz_sections.splice(idx, 1);
    Section.delete($scope.quiz_bank_id,id);
  }
  $scope.editSection = function(section){
     $rootScope.section_edit = section;
  }
  $scope.cancelEditSection = function(section){
    $rootScope.section_edit = null
  }
  $scope.updateSection = function(isValid,section_edit){
    if(isValid){
      updated_section = Section.update($scope.quiz_bank_id, section_edit.id, section_edit)
      $rootScope.section_edit = null
    }
  }

  $scope.handleDrop = function(questionId,sectionId,quizBankId,previousSectionId){
    Question.get(quizBankId,previousSectionId,questionId).$promise.then(function(data){
      $scope.question_to_update = data
      $scope.question_to_update.section_id = sectionId
      Question.update(quizBankId,previousSectionId,questionId,$scope.question_to_update)
    })
  }
  $rootScope.show_true_false = false
  $rootScope.show_mcq = false
  $rootScope.show_blank = false
  $rootScope.show_open_ended = false
  $rootScope.question_section = null
  $scope.addNewQuestion = function(question_type,section){

    $rootScope.question_section = section
    if(question_type == "True False"){
      $rootScope.show_true_false = true
      $rootScope.show_mcq = false
      $rootScope.show_blank = false
      $rootScope.show_open_ended = false
    }
    if(question_type == "Multiple Choice"){
      $rootScope.show_true_false = false
      $rootScope.show_mcq = true
      $rootScope.show_blank = false
      $rootScope.show_open_ended = false
    }
    if(question_type == "Fill in blank"){
      $rootScope.show_true_false = false
      $rootScope.show_mcq = false
      $rootScope.show_blank = true
      $rootScope.show_open_ended = false
    }
    if(question_type == "Open Ended"){
      $rootScope.show_true_false = false
      $rootScope.show_mcq = false
      $rootScope.show_blank = false
      $rootScope.show_open_ended = true
    }
  }
  $scope.hideQuestion = function(){
    $rootScope.show_true_false = false
    $rootScope.show_mcq = false
    $rootScope.show_blank = false
    $rootScope.show_open_ended = false
  }

}])

quizlib.controller("CloneQuizBankCtrl",['$scope','$location','$routeParams','QuizBank','Repository','Section','GlobalScope','Topic','QuestionTopic','Message',function($scope,$location,$routeParams,QuizBank, Repository,Section, GlobalScope,Topic,QuestionTopic,Message){
  
  $.removeCookie("my_assessments")
  $.removeCookie("shared_assessments")
  $.removeCookie("starred_assessments")
  $.removeCookie("main_repo")
  
  $scope.question_types = ["True False","Multiple Choice","Fill in blank","Open Ended"]
  $scope.submitted= false
  $scope.show_new_section = false
  $scope.section_submitted = false
  
  QuizBank.clone($routeParams.id).$promise.then(function(data){
    $scope.quiz_bank = data
    $scope.quiz_bank_id = data.id
    $scope.quiz_sections = Section.all($scope.quiz_bank_id)


    $scope.tags = [];

    $scope.loadtags = function(query) {
    return Topic.search(query).$promise
    };
    
    QuestionTopic.all($scope.quiz_bank_id).$promise.then(function(data){
      angular.forEach(data.result,function(value,key){
        Topic.get(value.topic_id).$promise.then(function(data){
          $scope.tags.push({text: data.title})
        })

      })
    })
  })
  
  $scope.cancelQuiz = function(){
    QuizBank.delete($scope.quiz_bank_id)
  }
  $scope.saveQuiz = function(isValid){
    $scope.submitted = true
    if(isValid){
      $scope.quiz_bank.status = 1
      QuestionTopic.destroy_all($scope.quiz_bank_id)
      QuizBank.update($scope.quiz_bank_id, $scope.quiz_bank).$promise.then(function(data){
        angular.forEach($scope.tags, function(value, key){
          QuestionTopic.save($scope.quiz_bank_id,{title: value.text})
        })
      })
      Message.push_message({type: "success",msg: "You have successfully cloned quiz bank",controller: "ManageCtrl"})
      $location.path("/manage_quiz_banks")
    }
  }
  $scope.show_section = function(){
    $scope.show_new_section = true
  }
  $scope.hide_section = function(){
    $scope.show_new_section = false
    if($scope.newSection != undefined){
      $scope.newSection.title = null
    }
  }  

  $scope.addSection = function(isValid){
    $scope.section_submitted = true
    if(isValid){
      section = Section.save($scope.quiz_bank_id,{title: $scope.newSection.title})
      $scope.quiz_sections = Section.all($scope.quiz_bank_id)
      $scope.newSection = {}
      $scope.section_submitted = false
      $scope.show_new_section = false
    }
  }

  $scope.addMoreTags = function(){
    console.log("add more tags")
    if($scope.selected_tag != undefined){
      $scope.show_tags.push($scope.selected_tag)
    }
  }
}])
quizlib.controller("EditQuizBankCtrl",['$scope','$location','$routeParams','QuizBank','Repository','Section','GlobalScope','Topic','QuestionTopic','Message',function($scope,$location,$routeParams,QuizBank, Repository,Section, GlobalScope,Topic,QuestionTopic,Message){
  $.removeCookie("my_assessments")
  $.removeCookie("shared_assessments")
  $.removeCookie("starred_assessments")
  $.removeCookie("main_repo")
  
  $scope.quiz_bank_id = $routeParams.id
  $scope.quiz_bank = QuizBank.get($scope.quiz_bank_id)
  $scope.quiz_sections = Section.all($scope.quiz_bank_id)
  $scope.question_types = ["True False","Multiple Choice","Fill in blank","Open Ended"]
  $scope.submitted = false
  $scope.section_submitted = false
  $scope.ckEditors = [];
  $scope.newSection = null
  $scope.show_new_section = false  

  $scope.saveQuiz = function(isValid){
    $scope.submitted =true
    if(isValid){
      $scope.quiz_bank.status = 1
      QuizBank.update($scope.quiz_bank_id, $scope.quiz_bank).$promise.then(function(data){
        QuestionTopic.destroy_all($scope.quiz_bank_id)
        angular.forEach($scope.tags, function(value, key){
          QuestionTopic.save($scope.quiz_bank_id,{title: value.text})
        })
        Message.push_message({type: "success",msg: "You have successfully updated quiz bank",controller: "ShowQuizBankCtrl"})
        $location.path("/quiz_banks/"+$scope.quiz_bank_id+"/show")
      })
    }
  }
  $scope.addSection = function(isValid){
    $scope.section_submitted = true
    if(isValid){
      section = Section.save($scope.quiz_bank_id,{title: $scope.newSection.title})
      $scope.quiz_sections = Section.all($scope.quiz_bank_id)
      $scope.newSection = {}
      $scope.section_submitted = false
      $scope.show_new_section = false
    }
  }

  $scope.show_section = function(){
    $scope.show_new_section = true
  }
  $scope.hide_section = function(){
    $scope.show_new_section = false
    $scope.newSection.title = null
  }
  
  $scope.tags = [];
  
  $scope.loadtags = function(query) {
    return Topic.search(query).$promise
  };        
  QuestionTopic.all($scope.quiz_bank_id).$promise.then(function(data){
    angular.forEach(data.result,function(value,key){
      Topic.get(value.topic_id).$promise.then(function(data){
        $scope.tags.push({text: data.title})
      })
    })
  })
  

}])
quizlib.controller("NewQuizBankCtrl",['$scope','$location','QuizBank','Repository','Section','GlobalScope','Topic','QuestionTopic','User','Message',function($scope, $location,QuizBank, Repository,Section, GlobalScope,Topic,QuestionTopic,User,Message){
  // Variables for view show hide

  $.removeCookie("my_assessments")
  $.removeCookie("shared_assessments")
  $.removeCookie("starred_assessments")
  $.removeCookie("main_repo")
  $scope.question_types = ["True False","Multiple Choice","Fill in blank","Open Ended"]
  $scope.submitted = false
  $scope.section_submitted = false
  $scope.show_new_section = false
  $scope.quiz_bank = {}

  $scope.tags = [];

  $scope.loadtags = function(query) {
    return Topic.search(query).$promise
  };
  
  $scope.init = function(){
    User.get_current_user().$promise.then(function(data){
      $scope.user = data
      if($scope.user.show_tour == true){
        $scope.currentStep = 0
      }
      else{
        $scope.currentStep = 1000
      }
    })
  }
  Repository.default_repo().
      $promise.then(
        function(data){ 
          $scope.repository_id = data.result.id
        }
      ).then(function(){
            QuizBank.save({title: "My Quiz Bank", repository_id: $scope.repository_id}).
            $promise.then(
              function(data){
                $scope.quiz_bank_id = data.id;
                GlobalScope.set_quiz_bank_id($scope.quiz_bank_id)
                $scope.quiz_bank = data
                $scope.quiz_sections = Section.all($scope.quiz_bank_id)
              }
            ) 
        })
  
  $scope.saveQuiz = function(isValid){
    $scope.submitted =true
    if(isValid){

      $scope.quiz_bank.status = 1
      QuizBank.update($scope.quiz_bank_id, $scope.quiz_bank).$promise.then(function(data){
        angular.forEach($scope.tags, function(value, key){
          QuestionTopic.save($scope.quiz_bank_id,{title: value.text})
        })
      })
      Message.push_message({type: "success",msg: "You have successfully created quiz bank",controller: "ManageCtrl"})
      $location.path("#/quiz_banks/"+$scope.quiz_bank_id+"/show")
    }
  }

  $scope.addSection = function(isValid){
    $scope.section_submitted = true
    if(isValid){
      section = Section.save($scope.quiz_bank_id,{title: $scope.newSection.title})
      $scope.quiz_sections = Section.all($scope.quiz_bank_id)
      $scope.newSection = {}
      $scope.section_submitted = false
      $scope.show_new_section = false
    }
  }
  $scope.show_section = function(){
    $scope.show_new_section = true
  }
  $scope.hide_section = function(){
    $scope.show_new_section = false
    $scope.newSection.title = null
  }
  $scope.difficulties = [{name: "Easy"},{name: "Medium"},{name: "Hard"}]
  $scope.cancelQuiz = function(){
    QuizBank.delete($scope.quiz_bank_id)
  }


}])