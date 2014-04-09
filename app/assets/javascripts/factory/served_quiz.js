quizlib.factory('ServedQuiz', ['$resource', function($resource,$http) {
  function ServedQuiz() {
    this.service = $resource('/served_quizzes/:id/:pending:completed:invited:attempted_answers:graded_answers_count', {id: '@id'},
                  {update:{method:"PUT",isArray:false},
                   query:{method:"GET",transformResponse: [function(data,headersGetter){
                    return {result: JSON.parse(data)}
                   }]},
                   pending: {method: "GET",isArray:true},
                   completed: {method: "GET",isArray: true},
                   invited:{method: "GET",isArray:true},
                   attempted_answers:{method: "GET",isArray:true},
                   graded_answers_count: {method: "GET", isArray: false}
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
  ServedQuiz.prototype.graded_answers_count = function(ServedQuizId){
    return this.service.graded_answers_count({id: ServedQuizId,graded_answers_count: "graded_answers_count"})
  }

  return new ServedQuiz;
}]);