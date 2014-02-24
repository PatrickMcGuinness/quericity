class QuestionsController < ApplicationController

  before_filter :authenticate_user!
  before_filter :set_variables, :only => [:new,:create,:edit, :destroy, :update]
  before_filter :set_question, :only => [:edit, :update, :new, :destroy]

  def new
    @question_option = @question.question_options.build
  end

  def create
    @question = Question.create_question(params,@section)
    @question_option = @question.create_option(params)
    render layout:nil
  end
  
  def edit
    @question_options = @question.question_options
    render layout:nil
  end

  def destroy
    @question.update_attribute(:deleted_at, Time.now)
    render layout:nil
  end

  def update
    @question.update_question(params)
  end


  private

  def set_variables
    @repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id])
    @section = @quiz_bank.sections.find(params[:section_id])
  end

  def set_question
    @question = params[:id].present? ? @section.questions.find(params[:id]) : @section.questions.new(:difficulty_level => Question::Difficulty::EASY)
  end
end
