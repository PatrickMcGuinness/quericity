class Share < ActiveRecord::Base
  attr_accessible :teacher_id, :shareable_id, :shareable_type, :permissions

  belongs_to :shareable, polymorphic: true

  belongs_to :owner, :class_name => "User", :foreign_key => "owner_id"

  belongs_to :teacher, :class_name => "User", :foreign_key => "teacher_id"

  class Permissions
  	READ = 1
  	WRITE = 2
  	ADMIN = 3
  end

  def has_read_permissions?
    self.permissions == Share::Permissions::READ
  end

  def has_write_permissions?
    self.permissions == Share::Permissions::WRITE
  end

  def has_admin_permissions?
    self.permissions == Share.Permissions::ADMIN
  end

end
