class QuestionOptionsController < ApplicationController

	before_filter :authenticate_user!
  before_filter :set_variables
  respond_to :json

  def create
  	render json: @question.question_options.create(params[:question_option])
  end

  def index
  	render json: @question.question_options
  end

  def show
  	render json: @question.question_options.find(params[:id])
  end
  def edit
  	render json: @question.question_options.find(params[:id])
  end
  def update
  	render json: @question.question_options.find(params[:id]).update_attributes(params[:question_topic])
  end
  def destroy
  	render json: @question.question_options.find(params[:id]).destroy
  end

  private
    def set_variables
      @quiz_bank = current_user.quiz_banks.find(params[:quiz_bank_id])
      @section = @quiz_bank.sections.find(params[:section_id])
      @question = @section.questions.find(params[:question_id])
    end
end
