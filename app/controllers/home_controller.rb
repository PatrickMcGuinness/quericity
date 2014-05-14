class HomeController < ApplicationController
  layout :determine_layout

  def index
    #redirect_to manage_quiz_banks_path if user_signed_in?
  end

  def determine_layout
    if user_signed_in? and current_user.is_professor?
     "dynamic"
    elsif user_signed_in? and current_user.is_student?
      "student_layout" 
    else
     "application"
    end
 end

 def verify_email
  render json: User.where("email = ?",params[:user][:email]).blank?
 end
end
