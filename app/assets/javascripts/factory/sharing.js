quizlib.factory('Sharing', ['$resource', function($resource) {
  function Sharing() {
    this.service = $resource('/served_quizzes/:served_quiz_id/sharings/:id', {id: '@id'},
                {update:{method:"PUT",isArray:false}
                });
  };
  
  Sharing.prototype.delete = function(ServedQuizId,SharingId) {
    this.service.remove({served_quiz_id: ServedQuizId,id:SharingId});
  };
  Sharing.prototype.all = function(ServedQuizId) {
    return this.service.query({served_quiz_id: ServedQuizId});
  }
  Sharing.prototype.save = function(ServedQuizId,Sharing){
    return this.service.save({served_quiz_id: ServedQuizId},Sharing)
  }
  Sharing.prototype.update = function(ServedQuizId,SharingId,Sharing){
    return this.service.update({id: SharingId,served_quiz_id: ServedQuizId},Sharing)
  }
  Sharing.prototype.get = function(SharingId,ServedQuizId){
    return this.service.get({id: SharingId,served_quiz_id: ServedQuizId})
  }
  
  return new Sharing;
}]);