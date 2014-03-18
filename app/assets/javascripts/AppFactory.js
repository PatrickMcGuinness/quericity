quizlib.factory('QuizBank', ['$resource', function($resource,$http) {
  function QuizBank() {
    this.service = $resource('/quiz_banks/:id', {id: '@id'},
                  {update:{method:"PUT",isArray:false},
                   query:{method:"GET",transformResponse: [function(data,headersGetter){
                    return {result: JSON.parse(data)}
                   }]}});
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
  QuizBank.prototype.updateQuiz = function(QuizId,Quiz){
    return this.service.update({id: QuizId},Quiz)
  }
  QuizBank.prototype.get = function(QuizId){
    return this.service.get({id: QuizId})
  }
  return new QuizBank;
}]);


quizlib.factory('Repository', ['$resource', function($resource,$http) {
  function Repository() {
    this.service = $resource('/repositories/:id:default_repo', {id: '@id',default_repo: "@default_repo"},
                      {get_default_repo:{method:"GET",params:{default_repo: "default_repo"},transformResponse: [function (data, headersGetter) {
                      return { result: JSON.parse(data) };}]
                    }});
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
    return this.service.get_default_repo()
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

quizlib.factory('Subject', ['$resource', function($resource) {
  function Subject() {
    this.service = $resource('/subjects/:id', {id: '@id'});
  };
  
  Subject.prototype.all = function() {
    return this.service.query();
  };
  return new Subject;
}]);


quizlib.factory('Section', ['$resource', function($resource) {
  function Section() {
    this.service = $resource('/quiz_banks/:quiz_bank_id/sections/:id', 
                    {quiz_bank_id:'@quiz_bank_id',id: '@id'},
                    {update:{method:"PUT"}});
  };
  
  Section.prototype.all = function(QuizId) {
    return this.service.query({quiz_bank_id: QuizId});
  };
  Section.prototype.delete = function(QuizId,SectionId) {
    this.service.remove({quiz_bank_id: QuizId, id: SectionId});
  };
  Section.prototype.save = function(QuizId,Section){
    return this.service.save({quiz_bank_id: QuizId},Section)
  }
  Section.prototype.update = function(QuizId,SectionId,Section){
    return this.service.update({quiz_bank_id: QuizId, id: SectionId},Section)
  }
  Section.prototype.get = function(QuizId,SectionId){
    return this.service.get({quiz_bank_id: QuizId,id: SectionId})
  }
  return new Section;
}]);