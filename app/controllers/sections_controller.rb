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

  def section_before_destroy
    @repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id])
    @section = @quiz_bank.sections.find(params[:id])
    @questions =  @section.questions
  end

  def update_section_before_destroy
    @prev_section = Section.find(params[:prev_section_id])
    @prev_section.questions.update_all(:section_id => params[:section_id])
    @quiz_bank = @prev_section.quiz_bank
    @prev_section.destroy
    @sections = @quiz_bank.sections
    render layout:nil
  end

  def change_question_positions
    params[:"question"].each_with_index do |id, index|
      Question.update_all({seq: index+1},{id: id})
    end
    @questions = Question.where("id in (?)",params[:"question"]).order("seq ASC")
    @section = @questions.first.section 
    render json:{questions: @questions, section: @section}
  end

  def change_question_section
    @question = Question.find(params[:question_id])
    @question.update_attribute(:section_id,params[:section_id])
    @question_count = @question.section.questions.count
    render json:{count: @question_count}
  end

  def change_section_positions
    params[:"section"].each_with_index do |id, index|
      Section.update_all({seq: index+1},{id: id})
    end
    render nothing:true
  end

  def update_title
    @section = Section.find(params[:id])
    @section.title = params[:title]
    @section.save
    render json:{title: @section.title}
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
