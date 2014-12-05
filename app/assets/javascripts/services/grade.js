student_quizlib.service('Grade', ['Answer', function(Answer) {
	
	this.trf = function(question,quizId,callback) {
		
        if(question.cloned_question_options[0].is_correct == true){
          var answer = "true"
        }
        else{
          var answer = "false"
        }
        if(question.answer == answer){
		  
          var is_correct = true
          var student_score = question.score 
        }
        else{
          
          var is_correct = false
          var student_score = 0
        }
        Answer.save({cloned_question_id: question.id, student_answer: question.answer, answer: answer, 
          is_correct: is_correct,served_quiz_id: quizId, 
          graded_by_teacher: 0, student_score: student_score}).$promise.then(function(data){

			  callback(data.questions_to_attempt);
		  })
	}
	
	this.mcq = function(question,quizId,callback) { 
		
        var correct_answer = null
        angular.forEach(question.cloned_question_options,function(value,key){
          if(value.is_correct == true){
            correct_answer = value.answer
          }
        })
        var count = 0
        angular.forEach(question.cloned_question_options,function(value,key){
          if(value.id == question.answer){

            count = count + 1
            if(value.is_correct == true){
              var is_correct = true
              var student_score = question.score
            }
            else{
              var is_correct = false
              var student_score = 0
            }
            var student_answer = value.answer
            Answer.save({cloned_question_id: question.id, student_answer: student_answer, 
              answer: correct_answer, is_correct: is_correct,served_quiz_id: quizId,
              graded_by_teacher: 0, student_score: student_score}).$promise.then(function(data){
                callback(data.questions_to_attempt);
                
              })
          }
          
        })  
        if(count == 0)
          {var student_answer = ""
            Answer.save({cloned_question_id: question.id, student_answer: student_answer, 
              answer: correct_answer, is_correct: is_correct,served_quiz_id: quizId,
              graded_by_teacher: 0, student_score: student_score}).$promise.then(function(data){
                callback(data.questions_to_attempt);
                
              })
          }
	
	}
	
	this.fib = function(question,quizId,callback) { 
	
		var is_correct;
        if(question.answer == question.cloned_question_options[0].answer.replace("<p>", "").replace("</p>","")){
          var is_correct = true
          var student_score = question.score
        }
        else{
          var is_correct = false
          var student_score = 0
        }
        Answer.save({cloned_question_id: question.id, student_answer: question.answer, 
          answer: question.cloned_question_options[0].answer, is_correct: is_correct,
          served_quiz_id: quizId, graded_by_teacher: 0, student_score: student_score}).$promise.then(function(data){
            callback(data.questions_to_attempt);
            
          })
	
	}

	
}]);