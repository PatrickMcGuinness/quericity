class QuizBanksController < ApplicationController

	def index
		@quiz_banks = QuizBank.all
	end

	def new
    @quiz_bank = QuizBank.new
  end

  def show
  	@quiz_bank = QuizBank.find(params[:id])
  end

  def create
    @quiz_bank = QuizBank.new(params[:quiz_bank])
  	if @quiz_bank.save
  		redirect_to quiz_banks_path
    else
       render action: "new"
    end
  end

  def edit
  	@quiz_bank = QuizBank.find(params[:id])
  end

  def update
    @quiz_bank = QuizBank.find(params[:id])
    if @quiz_bank.update_attributes(params[:quiz_bank])
      redirect_to quiz_banks_path
    else
      redirect_to edit_quiz_bank_path
    end
  end

  def destroy
    @quiz_bank = QuizBank.find(params[:id])
    @quiz_bank.destroy
    redirect_to quiz_banks_path
  end

end
