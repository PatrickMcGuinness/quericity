class ServedQuizzesController < ApplicationController
  
  before_filter :authenticate_user!
  before_filter :set_served_quiz, except: [:index,:create,
                :student_served_quizzes,:student_pending_quizzes,
                :student_attempted_quizzes,:student_started_quizzes,:show,:questions_to_attempt]
  respond_to :json

  def index
    render json: current_user.served_quizzes
  end

  def create
    render json: current_user.served_quizzes.create(params[:served_quiz])
  end

  def show
    #render json: @served_quiz
    render json: ServedQuiz.find(params[:id])
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

  def graded_answers
    render json: @served_quiz.graded_answers
  end

  def questions_to_grade
    render json: @served_quiz.open_ended_answers_to_grade
  end

  def student_served_quizzes
    render json: current_user.student_served_quizzes
  end

  def student_attempted_quizzes
    render json: current_user.student_attempted_quizzes
  end

  def student_pending_quizzes
    render json: current_user.student_pending_quizzes
  end

  def student_started_quizzes
    render json: current_user.student_started_quizzes
  end

  def questions_to_attempt
    render json: ServedQuiz.find(params[:id]).questions_to_attempt(current_user)
  end


  private

  def set_served_quiz
    @served_quiz = current_user.served_quizzes.find(params[:id])
  end

end
