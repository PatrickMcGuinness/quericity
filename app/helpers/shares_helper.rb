module SharesHelper

  def show_user(share)
    name = nil
    if share.teacher.name.blank?
      name = share.teacher.email
    else
      name = share.teacher.name
    end
    name
  end 

  def show_permissions(share)
    permissions = nil
    if share.has_read_permissions?
      permissions = "Read"
    end
    if share.has_write_permissions?
      permissions = "Write"
    end
    if share.has_admin_permissions?
      permissions = "Admin"
    end
    permissions
  end

end
