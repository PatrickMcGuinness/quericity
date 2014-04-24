quizlib.factory('ServedQuiz', ['$resource', function($resource,$http) {
  function ServedQuiz() {
    this.service = $resource('/served_quizzes/:id/:pending:completed:invited:attempted_answers:graded_answers:questions_to_grade', {id: '@id'},
                  {update:{method:"PUT",isArray:false},
                   query:{method:"GET",transformResponse: [function(data,headersGetter){
                    return {result: JSON.parse(data)}
                   }]},
                   pending: {method: "GET",isArray:true},
                   completed: {method: "GET",isArray: true},
                   invited:{method: "GET",isArray:true},
                   attempted_answers:{method: "GET",isArray:true},
                   graded_answers: {method: "GET", isArray: true},
                   questions_to_grade: {method: "GET", isArray: true}
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
  ServedQuiz.prototype.pending = function(ServedQuizId){

    return this.service.pending({id: ServedQuizId,pending: "pending"})
  }
  ServedQuiz.prototype.completed = function(ServedQuizId){
    return this.service.completed({id: ServedQuizId,completed: "completed"})
  }
  ServedQuiz.prototype.invited = function(ServedQuizId){
    return this.service.invited({id: ServedQuizId,invited: "invited"})
  }
  ServedQuiz.prototype.attempted_answers = function(ServedQuizId){
    return this.service.attempted_answers({id: ServedQuizId,attempted_answers: "attempted_answers"})
  }
  ServedQuiz.prototype.graded_answers = function(ServedQuizId){
    return this.service.graded_answers({id: ServedQuizId,graded_answers: "graded_answers"})
  }
  ServedQuiz.prototype.questions_to_grade = function(ServedQuizId){
    return this.service.questions_to_grade({id: ServedQuizId,questions_to_grade: "questions_to_grade"})
  }

  return new ServedQuiz;
}]);