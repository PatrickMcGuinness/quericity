quizlib.factory('FavouriteQuiz', ['$resource', function($resource,$http) {
  function FavouriteQuiz() {
    this.service = $resource('/favourite_quiz_banks/:id/:is_favourite', {id: '@id'},
                  {update:{method:"PUT",isArray:false},
                   is_favourite:{method:"GET",isArray:false,transformResponse: [function(data,headersGetter){
                    return {result: JSON.parse(data)}
                   }]}
                   
                 });
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
  FavouriteQuiz.prototype.save = function(Quiz){
    return this.service.save(Quiz)
  }
  FavouriteQuiz.prototype.updateQuiz = function(QuizId,Quiz){
    return this.service.update({id: QuizId},Quiz)
  }
  FavouriteQuiz.prototype.get = function(QuizId){
    return this.service.get({id: QuizId})
  }
  FavouriteQuiz.prototype.is_favourite = function(QuizId){
    return this.service.is_favourite({is_favourite: "is_favourite",id: QuizId})
  }

  return new FavouriteQuiz;
}]);