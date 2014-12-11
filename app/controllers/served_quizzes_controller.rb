class ServedQuizzesController < ApplicationController
  
  before_filter :authenticate_user!
  before_filter :set_served_quiz, except: [:index,:create,:first_served_quiz,
                :student_served_quizzes,:student_pending_quizzes,:student_mixed_quizzes,:student_quiz_report,
                :student_attempted_quizzes,:student_started_quizzes,:show,:questions_to_attempt]
  
  respond_to :json

  def index
    render json: current_user.served_quizzes
  end

  def create
    render json: ServedQuiz.create_served_quiz(current_user,params)
  end

  def show
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

  def first_served_quiz
    render json: current_user.served_quizzes.first.get_quiz_report
  end

  def quiz_report
    render json: @served_quiz.get_quiz_report
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

  def student_mixed_quizzes
    render json: current_user.student_mixed_quizzes
  end

  def student_started_quizzes
    render json: current_user.student_started_quizzes
  end

  def questions_to_attempt
    render json: ServedQuiz.find(params[:id]).questions_to_attempt(current_user)
  end

  def histogram_data
    render json: @served_quiz.histogram_data
  end



  def student_quiz_report
    @served_quiz = ServedQuiz.find(params[:id])
    student = User.find(params[:student_id])
    render json: {served_quiz: @served_quiz,answers:Answer.student_answers_in_served_quiz(@served_quiz,student),
      correct_answers: Answer.student_correct_answers(@served_quiz,student), wrong_answers: Answer.student_wrong_answers(@served_quiz,student)}
  end


  private

  def set_served_quiz
    @served_quiz = current_user.served_quizzes.find(params[:id])
  end

end
