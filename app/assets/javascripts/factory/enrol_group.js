student_quizlib.factory('Group', ['$resource', function($resource) {
  function Group() {
    this.service = $resource('/groups/:id/:get_student_groups:students:enrol_student:all_groups:enrol_in_group', {id: '@id'},
                {update:{method:"PUT",isArray:false},
                get_student_groups:{method: 'GET',isArray:true},
                students:{method: 'GET',isArray:true},
                all_groups_of_student:{method: 'GET',isArray:true},
                all_groups:{method: 'GET',isArray:true},
                enrol_in_the_group:{method: 'GET',isArray:false}
                });
  };
  
  Group.prototype.delete = function(GroupId) {
    this.service.remove({id:GroupId});
  };
  Group.prototype.all = function() {
    console.log("yes you can go")
    return this.service.query();
  }
  Group.prototype.save = function(Group){
    return this.service.save(Group)
  }
  Group.prototype.update = function(GroupId,Group){
    return this.service.update({id: GroupId},Group)
  }
  Group.prototype.get = function(GroupId){
    return this.service.get({id: GroupId})
  }
  Group.prototype.get_student_groups = function(GroupId){
    return this.service.get_student_groups({id: GroupId,get_student_groups: "get_student_groups"})
  }
  Group.prototype.students = function(GroupId){
    return this.service.students({id: GroupId,students: "students"})
  }
  Group.prototype.all_groups_of_student = function(){
    return this.service.all_groups_of_student({id: 1,enrol_student: "all_groups_of_student"})
  }
  Group.prototype.enrol_in_the_group = function(GroupId,Code){
    console.log("aaaaaaaa")
    console.log(Code)
    console.log("aaaaaaa")
    return this.service.enrol_in_the_group({id: GroupId,enrol_in_group: "enrol_in_the_group"})
  }
  Group.prototype.all_groups = function(){
    return this.service.all_groups({id: 1,all_groups: "all_groups"})
  }

  return new Group;
}]);
