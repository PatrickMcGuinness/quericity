quizlib.controller('QuizBankCtrl', ['$scope', 'QuizBank', function($scope, QuizBank) {
  $scope.entries = QuizBank.all()

  $scope.addQuiz= function(){
    quiz_bank = QuizBank.save($scope.newEntry)
    $scope.entries.push(quiz_bank)
    $scope.newEntry = {}
  }
  $scope.deleteQuiz = function(id,idx) {
    $scope.entries.splice(idx, 1);
    QuizBank.delete(id);
  };
  $scope.publicQuiz = function(quiz_bank){
    quiz_bank.public = true
    QuizBank.updateQuiz(quiz_bank)
  }
  $scope.privateQuiz = function(quiz_bank){
    quiz_bank.public = false
    QuizBank.updateQuiz(quiz_bank)
  }

}]);

quizlib.controller("ManageCtrl",['$scope','QuizBank','Repository','User',function($scope, QuizBank, Repository, User){
  $scope.quiz_banks = [] 
  
  QuizBank.all().$promise.then(function(data){
    angular.forEach(data.result, function(value, key){
      Repository.get(value.repository_id).$promise.then(function(data){
        User.get(data.user_id).$promise.then(function(data){
          name = data.first_name +" " + data.last_name
          $scope.quiz_banks.push({title: value.title,id:value.id, name: name, public: value.public})
        })
      })
     });
  })
}])


quizlib.controller("SectionCtrl",['$scope','QuizBank','Section',function($scope, QuizBank,Section){
  

}])


quizlib.controller("NewQuizBankCtrl",['$scope','$http','QuizBank','Repository','Subject','Section','Topic',function($scope, $http,QuizBank, Repository, Subject,Section, Topic){
  // Variables for view show hide
  $scope.show_new_section = false
  $scope.section_edit = null
  $scope.question_types = ["True False","Mcq","Fill in blank","Open Ended"]
  
  // Values to create new quiz
  $scope.subjects = Subject.all()
  $scope.topics = Topic.all()

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
    $scope.quiz_bank.subject_id = $scope.selectedsubject.id
    QuizBank.updateQuiz($scope.quiz_bank_id, $scope.quiz_bank)
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

  $scope.difficulties = [{name: "Easy"},{name: "Medium"},{name: "Hard"}]
  $scope.show_true_false = false
  $scope.show_mcq = false
  $scope.show_blank = false
  $scope.show_open_ended = false
  $scope.selected_section = null
  $scope.addNewQuestion = function(question_type, section){
    $scope.selected_section = section
    if(question_type == "True False"){
      console.log("hello")
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

    $scope.hideQuestion = function(){
      $scope.show_true_false = false
      $scope.show_mcq = false
      $scope.show_blank = false
      $scope.show_open_ended = false
    }

  }


}])