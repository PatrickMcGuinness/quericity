class Invitation < ActiveRecord::Base
  attr_accessible :email , :permission
  
  belongs_to :repository
end
