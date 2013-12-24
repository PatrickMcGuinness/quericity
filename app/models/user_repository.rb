class UserRepository < ActiveRecord::Base
  attr_accessible  :repository_id  , :user_id , :permission
  
  belongs_to :user
  belongs_to :repository
  
end
