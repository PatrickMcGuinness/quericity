class UserRepository < ActiveRecord::Base
  attr_accessible :permission
  
  belongs_to :user
  belongs_to :repository
  
end
