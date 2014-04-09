class ServedQuiz < ActiveRecord::Base
  attr_accessible :owner_id, :quiz_bank_id,:answer, :duration, :date, :close_date,:end_time, 
                  :instructions,:random,:start_time,:infinite_duration,:number_of_questions, 
                  :same_questions,:show_in_sequence, :show_all_questions, :questions_per_page,:cloned_quiz_bank_id

  #validates :owner_id, presence:true
  #validates :quiz_bank_id, presence: true


  belongs_to :owner, :class_name => "User", :foreign_key => "owner_id"
  belongs_to :quiz_bank
  belongs_to :cloned_quiz_bank
  has_many :sharings, dependent: :destroy
  #has_many :answers, dependent: :destroy

  class Random
    YES = 1
    NO = 0
  end
  
  class Infinite
    YES = 1
    NO = 0
  end

  class Answers
    AFTERQUESTION = 1
    AFTERQUIZ = 2
    DONTSHOW = 3
    def self.get_all_answers
      [["After Question",1],["After Quiz",2],["Don't Show",3]]
    end
  end

  class Sequence
    NO = 0
    YES = 1
  end

  class ShowAllQuestions
    NO = 0
    YES = 1
  end

  def pending_sharings
    self.sharings.where("status = ?",Sharing::Status::STARTED)
  end

  def completed_sharings
    self.sharings.where("status = ?",Sharing::Status::ATTEMPTED)
  end

  def invited_sharings
    self.sharings.where("status = ?",Sharing::Status::PENDING)
  end

  def attempted_answers
    Answer.where("served_quiz_id = ?",self.id)
  end
  
  def show_all_questions_in_preview?
    self.show_all_questions == ServedQuiz::ShowAllQuestions::YES
  end

  def open_ended_questions_in_answered_questions
    self.cloned_quiz_bank.cloned_questions.joins(:answers).where("cloned_questions.question_type = ?",Question::QuestionType::OPENENDED)
  end

  def open_ended_questions_to_grade
    self.cloned_quiz_bank.cloned_questions.joins(:answers).where("cloned_questions.question_type = ? and answers.graded_by_teacher = ?", Question::QuestionType::OPENENDED, 0)
  end

  def graded_answers_count
    self.attempted_answers.count - self.open_ended_questions_to_grade.count
  end


  

  def graded_by_system
    self.cloned_quiz_bank.cloned_questions.joins(:answers).count - self.open_ended_questions_to_grade.count
  end

  def is_infinite?
    self.infinite_duration == ServedQuiz::Infinite::YES
  end

  def quiz_is_random?
    self.random == ServedQuiz::Random::YES
  end

  def show_answer_after_question?
    self.answer == ServedQuiz::Answers::AFTERQUESTION
  end

  def is_expired?
    self.close_date.day <= Date.today.day and self.end_time < Time.now
  end

  def is_not_served?
    self.date.day >= Date.today.day and self.start_time > Time.now
  end


  def is_served?
    self.date.day <= Date.today.day and self.start_time < Time.now
  end

  def show_answer_after_quiz?
    self.answer == ServedQuiz::Answers::AFTERQUIZ
  end

  def dont_show_answer?
    self.answer == ServedQuiz::Answers::DONTSHOW
  end

  def question_number(user)
    count = user.answers.where("served_quiz_id = ?",self.id).count
    count = count + 1
  end

  def should_redirect?(user)
    self.question_number(user) > self.cloned_quiz_bank.cloned_questions.count 
  end
  
  def self.answer_options_for_select
    ServedQuiz::Answers.get_all_answers
  end

  def get_average
    total_sharing = self.sharings.count
    sum = self.sharings.map{|s| s.get_average}.inject(:+)
    average = (sum/total_sharing)
  end
  
  def serve_to_group(group)
    student_ids = group.student_groups.pluck(:student_id)
    self.share_with_student_ids(student_ids)
  end



  def share_with_student_ids(student_ids)
    student_ids.each do |student_id|
      Sharing.create(:user_id => student_id, :served_quiz_id => self.id)
    end
  end

  def self.create_the_clone(params)
    quiz_bank_id = params[:served_quiz][:quiz_bank_id]
    quiz_bank = QuizBank.find(quiz_bank_id)
    ClonedQuizBank.create_the_clone(quiz_bank,params)
  end

  def next_question(user)
    question_ids = user.answers.where("served_quiz_id = ? and student_id = ?",self.id, user.id).pluck(:cloned_question_id)
    unless question_ids.blank?
      question = self.cloned_quiz_bank.cloned_questions.where("id NOT IN (?)",question_ids).first 
    else
      question = self.cloned_quiz_bank.cloned_questions.first
    end
  end
end
