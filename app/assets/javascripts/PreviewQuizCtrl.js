quizlib.controller('PreviewQuizCtrl', ['$scope','$routeParams','$timeout','QuizBank','Question','QuestionOption',function($scope,$routeParams,$timeout,QuizBank,Question,QuestionOption){
  
  $.removeCookie("my_assessments")
  $.removeCookie("shared_assessments")
  $.removeCookie("starred_assessments")
  $.removeCookie("main_repo")

  $scope.correct_answers = 0
  $scope.wrong_answers = 0
  $scope.no_answers = 0
  $scope.graded_later = 0
  $scope.quiz_bank_id = $routeParams.id
  $scope.show_options = true
  $scope.show_questions = []
  $scope.show_timer = false
  $scope.submit = false
  $scope.show_answer = false
  $scope.show_previous = false
  $scope.quiz_start_pressed = false
  $scope.show_next = true
  $scope.final_answer = false
  $scope.questions_done = 0
  $scope.question_done = 0
  $scope.total_questions = 0
  $scope.questions = []
  $scope.show_answers = []
  $scope.to_be_graded = []
  $scope.shown_questions = []
  $scope.all_questions_to_save= []
  $scope.questions_answered = []
  $scope.options_alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N"]
  $scope.option = {all_questions: 1, unlimited: 1}
  $scope.show_summary = true
  $scope.numbering = 0
  $scope.array_of_indexes = []
  $scope.index_of_questions = []

  $scope.question_numbering_of_radio = function(index){
    console.log(index)
    ind =  $scope.array_of_indexes.indexOf(index)

    if (ind == -1 )
    { 
      $scope.array_of_indexes.push(index)
      $scope.numbering = $scope.numbering+ 1
    }
  }

  $scope.question_numbering_of_input = function(index,question){
    console.log(index)
    console.log(question.answer)
    ind =  $scope.array_of_indexes.indexOf(index)

    if (ind == -1 && question.answer && question.answer.length > 0)
    { console.log("1")
      $scope.array_of_indexes.push(index)
      $scope.numbering = $scope.numbering+ 1
    }
    else if (question.answer.length == 0 ){
      console.log("2")
      $scope.array_of_indexes.pop(index)
      $scope.numbering = $scope.numbering - 1
    }
  }


  $scope.stopQuiz = function(){
    $scope.show_numbering = false
    $scope.show_options = true
    $scope.show_timer = false
    $scope.show_questions = []
    $scope.show_answers = []
    $scope.to_be_graded = []
    $scope.option = {all_questions: 1, unlimited: 1}
    $scope.show_answer = false
    $scope.submit = false
    $scope.counter = 0
    $scope.minutes = 0
    $scope.questions_answered = []
    $scope.all_questions_to_save = []
    $scope.questions = []
    $scope.array_of_indexes = []
    $scope.final_answer = false
    $scope.show_next = true
    $scope.show_previous = false
    $scope.numbering = 0
    $scope.quiz_bank = QuizBank.get($scope.quiz_bank_id).$promise.then(function(data){
      $scope.quiz_bank = data
      $scope.questions = data.questions
    })
  }

  $scope.counter = 0;
  $scope.minutes = 0;
  
  $scope.onTimeout = function(){
    $scope.counter--;
    if($scope.counter == 0){
      if($scope.minutes == 0){
        $scope.submitQuiz($scope.show_questions)
        return
      }
      else{
        $scope.counter = 60
        $scope.minutes = $scope.minutes - 1
      }
    }
    mytimeout = $timeout($scope.onTimeout,1000);
  }

  $scope.quiz_bank = QuizBank.get($scope.quiz_bank_id).$promise.then(function(data){
    $scope.quiz_bank = data
    $scope.questions = data.questions
  })

  $scope.startQuiz = function(){
    $scope.show_numbering = true
    $scope.quiz_start_pressed = true
    $scope.show_options = false
    $scope.show_answer = false
    $scope.submit = true
    $scope.show_answers = []
    $scope.total_questions = $scope.questions.length

    if($scope.option.all_questions == 1){
      $scope.show_questions = $scope.questions 
    }
    
    if($scope.option.all_questions == 0){
      for(var i = 0; i < $scope.option.question_number; i++){
        if($scope.questions[i] != undefined){
          $scope.show_questions.push($scope.questions[i])
          $scope.question_done = i + 1
        }
        else{
          $scope.questions_done = $scope.questions.length
        }
      }
    }
    if($scope.option.unlimited == 0){
      $scope.show_timer = true
      $scope.counter = 60
      $scope.minutes = $scope.option.duration - 1
      mytimeout = $timeout($scope.onTimeout,1000);
    }
  }




    $scope.previous_questions = function(){
    $scope.final_answer = false
    for(var i = 0; i < $scope.option.question_number;i++)
    {
      $scope.all_questions_to_save.pop()
      $scope.questions_answered.pop()
    }
    // angular.forEach($scope.option.question_number,function(answered_question,key){
    //   $scope.all_questions_to_save.pop()
    // })



    $scope.show_next= true
    console.log($scope.question_done)
    console.log($scope.option.question_number*2)
    if ($scope.question_done == $scope.option.question_number*2)
    {
      $scope.show_previous= false
    }
    
    $scope.show_questions = []
    var new_number =$scope.question_done
    $scope.question_done = parseInt($scope.question_done) - parseInt($scope.option.question_number)
    for(var j = $scope.question_done; j <  new_number; j++){
      $scope.show_questions.push($scope.questions[j-$scope.option.question_number])
    }
  }

  $scope.next_questions = function(){
    angular.forEach($scope.show_questions,function(answered_question,key){
      $scope.all_questions_to_save.push(answered_question)
    })


    angular.forEach($scope.show_questions,function(answered_question,key){
      if (answered_question.answer != undefined)
      {
        $scope.questions_answered.push(answered_question)
      } 
    })
    // console.log("--------------------")
    // console.log($scope.all_questions_to_save)
    // console.log($scope.show_questions)
    // console.log("--------------------")

    $scope.show_questions = []
    $scope.show_previous = true
    console.log($scope.question_done)
    console.log($scope.questions.length)
    console.log(parseInt($scope.option.question_number))
    if ($scope.question_done >= $scope.questions.length-$scope.option.question_number)
    {
      $scope.show_next = false
      $scope.final_answer = true
    }
    
    var new_number = parseInt($scope.option.question_number) + parseInt($scope.question_done)
    if(new_number < $scope.questions.length){
      for(var i = $scope.question_done; i < new_number;i++){
         if($scope.questions[i] != undefined){
          $scope.show_questions.push($scope.questions[i])
          $scope.question_done = i
        }
      }
    }
    else{
      for(var i = $scope.question_done; i < $scope.questions.length; i++){
        if($scope.questions[i] != undefined){
          $scope.show_questions.push($scope.questions[i])
          $scope.question_done = i
        }
        
      }
    }
    $scope.question_done = new_number
  }
  $scope.submitQuestion = function(shown_questions){
    
    // angular.forEach(answered_questions,function(question,key){
    //   if(question.question_type == 1){
    //     answer = {question_answer: question.question_options[0].is_correct, answer: question.answer}
    //     if(question.question_options[0].is_correct == true && question.answer == 'true'){
    //       answer.correct = 'Correct'
    //     }
    //     else if(question.question_options[0].is_correct == false && question.answer == 'false'){
    //       answer.correct = 'Correct'
    //     }
    //     else{
    //       answer.correct = 'Incorrect'
    //     }
    //     $scope.show_answers.push(answer)
    //   }
    //   if(question.question_type == 2){
    //     answer = {}
    //     angular.forEach(question.question_options,function(value,key){
    //       if(question.answer == value.id){
    //         if(value.is_correct == true){
    //           answer.correct = 'Correct';
    //           answer.answer = value.answer;
    //         }
    //         if(value.is_correct == false){
    //           answer.correct = 'Incorrect';
    //           answer.answer = value.answer;
    //         }
    //       }
    //       if(value.is_correct == true){
    //         answer.question_answer = value.answer
    //       }

    //     })
    //     $scope.show_answers.push(answer)
    //   }
    //   if(question.question_type == 4){
    //     answer = {question_answer: question.question_options[0].answer,
    //       answer: question.answer}
    //     if(question.question_options[0].answer == question.answer){
    //       answer.correct = 'Correct'
    //     }else{
    //       answer.correct = 'Incorrect'
    //     }
    //     $scope.show_answers.push(answer)
    //   }
    //   if(question.question_type == 3){
    //     $scope.to_be_graded.push({question_answer: question.question_options[0].answer,answer: question.answer,status: "Will be graded later"})
    //   }
    // })
    
    // $scope.show_questions = []
    // if($scope.question_done == $scope.questions.length){
    //   $scope.show_answer= true 
    //   $scope.submit = false
    // }
    // var new_number = parseInt($scope.option.question_number) + parseInt($scope.question_done)
    // if(new_number < $scope.questions.length){
    //   for(var i = $scope.question_done; i < new_number;i++){
    //      if($scope.questions[i] != undefined){
    //       $scope.show_questions.push($scope.questions[i])
    //       $scope.show_questions[$scope.show_questions.length -1].question_options = QuestionOption.all($scope.quiz_bank_id,$scope.questions[i].section_id,$scope.questions[i].id)
    //       $scope.question_done = i + 1
    //     }
    //   }
    // }
    // else{
    //   for(var i = $scope.question_done; i < $scope.questions.length; i++){
    //     if($scope.questions[i] != undefined){
    //       $scope.show_questions.push($scope.questions[i])
    //       $scope.show_questions[$scope.show_questions.length -1].question_options = QuestionOption.all($scope.quiz_bank_id,$scope.questions[i].section_id,$scope.questions[i].id)
    //       $scope.question_done = i + 1
    //     }
        
    //   }
    // }  
  }
  
  $scope.submitQuiz = function(answered_questions){
    $scope.correct_answers = 0
    $scope.wrong_answers = 0
    $scope.show_numbering = false
    $scope.no_answers = 0
    $scope.graded_later = 0
    $scope.quiz_start_pressed = false
    $scope.final_answer = false
    $scope.show_next = true
    $scope.show_previous = false
    $scope.questions_answered = []

    console.log(answered_questions)

    angular.forEach(answered_questions,function(answered_question,key){
      $scope.all_questions_to_save.push(answered_question)
    })

    console.log($scope.all_questions_to_save)
    $scope.answered_questions = $scope.all_questions_to_save
    $scope.show_options = false
    $scope.show_timer = false
    $scope.submit = false
    $scope.show_answer = true
    
    angular.forEach($scope.all_questions_to_save,function(question,key){
      if(question.question_type == 1){
        question.question_answer = question.question_options[0].is_correct

        if (question.answer == undefined)
        {
          question.correct = 'no_answer'
        }
        else if(question.question_options[0].is_correct == true && question.answer == 'true'){
          question.correct = 'Correct'
        }
        else if(question.question_options[0].is_correct == false && question.answer == 'false'){
          question.correct = 'Correct'
        }
        else{
          question.correct = 'Incorrect'

        }
      }
      if(question.question_type == 2){

        angular.forEach(question.question_options,function(value,key){
          if(question.answer == value.id){
            if(value.is_correct == true){
              question.correct = 'Correct';
              question.answer = value.answer
            }
            if(value.is_correct == false){
              question.correct = 'Incorrect';
              question.answer = value.answer;
            }
          }
          if(value.is_correct == true){
            question.question_answer = value.answer
          }
          if(question.answer == undefined){
            console.log("i am in undefined")
            question.correct = "no_answer"
            question.question_answer = value.answer
          }

        })
      }

      if(question.question_type == 4){
         console.log("Question 4")
        console.log(question.question_options[0].answer)
        question.question_answer = question.question_options[0].answer

        correct_answer = question.question_options[0].answer
        console.log(correct_answer)
        console.log(question.answer)
        var answer_withought_tags = question.question_answer.replace("<p>", "").replace("</p>","");

        if(question.answer == undefined)
        {
          question.correct = 'no_answer'
        }
        else if(answer_withought_tags.trim() == question.answer){
          question.correct = 'Correct'
         }else{
           question.correct = 'Incorrect'
        }
      }

      if(question.question_type == 3){
        console.log("Question 3")
        console.log(question.question_options[0].answer)
        question.question_answer = question.question_options[0].answer
        question.correct =  "Will be graded later"
      }

      if (question.correct == 'Correct'){
        $scope.correct_answers = $scope.correct_answers + 1
      }
      if (question.correct == 'Incorrect'){
        $scope.wrong_answers = $scope.wrong_answers + 1
      }
      if (question.correct == 'no_answer'){
        $scope.no_answers = $scope.no_answers + 1
      }
      $scope.graded_later = $scope.all_questions_to_save.length - $scope.no_answers - $scope.wrong_answers -$scope.correct_answers 
      question = []
      })
    
    $scope.all_questions_to_save = []
    $scope.questions = []
    $scope.array_of_indexes = []
    $scope.numbering = 0
    $scope.quiz_bank = QuizBank.get($scope.quiz_bank_id).$promise.then(function(data){
      $scope.quiz_bank = data
      $scope.questions = data.questions
    })
  }
}]);

