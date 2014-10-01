student_quizlib.factory('ServedQuiz', ['$resource', function($resource,$http) {
  function ServedQuiz() {
    this.service = $resource('/served_quizzes/:id/:student_served_quizzes:student_pending_quizzes:student_attempted_quizzes:student_started_quizzes:questions_to_attempt:student_quiz_report', {id: '@id'},
                  {update:{method:"PUT",isArray:false},
                   query:{method:"GET",transformResponse: [function(data,headersGetter){
                    return {result: JSON.parse(data)}
                   }]},
                   student_served_quizzes: {method: "GET", isArray: true},
                   student_attempted_quizzes: {method: "GET", isArray: true},
                   student_pending_quizzes: {method: "GET",isArray: true},
                   student_started_quizzes: {method: "GET",isArray: true},
                   questions_to_attempt: {method: "GET", isArray: true},
                   student_quiz_report: {method: "GET",isArray:false}
                   

                 });
  };
  ServedQuiz.prototype.all = function() {
    return this.service.query();
  };
  
  ServedQuiz.prototype.delete = function(ServedQuizId) {
    this.service.remove({id: ServedQuizId});
  };
  ServedQuiz.prototype.save = function(newServedQuiz){
    return this.service.save(newServedQuiz)
  }
  ServedQuiz.prototype.update = function(ServedQuizId,ServedQuiz){
    return this.service.update({id: ServedQuizId},ServedQuiz)
  }
  ServedQuiz.prototype.get = function(ServedQuizId){
    return this.service.get({id: ServedQuizId})
  }
  ServedQuiz.prototype.student_served_quizzes = function(StudentId){
    return this.service.student_served_quizzes({id: StudentId,student_served_quizzes: "student_served_quizzes"})
  }
  ServedQuiz.prototype.student_pending_quizzes = function(StudentId){
    return this.service.student_pending_quizzes({id: StudentId,student_pending_quizzes: "student_pending_quizzes"})
  }
  ServedQuiz.prototype.student_attempted_quizzes = function(StudentId){
    return this.service.student_attempted_quizzes({id: StudentId,student_attempted_quizzes: "student_attempted_quizzes"})
  }
  ServedQuiz.prototype.student_started_quizzes = function(StudentId){
    return this.service.student_started_quizzes({id: StudentId,student_started_quizzes: "student_started_quizzes"})
  }
  ServedQuiz.prototype.questions_to_attempt = function(ServedQuizId){
    return this.service.questions_to_attempt({id: ServedQuizId,questions_to_attempt: "questions_to_attempt"})
  }
  ServedQuiz.prototype.student_quiz_report = function(ServedQuizId,StudentId){
    return this.service.student_quiz_report({id: ServedQuizId,student_id:StudentId, student_quiz_report: "student_quiz_report"})
  }
  

  return new ServedQuiz;
}]);
