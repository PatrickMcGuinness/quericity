class UserRepository < ActiveRecord::Base
  attr_accessible  :repository_id  , :user_id , :permission
  
  belongs_to :user
  belongs_to :repository
  
  #after_create :send_email
  
  def send_email
  	if self.send_email?
    	UserMailer.welcome_email(self.user).deliver
    end
  end

  #def send_email?
  	#self.permission != "Owner"
  #end
end
