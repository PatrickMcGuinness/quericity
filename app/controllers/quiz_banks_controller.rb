class QuizBanksController < ApplicationController

	def index
    @repository = Repository.find(params[:repository_id])
    if params[:search]
      @quiz_banks = @repository.quiz_banks.search(params[:search])
    else
		  @quiz_banks = @repository.quiz_banks.all
    end
	end

	def new
    @repository = Repository.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.new 
  end

  def show
  	@quiz_bank = QuizBank.find(params[:id])
    @sections = @quiz_bank.sections
  end

  def create
    @repository = Repository.find(params[:repository_id])
    @quiz_bank= @repository.quiz_banks.new(params[:quiz_bank])
  	if @quiz_bank.save
  		redirect_to repository_quiz_banks_path
    else
       render action: "new"
    end
  end

  def edit
    @repository = Repository.find(params[:repository_id])
  	@quiz_bank = @repository.quiz_banks.find(params[:id])
  end

  def update
    @repository = Repository.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:id])
    if @quiz_bank.update_attributes(params[:quiz_bank])
      redirect_to repository_quiz_banks_path, notice: 'Updated Successfully.'
    else
      redirect_to edit_repository_quiz_bank_path
    end
  end

  def destroy
    @repository = Repository.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:id])
    @quiz_bank.destroy
    redirect_to repository_quiz_banks_path, notice: 'Deleted Successfully.'
  end

end
