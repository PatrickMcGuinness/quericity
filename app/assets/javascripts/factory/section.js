quizlib.factory('Section', ['$resource', function($resource) {
  function Section() {
    this.service = $resource('/quiz_banks/:quiz_bank_id/sections/:id', 
                    {quiz_bank_id:'@quiz_bank_id',id: '@id'},
                    {update:{method:"PUT"}});
  };
  
  Section.prototype.all = function(QuizId) {
    return this.service.query({quiz_bank_id: QuizId});
  };
  Section.prototype.delete = function(QuizId,SectionId) {
    this.service.remove({quiz_bank_id: QuizId, id: SectionId});
  };
  Section.prototype.save = function(QuizId,Section){
    return this.service.save({quiz_bank_id: QuizId},Section)
  }
  Section.prototype.update = function(QuizId,SectionId,Section){
    return this.service.update({quiz_bank_id: QuizId, id: SectionId},Section)
  }
  Section.prototype.get = function(QuizId,SectionId){
    return this.service.get({quiz_bank_id: QuizId,id: SectionId})
  }
  return new Section;
}]);