class GroupContact < ActiveRecord::Base
  attr_accessible :group_id, :contact_id
  #validates :group_id, presence: true
  validates :contact_id, presence:true

  belongs_to :group
  belongs_to :contact
end
