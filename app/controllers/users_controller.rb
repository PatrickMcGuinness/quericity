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
    render json: current_user
  end

  def get_students
    render json: current_user.students
  end
  
  def system_students
    render json: User.where("role = ?",'Student')
  end

  def get_student_details
    render json: current_user.students.find(params[:id]).get_details
  end

  def bar_graph_data
    render json: current_user.students.find(params[:id]).bar_graph_data
  end

  def line_graph_data
    render json: current_user.students.find(params[:id]).line_graph_data
  end

  def dashboard_details
    render json: User.find(params[:id]).get_details
  end

  def dashboard_bar_graph_data
    render json: User.find(params[:id]).bar_graph_data
  end

  def dashboard_line_graph_data
    render json: User.find(params[:id]).line_graph_data
  end
end
