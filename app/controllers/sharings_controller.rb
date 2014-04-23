class SharingsController < ApplicationController

  before_filter :authenticate_user!
  before_filter :set_served_quiz, :except => [:student_sharing,:update]
  respond_to :json

  def create
    render json: @served_quiz.sharings.create(params[:sharing])
  end

  def index
    render json: @served_quiz.sharings
  end

  def show
    render json: @served_quiz.sharings.find(params[:id])
  end

  def edit
    render json: @served_quiz.sharings.find(params[:id])
  end

  def update
    render json: ServedQuiz.find(params[:served_quiz_id]).sharings.find(params[:id]).update_attributes(params[:sharing])
  end

  def destroy
    render json: @served_quiz.sharings.find(params[:id]).destroy
  end

  def student_sharing
    render json: ServedQuiz.find(params[:served_quiz_id]).sharings.find_by_user_id(current_user.id)
  end

  def set_served_quiz
    @served_quiz = current_user.served_quizzes.find(params[:served_quiz_id])
  end

  
end
