class SectionsController < ApplicationController

  before_filter :authenticate_user!
  before_filter :set_variables, :only => [:index,:new,:create,:edit,:update,:section_before_destroy,:destroy]
  before_filter :set_section, :only => [:create, :edit, :update, :section_before_destroy,:destroy]
  
  def index
    @sections = @quiz_bank.sections
	end

	def new 
    @section = @quiz_bank.sections.new
    render layout:nil
  end

  def create
    render layout:nil
  end

  def edit
    render layout:nil
  end

  def update
    @section.update_attributes(params[:section])
    render layout:nil
  end

  def section_before_destroy
    @questions =  @section.questions
  end

  def destroy
    @section.update_attribute(:delete_at, Time.now)
    render layout:nil
  end

  def change_section_positions
    Section.change_section_positions(params[:"section"])
    render nothing:true
  end

  def change_question_positions
    @questions, @section = Question.change_question_positions(params[:"question"]) 
    render json:{questions: @questions, section: @section}
  end

  def change_question_section
    @question = Question.find(params[:question_id])
    @question.update_attribute(:section_id,params[:section_id])
    render json:{count: @question.section.questions_count}
  end

  def update_title
    @section = Section.find(params[:id])
    @section.update_attribute(:title,params[:title])
    render json:{title: @section.title}
  end

  def update_section_before_destroy
    @prev_section = Section.find(params[:prev_section_id])
    @prev_section.questions.update_all(:section_id => params[:section_id])
    @quiz_bank = @prev_section.quiz_bank
    @repository = @quiz_bank.repository
    @prev_section.update_attribute(:delete_at, Time.now)
    render layout:nil
  end


  private

  def set_variables
    @repository = current_user.repositories.find(params[:repository_id]) 
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id])
  end

  def set_section
    @section = params[:id].present? ? @quiz_bank.sections.find(params[:id]) : @quiz_bank.sections.create(params[:section])
  end

end
