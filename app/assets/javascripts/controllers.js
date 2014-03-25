quizlib.controller('ShowQuizBankCtrl', ['$scope','$routeParams','QuizBank','Repository','User','QuestionTopic','Topic','Section', function($scope,$routeParams, QuizBank, Repository, User,QuestionTopic,Topic,Section) {
  $scope.my_assessments = Repository.all()
  $scope.shared_quiz_banks = QuizBank.shared_quiz_banks()
  $scope.quiz_bank = QuizBank.get($routeParams.id)
  $scope.tags = []
  QuizBank.get($routeParams.id).$promise.then(function(data){
    var obj = new Date(data.created_at)
    var obj2 = new Date(data.updated_at)
    $scope.created_at = obj.getDate() +"-" + obj.getMonth() +"-"+obj.getFullYear()
    $scope.updated_at = obj2.getDate() +"-" + obj2.getMonth() +"-"+obj2.getFullYear()
    $scope.quiz_sections = Section.all(data.id)
  })

  QuestionTopic.all($routeParams.id).$promise.then(function(data){
    angular.forEach(data.result,function(value,key){
      Topic.get(value.topic_id).$promise.then(function(data){
        $scope.tags.push(data.title)
      })
    })
  })
}]);



quizlib.controller("ManageCtrl",['$scope','QuizBank','Repository','User','QuestionTopic','Topic',function($scope, QuizBank, Repository, User,QuestionTopic,Topic){
  $scope.quiz_banks = [] 
  $scope.my_assessments = Repository.all()
  $scope.show_new_repo_div = false
  $scope.tags = [] 
  
  $scope.newRepo = function(){
    $scope.show_new_repo_div = true
  }

  $scope.addRepo = function(){
    $scope.show_new_repo_div = false
    console.log($scope.repository)
    Repository.save($scope.repository)
    $scope.my_assessments.push($scope.repository)
  }
  $scope.shared_quiz_banks = QuizBank.shared_quiz_banks()
  
  QuizBank.all().$promise.then(function(data){
    angular.forEach(data.result, function(value, key){
      QuestionTopic.all(value.id).$promise.then(function(data){
        angular.forEach(data.result,function(value,key){
          Topic.get(value.topic_id).$promise.then(function(data){
            $scope.tags.push(data.title)
          })
        })
      })
      Repository.get(value.repository_id).$promise.then(function(data){
        User.get(data.user_id).$promise.then(function(data){
          name = data.first_name +" " + data.last_name
          $scope.quiz_banks.push({title: value.title,id:value.id, name: name, public: value.public, tag: $scope.tags[0]})
        })
      })

     });
  })
  $scope.make_public = function(quiz){
    quiz.public = 1
    QuizBank.update(quiz.id,quiz)
  }
  $scope.make_private = function(quiz){
    quiz.public = 0
    QuizBank.update(quiz.id,quiz)
  }
}])

quizlib.controller("viewQuestionsCtrl",['$scope','Question','GlobalScope','QuestionOption',function($scope, Question,GlobalScope,QuestionOption){
  $scope.$on('quiz_bank_id_Changed', function(event, quiz_bank_id) {
    $scope.quiz_bank_id = quiz_bank_id;
  });
  $scope.$on("section_id_Changed",function(event,section_id){
    $scope.section_id = section_id;
    $scope.questions = Question.all($scope.quiz_bank_id,$scope.section_id)
  })
  $scope.$on("question_id_Changed",function(event,question_id){
    $scope.question_id = question_id;
    $scope.questions = Question.all($scope.quiz_bank_id,$scope.section_id)
  })

}])

quizlib.controller("viewQuestionCtrl",['$scope','QuestionOption','Question','GlobalScope',function($scope,QuestionOption,Question,GlobalScope){
  
  $scope.show_details = false

  $scope.show_details_edit = false

  $scope.$on('quiz_bank_id_Changed', function(event, quiz_bank_id) {
    $scope.quiz_bank_id = quiz_bank_id;
  });

  $scope.show_options = function(section_id,question_id,question_type){
    $scope.show_details = true
    $scope.show_details_view = true
    if(question_type == 1){
      QuestionOption.all($scope.quiz_bank_id,section_id,question_id).$promise.
      then(function(data){angular.forEach(data,function(value,key){
      $scope.question_option = value
      })})

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
    $scope.question.first_statement = statements[0]
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
        {question_id: $scope.question_id, is_correct:$scope.selected_true_false_option})
      })
  }
  $scope.create_open_ended = function(){
    Question.save($scope.quiz_bank_id, $scope.section_id,
      {description: $scope.open_ended_statement,section_id: $scope.section_id,
      question_type: 3,difficult_level: 1}).$promise.then(function(data){
        $scope.question_id  = data.id
        GlobalScope.set_question_id($scope.question_id)
        QuestionOption.save($scope.quiz_bank_id, $scope.section_id,$scope.question_id,
        {question_id: $scope.question_id, answer:$scope.open_ended_answer})
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
        {question_id: $scope.question_id, answer:$scope.blank})
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

quizlib.controller("NewQuizBankCtrl",['$scope','$http','QuizBank','Repository','Section','GlobalScope','Topic','QuestionTopic',function($scope, $http,QuizBank, Repository,Section, GlobalScope,Topic,QuestionTopic){
  // Variables for view show hide
  $scope.show_new_section = false
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
  //Click event handlers
  
  $scope.cancelQuiz = function(){
    QuizBank.delete($scope.quiz_bank_id)
  }
  $scope.saveQuiz = function(){
    QuizBank.update($scope.quiz_bank_id, $scope.quiz_bank).$promise.then(function(data){
      angular.forEach($scope.show_tags, function(value, key){
        console.log(value)
        QuestionTopic.save($scope.quiz_bank_id,{title: value})
      })

    })
  }
  $scope.addNewSection = function(){
    $scope.show_new_section = true
  }
  $scope.CancelSection = function(){
    $scope.show_new_section = false
  }
  $scope.addSection = function(title){
    section = Section.save($scope.quiz_bank_id,{title: title})
    $scope.quiz_sections.push(section)
    $scope.newSection = {}
    $scope.show_new_section = false
  }
  
  
  

  $scope.difficulties = [{name: "Easy"},{name: "Medium"},{name: "Hard"}]
  


}])