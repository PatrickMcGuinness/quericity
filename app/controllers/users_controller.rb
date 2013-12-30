class UsersController < ApplicationController
	before_filter :require_login
	
	def profile
    @user = User.find(params[:id])
    respond_to do |format|
      format.html
    end
  end


  def require_login
    unless current_user
      redirect_to new_user_session_path, :notice => "Please log in to access this page."
    end
  end
end
