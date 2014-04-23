class AnswersController < ApplicationController

  before_filter :authenticate_user!

  respond_to :json

  def create
    render json: current_user.answers.create(:cloned_question_id => params[:cloned_question_id],
            :student_answer=>params[:student_answer], :answer=>params[:answer],
            :is_correct => params[:is_correct], :graded_by_teacher=>params[:graded_by_teacher],
            :served_quiz_id => params[:served_quiz_id])
  end

  def show
    render json: Answer.find(params[:id])
  end

  def student_answers_in_served_quiz
    @served_quiz = ServedQuiz.find(params[:id])
    render json: Answer.student_answers_in_served_quiz(@served_quiz,current_user)
  end

  def update
    render json: Answer.find(params[:id]).update_attributes(student_id: params[:student_id], 
      cloned_question_id: params[:cloned_question_id], student_answer: params[:student_answer],
       answer: params[:text], is_correct: params[:is_correct], served_quiz_id: params[:served_quiz_id],
        graded_by_teacher: params[:graded_by_teacher])
  end

end
