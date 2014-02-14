class ClonedQuestion < ActiveRecord::Base
  attr_accessible :title,:seq, :description, :question_type,:difficulty_level,:reference_url,:cloned_section_id

  has_many :cloned_question_options
  
  def self.create_the_clone(section,cloned_section)
    section.questions.each do |question|
      cloned_question = ClonedQuestion.create(:seq => question.seq, 
                            :description => question.description, :question_type => question.question_type,
                            :difficulty_level => question.difficulty_level,:cloned_section_id => cloned_section.id)
      ClonedQuestionOption.create_the_clone(question,cloned_question)
    end
  end
end
