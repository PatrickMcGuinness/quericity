class ClonedQuestionOption < ActiveRecord::Base
  attr_accessible :answer,:cloned_question_id,:is_correct,:seq

  belongs_to :cloned_question
  
  def self.create_the_clone(question,cloned_question)
    question.question_options.each do |question_option|
      ClonedQuestionOption.create(:answer => question_option.answer, :cloned_question_id => cloned_question.id,
                                  :is_correct => question_option.is_correct, :seq => question_option.seq)
    end
  end
end
