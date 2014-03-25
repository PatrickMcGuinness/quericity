quizlib.factory('QuestionTopic', ['$resource', function($resource,$http) {
  function QuestionTopic() {
    this.service = $resource('/quiz_banks/:quiz_bank_id/question_topics/:id', 
                    {quiz_bank_id: '@quiz_bank_id',id: '@id'},
                    {query:{method:"GET",transformResponse: [function (data, headersGetter) {
                    return { result: JSON.parse(data) };}]}});
  };
  QuestionTopic.prototype.all = function(QuizId) {
    return this.service.query({quiz_bank_id: QuizId});
  };
  QuestionTopic.prototype.delete = function(QuizId,QuestionTopicId) {
    this.service.remove({quiz_bank_id: QuizId,id: QuestionTopicId});
  };
  QuestionTopic.prototype.save = function(QuizId,QuestionTopic){
    return this.service.save({quiz_bank_id: QuizId},QuestionTopic)
  }
  QuestionTopic.prototype.update = function(QuizId,QuestionTopicId,QuestionTopic){
    return this.service.update({quiz_bank_id: QuizId,id:QuestionTopicId},QuestionTopic)
  }
  QuestionTopic.prototype.get = function(QuizId,QuestionTopicId,QuestionTopic){
    return this.service.get({quiz_bank_id: QuizId,id: QuestionTopicId})
  }
  return new QuestionTopic;
}]);