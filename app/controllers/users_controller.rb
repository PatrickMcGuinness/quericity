class UsersController < ApplicationController
	
  before_filter :authenticate_user!

  respond_to :json

  def index
    render json: User.all
  end

  def show
    render json: User.find(params[:id])
  end

  def edit
    render json: User.find(params[:id])
  end

  def update
    render json: User.find(params[:id]).update_attributes(param[:quiz_bank])
  end

  def destroy
    render json: User.find(params[:id]).destroy
  end

  def create 
    render json: User.create(params[:quiz_bank])
  end

  def get_current_user
    render json: {user:current_user}
  end

  def get_students
    render json: current_user.students
  end
  def system_students
    render json: User.where("role = ?",'Student')
  end
end
