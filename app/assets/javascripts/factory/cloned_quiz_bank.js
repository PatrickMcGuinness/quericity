quizlib.factory('ClonedQuizBank', ['$resource', function($resource,$http) {
  function ClonedQuizBank() {
    this.service = $resource('/quiz_banks/:quiz_bank_id/:cloned_quiz_banks/:create_the_clone:id', {id: '@id'},
                  {update:{method:"PUT",isArray:false},
                   query:{method:"GET",transformResponse: [function(data,headersGetter){
                    return {result: JSON.parse(data)}
                   }]},
                   create_the_clone:{method: "GET", isArray:false}
                 });
  };
  ClonedQuizBank.prototype.create_the_clone = function(QuizId){
    return this.service.create_the_clone({quiz_bank_id: QuizId,cloned_quiz_banks: "cloned_quiz_banks", create_the_clone: "create_the_clone"})
  }
  ClonedQuizBank.prototype.all = function(QuizId) {
    return this.service.query({id: QuizId,clone: "clone"});
  };
  ClonedQuizBank.prototype.get = function(QuizId,ClonedQuizBankId){
    return this.service.get({quiz_bank_id: QuizId,cloned_quiz_banks: "cloned_quiz_banks", id: ClonedQuizBankId})
  }

  return new ClonedQuizBank;
}]);