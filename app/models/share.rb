class Share < ActiveRecord::Base
  attr_accessible :teacher_id, :shareable_id, :shareable_type, :permissions, :owner_id

  belongs_to :shareable, polymorphic: true

  belongs_to :owner, :class_name => "User", :foreign_key => "owner_id"

  belongs_to :teacher, :class_name => "User", :foreign_key => "teacher_id"

  class Permissions
  	READ = 1
  	WRITE = 2
  	ADMIN = 3
    def self.get_all_permissions
      [["Read",1],["Write",2],["Admin",3]]
    end
  end

  def has_read_permissions?
    self.permissions == Share::Permissions::READ
  end

  def has_write_permissions?
    self.permissions == Share::Permissions::WRITE
  end

  def has_admin_permissions?
    self.permissions == Share::Permissions::ADMIN
  end

  def self.permissions_for_select
    Share::Permissions.get_all_permissions
  end

  def self.get_quiz_bank_shares(user,quiz_bank)
    user.shares.where("shareable_id = ?",quiz_bank.id)
  end

  def self.get_quiz_bank_shares_count(user,quiz_bank)
    Share.get_quiz_bank_shares(user,quiz_bank).count
  end

  def as_json(opts = nil)
    opts ||={}
    {
      :id  => id,
      :teacher => teacher.as_json(), 
      :shareable_id => shareable_id,
      :shareable_type => shareable_type,
      :permissions => permissions, 
      :owner => owner.as_json()
    }
  end


end
