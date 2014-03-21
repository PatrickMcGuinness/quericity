class QuestionTopicsController < ApplicationController

  before_filter :authenticate_user!
  before_filter :set_variables
  respond_to :json
  
  def create
  	render json: @question.question_topics.create(params[:question_topic])
  end

  def index
  	render json: @question.question_topics
  end

  def show
  	render json: @question.question_topics.find(params[:id])
  end
  def edit
  	render json: @question.question_topics.find(params[:id])
  end
  def update
  	render json: @question.question_topics.find(params[:id]).update_attributes(params[:question_topic])
  end
  def destroy
  	render json: @question.question_topics.find(params[:id]).destroy
  end
  def destroy_list
  	#render json: @question.question_topics.find_list(params).destory_all
  end

  private
    def set_variables
      @quiz_bank = current_user.quiz_banks.find(params[:quiz_bank_id])
      @section = @quiz_bank.sections.find(params[:section_id])
      @question = @section.questions.find(params[:question_id])
    end
end
