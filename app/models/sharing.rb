class Sharing < ActiveRecord::Base
  

  attr_accessible :user_id, :quiz_bank_id, :owner_id

  belongs_to :user, :class_name => 'User', :foreign_key => 'user_id'
  belongs_to :owner, :class_name => 'User', :foreign_key => 'owner_id'
  belongs_to :quiz_bank

  validates :user_id, presence: true
  validates :quiz_bank_id, presence: true

  def self.add_more_students(user,params)
    students = []
    invites = []
    if params[:emails].present?
      emails = params[:emails].split(",")
      emails.each do |email|
        if User.exists?(:email => email)
          student = User.find_by_email(email)
          students << student
        else
          invites << Invite.create(:sender_id => user.id, :receiver_email => email, :invitable_id => params[:quiz_bank_id], :invitable_type => "QuizBank")
        end
      end
    end
    [students, invites]
  end

  def self.background_job_for_create(user,params)
    if params[:student_ids].present?
    end
  end

  def self.email_is_valid?(email)
    
  end

  def self.email_is_user?(email)
    User.exists?(:email => email)
  end

  def self.email_is_teacher?(email)
    User.exists?(:email => email) and User.find_by_email(email).is_professor?   
  end

  def self.get_unique_quiz_banks(sharings)
    quiz_bank_keys = sharings.group_by(&:quiz_bank_id).keys()
    quiz_banks = QuizBank.where("id IN (?)", quiz_bank_keys)
    quiz_banks
  end

  def self.send_invitations(user,params)
    users = []
    emails = params[:emails].split(",")
    emails.each do |email|
      if User.exists?(email)
        users << User.find_by_email(email)
      else
        users << User.invite!({:email => email, :role => "Student"},user)
      end
    end
    users   
  end

end

