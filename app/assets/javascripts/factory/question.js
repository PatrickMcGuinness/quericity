quizlib.factory('Question', ['$resource', function($resource,$http) {
  function Question() {
    this.service = $resource('/quiz_banks/:quiz_bank_id/sections/:section_id/questions/:id', 
                    {quiz_bank_id: '@quiz_bank_id', section_id: '@section_id',id: '@id'},
                    {update:{method:"PUT",isArray:false}});
  };
  Question.prototype.all = function(QuizId,SectionId) {
    return this.service.query({quiz_bank_id: QuizId, section_id: SectionId});
  };
  Question.prototype.delete = function(QuizId,SectionId,QuestionId) {
    this.service.remove({quiz_bank_id: QuizId, section_id: SectionId, id: QuestionId});
  };
  Question.prototype.save = function(QuizId,SectionId,Question){
    return this.service.save({quiz_bank_id: QuizId, section_id: SectionId},Question)
  }
  Question.prototype.update = function(QuizId,SectionId,QuestionId,Question){
    return this.service.update({quiz_bank_id: QuizId, section_id: SectionId, id: QuestionId},Question)
  }
  Question.prototype.get = function(QuizId,SectionId,QuestionId){
    return this.service.get({quiz_bank_id: QuizId, section_id: SectionId, id: QuestionId})
  }
  return new Question;
}]);