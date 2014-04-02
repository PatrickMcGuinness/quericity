class GroupsController < ApplicationController

  before_filter :authenticate_user!
  respond_to :json

  def create
    render json: current_user.groups.create(params[:group])
  end

  def index
    render json: current_user.groups
  end

  def show
    render json: current_user.groups.find(params[:id])
  end

  def edit
    render json: current_user.groups.find(params[:id])
  end

  def update
    render json: current_user.groups.find(params[:id]).update_attributes(params[:group])
  end

  def destroy
    render json: current_user.groups.find(params[:id]).destroy
  end

  def get_student_groups
    render json: current_user.groups.find(params[:id]).student_groups
  end

  def students
    render json: current_user.groups.find(params[:id]).students
  end
end
