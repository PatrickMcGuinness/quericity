class QuizBanksController < ApplicationController

  before_filter :authenticate_user!
	
  def index
    @quiz_banks = QuizBank.search(params["search"],current_user)
	end

	def new
    @repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.new
    render layout: nil 
  end
  def without_repo
    @quiz_bank = QuizBank.new
    @repository = Repository.first
    render layout:nil
  end

  def show
    @repository = current_user.repositories.find(params[:repository_id])
  	@quiz_bank = @repository.quiz_banks.find(params[:id])
    @repository = @quiz_bank.repository
    @sections = @quiz_bank.sections
  end

  def create
    @repository = current_user.repositories.find(params[:quiz_bank][:repository_id])
    @quiz_bank= @repository.quiz_banks.create(params[:quiz_bank])
  	render layout: nil
  end

  def edit
    @repository = current_user.repositories.find(params[:repository_id])
  	@quiz_bank = @repository.quiz_banks.find(params[:id])
    render layout:nil
  end

  def update
    @repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:id])
    @quiz_bank.update_attributes(params[:quiz_bank])
    render layout:nil
  end

  def destroy
    @repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:id])
    @quiz_bank_id = @quiz_bank.id
    @quiz_bank.destroy
    render layout:nil
  end

end
