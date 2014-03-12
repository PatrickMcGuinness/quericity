class UsersController < ApplicationController
	

  before_filter :require_login
	before_filter :authenticate_user!
	

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

  def edit
    @user = User.find(params[:id])
  end

  def change_password
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    @user.update_attributes(params[:user])
    redirect_to profile_user_path(@user)
  end

  def update_change_password
    @user = User.find(params[:user_id])
    @user.update_attribute(:password, params[:new_password])
    redirect_to profile_user_path(@user)
  end

  def search_name_email_id
    @users_names = User.search_by_name(params[:search])
    @users_emails = User.search_by_email(params[:search])
    render json: {names: @users_names, emails: @users_emails}
  end
end
