class SectionsController < ApplicationController

  before_filter :authenticate_user!
	
  def index
		@repository = Repository.find(params[:repository_id]) 
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id])
    @sections = @quiz_bank.sections.all  
	end

	def new 
	  @repository = current_user.repositories.find(params[:repository_id]) 
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id]) 
    @section = @quiz_bank.sections.new
    render layout:nil
  end

  def create
  	@repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank= @repository.quiz_banks.find(params[:quiz_bank_id])
    @section = @quiz_bank.sections.create(params[:section])
    render layout:nil
  end

  def edit
  	@repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id])
    @section = @quiz_bank.sections.find(params[:id])
    render layout:nil
  end

  def update
  	@repository = Repository.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id])
    @section = @quiz_bank.sections.find(params[:id])
    @section.update_attributes(params[:section])
    render layout:nil
  end

  def destroy
    @repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id])
    @section = @quiz_bank.sections.find(params[:id])
    @section_id = @section.id
    @section.destroy
    render layout:nil 
  end

end
