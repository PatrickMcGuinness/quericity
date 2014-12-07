class QuestionsController < ApplicationController

  before_filter :authenticate_user!
  before_filter :set_variables 
  respond_to :json

  def create
    render json: Question.create_the_question(@section,params)
  end
  
  def index
    render json: @section.questions.order("created_at ASC")
  end
  def show
    render json: @section.questions.find(params[:id])
  end

  def destroy
    render json: @section.questions.find(params[:id]).destroy
  end

  def update
    params[:question][:rubrick] =  params[:explanation]
    render json: @section.questions.find(params[:id]).update_question(params)
  end

  

  private
    def set_variables
      @quiz_bank = QuizBank.find(params[:quiz_bank_id])
      @section = @quiz_bank.sections.find(params[:section_id])
    end
end
