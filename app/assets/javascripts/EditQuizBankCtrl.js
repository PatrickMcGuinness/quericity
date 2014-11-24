quizlib.controller("EditQuizBankCtrl",['$scope','$location','$routeParams','QuizBank','Repository','Section','GlobalScope','Topic','QuestionTopic','Message','$rootScope',function($scope,$location,$routeParams,QuizBank, Repository,Section, GlobalScope,Topic,QuestionTopic,Message,$rootScope){
  $.removeCookie("my_assessments")
  $.removeCookie("shared_assessments")
  $.removeCookie("starred_assessments")
  $.removeCookie("main_repo")
  $scope.subject_edit = false
  $scope.grade_edit = false
  $scope.tags_edit = false
  $scope.description_edit = false
  $scope.instructions_edit = false

  $scope.quiz_bank_id = $routeParams.id
  $scope.question_types = ["True False","Multiple Choice","Fill in blank","Open Ended"]

  $scope.submitted = false
  $scope.section_submitted = false
  $scope.ckEditors = [];
  $scope.newSection = null
  $scope.show_new_section = false
  $scope.show_new_question = false  

  QuizBank.get($scope.quiz_bank_id).$promise.then(function(data){
    $scope.quiz_sections = data.sections
    $scope.last_section = data.sections[data.sections.length - 1]
    $scope.quiz_bank = data
    var obj = new Date(data.created_at)
    var obj2 = new Date(data.updated_at)
    $scope.created_at = (obj.getMonth() + 1) + "-" + obj.getDate() + "-" +obj.getFullYear()
    $scope.updated_at = (obj2.getMonth() + 1) + "-" + obj2.getDate() + "-" +obj2.getFullYear()
  })

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
  
  $scope.saveQuiz = function(isValid){
    $scope.submitted =true
    if(isValid){
      $scope.quiz_bank.status = 1
      QuizBank.update($scope.quiz_bank_id, $scope.quiz_bank).$promise.then(function(data){
        QuestionTopic.destroy_all($scope.quiz_bank_id).$promise.then(function(){
          angular.forEach($scope.tags, function(value, key){
            QuestionTopic.save($scope.quiz_bank_id,{title: value.text})
          })
          Message.push_message({type: "success",msg: "You have successfully updated quiz bank",controller: "ShowQuizBankCtrl"})
          $location.path("/quiz_banks/"+$scope.quiz_bank_id+"/show")
        })
      })
    }
  }
  
  $scope.addSection = function(isValid){
    $scope.section_submitted = true
    if(isValid){
      section = Section.save($scope.quiz_bank_id,{title: $scope.newSection.title})
      Section.all($scope.quiz_bank_id).$promise.then(function(data){
        $scope.quiz_sections = data
        $scope.last_section = data[data.length - 1]
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
  
  $scope.show_question = function(){
    $scope.show_new_question = true
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