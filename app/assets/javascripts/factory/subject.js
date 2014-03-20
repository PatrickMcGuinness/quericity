quizlib.factory('Subject', ['$resource', function($resource) {
  function Subject() {
    this.service = $resource('/subjects/:id', {id: '@id'});
  };
  
  Subject.prototype.all = function() {
    return this.service.query();
  };
  return new Subject;
}]);