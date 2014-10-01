class Group < ActiveRecord::Base
  attr_accessible :title, :owner_id ,:is_protected ,:code,:searcable

  belongs_to :owner, :class_name=>'User', :foreign_key=>'owner_id'
  validates :owner_id, presence: true

  has_many :student_groups, dependent: :destroy
  has_many :invites, as: :invitable

  #validates :title,:owner_id , presence: true

  
  #validates :title, :uniqueness => { :scope => :owner_id }  
  
  def add_student_groups(params)
    params[:user_ids].each do |user|
      StudentGroup.create(:student_id => user, :group_id => self.id)
    end
  end

  def students
    student_ids = self.student_groups.pluck(:student_id)
    students  = User.where("id IN (?)",student_ids)
    students
  end


  def self.add_students(user,params)
    students = []
    invites = []
    default_group = user.default_group
    if params[:emails].present?
      emails = params[:emails].split(",")
      emails.each do |email|
        if User.exists?(:email => email)
          student = User.find_by_email(email)
          unless student.is_professor?
            StudentGroup.create(:group_id => default_group.id, :student_id => student.id)
            students << student
          end
        else
          invites << Invite.create(:sender_id => user.id, :receiver_email => email, :invitable_id => default_group.id, :invitable_type => "Group")
          
        end
      end
    end
    [students, invites]
  end

  def add_students_edit(user,params)
    invites = []
    student_groups = []
    default_group = user.default_group
    if params[:emails].present?
      emails = params[:emails].split(",")
      emails.each do |email|
        if User.exists?(:email => email)
          student = User.find_by_email(email)
          unless self.student_groups.exists?(:student_id => student.id) and student.is_professor?
            student_groups << StudentGroup.create(:group_id => self.id, :student_id => student.id)
          end
        else
          invites << Invite.create(:sender_id => user.id, :receiver_email => email, :invitable_id => self.id, :invitable_type => "Group")
        end
      end
    end
    [student_groups, invites]
  end

  def as_json(opts = nil)
    opts ||={}
    {
      :id => id,
      :title => title,
      :owner_id => owner_id,
      :owner => owner.as_json(),
      :created_at => created_at,
      :updated_at => updated_at,
      :is_protected => is_protected,
      :searcable => searcable,
      :code => code,
      :students => students.as_json()
    }
    
  end
end
