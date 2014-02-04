class Sharing < ActiveRecord::Base
  

  attr_accessible :user_id, :quiz_bank_id, :owner_id

  belongs_to :user, :class_name => 'User', :foreign_key => 'user_id'
  belongs_to :owner, :class_name => 'User', :foreign_key => 'owner_id'
  belongs_to :quiz_bank

  validates :user_id, presence: true
  validates :quiz_bank_id, presence: true

  class << self
    def add_more_students(user,emails,quiz_bank_id)
      students = []
      invites = []
      emails.each do |email|
        if User.exists?(:email => email)
          student = User.find_by_email(email)
          students << student
        else
          invites << Invite.create(:sender_id => user.id, :receiver_email => email, :invitable_id => quiz_bank_id, :invitable_type => "QuizBank")
        end
      end
      [students, invites]
    end

    def background_job_for_create(user,params)
      if params[:student_ids].present?
        params[:student_ids].each do |student_id|
          sharing = Sharing.create(:owner_id => user.id, :user_id => student_id, :quiz_bank_id => params[:quiz_bank_id])
        end
      end

      if params[:invite_ids].present?
        invites = Invite.find_by_list(params[:invite_ids])
        default_group = user.default_group
        invites.each do |invite|
          new_user = User.invite!({:email => invite.receiver_email, :role => "Student"},user)
          Sharing.create(:owner_id => user.id, :user_id => new_user.id,:quiz_bank_id => params[:quiz_bank_id])
          StudentGroup.create(:group_id => default_group.id, :student_id => new_user.id)
        end
        Invite.where("invitable_id = ? and invitable_type = ?",params[:quiz_bank_id],"QuizBank").destroy_all
      end
    end
    handle_asynchronously :background_job_for_create, :run_at => Proc.new { Time.now }

    def email_is_valid?(email)
      
    end

    def email_is_user?(email)
      User.exists?(:email => email)
    end

    def email_is_teacher?(email)
      User.exists?(:email => email) and User.find_by_email(email).is_professor?   
    end

    def get_unique_quiz_banks(sharings)
      quiz_bank_keys = sharings.group_by(&:quiz_bank_id).keys()
      quiz_banks = QuizBank.where("id IN (?)", quiz_bank_keys)
      quiz_banks
    end
  end
end

