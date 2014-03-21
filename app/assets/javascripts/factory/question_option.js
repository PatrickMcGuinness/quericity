quizlib.factory('QuestionOption', ['$resource', function($resource,$http) {
  function QuestionOption() {
    this.service = $resource('/quiz_banks/:quiz_bank_id/sections/:section_id/questions/:question_id/question_options/:id', 
                    {quiz_bank_id: '@quiz_bank_id', section_id: '@section_id',question_id: '@question_id',id: '@id'});
  };
  QuestionOption.prototype.all = function(QuizId,SectionId,QuestionId) {
    return this.service.query({quiz_bank_id: QuizId, section_id: SectionId, question_id: QuestionId});
  };
  QuestionOption.prototype.delete = function(QuizId,SectionId,QuestionId,QuestionOptionId) {
    this.service.remove({quiz_bank_id: QuizId, section_id: SectionId, question_id: QuestionId, id: QuestionOptionId});
  };
  QuestionOption.prototype.save = function(QuizId,SectionId,QuestionId,QuestionOption){
    return this.service.save({quiz_bank_id: QuizId, section_id: SectionId, question_id: QuestionId},QuestionOption)
  }
  QuestionOption.prototype.updateQuestion = function(QuizId,SectionId,QuestionId,QuestionOptionId,QuestionOption){
    return this.service.update({quiz_bank_id: QuizId, section_id: SectionId, question_id: QuestionId,id: QuestionOptionId},QuestionOption)
  }
  QuestionOption.prototype.get = function(QuizId,SectionId,QuestionId,QuestionOptionId){
    return this.service.get({quiz_bank_id: QuizId, section_id: SectionId, question_id: QuestionId,id: QuestionOptionId})
  }
  return new QuestionOption;
}]);