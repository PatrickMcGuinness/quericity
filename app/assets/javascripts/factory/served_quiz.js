quizlib.factory('ServedQuiz', ['$resource', function($resource,$http) {
  function ServedQuiz() {
    this.service = $resource('/served_quizzes/:id/:pending:completed:invited', {id: '@id'},
                  {update:{method:"PUT",isArray:false},
                   query:{method:"GET",transformResponse: [function(data,headersGetter){
                    return {result: JSON.parse(data)}
                   }]},
                   pending: {method: "GET",isArray:true},
                   completed: {method: "GET",isArray: true},
                   invited:{method: "GET",isArray:true}
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

  return new ServedQuiz;
}]);