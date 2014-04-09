quizlib.factory('User', ['$resource', function($resource) {
  function User() {
    this.service = $resource('/users/:id/:get_students:system_students:get_current_user', {id: '@id'},
                {update:{method:"PUT",isArray:false},
                 get_students:{method: "GET",isArray:true},
                 system_students:{method: "GET",isArray:true},
                 get_current_user:{method: "GET",isArray:false}
                });
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
  User.prototype.get_students = function(){
    return this.service.get_students({get_students: "get_students"})
  }
  User.prototype.system_students = function(){
    return this.service.system_students({system_students: "system_students"})
  }
  User.prototype.get_current_user = function(){
    return this.service.get_current_user({get_current_user: "get_current_user"})
  }
  return new User;
}]);