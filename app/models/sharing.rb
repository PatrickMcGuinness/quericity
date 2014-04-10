class Sharing < ActiveRecord::Base
  

  attr_accessible :user_id, :served_quiz_id, :status

  belongs_to :user, :class_name => 'User', :foreign_key => 'user_id'
  belongs_to :served_quiz

  validates :user_id, presence: true
  
  class Status
    PENDING = 1
    ATTEMPTED = 2
    EXPIRED = 3
    STARTED = 4
  end
  
  scope :attempted, -> { where(status: Sharing::Status::ATTEMPTED) }
  scope :pending, -> { where(status: Sharing::Status::PENDING) }
  scope :expired, -> { where(status: Sharing::Status::EXPIRED) }
  scope :started, -> { where(status: Sharing::Status::STARTED) }

  def self.email_is_user?(email)
    User.exists?(:email => email)
  end

  def self.email_is_teacher?(email)
    User.exists?(:email => email) and User.find_by_email(email).is_professor?   
  end

  def is_pending?
    self.status == Sharing::Status::PENDING
  end

  def is_attempted?
    self.status == Sharing::Status::ATTEMPTED
  end

  def is_expired?
    self.status == Sharing::Status::EXPIRED
  end

  def is_started?
    self.status == Sharing::Status::STARTED
  end

  def self.get_sharing(served_quiz,user)
    user.sharings.where("served_quiz_id = ?",served_quiz.id).first
  end

  def get_correct_answers
    Answer.where("student_id = ? and served_quiz_id = ? and is_correct = ? and graded_by_teacher = ?",self.user_id,self.served_quiz_id,true,Answer::Graded::YES)
  end

  def get_correct_answers_count
    self.get_correct_answers.count
  end

  def get_wrong_answers
    Answer.where("student_id = ? and served_quiz_id = ? and is_correct = ? and graded_by_teacher = ?", self.user_id, self.served_quiz_id,false, Answer::Graded::YES)
  end
  
  def get_wrong_answers_count
    self.get_wrong_answers.count
  end

  def get_attempted_answers
    Answer.where("student_id = ? and served_quiz_id = ?",self.user_id, self.served_quiz_id)
  end

  def get_attempted_answers_count
    self.get_attempted_answers.count
  end

  def get_average
    (self.get_correct_answers_count * 100)/(self.served_quiz.cloned_quiz_bank.cloned_questions.count)
  end

  def as_json(opts = nil)
    opts ||={}
    {
      :id  => id,
      :served_quiz_id   => served_quiz_id,
      :status  => status,
      :user_id => user_id,
      :user => user.as_json()
    }
  end  

  def self.add_more_students(user,emails,quiz_bank_id)
    students = []
    invites = []
    emails.each do |email|
      if User.exists?(:email => email)
        student = User.find_by_email(email)
        unless student.is_professor?
          students << student
          default_group = user.default_group
          StudentGroup.create(:group_id => default_group.id, :student_id => student.id)
        end
      else
        invites << Invite.create(:sender_id => user.id, :receiver_email => email, :invitable_id => quiz_bank_id, :invitable_type => "QuizBank")
      end
    end
    [students, invites]
  end
end

