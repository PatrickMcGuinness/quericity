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
      //console.log('file is ' + JSON.stringify(file));
      var uploadUrl = "/users/"+ $scope.user.id + "/upload_image";
      $scope.loading = true
      fileUpload.uploadFileToUrl(file, uploadUrl);
  };

  $scope.$on("profile_pic_Changed",function(event,profile_pic){
    $scope.user.profile_pic = profile_pic
    $scope.loading = false
  })

}]);

student_quizlib.controller('DashBoardCtrl', ['$scope','ServedQuiz','Sharing','User',function($scope,ServedQuiz,Sharing,User){
    User.get_current_user().$promise.then(function(data){
      $scope.student_id = data.id
      $scope.student_detail = User.dashboard_details(data.id)
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
    $scope.student_quiz_report.served_at = TimeDisplay.get_date(data.served_quiz.created_at) + " " + TimeDisplay.get_time(data.served_quiz.created_at)
    $scope.student_quiz_report.start_time = TimeDisplay.get_date(data.served_quiz.date) + " " + TimeDisplay.get_time(data.served_quiz.start_time)
    $scope.student_quiz_report.end_time = TimeDisplay.get_date(data.served_quiz.close_date)+ " " + TimeDisplay.get_time(data.served_quiz.end_time)
  }) 

}]);

