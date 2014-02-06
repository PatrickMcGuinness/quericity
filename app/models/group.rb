class Group < ActiveRecord::Base
  attr_accessible :title, :owner_id

  belongs_to :owner, :class_name=>'User', :foreign_key=>'owner_id'
  validates :owner_id, presence: true

  has_many :student_groups, dependent: :destroy
  has_many :invites, as: :invitable
  
  def add_student_groups(params)
    params[:user_ids].each do |user|
      StudentGroup.create(:student_id => user, :group_id => self.id)
    end
  end

  def background_tasks_for_create(user,params)
    if params[:student_ids].present?
      student_groups = user.default_group.student_groups
      student_groups.update_all(:group_id => self.id)
      student_ids_new = student_groups.pluck(:student_id)
      other_student_ids = params[:student_ids] - student_ids_new
      other_student_ids.each do |student_id|
        StudentGroup.create(:student_id => student_id, :group_id => self.id)
      end
    end

    if params[:invite_ids].present?
      invites = Invite.where("id IN (?)", params[:invite_ids])
      invites.each do |invite|
        new_user = User.invite!({:email => invite.receiver_email, :role => "Student"},user)
        StudentGroup.create(:group_id => self.id, :student_id => new_user.id)
        invite.destroy
      end
    end
  end
  handle_asynchronously :background_tasks_for_create, :run_at => Proc.new { Time.now }

  def background_tasks_for_update(user,params)
    if params[:invite_ids].present?
      invites = Invite.where("id IN (?)", params[:invite_ids])
      invites.each do |invite|
        new_user = User.invite!({:email => invite.receiver_email, :role => "Student"},user)
        StudentGroup.create(:group_id => self.id, :student_id => new_user.id)
        invite.destroy
      end
    end
  end
  handle_asynchronously :background_tasks_for_update, :run_at => Proc.new { Time.now }

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
end
