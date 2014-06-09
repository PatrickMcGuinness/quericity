class QuestionTopicsController < ApplicationController

  before_filter :authenticate_user!
  before_filter :set_variables
  respond_to :json
  
  def create
  	render json: QuestionTopic.create_topic(params[:title],@quiz_bank)
  end

  def index
  	render json: @quiz_bank.question_topics
  end

  def show
  	render json: @quiz_bank.question_topics.find(params[:id])
  end
  
  def edit
  	render json: @quiz_bank.question_topics.find(params[:id])
  end
  
  def update
  	render json: @quiz_bank.question_topics.find(params[:id]).update_attributes(params[:question_topic])
  end
  
  def destroy
  	render json: @quiz_bank.question_topics.find(params[:id]).destroy
  end

  def destroy_all
    @quiz_bank.question_topics.destroy_all
    render json: true
  end

  private
    def set_variables
      @quiz_bank = QuizBank.find(params[:quiz_bank_id])
    end
end
