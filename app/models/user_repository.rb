class UserRepository < ActiveRecord::Base
  attr_accessible :user_d , :permission
  
  belongs_to :user
  belongs_to :repository
  
end
