quizlib.factory('FavouriteQuiz', ['$resource', function($resource,$http) {
  function FavouriteQuiz() {
    this.service = $resource('/favourite_quiz_banks/:id', {id: '@id'},
                  {update:{method:"PUT",isArray:false},
                   query:{method:"GET",transformResponse: [function(data,headersGetter){
                    return {result: JSON.parse(data)}
                   }]}});
  };
  FavouriteQuiz.prototype.new = function(){
    return this.service.new()
  }
  FavouriteQuiz.prototype.all = function() {
    return this.service.query();
  };
  FavouriteQuiz.prototype.delete = function(QuizId) {
    this.service.remove({id: QuizId});
  };
  FavouriteQuiz.prototype.save = function(newQuiz){
    return this.service.save(newQuiz)
  }
  FavouriteQuiz.prototype.updateQuiz = function(QuizId,Quiz){
    return this.service.update({id: QuizId},Quiz)
  }
  FavouriteQuiz.prototype.get = function(QuizId){
    return this.service.get({id: QuizId})
  }
  return new FavouriteQuiz;
}]);