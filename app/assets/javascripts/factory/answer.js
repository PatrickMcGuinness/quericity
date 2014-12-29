student_quizlib.factory('Answer', ['$resource', function($resource,$http) {
	function Answer() {
    	this.service = $resource('/answers/:id/:student_answers_in_served_quiz', {id: '@id'},
                  {update:{method:"PUT",isArray:false},
                  student_answers_in_served_quiz: {method: "GET",isArray:true}
                 });
				 
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
		        this.save({cloned_question_id: question.id, student_answer: question.answer, answer: answer, 
		          is_correct: is_correct,served_quiz_id: quizId, 
		          graded_by_teacher: 0, student_score: student_score}).$promise.then(function(data){

					  callback(data.questions_to_attempt);
				  })
			}
					
		this.mcq = function(question,quizId,callback) { 
			var self = this;
		
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
		        	self.save({cloned_question_id: question.id, student_answer: student_answer, 
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
			this.save({cloned_question_id: question.id, student_answer: question.answer, 
			  answer: question.cloned_question_options[0].answer, is_correct: is_correct,
			  served_quiz_id: quizId, graded_by_teacher: 0, student_score: student_score}).$promise.then(function(data){
			    callback(data.questions_to_attempt);
            
			  })
	
		}
		
		this.openEnded = function(question,quizId,callback){
			this.save({cloned_question_id: question.id, student_answer: question.answer, 
			  answer: question.cloned_question_options[0].answer, is_correct: false,
			  served_quiz_id: quizId, graded_by_teacher: 0, student_score: 0}).$promise.then(function(data){
			    callback(data.questions_to_attempt);
			})
		}
	};
  
  
	Answer.prototype.save = function(Answer){
	  return this.service.save(Answer)
	}
	Answer.prototype.get = function(AnswerId){
	  return this.service.get({id: AnswerId})
	}
	Answer.prototype.update = function(AnswerId,Answer){
	  return this.service.get({id: AnswerId},Answer)
	}
	Answer.prototype.student_answers_in_served_quiz = function(ServedQuizId){
	  return this.service.student_answers_in_served_quiz({id: ServedQuizId, student_answers_in_served_quiz: "student_answers_in_served_quiz"})
	}
  

	Answer.prototype.grade = function(question,servedQuizId,callback){
		
		if(question.question_type == 1){
			  this.trf(question,servedQuizId,function(questionsToAttempt){
				  callback(questionsToAttempt)
				  
			  })
		}
		if(question.question_type == 2){
			this.mcq(question,servedQuizId,function(questionsToAttempt){
				callback(questionsToAttempt)
			
			})
				  
		}
		
		if(question.question_type ==3 ){
			this.openEnded(question,servedQuizId,function(questionsToAttempt){
				callback(questionsToAttempt)
		
			})
		}
		if(question.question_type == 4){
			this.fib(question,servedQuizId,function(questionsToAttempt){
				callback(questionsToAttempt)
		
			})
		}
		
	
		  	
		  
	}
	return new Answer;
}]);