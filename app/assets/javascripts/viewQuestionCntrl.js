quizlib.controller("viewQuestionCtrl",['$window','$scope','$rootScope','QuestionOption','Question','GlobalScope',function($window,$scope,$rootScope,QuestionOption,Question,GlobalScope){
  $scope.extra_details = false
  $scope.show_details = true
  $scope.show_details_view = true
  $scope.options_alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N"]
  $scope.temp = ["A","B","C"]
  $scope.show_details_edit = false
  $scope.submitted = false
  $scope.full_editor = false

  $scope.sec1= ["2.0", "2.13", "3.1", "3.0", "2.16", "3.3", "3.2", "2.6", "2.2", "2.7", "2.18", "2.11", "2.17", "2.19"]
  $scope.sec2 = ["2.1", "2.15", "2.14", "2.12", "2.10", "2.9", "2.8", "2.5", "3.5", "3.4", "2.4", "2.3"]
  $scope.remove_question_option = function(question,index){
    if(question.question_options.length > 2){
      question.question_options.splice(index,1)
    }
  }


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
    var blank = question.question_options[0].answer
    $scope.statement = statements[0] + " [" + blank + "] " + statements[statements.length - 1]   

  }
  $scope.hide_update = function(){$scope.show_details_view = true}

  $scope.add_question_option = function(question){
    question.question_options.push({question_id: question.id, is_correct :false, answer: null})
  }

  $scope.edit_question = function(section_id,question_id,question,isValid){
    $scope.submitted = true
    if(isValid){
      Question.update($scope.quiz_bank_id,section_id,question_id,question)
      $scope.show_details_view = true
      //$rootScope.$broadcast("question_changed")
    }  
  }
  $scope.edit_blank = function(statement,section_id,question_id,question,isValid){
    $scope.submitted = true
    if(isValid){
      console.log("statement")
      console.log(statement)
      if (statement.indexOf("[") > -1 ){
      
        var temp  = statement.split("[")
        var array = temp[1].split("]")
        question.description = temp[0] + "_________" + array[1]
      }
      else
      {
        question.description = statement
      }

      Question.update($scope.quiz_bank_id,section_id,question_id,question)
      $scope.show_details_view = true
      //$rootScope.$broadcast("question_changed")
    }
  }
  $scope.edit_mcq = function(section_id,question_id,question,question_options){
    angular.forEach(question_options,function(value,key){
      if($scope.selected_option == value){value.is_correct = "true";}
      else{value.is_correct = "false";}
    })
    Question.update($scope.quiz_bank_id,section_id,question_id,question)
    $scope.show_details_view = true
    //$rootScope.$broadcast("question_changed")
  }
  
  $scope.delete_question = function(section_id,question_id,idx){
      var deleteUser = $window.confirm('Are you sure you want to delete this question?'); 
    if (deleteUser){
    // QuizBank.delete($scope.quiz_bank_id)
     Question.delete($scope.quiz_bank_id,section_id,question_id)
    $scope.questions.splice(idx, 1);
    $scope.show_details = false
    }

   
    //$rootScope.$broadcast("question_changed")
  }
  
  $scope.select_option = function(option){
    $scope.selected_option = option
  }

  $scope.check_for_true = function(option){
    if(option.is_correct == true){ 
      console.log("in the true")
      $scope.selected_option = option
    }
  }
  $scope.is_true = function(option){
    if(option.is_correct == true){
      return true
    }
    else{
      return false
    }
  }

}])



