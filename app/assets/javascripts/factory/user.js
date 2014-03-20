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