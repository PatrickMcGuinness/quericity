class ServedQuiz < ActiveRecord::Base
  attr_accessible :owner_id, :quiz_bank_id,:answer, :duration, :date, :close_date, :instructions,:random,:start_time,:infinite_duration

  validates :owner_id, presence:true
  validates :quiz_bank_id, presence: true


  belongs_to :owner, :class_name => "User", :foreign_key => "owner_id"
  belongs_to :quiz_bank
  belongs_to :cloned_quiz_bank
  has_many :sharings, dependent: :destroy

  class Random
    YES = 1
    NO = 0
  end
  
  class Infinite
    YES = 1
    NO = 0
  end

  class Answer
    AFTERQUESTION = 1
    AFTERQUIZ = 2
    DONTSHOW = 3
    def self.get_all_answers
      [["After Question",1],["After Quiz",2],["Don't Show",3]]
    end
  end

  def is_infinite?
    self.infinite_duration == ServedQuiz::Infinite::YES
  end

  def quiz_is_random?
    self.random == ServedQuiz::Random::YES
  end

  def show_answer_after_question?
    self.answer == ServedQuiz::Answer::AFTERQUESTION
  end

  def show_answer_after_quiz?
    self.answer == ServedQuiz::Answer::AFTERQUIZ
  end

  def dont_show_answer?
    self.answer == ServedQuiz::Answer::DONTSHOW
  end

  def question_number(user)
    count = user.answers.where("served_quiz_id = ?",self.id).count
    count = count + 1
  end

  def should_redirect?(user)
    self.question_number(user) > self.cloned_quiz_bank.cloned_questions.count 
  end
  
  def self.answer_options_for_select
    ServedQuiz::Answer.get_all_answers
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

  def self.create_the_clone(quiz_bank_id)
    quiz_bank = QuizBank.find(quiz_bank_id)
    ClonedQuizBank.create_the_clone(quiz_bank)
  end

  def next_question(user)
    question_ids = user.answers.where("served_quiz_id = ? and student_id = ?",self.id, user.id).pluck(:cloned_question_id)
    if self.quiz_is_random?
      unless question_ids.blank?
        question = self.cloned_quiz_bank.cloned_questions.where("id NOT IN (?)",question_ids).first 
      else
        question = self.cloned_quiz_bank.cloned_questions.first
      end
    else
      unless question_ids.blank?
        question = self.cloned_quiz_bank.cloned_questions.where("id NOT IN (?)",question_ids).order("seq ASC").first
      else
        question = self.cloned_quiz_bank.cloned_questions.order("seq ASC").first
      end
    end
  end

  def background_job_for_create(group_id,user,student_ids,invite_ids)
    if group_id.present?
      group = Group.find(group_id)
      self.serve_to_group(group)
    else
      if student_ids.present?
        self.share_with_student_ids(student_ids)
      end
      invites = Invite.find_by_list(invite_ids)
      default_group = user.default_group
      invites.each do |invite|
        new_user = User.invite!({:email => invite.receiver_email, :role => "Student"},user)
        Sharing.create(:user_id => new_user.id,:served_quiz_id => self.id)
        StudentGroup.create(:group_id => default_group.id, :student_id => new_user.id)
      end
      Invite.where("invitable_id = ? and invitable_type = ?",self.quiz_bank_id,"QuizBank").destroy_all
    end
  end
  handle_asynchronously :background_job_for_create, :run_at => Proc.new { Time.now }
end
