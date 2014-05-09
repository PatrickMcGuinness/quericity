student_quizlib.factory('User', ['$resource', function($resource) {
  function User() {
    this.service = $resource('/users/:id/:get_students:system_students:get_current_user:dashboard_bar_graph_data:dashboard_line_graph_data:dashboard_details', {id: '@id'},
                {update:{method:"PUT",isArray:false},
                 get_students:{method: "GET",isArray:true},
                 system_students:{method: "GET",isArray:true},
                 get_current_user:{method: "GET",isArray:false},
                 dashboard_bar_graph_data: {method: "GET",isArray:false},
                 dashboard_line_graph_data: {method: "GET",isArray:false},
                 dashboard_details: {method: "GET",isArray:false}
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
  User.prototype.dashboard_details = function(StudentId){
    return this.service.dashboard_details({id: StudentId,dashboard_details: "dashboard_details"})
  }
  User.prototype.dashboard_bar_graph_data = function(StudentId){
    return this.service.dashboard_bar_graph_data({id: StudentId,dashboard_bar_graph_data: "dashboard_bar_graph_data"})
  }
  User.prototype.dashboard_line_graph_data = function(StudentId){
    return this.service.dashboard_line_graph_data({id: StudentId,dashboard_line_graph_data: "dashboard_line_graph_data"})
  }
  return new User;
}]);