student_quizlib.controller('QuizListCtrl', ['$scope','ServedQuiz','Sharing','TimeDisplay','QuizStatus',function($scope,ServedQuiz,Sharing,TimeDisplay,QuizStatus){
  
  ServedQuiz.student_served_quizzes().$promise.then(function(data){
    $scope.all_quizzes = data
    $scope.served_quizzes = data
    date_formatting($scope.served_quizzes)
  })

  ServedQuiz.student_pending_quizzes().$promise.then(function(data){
    $scope.pending_quizzes = data
    date_formatting($scope.pending_quizzes)
  })

  ServedQuiz.student_attempted_quizzes().$promise.then(function(data){
    $scope.attempted_quizzes = data
    date_formatting($scope.attempted_quizzes)
  })

  ServedQuiz.student_started_quizzes().$promise.then(function(data){
    $scope.started_quizzes = data
    date_formatting($scope.started_quizzes)
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

  var date_formatting = function(quizzes){
    angular.forEach(quizzes,function(value,key){
      value.student_sharing = Sharing.student_sharing(value.id)
      
      var obj1 = new Date(value.local_date)
      
      var obj2 = new Date(value.local_close_date)
      value.close_date = TimeDisplay.get_date(value.local_close_date)
      
      var obj3 = new Date(value.local_start_time)
      
      var obj4 = new Date(value.local_end_time)
      
      value.end_time = TimeDisplay.get_time(value.local_end_time)
      
      value.show_icon = false
      value.expired = false
      
      value.status = QuizStatus.get_status(obj1,obj2,value.local_start_time,value.local_end_time)
    })
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
    var obj = new Date($scope.served_quiz.end_time)
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

student_quizlib.controller('AllQuestionsTimeLimit', ['$scope','$timeout','ServedQuiz','Sharing','Answer',function($scope,$timeout,ServedQuiz,Sharing,Answer){
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

  
  $scope.served_quiz.answers = Answer.student_answers_in_served_quiz($scope.served_quiz.id)
  $scope.submit = function(cloned_questions){
    /* loop through all the submitted answers*/
    angular.forEach(cloned_questions,function(question,key){
      /* Grade only questions with given answers */
      if(question.answer != null){
        
        /* If question is fill in the blank*/
        
        if(question.question_type == 1){
          if(question.cloned_question_options[0].is_correct == true){
            var answer = "true"
          }
          else{
            var answer = "false"
          }
          if(question.answer == answer){
            var is_correct = true
          }
          else{
            var is_correct = false
          }
          Answer.save({cloned_question_id: question.id, student_answer: question.answer, answer: answer, is_correct: is_correct,served_quiz_id: $scope.served_quiz.id, graded_by_teacher: 0})
        }

        /* If question is mcq*/
        
        if(question.question_type == 2){
          var correct_answer = null
          angular.forEach(question.cloned_question_options,function(value,key){
            if(value.is_correct == true){
              correct_answer = value.answer
            }
          })
          angular.forEach(question.cloned_question_options,function(value,key){
            if(value.id == question.answer){
              if(value.is_correct == true){
                var is_correct = true
              }
              else{
                var is_correct = false
              }
              var student_answer = value.answer
              Answer.save({cloned_question_id: question.id, student_answer: student_answer, answer: correct_answer, is_correct: is_correct,served_quiz_id: $scope.served_quiz.id, graded_by_teacher: 0})
            }
          })         
        }

        /*if questios in open ended*/
        
        if(question.question_type == 3){
          Answer.save({cloned_question_id: question.id, student_answer: question.answer, answer: question.cloned_question_options[0].answer, is_correct: false,served_quiz_id: $scope.served_quiz.id, graded_by_teacher: 0})
        }

        /*If question is fill in the blank*/

        if(question.question_type == 4){
          if(question.answer.toLowerCase() == question.cloned_question_options[0].answer.toLowerCase()){
            var is_correct = true
          }
          else{
            var is_correct = false
          }
          Answer.save({cloned_question_id: question.id, student_answer: question.answer, answer: question.cloned_question_options[0].answer, is_correct: is_correct,served_quiz_id: $scope.served_quiz.id, graded_by_teacher: 0})
        }
      }  
    })
    
    /*check the remaining questions*/
    
    ServedQuiz.questions_to_attempt($scope.served_quiz.id).$promise.then(function(data){
      $scope.served_quiz.questions_to_attempt = data
      if($scope.served_quiz.questions_to_attempt == 0){
        $scope.served_quiz.student_sharing.status = 2
        $scope.served_quiz.student_sharing.status_in_string = "COMPLETED"
        Sharing.update($scope.served_quiz.id, $scope.served_quiz.student_sharing.id,$scope.served_quiz.student_sharing)
      }
    })
    $scope.served_quiz.answers = Answer.student_answers_in_served_quiz($scope.served_quiz.id)
  }
}]);

student_quizlib.controller('AllQuestionsAnswerAfterQuizCtrl', ['$scope','ServedQuiz','Sharing','Answer',function($scope,ServedQuiz,Sharing,Answer){
  
  $scope.served_quiz.answers = Answer.student_answers_in_served_quiz($scope.served_quiz.id)
  
  $scope.submit = function(cloned_questions){
    /* loop through all the submitted answers*/
    angular.forEach(cloned_questions,function(question,key){
      /* Grade only questions with given answers */
      if(question.answer != null){
        /* If question is fill in the blank*/
        if(question.question_type == 1){
          if(question.cloned_question_options[0].is_correct == true){
            var answer = "true"
          }
          else{
            var answer = "false"
          }
          if(question.answer == answer){
            var is_correct = true
          }
          else{
            var is_correct = false
          }
          Answer.save({cloned_question_id: question.id, student_answer: question.answer, answer: answer, is_correct: is_correct,served_quiz_id: $scope.served_quiz.id, graded_by_teacher: 0})
        }

        /* If question is mcq*/
        if(question.question_type == 2){
          var correct_answer = null
          angular.forEach(question.cloned_question_options,function(value,key){
            if(value.is_correct == true){
              correct_answer = value.answer
            }
          })
          angular.forEach(question.cloned_question_options,function(value,key){
            if(value.id == question.answer){
              if(value.is_correct == true){
                var is_correct = true
              }
              else{
                var is_correct = false
              }
              var student_answer = value.answer
              Answer.save({cloned_question_id: question.id, student_answer: student_answer, answer: correct_answer, is_correct: is_correct,served_quiz_id: $scope.served_quiz.id, graded_by_teacher: 0})
            }
          })         
        }
        /*if questios in open ended*/
        if(question.question_type == 3){
          Answer.save({cloned_question_id: question.id, student_answer: question.answer, answer: question.cloned_question_options[0].answer, is_correct: false,served_quiz_id: $scope.served_quiz.id, graded_by_teacher: 0})
        }

        /*If question is fill in the blank*/

        if(question.question_type == 4){
          if(question.answer.toLowerCase() == question.cloned_question_options[0].answer.toLowerCase()){
            var is_correct = true
          }
          else{
            var is_correct = false
          }
          Answer.save({cloned_question_id: question.id, student_answer: question.answer, answer: question.cloned_question_options[0].answer, is_correct: is_correct,served_quiz_id: $scope.served_quiz.id, graded_by_teacher: 0})
        }
      }  
    })
    
    /*check the remaining questions*/
    
    ServedQuiz.questions_to_attempt($scope.served_quiz.id).$promise.then(function(data){
      $scope.served_quiz.questions_to_attempt = data
      if($scope.served_quiz.questions_to_attempt == 0){
        $scope.served_quiz.student_sharing.status = 2
          $scope.served_quiz.student_sharing.status_in_string = "COMPLETED"
        Sharing.update($scope.served_quiz.id, $scope.served_quiz.student_sharing.id,$scope.served_quiz.student_sharing)
      }
    })
    $scope.served_quiz.answers = Answer.student_answers_in_served_quiz($scope.served_quiz.id)
  }

}]);

student_quizlib.controller('NumberOfQuestionsNOTimeLimit', ['$scope','ServedQuiz','Sharing','Answer',function($scope,ServedQuiz,Sharing,Answer){

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
  
  $scope.submit = function(cloned_questions){
    /* loop through all the submitted answers*/
    angular.forEach(cloned_questions,function(question,key){
      /* Grade only questions with given answers */
      if(question.answer != null){
        /* If question is fill in the blank*/
        if(question.question_type == 1){
          if(question.cloned_question_options[0].is_correct == true){
            var answer = "true"
          }
          else{
            var answer = "false"
          }
          if(question.answer == answer){
            var is_correct = true
          }
          else{
            var is_correct = false
          }
          Answer.save({cloned_question_id: question.id, student_answer: question.answer, 
            answer: answer, is_correct: is_correct,served_quiz_id: $scope.served_quiz.id, 
            graded_by_teacher: 0}).$promise.then(function(data){
              $scope.served_quiz.questions_to_attempt = data.questions_to_attempt
              check_more_questions()
            })
        }

        /* If question is mcq*/
        if(question.question_type == 2){
          var correct_answer = null
          angular.forEach(question.cloned_question_options,function(value,key){
            if(value.is_correct == true){
              correct_answer = value.answer
            }
          })
          angular.forEach(question.cloned_question_options,function(value,key){
            if(value.id == question.answer){
              if(value.is_correct == true){
                var is_correct = true
              }
              else{
                var is_correct = false
              }
              var student_answer = value.answer
              Answer.save({cloned_question_id: question.id, student_answer: student_answer, 
                  answer: correct_answer, is_correct: is_correct,
                  served_quiz_id: $scope.served_quiz.id, graded_by_teacher: 0}).$promise.then(function(data){
                    $scope.served_quiz.questions_to_attempt = data.questions_to_attempt
                    check_more_questions()
                  })
            }
          })         
        }
        /*if questios in open ended*/
        if(question.question_type == 3){
          Answer.save({cloned_question_id: question.id, student_answer: question.answer, 
            answer: question.cloned_question_options[0].answer, is_correct: false,
            served_quiz_id: $scope.served_quiz.id, graded_by_teacher: 0}).$promise.then(function(data){
              $scope.served_quiz.questions_to_attempt = data.questions_to_attempt
              check_more_questions()
            })
        }

        /*If question is fill in the blank*/

        if(question.question_type == 4){
          if(question.answer.toLowerCase() == question.cloned_question_options[0].answer.toLowerCase()){
            var is_correct = true
          }
          else{
            var is_correct = false
          }
          Answer.save({cloned_question_id: question.id, student_answer: question.answer, 
            answer: question.cloned_question_options[0].answer, is_correct: is_correct,
            served_quiz_id: $scope.served_quiz.id, graded_by_teacher: 0}).$promise.then(function(data){
              $scope.served_quiz.questions_to_attempt = data.questions_to_attempt
              check_more_questions()
            })
        }    
      }
    })
    
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

student_quizlib.controller('NumberOfQuestionsTimeLimit', ['$scope','$timeout','ServedQuiz','Sharing','Answer',function($scope,$timeout,ServedQuiz,Sharing,Answer){
  $scope.time_running = true

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

  
  
  $scope.submit = function(cloned_questions){
    /* loop through all the submitted answers*/
    angular.forEach(cloned_questions,function(question,key){
      /* Grade only questions with given answers */
      if(question.answer != null){
        /* If question is fill in the blank*/
        if(question.question_type == 1){
          if(question.cloned_question_options[0].is_correct == true){
            var answer = "true"
          }
          else{
            var answer = "false"
          }
          if(question.answer == answer){
            var is_correct = true
          }
          else{
            var is_correct = false
          }
          Answer.save({cloned_question_id: question.id, student_answer: question.answer, 
            answer: answer, is_correct: is_correct,served_quiz_id: $scope.served_quiz.id,
             graded_by_teacher: 0}).$promise.then(function(data){
                $scope.questions_to_attempt = data.questions_to_attempt
                check_more_questions()
             })
        }

        /* If question is mcq*/
        if(question.question_type == 2){
          var correct_answer = null
          angular.forEach(question.cloned_question_options,function(value,key){
            if(value.is_correct == true){
              correct_answer = value.answer
            }
          })
          angular.forEach(question.cloned_question_options,function(value,key){
            if(value.id == question.answer){
              if(value.is_correct == true){
                var is_correct = true
              }
              else{
                var is_correct = false
              }
              var student_answer = value.answer
              Answer.save({cloned_question_id: question.id, student_answer: student_answer, 
                answer: correct_answer, is_correct: is_correct,served_quiz_id: 
                $scope.served_quiz.id, graded_by_teacher: 0}).$promise.then(function(data){
                  $scope.questions_to_attempt = data.questions_to_attempt
                  check_more_questions()
                })
            }
          })         
        }
        /*if questios in open ended*/
        if(question.question_type == 3){
          Answer.save({cloned_question_id: question.id, student_answer: question.answer, 
            answer: question.cloned_question_options[0].answer, is_correct: false,
            served_quiz_id: $scope.served_quiz.id, graded_by_teacher: 0}).$promise.then(function(data){
              $scope.questions_to_attempt = data.questions_to_attempt
              check_more_questions()
            })
        }

        /*If question is fill in the blank*/

        if(question.question_type == 4){
          if(question.answer.toLowerCase() == question.cloned_question_options[0].answer.toLowerCase()){
            var is_correct = true
          }
          else{
            var is_correct = false
          }
          Answer.save({cloned_question_id: question.id, student_answer: question.answer, 
            answer: question.cloned_question_options[0].answer, is_correct: is_correct,
            served_quiz_id: $scope.served_quiz.id, graded_by_teacher: 0}).$promise.then(function(data){
              $scope.questions_to_attempt = data.questions_to_attempt
              check_more_questions()
            })
        }
        //index = $scope.served_quiz.questions_to_show.indexOf(question)
        //$scope.served_quiz.questions_to_show.splice(index,1)  
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