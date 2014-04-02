class ServedQuizzesController < ApplicationController
  
  before_filter :authenticate_user!
  respond_to :json

  def index
    render json: current_user.served_quizzes
  end

  def create
    render json: current_user.served_quizzes.create(params[:served_quiz])
  end

  def show
    render json: current_user.served_quizzes.find(params[:id])
  end

  def edit
    render json: current_user.served_quizzes.find(params[:id])
  end

  def update
    render json: current_user.served_quizzes.find(params[:id]).update_attributes(params[:served_quiz])
  end

  def destroy
    render json: current_user.served_quizzes.find(params[:id]).destroy
  end
  def pending
    render json: current_user.served_quizzes.find(params[:id]).pending_sharings
  end

  def completed
    render json: current_user.served_quizzes.find(params[:id]).completed_sharings
  end
end
