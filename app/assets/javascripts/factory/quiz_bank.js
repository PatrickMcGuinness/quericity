quizlib.factory('QuizBank', ['$resource', function($resource,$http) {
  function QuizBank() {
    this.service = $resource('/quiz_banks/:id:shared_quiz_banks', {id: '@id'},
                  {update:{method:"PUT",isArray:false},
                   query:{method:"GET",transformResponse: [function(data,headersGetter){
                    return {result: JSON.parse(data)}
                   }]},
                   shared_quiz_banks:{method:"GET",isArray:true}
                 });
  };
  QuizBank.prototype.new = function(){
    return this.service.new()
  }
  QuizBank.prototype.all = function() {
    return this.service.query();
  };
  QuizBank.prototype.shared_quiz_banks = function() {
    console.log("hello")
    return this.service.shared_quiz_banks();
  };
  QuizBank.prototype.delete = function(QuizId) {
    this.service.remove({id: QuizId});
  };
  QuizBank.prototype.save = function(newQuiz){
    return this.service.save(newQuiz)
  }
  QuizBank.prototype.update = function(QuizId,Quiz){
    return this.service.update({id: QuizId},Quiz)
  }
  QuizBank.prototype.get = function(QuizId){
    return this.service.get({id: QuizId})
  }
  return new QuizBank;
}]);