module ApplicationHelper

  def get_user_name(user)
    if user.name.blank?
      name = "Name not set"
    else
      name = user.name
    end
    name
  end

  def show_name(user)
    if user.present?
      return user.name if user.name.present?
    end
    return "Name not set"
  end

  def display_picture(user)
    if user.present?
      if user.profile_pic.present?
        return user.profile_pic
      elsif user.provider == "facebook" && user.uid.present?
        return "http://graph.facebook.com/#{user.uid}/picture?type=large"
      else
        return "/assets/studentdemo.jpg"  
      #elsif self.provider == "google_oauth2" && self.uid
        #return "https://www.google.com/s2/photos/profile/#{self.uid}"

      end
    else
      return "/assets/studentdemo.jpg"
    end
  end
end
