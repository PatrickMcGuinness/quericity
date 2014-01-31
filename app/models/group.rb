class Group < ActiveRecord::Base
  attr_accessible :title, :owner_id

  belongs_to :owner, :class_name=>'User', :foreign_key=>'owner_id'
  validates :owner_id, presence: true

  has_many :student_groups, dependent: :destroy
  has_many :group_contacts
  has_many :contacts, through: :group_contacts

  def add_student_groups(params)
    params[:user_ids].each do |user|
      StudentGroup.create(:student_id => user, :group_id => self.id)
    end
  end

  def add_group_contacts(params)
    params[:contact_ids].each do |contact_id|
      GroupContact.create(:group_id => self.id, :contact_id => Contact.find(contact_id).id)
    end
  end
end
