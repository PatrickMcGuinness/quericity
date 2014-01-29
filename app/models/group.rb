class Group < ActiveRecord::Base
  attr_accessible :title, :owner_id

  belongs_to :owner, :class_name=>'User', :foreign_key=>'owner_id'
  validates :owner_id, presence: true

  has_many :student_groups, dependent: :destroy

  def add_student_groups(params)
    params[:user_ids].each do |user|
      StudentGroup.create(:student_id => user, :group_id => self.id)
    end
  end
end
