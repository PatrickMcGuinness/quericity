quizlib.factory('User', ['$resource', function($resource) {
  function User() {
    this.service = $resource('/users/:id/:get_students:quiz_banks:get_served_students:system_students:get_current_user:get_student_details:bar_graph_data:line_graph_data:search_teacher_by_email', {id: '@id'},
                {update:{method:"PUT",isArray:false},
                 get_students:{method: "GET",isArray:true},
                 system_students:{method: "GET",isArray:true},
                 get_current_user:{method: "GET",isArray:false},
                 get_student_details: {method: "GET",isArray:false},
                 bar_graph_data: {method: "GET",isArray:false},
                 line_graph_data: {method: "GET",isArray:false},
                 get_served_students: {method: "GET",isArray:true},
                 search_teacher_by_email:{method: "GET",isArray: true},
                 quiz_banks:{method: "GET", isArray: true}
                });
  };
  
  User.prototype.delete = function(UserId) {
    this.service.remove({id: RepoId});
  };
  User.prototype.save = function(User){
    return this.service.save(User)
  }
  User.prototype.update = function(UserId,User){
    return this.service.update({id: UserId},User)
  }
  User.prototype.get = function(UserId){
    return this.service.get({id: UserId})
  }
  User.prototype.get_students = function(){
    return this.service.get_students({get_students: "get_students"})
  }
  User.prototype.quiz_banks = function(){
    return this.service.quiz_banks({quiz_banks: "quiz_banks"})
  }
  User.prototype.get_served_students = function(){
    return this.service.get_served_students({get_served_students: "get_served_students"})
  }
  User.prototype.system_students = function(){
    return this.service.system_students({system_students: "system_students"})
  }
  User.prototype.get_current_user = function(){
    return this.service.get_current_user({get_current_user: "get_current_user"})
  }
  User.prototype.get_student_details = function(StudentId){
    return this.service.get_current_user({id: StudentId,get_student_details: "get_student_details"})
  }
  User.prototype.bar_graph_data = function(StudentId){
    return this.service.bar_graph_data({id: StudentId,bar_graph_data: "bar_graph_data"})
  }
  User.prototype.line_graph_data = function(StudentId){
    return this.service.line_graph_data({id: StudentId,line_graph_data: "line_graph_data"})
  }
  User.prototype.search_teacher_by_email = function(query){
    return this.service.search_teacher_by_email({"query": query,search_teacher_by_email: "search_teacher_by_email"})
  }
  return new User;
}]);