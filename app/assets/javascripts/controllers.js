quizlib.controller('GradeListQuizCtrl', ['$scope','$modal','$log','ServedQuiz','ClonedQuizBank','QuizBank','Sharing',function($scope,$modal,$log,ServedQuiz,ClonedQuizBank,QuizBank,Sharing){

}]);
quizlib.controller('ServeQuizCtrl', ['$scope','$modal','$log','ServedQuiz','ClonedQuizBank','QuizBank','Sharing',function($scope,$modal,$log,ServedQuiz,ClonedQuizBank,QuizBank,Sharing){
  $scope.served_quizzes = []
  $scope.pending_sharings = []
  $scope.completed_sharings = []
  ServedQuiz.all().$promise.then(function(data){
    angular.forEach(data.result,function(value,key){
      QuizBank.get(value.quiz_bank_id).$promise.then(function(data){
        title = data.title
        
        var obj = new Date(value.date)
        start_date = obj.getDate() +"/" + (obj.getMonth()+1) +"/"+obj.getFullYear()
        
        var obj = new Date(value.close_date)
        close_date = obj.getDate() +"/" + (obj.getMonth()+1) +"/"+obj.getFullYear()
        
        var obj = new Date(value.start_time)
        start_time = obj.getHours() + ":" + obj.getMinutes()
        
        var obj = new Date(value.end_time)
        end_time = obj.getHours() + ":" + obj.getMinutes()        

        status = "Not Served Yet"
        var obj = new Date()
        today = obj.getDate() +"/" + (obj.getMonth()+1) +"/"+obj.getFullYear()
        if(new Date(start_date) < new Date(today)){
          status = "In Process"
        }
        if(new Date(close_date) < new Date(today)){
          status = "Serving Completed"
        }
       $scope.served_quizzes.push({title: title,start_date: start_date,start_time: start_time, 
            close_date: close_date, end_time: end_time, status: status,pend: ServedQuiz.pending(value.id),
            comp:ServedQuiz.completed(value.id)})
        ServedQuiz.pending(value.id).$promise.then(function(data){
          $scope.pending_sharings.push(data)
        })
        $scope.completed_sharings.push(ServedQuiz.completed(value.id))
        
      })
    })
  })
  
  $scope.open = function (index) {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ServeQuizCtrl',
      resolve: {
        sharings: function(){
          return $scope.pending_sharings[index]
        }
      }
    });
    
  }
}]);
quizlib.controller('PreviewQuizCtrl', ['$scope','$routeParams','$timeout','QuizBank','Question','QuestionOption',function($scope,$routeParams,$timeout,QuizBank,Question,QuestionOption){
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
        $scope.minutes = $scope.option.duration
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
        if(question.question_options[0].is_correct == question.answer){
          answer.correct = true
        }
        else{
          answer.correct = false
        }
        $scope.show_answers.push(answer)
      }
      if(question.question_type == 2){
        angular.forEach(question.question_options,function(value,key){
          if(question.answer == value.id){
            if(value.is_correct == true){
              answer = {correct: true,answer: value.answer}
            }
            if(value.is_correct == false){
              answer = {correct: false,answer: value.answer}
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
          answer.correct = true
        }else{
          answer.correct = false
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
    for(var i = $scope.question_done; i < $scope.questions.length; i++){
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
        if(question.question_options[0].is_correct == question.answer){
          answer.correct = true
        }
        else{
          answer.correct = false
        }
        $scope.show_answers.push(answer)
      }
      if(question.question_type == 2){
        angular.forEach(question.question_options,function(value,key){
          if(question.answer == value.id){
            if(value.is_correct == true){
              answer = {correct: true,answer: value.answer}
            }
            if(value.is_correct == false){
              answer = {correct: false,answer: value.answer}
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
          answer.correct = true
        }else{
          answer.correct = false
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
quizlib.controller('NewServeQuizCtrl', ['$scope','QuizBank','ServedQuiz','ClonedQuizBank','ClonedQuestion','Group','User','Sharing',function($scope,QuizBank,ServedQuiz,ClonedQuizBank,ClonedQuestion,Group,User,Sharing){
  
  $scope.show_question_list = true
  $scope.selected_questions = []
  $scope.show_options = true
  $scope.group_students = []
  $scope.students_to_left = []
  $scope.students_to_right = []
  $scope.selected_students = []
  
  QuizBank.all().$promise.then(function(data){
    $scope.quiz_banks = data.result
  })
  
  $scope.groups = Group.all()
  $scope.system_students = User.system_students()
  
  $scope.$watch('selected_quiz', function() {
    if($scope.selected_quiz != undefined){
      $scope.quiz_bank_questions = QuizBank.questions($scope.selected_quiz.id)
      $scope.quiz_bank = QuizBank.get($scope.selected_quiz.id)
    }
  });

  $scope.$watch('selected_group',function(){
    if($scope.selected_group != undefined){
      $scope.group_students = Group.students($scope.selected_group.id)
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
      $scope.selected_students.push(value)
      index = $scope.group_students.indexOf(value)
      $scope.group_students.splice(index,1)
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

  $scope.serveTheQuiz = function(){
    ClonedQuizBank.create_the_clone($scope.selected_quiz.id).$promise.then(function(data){
      cloned_quiz_bank_id = data.id
      
      if($scope.served_quiz.random == 0){
        angular.forEach($scope.selected_questions,function(value,key){
          ClonedQuestion.save($scope.selected_quiz.id,data.id,{seq: value.seq, 
              description: value.description, question_type: value.question_type,
              difficulty_level: value.difficulty_level, cloned_quiz_bank_id: cloned_quiz_bank_id})
        })
      }
      if($scope.served_quiz.random == 1){

      }
      $scope.served_quiz.cloned_quiz_bank_id = cloned_quiz_bank_id
      $scope.served_quiz.quiz_bank_id = $scope.selected_quiz.id
      ServedQuiz.save($scope.served_quiz).$promise.then(function(data){
        angular.forEach($scope.selected_students,function(value,key){
          Sharing.save(data.id,{user_id: value.id})
        })
      })
    })
  }

}]);

quizlib.controller('GroupListCtrl', ['$scope','User','Group','StudentGroup',function($scope,User,Group,StudentGroup){
  $scope.groups = []
  $scope.students = User.get_students()
  Group.all().$promise.then(function(data){
    angular.forEach(data,function(value,key){
      var obj = new Date(value.updated_at)
      last_updated = obj.getDate() +"-" + (obj.getMonth() + 1) +"-"+obj.getFullYear()
      Group.get_student_groups(value.id).$promise.then(function(data){
        $scope.groups.push({id: value.id, title: value.title, count: data.length,last_updated:last_updated})
      })
      
    })
  })
  $scope.removeGroup = function(group,idx){
    Group.delete(group.id)
    $scope.groups.splice(idx,1)
  }
  $scope.$watch('sorttitle', function() {
    if($scope.sorttitle == 1){
      $scope.predicate = 'title'
      $scope.reverse = false
    }
    if($scope.sorttitle == 2){
      $scope.predicate = 'title'
      $scope.reverse = true
    }
  });
  $scope.$watch('sortmodified', function() {
    if($scope.sortmodified == 1){
      $scope.predicate = 'last_updated'
      $scope.reverse = false
    }
    if($scope.sortmodified == 2){
      $scope.predicate = 'last_updated'
      $scope.reverse = true
    }
  });

}]);
quizlib.controller('AddGroupCtrl', ['$scope','User','Group','StudentGroup',function($scope,User,Group,StudentGroup){
  
  $scope.students = User.get_students()
  $scope.selected_students = []
  $scope.system_students = User.system_students()

  $scope.AddStudent = function(student){
    $scope.students.push(student)
  }
  $scope.saveGroup = function(){
    Group.save($scope.group).$promise.then(function(data){
      angular.forEach($scope.selected_students,function(value,key){
        StudentGroup.save({student_id: value.id,group_id: data.id})
      })
    })
  }
  $scope.selected_student = function(student){
    index = $scope.selected_students.indexOf(student);
    if(index == -1){
      $scope.selected_students.push(student)
    }
    else{
      $scope.selected_students.splice(index,1)
    }
  }
}]);
quizlib.controller('EditGroupCtrl', ['$scope','$routeParams','User','Group','StudentGroup',function($scope,$routeParams,User,Group,StudentGroup){
  
  $scope.students = []
  $scope.selected_students = []
  $scope.group = Group.get($routeParams.id)
  Group.get_student_groups($routeParams.id).$promise.then(function(data){
    $scope.student_groups = data
    angular.forEach(data,function(value,key){
      User.get(value.student_id).$promise.then(function(data){
        $scope.students.push(data)
      })
    })
  })
  
  $scope.system_students = User.system_students()

  $scope.AddStudent = function(student){
    $scope.students.push(student)
  }
  $scope.saveGroup = function(){
    Group.update($scope.group.id,$scope.group).$promise.then(function(data){
      angular.forEach($scope.student_groups,function(value,key){
        StudentGroup.delete(value.id)
      })
      angular.forEach($scope.selected_students,function(value,key){
        StudentGroup.save({student_id: value.id,group_id: $scope.group.id})
      })
    })
  }
  $scope.selected_student = function(student){
    index = $scope.selected_students.indexOf(student);
    if(index == -1){
      $scope.selected_students.push(student)
    }
    else{
      $scope.selected_students.splice(index,1)
    }
  }
}]);
quizlib.controller('ShowQuizBankCtrl', ['$scope','$routeParams','QuizBank','Repository','User','QuestionTopic','Topic','Section', function($scope,$routeParams, QuizBank, Repository, User,QuestionTopic,Topic,Section) {
  $scope.my_assessments = Repository.all()
  $scope.shared_quiz_banks = QuizBank.shared_quiz_banks()
  $scope.quiz_bank = QuizBank.get($routeParams.id)
  $scope.quiz_bank_id = $routeParams.id
  $scope.tags = []
  $scope.is_quiz_view = true
  QuizBank.get($routeParams.id).$promise.then(function(data){
    var obj = new Date(data.created_at)
    var obj2 = new Date(data.updated_at)
    $scope.created_at = obj.getDate() +"-" + obj.getMonth() +"-"+obj.getFullYear()
    $scope.updated_at = obj2.getDate() +"-" + obj2.getMonth() +"-"+obj2.getFullYear()
    $scope.quiz_sections = Section.all(data.id)
    Repository.get(data.repository_id).$promise.then(function(data){
        User.get(data.user_id).$promise.then(function(data){
          $scope.owner_name = data.first_name + " " + data.last_name 
        })
    })    
  })


  QuestionTopic.all($routeParams.id).$promise.then(function(data){
    angular.forEach(data.result,function(value,key){
      Topic.get(value.topic_id).$promise.then(function(data){
        $scope.tags.push(data.title)
      })
    })
  })

  $scope.deleteQuiz = function(){
    QuizBank.delete($scope.quiz_bank_id)
  }
}]);


quizlib.controller("ManageCtrl",['$scope','QuizBank','Repository','User','QuestionTopic','Topic','FavouriteQuiz',function($scope, QuizBank, Repository, User,QuestionTopic,Topic,FavouriteQuiz){
  $scope.quiz_banks = [] 
  $scope.show_new_repo_div = false
  $scope.starred_quiz_banks = []

  $scope.my_assessments = []

  Repository.all().$promise.then(function(data){
    $scope.my_assessments = data
    angular.forEach(data,function(value,key){
      value.quiz_banks = QuizBank.repo_quiz_banks(value.id)
    })
    
  })

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


  
  QuizBank.all().$promise.then(function(data){
    angular.forEach(data.result, function(value, key){
      var tags = []
      var is_favourite = false
      FavouriteQuiz.is_favourite(value.id).$promise.then(function(data){
        is_favourite = data.result
      })
      QuestionTopic.all(value.id).$promise.then(function(data){
        angular.forEach(data.result,function(value,key){
          tags.push(Topic.get(value.topic_id))
        })
      })
      Repository.get(value.repository_id).$promise.then(function(data){
        User.get(data.user_id).$promise.then(function(data){
          name = data.first_name +" " + data.last_name
          $scope.quiz_banks.push({title: value.title,id:value.id, name: name, public: value.public, tag: tags[0],is_favourite: is_favourite})
        })
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

}])

quizlib.controller("viewQuestionCtrl",['$scope','QuestionOption','Question','GlobalScope',function($scope,QuestionOption,Question,GlobalScope){
  
  $scope.show_details = false

  $scope.show_details_edit = false
  
  $scope.show_options = function(section_id,question_id,question_type){
    $scope.show_details = true
    $scope.show_details_view = true
    if(question_type == 1){
      QuestionOption.all($scope.quiz_bank_id,section_id,question_id).$promise.
      then(function(data){angular.forEach(data,function(value,key){
      $scope.question_option = value
      })})

    }
    if(question_type == 2){
      $scope.question_options = QuestionOption.all($scope.quiz_bank_id,section_id,question_id)
    }
    if(question_type == 3 || question_type == 4){
      QuestionOption.all($scope.quiz_bank_id,section_id,question_id).$promise.
      then(function(data){angular.forEach(data,function(value,key){
      $scope.question_option = value})})
    }
  }

  $scope.show_edit = function(){$scope.show_details_view = false}
  $scope.show_blank_edit = function(question){
    $scope.show_details_view = false
    statements = question.description.split("_")
    $scope.first_statement = statements[0]
    $scope.second_statement = statements[statements.length - 1]

  }
  $scope.hide_update = function(){$scope.show_details_view = true}
  $scope.edit_question = function(section_id,question_id,question){
    Question.update($scope.quiz_bank_id,section_id,question_id,question).$promise.then(
      function(data){
        QuestionOption.update($scope.quiz_bank_id,section_id,question_id,$scope.question_option.id,$scope.question_option)
      })
    $scope.show_details_view = true
  }
  $scope.edit_blank = function(section_id,question_id,question){
    question.description  = $scope.first_statement + "______" + $scope.second_statement
    Question.update($scope.quiz_bank_id,section_id,question_id,question).$promise.then(
      function(data){
        QuestionOption.update($scope.quiz_bank_id,section_id,question_id,$scope.question_option.id,$scope.question_option)
      })
    $scope.show_details_view = true

  }
  $scope.edit_mcq = function(section_id,question_id,question,question_options){
    Question.update($scope.quiz_bank_id,section_id,question_id,question)
    angular.forEach(question_options,function(value,key){
      QuestionOption.update($scope.quiz_bank_id,section_id,question_id,value.id,value)
    })
    $scope.show_details_view = true
  }
  $scope.delete_question = function(section_id,question_id,idx){
    Question.delete($scope.quiz_bank_id,section_id,question_id)
    $scope.questions.splice(idx, 1);
    $scope.show_details = false
  }
}])



quizlib.controller("newQuestionCtrl",['$scope','Question','GlobalScope','QuestionOption',function($scope, Question, GlobalScope,QuestionOption){
  
  $scope.$on('quiz_bank_id_Changed', function(event, quiz_bank_id) {
    $scope.quiz_bank_id = quiz_bank_id;
  });

  $scope.$on("section_id_Changed",function(event,section_id){
    $scope.section_id = section_id;
  })
  $scope.create_true_false = function(){
    Question.save($scope.quiz_bank_id, $scope.section_id,
      {description: $scope.true_false_question_statement,section_id: $scope.section_id,
      question_type: 1,difficult_level: 1}).$promise.then(function(data){
        $scope.question_id  = data.id
        GlobalScope.set_question_id($scope.question_id)
        QuestionOption.save($scope.quiz_bank_id, $scope.section_id,$scope.question_id,
        {question_id: $scope.question_id, is_correct:$scope.selected_true_false_option}).$promise.then(function(){
          $scope.true_false_question_statement = {}
          $scope.selected_true_false_option = {}
        })
      })
       
  }
  $scope.create_open_ended = function(){
    Question.save($scope.quiz_bank_id, $scope.section_id,
      {description: $scope.open_ended_statement,section_id: $scope.section_id,
      question_type: 3,difficult_level: 1}).$promise.then(function(data){
        $scope.question_id  = data.id
        GlobalScope.set_question_id($scope.question_id)
        QuestionOption.save($scope.quiz_bank_id, $scope.section_id,$scope.question_id,
        {question_id: $scope.question_id, answer:$scope.open_ended_answer}).$promise.then(function(){
          $scope.open_ended_statement = {}
          $scope.open_ended_answer = {}
        })
      })
  }
  $scope.create_blank = function(){
    $scope.blank_statement = $scope.first_statement +"_______"+$scope.second_statement
    Question.save($scope.quiz_bank_id, $scope.section_id,
      {description: $scope.blank_statement,section_id: $scope.section_id,
      question_type: 4,difficult_level: 1}).$promise.then(function(data){
        $scope.question_id  = data.id
        GlobalScope.set_question_id($scope.question_id)
        QuestionOption.save($scope.quiz_bank_id, $scope.section_id,$scope.question_id,
        {question_id: $scope.question_id, answer:$scope.blank}).$promise.then(function(){
          $scope.first_statement = {}
          $scope.second_statement = {}
          $scope.blank = {}
        })
      })
  }

  $scope.create_mcq = function(){
    Question.save($scope.quiz_bank_id, $scope.section_id,
      {description: $scope.question.description,section_id: $scope.section_id,
      question_type: 2,difficult_level: 1}).$promise.then(function(data){
        $scope.question_id = data.id
        GlobalScope.set_question_id($scope.question_id)
        inputs = [$scope.input_0,$scope.input_1,$scope.input_2,$scope.input_3]
        for(var i = 0; i<4; i++){
          is_correct = true
          if($scope.radio == i){
            is_correct = true
          }
          else{
            is_correct = false
          }
          QuestionOption.save($scope.quiz_bank_id, $scope.section_id,$scope.question_id,
          {question_id: $scope.question_id, answer:inputs[i],is_correct: is_correct})
        }

      })

  }

}])

quizlib.controller("sectionCtrl",['$scope','Section',function($scope,Section){
  
  $scope.deleteSection = function(id,idx){
    $scope.quiz_sections.splice(idx, 1);
    Section.delete($scope.quiz_bank_id,id);
  }
  $scope.editSection = function(section){
     $scope.section_edit = section;
  }
  $scope.cancelEditSection = function(section){
    $scope.section_edit = null
  }
  $scope.updateSection = function(section_edit){
    updated_section = Section.update($scope.quiz_bank_id, section_edit.id, section_edit)
    $scope.section_edit = null
  }
  $scope.show_true_false = false
  $scope.show_mcq = false
  $scope.show_blank = false
  $scope.show_open_ended = false
  $scope.addNewQuestion = function(question_type){
    if(question_type == "True False"){
      $scope.show_true_false = true
      $scope.show_mcq = false
      $scope.show_blank = false
      $scope.show_open_ended = false
    }
    if(question_type == "Mcq"){
      $scope.show_true_false = false
      $scope.show_mcq = true
      $scope.show_blank = false
      $scope.show_open_ended = false
    }
    if(question_type == "Fill in blank"){
      $scope.show_true_false = false
      $scope.show_mcq = false
      $scope.show_blank = true
      $scope.show_open_ended = false
    }
    if(question_type == "Open Ended"){
      $scope.show_true_false = false
      $scope.show_mcq = false
      $scope.show_blank = false
      $scope.show_open_ended = true
    }
  }
  $scope.hideQuestion = function(){
    $scope.show_true_false = false
    $scope.show_mcq = false
    $scope.show_blank = false
    $scope.show_open_ended = false
  }

}])

quizlib.controller("CloneQuizBankCtrl",['$scope','$routeParams','QuizBank','Repository','Section','GlobalScope','Topic','QuestionTopic',function($scope, $routeParams,QuizBank, Repository,Section, GlobalScope,Topic,QuestionTopic){
  $scope.question_types = ["True False","Mcq","Fill in blank","Open Ended"]
  QuizBank.clone($routeParams.id).$promise.then(function(data){
    $scope.quiz_bank = data
    $scope.quiz_bank_id = data.id
    $scope.quiz_sections = Section.all($scope.quiz_bank_id)
    $scope.tags = Topic.all()
    $scope.show_tags = []
    QuestionTopic.all($scope.quiz_bank_id).$promise.then(function(data){
      angular.forEach(data.result,function(value,key){
        Topic.get(value.topic_id).$promise.then(function(data){
          $scope.show_tags.push(data.title)
        })

      })
    })
  })
  
  $scope.cancelQuiz = function(){
    QuizBank.delete($scope.quiz_bank_id)
  }
  $scope.saveQuiz = function(){
    $scope.quiz_bank.status = 1
    QuizBank.update($scope.quiz_bank_id, $scope.quiz_bank).$promise.then(function(data){
      angular.forEach($scope.show_tags, function(value, key){
        QuestionTopic.save($scope.quiz_bank_id,{title: value})
      })

    })
  }  

  $scope.addSection = function(title){
    section = Section.save($scope.quiz_bank_id,{title: title})
    $scope.quiz_sections = Section.all($scope.quiz_bank_id)
    $scope.newSection = {}
  }

  $scope.addMoreTags = function(){
    if($scope.selected_tag != undefined){
      $scope.show_tags.push($scope.selected_tag)
    }
  }
}])
quizlib.controller("EditQuizBankCtrl",['$scope','$routeParams','QuizBank','Repository','Section','GlobalScope','Topic','QuestionTopic',function($scope, $routeParams,QuizBank, Repository,Section, GlobalScope,Topic,QuestionTopic){

  $scope.quiz_bank_id = $routeParams.id
  $scope.quiz_bank = QuizBank.get($scope.quiz_bank_id)
  $scope.quiz_sections = Section.all($scope.quiz_bank_id)
  $scope.question_types = ["True False","Mcq","Fill in blank","Open Ended"]
  
  
  $scope.ckEditors = [];
  
  $scope.addEditor = function(){
    var rand = ""+(Math.random() * 10000);
    $scope.ckEditors.push({value:rand});
  }
  
  $scope.saveQuiz = function(){
    $scope.quiz_bank.status = 1
    QuizBank.update($scope.quiz_bank_id, $scope.quiz_bank).$promise.then(function(data){
      angular.forEach($scope.show_tags, function(value, key){
        QuestionTopic.save($scope.quiz_bank_id,{title: value})
      })

    })
  }  

  $scope.addSection = function(title){
    section = Section.save($scope.quiz_bank_id,{title: title})
    $scope.quiz_sections = Section.all($scope.quiz_bank_id)
    $scope.newSection = {}
  }
  
  $scope.tags = Topic.all()
  $scope.show_tags = []
  QuestionTopic.all($scope.quiz_bank_id).$promise.then(function(data){
    angular.forEach(data.result,function(value,key){
      Topic.get(value.topic_id).$promise.then(function(data){
        $scope.show_tags.push(data.title)
      })

    })
  })

  $scope.addMoreTags = function(){
    if($scope.selected_tag != undefined){
      $scope.show_tags.push($scope.selected_tag)
    }
  }

}])
quizlib.controller("NewQuizBankCtrl",['$scope','$http','QuizBank','Repository','Section','GlobalScope','Topic','QuestionTopic',function($scope, $http,QuizBank, Repository,Section, GlobalScope,Topic,QuestionTopic){
  // Variables for view show hide


  $scope.question_types = ["True False","Mcq","Fill in blank","Open Ended"]
  $scope.tags = Topic.all()
  $scope.show_tags = []
  $scope.addMoreTags = function(){
    if($scope.selected_tag != undefined){
      $scope.show_tags.push($scope.selected_tag)
    }
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
  
  $scope.saveQuiz = function(){
    $scope.quiz_bank.status = 1
    QuizBank.update($scope.quiz_bank_id, $scope.quiz_bank).$promise.then(function(data){
      angular.forEach($scope.show_tags, function(value, key){
        QuestionTopic.save($scope.quiz_bank_id,{title: value})
      })

    })
  }

  $scope.addSection = function(title){
    section = Section.save($scope.quiz_bank_id,{title: title})
    $scope.quiz_sections = Section.all($scope.quiz_bank_id)
    $scope.newSection = {}
  }
  $scope.difficulties = [{name: "Easy"},{name: "Medium"},{name: "Hard"}]
  $scope.cancelQuiz = function(){
    QuizBank.delete($scope.quiz_bank_id)
  }


}])