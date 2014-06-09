quizlib.factory('Topic', ['$resource', function($resource) {
  function Topic() {
    this.service = $resource('/topics/:id:search', {id: "@id"},
                  {all:{method:"GET",transformResponse: [function (data, headersGetter) {
                  return { result: JSON.parse(data) };}]},
                  search:{method: "GET",isArray: true}
                });
  };
  
  Topic.prototype.all = function() {
    return this.service.query();
  };
  Topic.prototype.get = function(TopicId){
  	return this.service.get({id: TopicId})
  }
  Topic.prototype.search = function(query){
    return this.service.search({"query": query,search: "search"})
  }
  
  return new Topic;
}]);