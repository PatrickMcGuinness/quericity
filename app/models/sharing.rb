class Sharing < ActiveRecord::Base
  attr_accessible :user_id, :quiz_bank_id, :owner_id

  belongs_to :user, :class_name => 'User', :foreign_key => 'user_id'
  belongs_to :owner, :class_name => 'User', :foreign_key => 'owner_id'
  belongs_to :quiz_bank
  has_many :student_invitations, dependent: :destroy

  validates :user_id, presence: true
  validates :quiz_bank_id, presence: true

  def self.create_sharings(user, params)
    unless params[:email_ids].blank?
    	emails = params[:email_ids].split(",")
    	emails.each do |email|
        if Sharing.email_is_user?(email) and !Sharing.email_is_teacher?(email)
          Sharing.create(:user_id => User.find_by_email(email).id, :quiz_bank_id => params[:quiz_bank_id], :owner_id => user.id)
        end
        unless Sharing.email_is_user?(email)
          Sharing.transaction do
            new_user = User.invite!({:email => email, :role => "Student"},user)
            sharing = Sharing.create(:user_id => new_user.id, :quiz_bank_id => params[:quiz_bank_id], :owner_id => user.id)
            sharing.student_invitations.create(:email => email, :quiz_bank_id => params[:quiz_bank_id])
          end
        end
    	end
    else
      params[:user_ids].each do |user_id|
        Sharing.create(:user_id => user_id, :quiz_bank_id => params[:quiz_bank_id], :owner_id => user.id) 
      end
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

end

