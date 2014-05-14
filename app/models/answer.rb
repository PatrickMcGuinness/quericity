class Answer < ActiveRecord::Base
  attr_accessible :student_id, :cloned_question_id, :student_answer, :answer, :is_correct, :served_quiz_id, :graded_by_teacher


  belongs_to :student, :class_name => "User", :foreign_key => "student_id"
  belongs_to :cloned_question
  belongs_to :served_quiz

  #validates :student_id,:cloned_question_id, :student_answer, :answer, :is_correct,:served_quiz_id, presence: true
  #validates :cloned_question_id, :uniqueness => { :scope => :student_id }  
  
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

  def self.student_answers_in_served_quiz(served_quiz,student)
    Answer.where("served_quiz_id = ? and student_id = ?",served_quiz.id,student.id)
  end

  def self.student_correct_answers(served_quiz,student)
    Answer.where("served_quiz_id = ? and student_id = ? and is_correct = ?",served_quiz.id, student.id,true)
  end

  def self.student_wrong_answers(served_quiz,student)
    Answer.where("served_quiz_id = ? and student_id = ? and is_correct = ?",served_quiz.id, student.id,false)
  end

  def self.quiz_correct_answers(served_quiz)
    Answer.where("served_quiz_id = ? and is_correct = ?",served_quiz.id,true)
  end

  def self.quiz_wrong_answers(served_quiz)
    Answer.where("served_quiz_id = ? and is_correct = ?",served_quiz.id,false)
  end
  
  def questions_to_attempt
    self.served_quiz.questions_to_attempt(self.student)
  end


  def as_json(opts = nil)
    opts ||={}
    {
      :id  => id,
      :student_id => student_id,
      :cloned_question_id => cloned_question_id,
      :cloned_question => cloned_question.as_json(),
      :student_answer => student_answer,
      :answer => answer,
      :is_correct => is_correct,
      :served_quiz_id => served_quiz_id, 
      :graded_by_teacher => graded_by_teacher,
      :questions_to_attempt => questions_to_attempt.as_json(),
      :created_at => created_at,
      :updated_at => updated_at, 
    }
    
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
