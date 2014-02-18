class ClonedQuestion < ActiveRecord::Base
  attr_accessible :title,:seq, :description, :question_type,:difficulty_level,
                  :reference_url,:cloned_section_id, :cloned_quiz_bank_id

  has_many :cloned_question_options
  has_many :answers

  belongs_to :cloned_quiz_bank
 

  def is_true_false?
   self.question_type == Question::QuestionType::TRUEFALSE
  end

  def is_mcq?
    self.question_type == Question::QuestionType::MCQ
  end

  def is_open_ended?
    self.question_type == Question::QuestionType::OPENENDED
  end

  def is_fill_in_the_blank?
    self.question_type == Question::QuestionType::BLANK
  end

  def user_answer(user,served_quiz)
    user.answers.where("cloned_question_id = ? and served_quiz_id = ?",self.id,served_quiz.id).first
  end

  def self.create_the_clone(cloned_quiz_bank,params)
    questions = Question.where("id IN (?)",params[:question_ids])
    questions.each do |question|
      cloned_question = ClonedQuestion.create(:seq => question.seq, 
                          :description => question.description, :question_type => question.question_type,
                          :difficulty_level => question.difficulty_level,
                          :cloned_quiz_bank_id => cloned_quiz_bank.id)
      ClonedQuestionOption.create_the_clone(question,cloned_question)
    end
  end
end
