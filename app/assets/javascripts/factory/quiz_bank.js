quizlib.factory('QuizBank', ['$resource', function($resource,$http) {
  function QuizBank() {
    this.service = $resource('/quiz_banks/:id:shared_quiz_banks/:repo_quiz_banks:change_quiz_bank_repo:clone', {id: '@id'},
                  {update:{method:"PUT",isArray:false},
                   query:{method:"GET",transformResponse: [function(data,headersGetter){
                    return {result: JSON.parse(data)}
                   }]},
                   shared_quiz_banks:{method:"GET",isArray:true},
                   repo_quiz_banks:{method:"GET",isArray:true},
                   clone:{method:"GET",isArray:false}
                 });
  };
  QuizBank.prototype.new = function(){
    return this.service.new()
  }
  QuizBank.prototype.all = function() {
    return this.service.query();
  };
  QuizBank.prototype.shared_quiz_banks = function() {
    return this.service.shared_quiz_banks({shared_quiz_banks: "shared_quiz_banks"});
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
  QuizBank.prototype.clone = function(QuizId){
    return this.service.get({id: QuizId,clone: "clone"})
  }
  QuizBank.prototype.repo_quiz_banks = function(RepoId){
    return this.service.repo_quiz_banks({id: RepoId,repo_quiz_banks:"repo_quiz_banks"})
  }

  return new QuizBank;
}]);