class QuestionsController < ApplicationController

  before_filter :authenticate_user!

  def new
    @repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id])
    @section = @quiz_bank.sections.find(params[:section_id])
    @question = @section.questions.new
    @question_option = @question.question_options.build
  end

  def create
    @repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:quiz_bank_id])
    @section = @quiz_bank.sections.find(params[:section_id])
    @question = Question.create_question(params,@section)
    @question_option = @question.create_option(params)
    render layout:nil
    #render json:{question: @question,question_option: @question_option}
  end

  def true_false_edit
  end

  def fill_in_the_blank_edit
  end

  def open_ended_edit
  end

  def mcq_edit
  end
end
