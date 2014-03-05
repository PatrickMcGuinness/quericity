class Answer < ActiveRecord::Base
  attr_accessible :student_id, :cloned_question_id, :student_answer, :answer, :is_correct, :served_quiz_id, :graded_by_teacher


  belongs_to :student, :class_name => "User", :foreign_key => "student_id"
  belongs_to :cloned_question
  belongs_to :served_quiz


  class Graded
    NO = 0
    YES = 1
  end


  def is_graded_by_teacher?
    self.graded_by_teacher == Answer::Graded::YES 
  end

  def is_not_graded_by_teacher?
    self.graded_by_teacher == Answer::Graded::NO 
  end

  def self.open_ended_answers(served_quiz)
    Answer.joins(:cloned_question).where("cloned_questions.question_type = ? and answers.graded_by_teacher = ? and served_quiz_id = ?",Question::QuestionType::OPENENDED,0, served_quiz.id)
  end

  def self.find_answer_by_student_and_question(student,cloned_question)
    Answer.where("student_id = ? and cloned_question_id = ?", student.id, cloned_question.id).first
  end


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

  def self.check_open_ended_question(user,cloned_question,student_answer,served_quiz_id)
    cloned_question_option = cloned_question.cloned_question_options.first
    answer = cloned_question_option.answer
    is_correct = false
    answer = Answer.create(:student_id => user.id, :cloned_question_id => cloned_question.id, 
                  :student_answer => student_answer, :answer => answer, :is_correct => is_correct,
                  :served_quiz_id => served_quiz_id)
  end

  def manual_check_the_answer(string)
    self.is_correct = true if string == "correct"
    self.is_correct = false if string == "wrong"
    self.graded_by_teacher = Answer::Graded::YES
    self.save
  end

  def self.is_answer_correct?(student_answer,answer)
    student_answer.eql? answer
  end

end
