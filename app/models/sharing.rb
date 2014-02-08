class Sharing < ActiveRecord::Base
  

  attr_accessible :user_id, :served_quiz_id

  belongs_to :user, :class_name => 'User', :foreign_key => 'user_id'
  belongs_to :served_quiz

  validates :user_id, presence: true
  
  
  
  def self.add_more_students(user,emails,quiz_bank_id)
    students = []
    invites = []
    emails.each do |email|
      if User.exists?(:email => email)
        student = User.find_by_email(email)
        unless student.is_professor?
          students << student
        end
      else
        invites << Invite.create(:sender_id => user.id, :receiver_email => email, :invitable_id => quiz_bank_id, :invitable_type => "QuizBank")
      end
    end
    [students, invites]
  end

  def self.email_is_user?(email)
    User.exists?(:email => email)
  end

  def self.email_is_teacher?(email)
    User.exists?(:email => email) and User.find_by_email(email).is_professor?   
  end
end

