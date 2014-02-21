class QuizBanksController < ApplicationController

  before_filter :authenticate_user!
  layout "preview", only: [:quiz_preview]
  layout "quiz_bank_show", only: [:show]
  before_filter :set_variables, :only => [:show, :quiz_preview, :edit, :destroy, :update, :new, :destroy]
	before_filter :set_quiz_bank_params, :only => [:create,:update]
  
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

  def add_instructions
    @quiz_bank = QuizBank.find(params[:id])
    @quiz_bank.update_attributes(params[:quiz_bank])
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
      format.js{render :create}
    end
  end

  def update_quiz_bank
    @quiz_bank = QuizBank.find(params[:id])
    @quiz_bank.update_attributes(params[:quiz_bank])
    @question_topics = @quiz_bank.update_tags(params[:question_topics])
    render json: @quiz_bank.json_for_update_quiz_bank
  end

  private

  def set_variables
    @repository = current_user.repositories.find(params[:repository_id])
    @quiz_bank = params[:id].present? ? @repository.quiz_banks.find(params[:id]) : @repository.quiz_banks.new
    @sections = @quiz_bank.sections
  end

  def set_quiz_bank_params
    if params[:quiz_bank][:subject_id] == 'other'
      subject = Subject.find_by_title(params[:new_subject].capitalize)
      unless subject.present?
        subject = Subject.create(:title => params[:new_subject].capitalize)
        params[:quiz_bank][:subject_id] = subject.id
      else
        params[:quiz_bank][:subject_id] = subject.id
      end
    end
    params
  end

end
