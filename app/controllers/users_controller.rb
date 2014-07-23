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
    user = User.find(params[:id])
    user.update_attributes(params[:user])
    render json: user
  end

  def upload_image
    user = User.find(params[:id])
    user.update_attribute("profile_pic",params[:profile_pic])
    user.save
    render json: user
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

  def get_served_students
    render json: current_user.served_students
  end
  
  def system_students
    render json: User.where("role = ?",'Student')
  end

  def get_student_details
    render json: current_user.served_students.find(params[:id]).get_details
  end

  def quiz_banks
    render json: QuizBank.make_json_for_list(current_user.quiz_banks,current_user)
  end

  def bar_graph_data
    render json: current_user.served_students.find(params[:id]).bar_graph_data
  end

  def line_graph_data
    render json: current_user.served_students.find(params[:id]).line_graph_data
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

  def search_teacher_by_email
    render json: User.search_teacher_by_email(params[:query],current_user)
  end
end
