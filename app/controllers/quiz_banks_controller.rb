class QuizBanksController < ApplicationController

  before_filter :authenticate_user!
  layout "preview", only: [:quiz_preview]
	
  def index
    @quiz_banks = QuizBank.search_quiz(params["search"],current_user)
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

  def quiz_preview
    @repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:id])
    @sections = @quiz_bank.sections
  end

  def create
    @repository = current_user.repositories.find(params[:quiz_bank][:repository_id])
    @quiz_bank= @repository.quiz_banks.create(params[:quiz_bank])
    @topics = QuestionTopic.add_tags(params[:tags],@quiz_bank)
    @question_topics = @quiz_bank.question_topics
  	render layout: nil
  end

  def edit
    @repository = current_user.repositories.find(params[:repository_id])
  	@quiz_bank = @repository.quiz_banks.find(params[:id])
    @topics = @quiz_bank.topics
    render layout:nil
  end

  def update
    @repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:id])
    @quiz_bank.update_attributes(params[:quiz_bank])
    @topics = QuestionTopic.add_tags(params[:tags],@quiz_bank) 
    render layout:nil
  end

  def destroy
    @repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank = @repository.quiz_banks.find(params[:id])
    @quiz_bank_id = @quiz_bank.id
    @quiz_bank.destroy
    render layout:nil
  end

  def update_title
    @quiz_bank = QuizBank.find(params[:id])
    @quiz_bank.title = params[:title]
    @quiz_bank.save
    render json: {title: @quiz_bank.title}
  end

end
