class GradeQuizzesController < ApplicationController

  before_filter :authenticate_user!

  def index
    @served_quizzes = current_user.served_quizzes
  end

  def manual_check_the_answer
    @answer = Answer.find(params[:id])
    @answer.manual_check_the_answer(params[:score])
    @count = @answer.served_quiz.open_ended_questions_to_grade.count
    render json: {served_quiz_id: @answer.served_quiz_id}
  end

  def completed_students
  	@served_quiz = current_user.served_quizzes.find(params[:id])
    @sharings = @served_quiz.sharings.attempted
    render layout:nil
  end

end
