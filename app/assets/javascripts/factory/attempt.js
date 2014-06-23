quizlib.factory('Attempt', ['$resource', function($resource) {
  function Attempt() {
    this.service = $resource('/served_quizzes/:served_quiz_id/sharings/:sharing_id/attempts/:id', {served_quiz_id: '@served_quiz_id', sharing_id: '@sharing_id',id: '@id'},
                {update:{method:"PUT",isArray:false}
                });
  };
  
  Attempt.prototype.delete = function(ServedQuizId, SharingId, AttemptId) {
    this.service.remove({served_quiz_id:ServedQuizId, sharing_id: SharingId, id: AttemptId});
  };
  Attempt.prototype.all = function(ServedQuizId, SharingId) {
    return this.service.query({served_quiz_id: ServedQuizId, sharing_id: SharingId});
  }
  Attempt.prototype.save = function(ServedQuizId, SharingId, Attempt){
    return this.service.save({served_quiz_id: ServedQuizId, sharing_id: SharingId}, Attempt)
  }
  Attempt.prototype.update = function(ServedQuizId,SharingId, AttemptId, Attempt){
    return this.service.update({served_quiz_id: ServedQuizId, sharing_id: SharingId, id: AttemptId},Attempt)
  }
  Attempt.prototype.get = function(ServedQuizId, SharingId, AttemptId){
    return this.service.get({served_quiz_id: ServedQuizId, sharing_id: SharingId, id: AttemptId})
  }
  return new Attempt;
}]);