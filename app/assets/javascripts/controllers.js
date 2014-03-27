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
  })

  QuestionTopic.all($routeParams.id).$promise.then(function(data){
    angular.forEach(data.result,function(value,key){
      Topic.get(value.topic_id).$promise.then(function(data){
        $scope.tags.push(data.title)
      })
    })
  })
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
  $scope.addRepo = function(){
    $scope.show_new_repo_div = false
    console.log($scope.repository)
    Repository.save($scope.repository)
    $scope.my_assessments.push($scope.repository)
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
    console.log(quiz)
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

  $scope.create_mcq = function(){
    console.log("hello")
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

quizlib.controller("EditQuizBankCtrl",['$scope','$routeParams','QuizBank','Repository','Section','GlobalScope','Topic','QuestionTopic',function($scope, $routeParams,QuizBank, Repository,Section, GlobalScope,Topic,QuestionTopic){

  $scope.quiz_bank_id = $routeParams.id
  $scope.quiz_bank = QuizBank.get($scope.quiz_bank_id)
  $scope.quiz_sections = Section.all($scope.quiz_bank_id)

  
  
  $scope.cancelQuiz = function(){
    QuizBank.delete($scope.quiz_bank_id)
  }
  $scope.saveQuiz = function(){
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
  


}])