class QuizBanksController < ApplicationController

  before_filter :authenticate_user!
  layout "preview", only: [:quiz_preview]
  layout "application", only: [:show]
  before_filter :set_variables, :only => [:show, :quiz_preview, :edit, :destroy, :update, :new, :destroy]
	
  def index
    @quiz_banks = current_user.quiz_banks.search(params[:q]).result(:distinct => true).page(params[:page])
	end

	def new
    render layout: nil 
  end

  def quiz_preview
    @questions_without_sections = Section.all_questions_in_sections(@sections)
  end

  def edit
    @topics = @quiz_bank.topics
    render layout:nil
  end

  def update
    @quiz_bank.update_attributes(params[:quiz_bank])
    @topics = QuestionTopic.add_tags(params[:tags],@quiz_bank)
    render layout:nil
  end

  def destroy
    @quiz_bank.update_attribute(:deleted_at, Time.now)
    render layout:nil
  end

  def without_repo
    @quiz_bank = QuizBank.new
    @repository = Repository.first
    render layout:nil
  end

  def create
    @repository = current_user.repositories.find(params[:quiz_bank][:repository_id])
    @quiz_bank = @repository.quiz_banks.create(params[:quiz_bank])
    @topics = QuestionTopic.add_tags(params[:tags],@quiz_bank)
  	respond_to do |format|
      format.html{redirect_to repository_quiz_bank_path(@repository,@quiz_bank)}
      #format.xml { render :xml => @people.to_xml }
      format.js{render :create}
    end
  end

  def update_title
    @quiz_bank = QuizBank.find(params[:id])
    @quiz_bank.update_attribute(:title, params[:title])
    render json: {title: @quiz_bank.title}
  end

  private

  def set_variables
    @repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank = params[:id].present? ? @repository.quiz_banks.find(params[:id]) : @repository.quiz_banks.new
    @sections = @quiz_bank.sections
  end

end
