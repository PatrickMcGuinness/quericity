class Answer < ActiveRecord::Base
  attr_accessible :student_id, :cloned_question_id, :student_answer, :answer, :is_correct, :served_quiz_id


  #validates :student_id, presence: true
  #validates :cloned_question_id, presence: true
  #validates :student_answer, presence: true
  #validates :answer, presence: true
  #validates :is_correct, presence: true


  belongs_to :user, :class_name => "User", :foreign_key => "student_id"
  belongs_to :cloned_question


  def self.check_answer(user,cloned_question, student_answer,served_quiz_id)
    if cloned_question.is_true_false?
      Answer.check_true_false_question(user,cloned_question, student_answer,served_quiz_id)
    elsif cloned_question.is_mcq?
      Answer.check_mcq_question(user,cloned_question,student_answer,served_quiz_id)
    elsif cloned_question.is_fill_in_the_blank?
      Answer.check_fill_in_the_blank_question(user,cloned_question, student_answer,served_quiz_id)
    else
      Answer.check_open_ended_question(user,cloned_question, student_answer,served_quiz_id)
    end
  end

  def self.check_true_false_question(user,cloned_question, student_answer,served_quiz_id)
    cloned_question_option = cloned_question.cloned_question_options.first
    answer = "true" if cloned_question_option.is_correct == true
    answer = "false" unless cloned_question_option.is_correct == true
    is_correct = Answer.is_answer_correct?(student_answer, answer)
    answer = Answer.create(:student_id => user.id, :cloned_question_id => cloned_question.id, 
                  :student_answer => student_answer, :answer => answer, :is_correct => is_correct,
                  :served_quiz_id => served_quiz_id)
  end

  def self.check_mcq_question(user,cloned_question,student_answer,served_quiz_id)
    cloned_question_option = cloned_question.cloned_question_options.find_by_is_correct(true)
    answer = cloned_question_option.answer
    is_correct = cloned_question.cloned_question_options.find_by_answer(student_answer).is_correct
    answer = Answer.create(:student_id => user.id, :cloned_question_id => cloned_question.id, 
                  :student_answer => student_answer, :answer => answer, :is_correct => is_correct,
                  :served_quiz_id => served_quiz_id)
  end

  def self.check_fill_in_the_blank_question(user,cloned_question,student_answer,served_quiz_id)
    cloned_question_option = cloned_question.cloned_question_options.first
    answer = cloned_question_option.answer
    is_correct = Answer.is_answer_correct?(student_answer, answer)
    answer = Answer.create(:student_id => user.id, :cloned_question_id => cloned_question.id, 
                  :student_answer => student_answer, :answer => answer, :is_correct => is_correct,
                  :served_quiz_id => served_quiz_id)
  end

  def self.check_open_ended_question(user,cloned_question,student_answer, question_option_id,served_quiz_id)
  end

  def self.is_answer_correct?(student_answer,answer)
    student_answer.eql? answer
  end

end
