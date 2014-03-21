quizlib.factory('Topic', ['$resource', function($resource) {
  function Topic() {
    this.service = $resource('/topics/:id', {id: "@id"},
                  {all:{method:"GET",transformResponse: [function (data, headersGetter) {
                  return { result: JSON.parse(data) };}]}});
  };
  
  Topic.prototype.all = function() {
    return this.service.query();
  };
  
  return new Topic;
}]);