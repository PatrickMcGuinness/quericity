class QuizBanksController < ApplicationController

	def index
    if params[:search]
      @quiz_banks = QuizBank.search(params[:search])
    else
		  @quiz_banks = QuizBank.all
    end
	end

	def new
    @repository = Repository.find(params[:repository_id])
    @quiz_bank = QuizBank.new 
  end

  def show
    @repository = Repository.find(params[:repository_id])
  	@quiz_bank = QuizBank.find(params[:id])
    @repository = @quiz_bank.repository
    @sections = @quiz_bank.sections.all
  end

  def create
    @repository = Repository.find(params[:repository_id])
    @quiz_bank= @repository.quiz_banks.new(params[:quiz_bank])
  	if @quiz_bank.save
  		redirect_to repository_path(@repository)
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
      redirect_to repository_path(@repository), notice: 'Updated Successfully.'
    else
      redirect_to edit_repository_quiz_bank_path(@repository,@quiz_bank)
    end
  end

  def destroy
    @repository = Repository.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:id])
    @quiz_bank.destroy
    redirect_to repository_path(@repository), notice: 'Deleted Successfully.'
  end

end
