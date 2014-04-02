class ClonedQuizBanksController < ApplicationController

  before_filter :authenticate_user!

  respond_to :json

  def create_the_clone
    @quiz_bank = current_user.quiz_banks.find(params[:quiz_bank_id])
    render json: ClonedQuizBank.create_the_clone(@quiz_bank)
  end

  def show
  	@quiz_bank = current_user.quiz_banks.find(params[:quiz_bank_id])
  	render json: @quiz_bank.cloned_quiz_banks.find(params[:id])
  end
end
