class Students::UsersController < ApplicationController

  before_filter :authenticate_user!

  def profile
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    @user.update_attributes(params[:user])
    redirect_to profile_students_user_path(@user)
  end


end
