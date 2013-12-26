class UserRepository < ActiveRecord::Base
  attr_accessible  :repository_id  , :user_id , :permission
  
  belongs_to :user
  belongs_to :repository

  after_create :send_email

  before_update :send_email
  
  def send_email
    UserMailer.welcome_email(self.user).deliver
  end
end
