class ClonedQuestionsController < ApplicationController

  before_filter :authenticate_user!
  respond_to :json

  def create
  	puts "cloned_question: "*10,cloned_question.inspect
    render json: ClonedQuestion.create(params[:cloned_question]) 
  end

  def create_random
    @quiz_bank = current_user.quiz_banks.find(params[:quiz_bank_id])
    ClonedQuestion.create_random(@quiz_bank,params[:number_of_questions])
  end
end
