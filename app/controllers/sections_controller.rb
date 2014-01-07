class SectionsController < ApplicationController

	def index
		@repository = Repository.find(params[:repository_id]) 
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id])
    @sections = @quiz_bank.sections.all  
	end

	def new 
	  @repository = Repository.find(params[:repository_id]) 
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id]) 
    @section = @quiz_bank.sections.new
  end

  def create
  	@repository = Repository.find(params[:repository_id])
    @quiz_bank= @repository.quiz_banks.find(params[:quiz_bank_id])
    @section = @quiz_bank.sections.new(params[:section])
    if @section.save
  		redirect_to repository_quiz_bank_path(@repository,@quiz_bank), notice: 'Section created Successfully.'
    else
       render action: "new"
    end
  end

  def edit
  	@repository = Repository.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id])
    @section = @quiz_bank.sections.find(params[:id])
  end

  def update
  	@repository = Repository.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id])
    @section = @quiz_bank.sections.find(params[:id])
    if @section.update_attributes(params[:section])
      redirect_to repository_quiz_bank_path(@repository,@quiz_bank), notice: 'Updated Successfully.'
    else
      render action: "edit"
    end 
  end

  def destroy
    @repository = Repository.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id])
    @section = @quiz_bank.sections.find(params[:id])
    @section.destroy
    redirect_to repository_quiz_bank_path(@repository,@quiz_bank), notice: 'Deleted Successfully.' 
  end

end
