student_quizlib.service('FormatData', function ($rootScope,Sharing,QuizStatus){
	this.date = function(date){
		return moment(date).format("MMM Do  h:mm a");
	}
	
    this.statusFormat = function(quizzes){
		var self =this;
      angular.forEach(quizzes,function(value,key){
        Sharing.student_sharing(value.id).$promise.then(function(data){
          value.student_sharing = data
          var local_date = new Date(value.student_sharing.local_date)
          var close_date = new Date(value.student_sharing.local_close_date)
		  
          value.close_date = self.date(value.student_sharing.local_close_date)
          value.updated_at = self.date(value.updated_at)
		   value.local_date = self.date(value.local_date) 	  
          value.status = QuizStatus.get_status(local_date,close_date,value.close_status)

		  if(value.student_sharing.status_in_string == 'INVITED' &&  value.status== 'Serving Completed'){
			  value.student_sharing.status_in_string = 'EXPIRED';
		  }

		  if(value.student_sharing.status_in_string == 'COMPLETED' &&  value.status== 'Serving Completed'){
			  value.student_sharing.status_in_string = 'EXPIRED';
		  }
		  
		  		  

        })
		
      })
    }
	this.cleanUp = function(quiz){
		var self = this;
		angular.forEach(quiz.answers,function(answer){
			
			var reg = /<p>(.*?)<\/p>/
			
			var description = reg.exec(answer.cloned_question.description)
			var answerMatch = reg.exec(answer.student_answer)
			var correctAnswer = reg.exec(answer.answer)
			
			if(description)
				answer.cloned_question.description = description[1];
			
			if(answerMatch)
				answer.student_answer = answerMatch[1]
							
			if(correctAnswer)
				answer.answer = correctAnswer[1]
			
			
			
		})
		
		
	}

	
	
})