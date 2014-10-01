student_quizlib.factory('StudentGroup', ['$resource', function($resource) {
  function StudentGroup() {
    this.service = $resource('/student_groups/:id', {id: '@id'},
                {update:{method:"PUT",isArray:false}
                });
  };
  
  StudentGroup.prototype.delete = function(StudentGroupId) {
    this.service.remove({id:StudentGroupId});
  };
  StudentGroup.prototype.save = function(StudentGroup){
    return this.service.save(StudentGroup)
  }
  StudentGroup.prototype.update = function(StudentGroupId,StudentGroup){
    return this.service.update({id: StudentGroupId},StudentGroup)
  }
  StudentGroup.prototype.get = function(StudentGroupId){
    return this.service.get({id: StudentGroupId})
  }
  
  return new StudentGroup;
}]);
