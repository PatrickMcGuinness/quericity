class SharesController < ApplicationController

	before_filter :authenticate_user!
  before_filter :set_variables, except: [:create, :destroy]

	def index
	end

  def create
    teacher = User.find_by_email(params[:email])
    @share = current_user.shares.create(:permissions => params[:permissions],
      :teacher_id => teacher.id, :shareable_id => params[:shareable_id])
    render json: {message: "success"}
  end

  def make_public
    @quiz_bank.update_attribute(:public, QuizBank::Public::YES)
    @quiz_banks = current_user.quiz_banks
    render layout:nil
  end

  def make_private
    @quiz_bank.update_attribute(:public, QuizBank::Public::NO)
    @quiz_banks = current_user.quiz_banks
    render layout:nil
  end

  def make_stared_public
    @quiz_bank.update_attribute(:public, QuizBank::Public::YES)
    @quiz_banks = current_user.favourite_quizzes
    render layout:nil
  end

  def make_stared_private
    @quiz_bank.update_attribute(:public, QuizBank::Public::NO)
    @quiz_banks = current_user.favourite_quizzes
    render layout:nil
  end

  def destroy
    @share = current_user.shares.find(params[:id])
    @share.destroy
  end

  private

  def set_variables
    @quiz_bank = QuizBank.find(params[:id])
  end
end
