class ServedQuizzesController < ApplicationController
  
  before_filter :authenticate_user!
  before_filter :set_served_quiz, except: [:index,:create]
  respond_to :json

  def index
    render json: current_user.served_quizzes
  end

  def create
    render json: current_user.served_quizzes.create(params[:served_quiz])
  end

  def show
    render json: @served_quiz
  end

  def edit
    render json: @served_quiz
  end

  def update
    render json: @served_quiz.update_attributes(params[:served_quiz])
  end

  def destroy
    render json: @served_quiz.destroy
  end
  def pending
    render json: @served_quiz.pending_sharings
  end

  def completed
    render json: @served_quiz.completed_sharings
  end

  def invited
    render json: @served_quiz.invited_sharings
  end

  def attempted_answers
    render json: @served_quiz.attempted_answers
  end

  def graded_answers_count
    render json: @served_quiz.graded_answers_count
  end

  def questions_to_grade
    render json: @served_quiz.open_ended_questions_to_grade
  end


  private

  def set_served_quiz
    @served_quiz = current_user.served_quizzes.find(params[:id])
  end

end
