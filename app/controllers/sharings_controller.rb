class SharingsController < ApplicationController

  before_filter :authenticate_user!

  respond_to :json

  def create
    @served_quiz = current_user.served_quizzes.find(params[:served_quiz_id])
    render json: @served_quiz.sharings.create(params[:sharing])
  end

  def index
    @served_quiz = current_user.served_quizzes.find(params[:served_quiz_id])
    render json: @served_quiz.sharings
  end

  def show
    @served_quiz = current_user.served_quizzes.find(params[:served_quiz_id])
    render json: @served_quiz.sharings.find(params[:id])
  end

  def edit
    @served_quiz = current_user.served_quizzes.find(params[:served_quiz_id])
    render json: @served_quiz.sharings.find(params[:id])
  end

  def update
    @served_quiz = current_user.served_quizzes.find(params[:served_quiz_id])
    render json: @served_quiz.sharings.find(params[:id]).update_attributes(params[:sharing])
  end

  def destroy
    @served_quiz = current_user.served_quizzes.find(params[:served_quiz_id])
    render json: @served_quiz.sharings.find(params[:id]).destroy
  end

  
end
