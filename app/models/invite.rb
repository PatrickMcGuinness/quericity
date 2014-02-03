class Invite < ActiveRecord::Base
  attr_accessible :sender_id, :receiver_email, :invitable_type, :invitable_id
  belongs_to :invitable, polymorphic: true
  belongs_to :user, :class_name => "User", :foreign_key => "sender_id"  
end
