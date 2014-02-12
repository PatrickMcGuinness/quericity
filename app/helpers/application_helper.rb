module ApplicationHelper

  def get_user_name(user)
    if user.name.blank?
      name = "Name not set"
    else
      name = user.name
    end
    name
  end
end
