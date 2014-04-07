quizlib.factory('Repository', ['$resource', function($resource,$http) {
  function Repository() {
    this.service = $resource('/repositories/:id:default_repo', {id: '@id',default_repo: "@default_repo"},
                      {get_default_repo:{method:"GET",params:{default_repo: "default_repo"},transformResponse: [function (data, headersGetter) {
                      return { result: JSON.parse(data) };}]},
                      update:{method:"PUT",isArray:false}
                  });
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
  Repository.prototype.update = function(RepoId,Repo){
    return this.service.update(RepoId,Repo)
  }
  Repository.prototype.get = function(RepoId){
    return this.service.get({id: RepoId})
  }
  Repository.prototype.default_repo = function(){
    return this.service.get_default_repo()
  }
  return new Repository;
}]);