class QuestionOption < ActiveRecord::Base
  attr_accessible :answer,:question_id,:is_correct
  belongs_to :question

  def clone_the_question_option(new_question)
    new_question.question_options.create(:answer => self.answer, :is_correct => self.is_correct)
  end
end
