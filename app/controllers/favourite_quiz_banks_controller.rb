class FavouriteQuizBanksController < ApplicationController

  before_filter :authenticate_user!

  before_filter :set_variables

  def make_favourite
    FavouriteQuizBank.create(:user_id => current_user.id, :quiz_bank_id => @quiz_bank.id)
    @quiz_banks = current_user.quiz_banks
    render layout:nil
  end

  def make_shared_favourite
    FavouriteQuizBank.create(:user_id => current_user.id, :quiz_bank_id => @quiz_bank.id)
    @quiz_banks = current_user.shared_quiz_banks
  end

  def make_shared_unfavourite
    @favourite_quiz_bank = FavouriteQuizBank.find_by_user_id_and_quiz_bank_id(current_user,@quiz_bank)
    @favourite_quiz_bank.destroy
    @quiz_banks = current_user.shared_quiz_banks
  end
  def make_stared_favourite
    FavouriteQuizBank.create(:user_id => current_user.id, :quiz_bank_id => @quiz_bank.id)
    @quiz_banks = current_user.favourite_quizzes
  end

  def make_stared_unfavourite
    @favourite_quiz_bank = FavouriteQuizBank.find_by_user_id_and_quiz_bank_id(current_user,@quiz_bank)
    @favourite_quiz_bank.destroy
    @quiz_banks = current_user.favourite_quizzes
  end

  def make_unfavourite
    @favourite_quiz_bank = FavouriteQuizBank.find_by_user_id_and_quiz_bank_id(current_user,@quiz_bank)
    @favourite_quiz_bank.destroy
    @quiz_banks = current_user.quiz_banks
  end

  private

  def set_variables
    @quiz_bank = QuizBank.find(params[:id])
  end

end
