quizlib.factory('QuizBank', ['$resource', function($resource,$http) {
  function QuizBank() {
    this.service = $resource('/quiz_banks/:id', {id: '@id'},{update:{method:"PUT",isArray:false},
                    new:{method:"GET",isArray:true}});
  };
  QuizBank.prototype.new = function(){
    return this.service.new()
  }
  QuizBank.prototype.all = function() {
    return this.service.query();
  };
  QuizBank.prototype.delete = function(QuizId) {
    this.service.remove({id: QuizId});
  };
  QuizBank.prototype.save = function(newQuiz){
    return this.service.save(newQuiz)
  }
  QuizBank.prototype.updateQuiz = function(Quiz){
    return this.service.update()
  }
  QuizBank.prototype.get = function(QuizId){
    return this.service.get({id: QuizId})
  }
  return new QuizBank;
}]);


quizlib.factory('Repository', ['$resource', function($resource,$http) {
  function Repository() {
    this.service = $resource('/repositories/:id', {id: '@id'});
  };
  Repository.prototype.all = function() {
    return this.service.query();
  };
  Repository.prototype.delete = function(RepoId) {
    this.service.remove({id: RepoId});
  };
  Repository.prototype.save = function(Repo){
    return this.service.save(Repo)
  }
  Repository.prototype.updateRepo = function(Repo){
    return this.service.update()
  }
  Repository.prototype.get = function(RepoId){
    return this.service.get({id: RepoId})
  }
  Repository.prototype.default_repo = function(){
    return $resource('repositories/default_repo').get()
  }
  return new Repository;
}]);

quizlib.factory('User', ['$resource', function($resource) {
  function User() {
    this.service = $resource('/users/:id', {id: '@id'},{update:{method:"PUT",isArray:false}});
  };
  
  User.prototype.delete = function(UserId) {
    this.service.remove({id: RepoId});
  };
  User.prototype.save = function(User){
    return this.service.save(User)
  }
  User.prototype.updateUser = function(User){
    return this.service.update()
  }
  User.prototype.get = function(UserId){
    return this.service.get({id: UserId})
  }
  return new User;
}]);