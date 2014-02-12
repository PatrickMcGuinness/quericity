class ApplicationController < ActionController::Base
  
  protect_from_forgery
  #before_filter :check_student_and_redirect

  def check_student_and_redirect
    if user_signed_in?
      if current_user.is_student?
        unless self.class.parent.name == Students
          redirect_to students_quiz_banks_path
        end  
      end
    end
  end

end
