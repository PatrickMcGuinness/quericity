quizlib.factory('Group', ['$resource', function($resource) {
  function Group() {
    this.service = $resource('/groups/:id/:get_student_groups', {id: '@id'},
                {update:{method:"PUT",isArray:false},
                get_student_groups:{method: 'GET',isArray:true}
                
                });
  };
  
  Group.prototype.delete = function(GroupId) {
    this.service.remove({id:GroupId});
  };
  Group.prototype.all = function() {
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
  
  return new Group;
}]);