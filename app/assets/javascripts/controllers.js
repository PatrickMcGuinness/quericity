quizlib.controller('MenuCtrl', ['$scope','$route',function($scope,$route){
  $scope.$route = $route
  $scope.$watch('titleFilter', function() {
    if($scope.titleFilter != undefined){
      console.log($scope.titleFilter)
      $scope.$broadcast("title_filter_changed",$scope.titleFilter)
    }  
  }) 
}]);


quizlib.controller('ShareCtrl', ['$scope','$routeParams','QuizBank','User',function($scope,$routeParams,QuizBank,User){
  $scope.quiz_bank = QuizBank.get($routeParams.id)
  $scope.tags = [];
  
  $scope.loadtags = function(query) {
    return User.search_teacher_by_email(query).$promise
  };

  $scope.remove_sharing = function(share,index){
    $scope.quiz_bank.shares.splice(index,1)
    QuizBank.delete_share($scope.quiz_bank.id,share.id)
    if($scope.quiz_bank.shares.length == 0){
      $scope.quiz_bank.shared = false
    }
  }
  
  $scope.make_public = function(){
    $scope.quiz_bank.public = true
    QuizBank.update($scope.quiz_bank.id,$scope.quiz_bank)
  }
  $scope.make_private = function(){
    $scope.quiz_bank.public = false
    QuizBank.update($scope.quiz_bank.id,$scope.quiz_bank)
  }
  $scope.share = function(){
    var email_objects = $scope.tags
    $scope.tags = []
    angular.forEach(email_objects,function(value,key){
      QuizBank.share_with_list($scope.quiz_bank.id,value.text).$promise.then(function(data){
        $scope.quiz_bank.shares.push.apply($scope.quiz_bank.shares,data)
        $scope.quiz_bank.shared = true
      })
    })
  }

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
  $scope.grade_answer = function(answer){
    answer.graded_by_teacher = answer.student_score
    answer.is_correct = true
    Answer.update(answer.id,answer).$promise.then(function(){
      index = $scope.answers_to_grade.indexOf(answer)
      $scope.answers_to_grade.splice(index,1)
    })
  }
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


quizlib.controller('NewServeQuizCtrl', ['$scope','QuizBank','ServedQuiz','ClonedQuizBank','ClonedQuestion','ClonedQuestionOption','Group','User','Sharing','QuestionOption','$routeParams','$location','Message',function($scope,QuizBank,ServedQuiz,ClonedQuizBank,ClonedQuestion,ClonedQuestionOption,Group,User,Sharing,QuestionOption,$routeParams,$location,Message){
  
  $.removeCookie("my_assessments")
  $.removeCookie("shared_assessments")
  $.removeCookie("starred_assessments")
  $.removeCookie("main_repo")
  
  //$scope.show_question_list = true
  $scope.selected_questions = []
  //$scope.show_options = true
  $scope.show_advanced_options = false
  $scope.customize_questions= false
  $scope.group_students = []
  $scope.students_to_left = []
  $scope.students_to_right = []
  $scope.selected_students = []
  $scope.option_submitted = false
  $scope.quiz = {date: null, close_date: null}
  $scope.selects = {selected_group: null, selected_quiz: null}
  $scope.toggle_display = {show_question_list: true, show_options: true}
  $scope.currentStep = 1000
  $scope.served_quiz = {random:2, number_of_attempts: 1, basic_scoring: true, default_score: 1 ,date: new Date(), close_date: (7).day().fromNow()}  // to make the angular js work weird

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
      $scope.quiz_bank_questions = QuizBank.questions($scope.selects.selected_quiz.id).$promise.then(function(data){
        $scope.quiz_bank_questions = data
        angular.forEach($scope.quiz_bank_questions,function(value,key){
          $scope.selected_questions.push(value)
        })
      })
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

  $scope.select_all_questions = function(){
    angular.forEach($scope.quiz_bank_questions,function(value,key){
      $scope.selected_questions.push(value)
    })
  }
  $scope.AddStudent = function(student){
    index = $scope.group_students.indexOf(student);
    if(index == -1){
      $scope.group_students.push(student);
    }
  }

  $scope.check_date = function(){
    if($scope.served_quiz.date == null){
      $scope.served_quiz.date == Date.now()
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

  $scope.remove_current_student = function(student){
    $scope.group_students.pop(student)
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
    $scope.served_quiz.selected_students = $scope.group_students
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
  $scope.group = {title: null,code:  "",is_protected: false,searchable: false}
  $scope.user = User.get_current_user()
  $scope.currentStep = 1000
  $scope.is_protected = false
  $scope.searchable = true
  $scope.show_error = false
  
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

  $scope.make_protected = function(){
    if($scope.is_protected == false)
    {
      $scope.is_protected = true
    }
    else{
      $scope.is_protected = false
    }
  }
  // $scope.searchable = function(){
  //   if($scope.searchable == false)
  //   {
  //     $scope.searchable = true
  //   }
  //   else{
  //     $scope.searchable = false
  //   }
  // }
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
    $scope.group.is_protected = $scope.is_protected
    if ($scope.is_protected == true && $scope.group.code == undefined)
    {
      $scope.show_error = true
    }
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
quizlib.controller('ShowQuizBankCtrl', ['$window','$scope','$routeParams','QuizBank','Repository','User','QuestionTopic','Topic','Section','FavouriteQuiz','Message', function($window,$scope,$routeParams, QuizBank, Repository, User,QuestionTopic,Topic,Section,FavouriteQuiz,Message) {
  $scope.my_assessments = Repository.all()
  $scope.shared_quiz_banks = QuizBank.shared_quiz_banks()
  $scope.quiz_bank_id = $routeParams.id
  $scope.tags = []
  $scope.starred_quiz_banks = []
  $scope.assesment_have_values = false
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
    console.log("atlast i am in the controller")
    var deleteUser = $window.confirm('Are you absolutely sure you want to delete?'); 
    if (deleteUser){
    QuizBank.delete($scope.quiz_bank_id)
    }
  } 
}]);

quizlib.controller("Navigation",['$scope','Repository','QuizBank',function($scope,Repository,QuizBank){
  
  $scope.deleteRepo = function(repo){
    Repository.delete(repo.id)
    index = $scope.my_assessments.indexOf(repo);
    $scope.my_assessments.splice(index,1)  
  }

  $scope.my_assessments = Repository.all()

  Repository.default_repo().$promise.then(function(data){
    $scope.main_repo_quizzes = QuizBank.repo_quiz_banks(data.result.id)
  })
  $scope.handleDrop = function(quizId,repoId) {
    QuizBank.get(quizId).$promise.then(function(data){
      quiz_bank = data
      quiz_bank.repository_id = repoId
      QuizBank.update(quizId,quiz_bank)
    })
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

  // $scope.my_assessments = Repository.all()

  // Repository.default_repo().$promise.then(function(data){
  //   $scope.main_repo_quizzes = QuizBank.repo_quiz_banks(data.result.id)
  // })

  $scope.no_starred_cookie = function(){
    if($.cookie("starred_assessments") == undefined){
      return true;}
    else{return false;}
  }
  $scope.assesment_have_values = $scope.my_assessments
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

  $scope.no_all_assessments_cookie = function(){
    if($.cookie("all_assessments") == undefined){return true}
    else{return false}
  }


  $scope.update_status = function(state){
    if(state == "my_assessments"){
      if($.cookie("my_assessments") == undefined){
        $.cookie("my_assessments", "my_assessments");
        $.removeCookie("all_assessments");
        $.removeCookie("shared_assessments");
        $.removeCookie("starred_assessments");
      }
      else{
        $.removeCookie("my_assessments");
      }
      
    }
    if(state == "all_assessments"){
      if($.cookie("all_assessments") == undefined){
        $.cookie("all_assessments","all_assessments")
        $.removeCookie("my_assessments");
        $.removeCookie("shared_assessments");
        $.removeCookie("starred_assessments");
      }
      else{
        $.removeCookie("all_assessments");
      }
    }
    if(state == "shared_assessments"){
      if($.cookie("shared_assessments") == undefined){
        $.cookie("shared_assessments","shared_assessments")
        $.removeCookie("my_assessments");
        $.removeCookie("all_assessments");
        $.removeCookie("starred_assessments");
      }
      else{
        $.removeCookie("shared_assessments");
      }
    }
    if(state == "starred_assessments"){
      if($.cookie("starred_assessments") == undefined){
        $.cookie("starred_assessments","starred_assessments")
        $.removeCookie("all_assessments");
        $.removeCookie("shared_assessments");
        $.removeCookie("my_assessments");
      }
      else{
        $.removeCookie("starred_assessments");
      }
    }  
  }

}]);

quizlib.controller("ManageStarredCtrl",['$scope','QuizBank','Repository','User','QuestionTopic','Topic','FavouriteQuiz','Message',function($scope, QuizBank, Repository, User,QuestionTopic,Topic,FavouriteQuiz,Message){

  $scope.quiz_banks = [] 
  $scope.show_new_repo_div = false
  $scope.starred_quiz_banks = []
  $scope.repository = {title: null}
  $scope.my_assessments = []
  
  

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

  

  // $scope.shared_quiz_banks = QuizBank.shared_quiz_banks()
  // $scope.current_user = User.get_current_user()
  // $scope.quiz_banks = QuizBank.quiz_banks_list()
  $scope.starred_quiz_banks = FavouriteQuiz.all()
  
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
  $scope.deleteQuiz = function(quiz){
    index = $scope.quiz_banks.indexOf(quiz);
    $scope.quiz_banks.splice(index,1)
    QuizBank.delete(quiz.id)
  }
}]); 

quizlib.controller("ManageSharedCtrl",['$scope','QuizBank','Repository','User','QuestionTopic','Topic','FavouriteQuiz','Message',function($scope, QuizBank, Repository, User,QuestionTopic,Topic,FavouriteQuiz,Message){

  $scope.quiz_banks = [] 
  $scope.show_new_repo_div = false
  $scope.starred_quiz_banks = []
  $scope.repository = {title: null}
  $scope.my_assessments = []
  
  

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

  

  $scope.shared_quiz_banks = QuizBank.shared_quiz_banks()
  // $scope.quiz_banks = QuizBank.quiz_banks_list()
  // $scope.current_user = User.get_current_user()
  // $scope.starred_quiz_banks = FavouriteQuiz.all()

  
  
  
  $scope.make_favourite = function(quiz_bank){
    FavouriteQuiz.save({quiz_bank_id: quiz_bank.id})
    quiz_bank.is_favourite = true
    // $scope.starred_quiz_banks.push(quiz_bank)
  }
  $scope.make_unfavourite = function(quiz_bank){
    FavouriteQuiz.delete(quiz_bank.id)
    quiz_bank.is_favourite = false
    index = $scope.starred_quiz_banks.indexOf(quiz_bank);
    // $scope.starred_quiz_banks.splice(index,1)
  }
  $scope.deleteQuiz = function(quiz){
    index = $scope.quiz_banks.indexOf(quiz);
    $scope.quiz_banks.splice(index,1)
    QuizBank.delete(quiz.id)
  }
}]); 

quizlib.controller("ManageCtrl",['$scope','QuizBank','Repository','User','QuestionTopic','Topic','FavouriteQuiz','Message',function($scope, QuizBank, Repository, User,QuestionTopic,Topic,FavouriteQuiz,Message){

  $scope.quiz_banks = [] 
  $scope.show_new_repo_div = false
  $scope.starred_quiz_banks = []
  $scope.repository = {title: null}
  $scope.my_assessments = []
  
  // $scope.titleFilter = undefined

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

  
  // $scope.current_user = User.get_current_user()
  $scope.quiz_banks = QuizBank.quiz_banks_list()
  // $scope.shared_quiz_banks = QuizBank.shared_quiz_banks()
  // $scope.starred_quiz_banks = FavouriteQuiz.all()
  
  $scope.make_favourite = function(quiz_bank){
    FavouriteQuiz.save({quiz_bank_id: quiz_bank.id})
    quiz_bank.is_favourite = true
    // $scope.starred_quiz_banks.push(quiz_bank)
  }
  $scope.make_unfavourite = function(quiz_bank){
    FavouriteQuiz.delete(quiz_bank.id)
    quiz_bank.is_favourite = false
    index = $scope.starred_quiz_banks.indexOf(quiz_bank);
    // $scope.starred_quiz_banks.splice(index,1)
  }
  $scope.deleteQuiz = function(quiz){
    index = $scope.quiz_banks.indexOf(quiz);
    $scope.quiz_banks.splice(index,1)
    QuizBank.delete(quiz.id)
  }
}]);

quizlib.controller("ManageMyCtrl",['$scope','QuizBank','Repository','User','QuestionTopic','Topic','FavouriteQuiz','Message',function($scope, QuizBank, Repository, User,QuestionTopic,Topic,FavouriteQuiz,Message){

  $scope.quiz_banks = [] 
  $scope.show_new_repo_div = false
  $scope.starred_quiz_banks = []
  $scope.repository = {title: null}
  $scope.my_assessments = []
  
  

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

  

  // $scope.shared_quiz_banks = QuizBank.shared_quiz_banks()
  $scope.my_quiz_banks = User.quiz_banks()
  // $scope.quiz_banks = QuizBank.quiz_banks_list()
  // $scope.current_user = User.get_current_user()
  // $scope.starred_quiz_banks = FavouriteQuiz.all()

  
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
  $scope.deleteQuiz = function(quiz){
    index = $scope.quiz_banks.indexOf(quiz);
    $scope.quiz_banks.splice(index,1)
    QuizBank.delete(quiz.id)
  }
}]);

quizlib.controller("viewQuestionsCtrl",['$scope','Question','GlobalScope','QuestionOption',function($scope, Question,GlobalScope,QuestionOption){
  
  is_true_false = true
  is_mcq = true
  is_open_ended = true
  is_fill_in_the_blank = true

  $scope.questions = Question.all($scope.quiz_bank_id,$scope.section_id)
  $scope.clone_question = function(quiz_id,section_id,question)
  {


    Question.save(quiz_id, section_id,
      {description: question.description,section_id: question.section_id,
      question_type: question.question_type,difficulty_level: question.difficulty_level,default_score: question.default_score,question_options: question.question_options}).$promise.then(function(data){
        $scope.questions.push(data)
            
      })
    
  }
    $scope.mcq_options = ["", "","",""]

    $scope.change_current_question = function(selected_type,question){
    if(selected_type == "True False"){
      is_true_false = false
      is_mcq = true
      is_open_ended = true
      is_fill_in_the_blank = true
    }
    else if(selected_type == "Multiple Choice"){
      is_true_false = true
      is_mcq = false
      is_open_ended = true
      is_fill_in_the_blank = true
    }
     else if(selected_type == "Open Ended"){
      is_true_false = true
      is_mcq = true
      is_open_ended = false
      is_fill_in_the_blank = true
    }

    else if(selected_type == "Fill in blank"){
     is_true_false = true
      is_mcq =true
      is_open_ended = true
      is_fill_in_the_blank = false
    }
  }

 
    $scope.change_question = function(selected_type,question){
    if(selected_type == "True False"){
      question.question_type = 1
    }
    else if(selected_type == "Multiple Choice"){
      question.question_type = 2
    }
     else if(selected_type == "Open Ended"){
      question.question_type = 3
    }

    else if(selected_type == "Fill in blank"){
      question.question_type = 4
    }
  }


  
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
  console.log($scope)
}])



quizlib.controller("sectionCtrl",['$scope','$rootScope','Section','Question',function($scope,$rootScope,Section,Question){
  
  $scope.show_title = true
  $scope.deleteSection = function(id,idx){
    console.log("dleting section")
    $scope.sections.count = $scope.sections.count  - 1
    $scope.quiz_sections.splice(idx, 1);
    Section.delete($scope.quiz_bank_id,id);
  }
  $scope.editSection = function(section){
     $rootScope.section_edit = section;
  }
  $scope.cancelEditSection = function(section){
    $rootScope.section_edit = null
  }

  $scope.$on("last_section_changed",function(event,section){
    $scope.last_section = section;
  })

  $scope.updateSection = function(section_edit){
    update_section = Section.update($scope.quiz_bank_id,section_edit.id,section_edit)
    $rootScope.section_edit = null
    $scope.show_title = true
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
    $rootScope.selected_type = question_type
    console.log($scope.selected_type)
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
    $rootScope.selected_type = null
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
    $scope.quiz_sections = data.sections
    $scope.last_section = data.sections[data.sections.length - 1]
    
    $scope.tags = [];

    $scope.loadtags = function(query) {
      return Topic.search(query).$promise
    };

    $scope.$on("question_created",function(event){
      Section.all($scope.quiz_bank_id).$promise.then(function(){
        $scope.quiz_sections = data
        $scope.last_section = $scope.quiz_sections[$scope.quiz_sections.length - 1] 
        $scope.$broadcast("last_section_changed",$scope.last_section)
      })
    })

    // $scope.$on("question_changed",function(event){
    //   Section.all($scope.quiz_bank_id).$promise.then(function(){
    //     $scope.quiz_sections = data
    //     $scope.last_section = $scope.quiz_sections[$scope.quiz_sections.length - 1]
    //     $scope.$broadcast("last_section_changed",$scope.last_section)
    //   })
    // })
    
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
      // $scope.quiz_bank.rubricks = true
      QuizBank.update($scope.quiz_bank_id, $scope.quiz_bank).$promise.then(function(data){
        QuestionTopic.destroy_all($scope.quiz_bank_id).$promise.then(function(){
          angular.forEach($scope.tags, function(value, key){
            QuestionTopic.save($scope.quiz_bank_id,{title: value.text})
          })
          Message.push_message({type: "success",msg: "You have successfully cloned quiz bank",controller: "ManageCtrl"})
          $location.path("/manage_quiz_banks")
        })
      })
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
    $scope.sections.count = $scope.sections.count  + 1
    $scope.section_submitted = true
    if(isValid){
      section = Section.save($scope.quiz_bank_id,{title: $scope.newSection.title})
      Section.all($scope.quiz_bank_id).$promise.then(function(data){
        $scope.quiz_sections = data
        $scope.last_section = data[data.length - 1]
         $scope.$broadcast("last_section_changed",$scope.last_section) 
      });
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

quizlib.controller("NewQuizBankCtrl",['$scope','$location','QuizBank','Repository','Section','GlobalScope','Topic','QuestionTopic','User','Message',function($scope, $location,QuizBank, Repository,Section, GlobalScope,Topic,QuestionTopic,User,Message){
  // Variables for view show hide

  $.removeCookie("my_assessments")
  $.removeCookie("shared_assessments")
  $.removeCookie("starred_assessments")
  $.removeCookie("main_repo")
  $scope.advanced_quiz = false
  $scope.sections = {}
  $scope.sections.count = 0
  // $scope.quiz_bank.have_sections = true
  $scope.question_types = ["True False","Multiple Choice","Fill in blank","Open Ended"]
  $scope.submitted = false
  $scope.section_submitted = false
  $scope.show_new_section = false
  $scope.quiz_bank = {}
  $scope.last_section = null
  $scope.tags = [];


  $scope.advanced_quiz_type = function(){

  }

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
  console.log("asdasdasdasdasdasdasd")
  Repository.default_repo().$promise.then(function(data){ 
    $scope.repository_id = data.result.id
  }).then(function(){
    QuizBank.save({title: "My Quiz Bank", repository_id: $scope.repository_id}).
    $promise.then(
      function(data){
        $scope.quiz_bank_id = data.id;
        GlobalScope.set_quiz_bank_id($scope.quiz_bank_id)
        $scope.quiz_bank = data
        $scope.quiz_sections = data.sections
        $scope.last_section = data.sections[data.sections.length -1]
        $scope.$broadcast("last_section_changed",$scope.last_section) 
      }) 
  });


  $scope.$on("question_created",function(event){
    Section.all($scope.quiz_bank_id).$promise.then(function(data){
      $scope.quiz_sections = data
      $scope.last_section = $scope.quiz_sections[$scope.quiz_sections.length - 1]
      $scope.$broadcast("last_section_changed",$scope.last_section);
    })
  })
  
  // $scope.$on("question_changed",function(event){
  //   Section.all($scope.quiz_bank_id).$promise.then(function(data){
  //     $scope.quiz_sections = data
  //     $scope.last_section = $scope.quiz_sections[$scope.quiz_sections.length - 1]
  //     $scope.$broadcast("last_section_changed",$scope.last_section)
  //   })
  // })

  $scope.$on("last_section_changed",function(event,section){
    $scope.last_section = section;
  })

  $scope.simple_quiz = function(){
     $scope.quiz_bank.have_sections = false
    $scope.quiz_bank.have_explanations = false
    $scope.quiz_bank.have_rubricks = false
    $scope.quiz_bank.have_difficulty_levels = false
    $scope.quiz_bank.have_custom_scoring = false
    $scope.is_advanced_quiz = false
  }
 
$scope.advanced_quiz = function(){
   $scope.quiz_bank.have_sections = true   
  $scope.quiz_bank.have_explanations = true
  $scope.quiz_bank.have_rubricks = true
  $scope.quiz_bank.have_difficulty_levels = true
  $scope.quiz_bank.have_custom_scoring = true
  $scope.is_advanced_quiz = true
}
  $scope.saveQuiz = function(isValid){
    $scope.submitted =true
    if(isValid){
      $scope.quiz_bank.status = 1
      // $scope.quiz_bank.have_sections  = $scope.sec
      // $scope.quiz_bank.have_explanations = $scope.explanation
      // $scope.quiz_bank.have_rubricks = $scope.rubric
      // $scope.quiz_bank.have_difficulty_levels = $scope.difficulty
      // $scope.quiz_bank.have_custom_scoring = $scope.scoring
      console.log($scope.quiz_bank)
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
    $scope.sections.count  = $scope.sections.count  + 1
    $scope.section_submitted = true
    if(isValid){
      section = Section.save($scope.quiz_bank_id,{title: $scope.newSection.title})
      Section.all($scope.quiz_bank_id).$promise.then(function(data){
        $scope.quiz_sections = data
        $scope.last_section = data[data.length -1]
         $scope.$broadcast("last_section_changed",$scope.last_section) 
      })
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
