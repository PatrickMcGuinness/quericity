quizlib.controller("newQuestionCtrl",['$scope','$rootScope','Question','GlobalScope','QuestionOption',function($scope,$rootScope,Question, GlobalScope,QuestionOption){
  
  $scope.submitted = false
  $scope.$on('quiz_bank_id_Changed', function(event, quiz_bank_id) {
    $scope.quiz_bank_id = quiz_bank_id;
  });

  $scope.$on("section_id_Changed",function(event,section_id){
    $scope.section_id = section_id;
  })

  

  $scope.change_question = function(selected_type){
    $scope.selected_type = selected_type
    $scope.addNewQuestion($scope.selected_type,$scope.section)
  }

  $scope.mcq_options = ["", "","",""]

  $scope.removeData = function(){
    $scope.selected_difficulty = null
    $scope.explanation = null
    $scope.selected_true_false_option = null
    $scope.blank = null
    $scope.input_1 = null
    $scope.input_0 = null
    $scope.input_2 = null
    $scope.input_3 = null
    $scope.radio = null
    CKEDITOR.instances['true_false_question_statement'].setData("")
    CKEDITOR.instances['blank_statement'].setData("Put [] in question statement where you want the blank")
    CKEDITOR.instances['description'].setData("")
    CKEDITOR.instances['open_ended_question_statement'].setData("")
    CKEDITOR.instances['answer'].setData("")
  }

  

  $scope.create_true_false = function(isValid){
    console.log("this is true/false")
    console.log($scope.a786)
    $scope.submitted = true
    if(isValid && $scope.selected_true_false_option != undefined){
      Question.save($scope.quiz_bank_id, $scope.section_id,
        {description: $scope.true_false_question_statement,section_id: $scope.section_id,
        question_type: 1,difficulty_level: $scope.selected_difficulty, explanation: $scope.explanation,question_options: [{is_correct:$scope.selected_true_false_option}]}).$promise.then(function(data){
          $scope.question_id  = data.id
          GlobalScope.set_question_id($scope.question_id)
          $scope.true_false_question_statement = null
          $scope.selected_difficulty = 2
          $scope.selected_true_false_option = null
          $scope.submitted = false
          CKEDITOR.instances['true_false_question_statement'].setData("")
          $scope.hideQuestion()
          //$rootScope.$broadcast("question_created")
        })
        
       }
  }
  $scope.create_open_ended = function(isValid){
    $scope.submitted = true
    if(isValid){
      Question.save($scope.quiz_bank_id, $scope.section_id,
        {description: $scope.open_ended_statement,section_id: $scope.section_id,
        question_type: 3,difficulty_level: $scope.selected_difficulty, explanation: $scope.explanation, rubrick: $scope.rubrick,question_options: [{answer:$scope.open_ended_answer}]}).$promise.then(function(data){
          $scope.question_id  = data.id
          GlobalScope.set_question_id($scope.question_id)
          $scope.open_ended_statement = null
          $scope.open_ended_answer = null
          $scope.difficulty_level = 2
          $scope.submitted = false
          CKEDITOR.instances['open_ended_question_statement'].setData("")
          CKEDITOR.instances['answer'].setData("")
          $scope.hideQuestion()
          //$rootScope.$broadcast("question_created")
      })
    }    
  }
  $scope.create_blank = function(isValid){
    $scope.submitted = true
    var temp = $scope.blank_statement.split("[")
    var array = temp[1].split("]")
    $scope.blank_statement = temp[0] + "________" + array[1]
    if(isValid){
      Question.save($scope.quiz_bank_id, $scope.section_id,
        {description: $scope.blank_statement,section_id: $scope.section_id,
        question_type: 4,difficulty_level: $scope.selected_difficulty, explanation: $scope.explanation,question_options: [{answer:$scope.blank}]}).$promise.then(function(data){
          $scope.question_id  = data.id
          GlobalScope.set_question_id($scope.question_id)
          $scope.blank_statement = {}
          $scope.blank = null
          $scope.selected_difficulty = 2
          $scope.submitted = false
          CKEDITOR.instances['blank_statement'].setData("Put [blank] in question statement where you want the blank")
          $scope.hideQuestion()
          //$rootScope.$broadcast("question_created") 
        }) 
    } 
  }


  $scope.remove_question_option = function(question,index){
    if(question.question_options.length > 2){
      question.question_options.splice(index,1)
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
  $scope.add_new_question_option = function(question,mcq_options){
    console.log("I am in new")
    console.log(question)
    // console.log(question.question_options)
    mcq_options.push({question_id: question.id, is_correct :false, answer: null})
  }

  $scope.add_correct_option = function(radio){
    $scope.correct_input = radio
  }
  
  $scope.create_mcq = function(isValid){
    $scope.submitted = true
    var question_options = []
    inputs = $scope.mcq_options
    for(var i = 0; i<(inputs.length) ; i++){
      if(inputs[i] != ""){
        is_correct = true
        if($scope.correct_input == i){
          is_correct = true
        }
        else{
          is_correct = false
        }
        question_options.push({answer:inputs[i],is_correct: is_correct, seq: i}) 
      }  
    }
    Question.save($scope.quiz_bank_id, $scope.section_id,
      {description: $scope.question.description,section_id: $scope.section_id,
      question_type: 2,difficulty_level: $scope.selected_difficulty,explanation: $scope.explanation,question_options: question_options}).$promise.then(function(data){
        $scope.question_id = data.id
        GlobalScope.set_question_id($scope.question_id)
      })
      $scope.selected_difficulty = 2
      $scope.submitted = false
      $scope.radio = null
      $scope.input_0 = null
      $scope.input_1 = null
      $scope.input_2 = null
      $scope.input_3 = null
      CKEDITOR.instances['description'].setData("")
      $scope.hideQuestion()
      //$rootScope.$broadcast("question_created")
  }

}])
