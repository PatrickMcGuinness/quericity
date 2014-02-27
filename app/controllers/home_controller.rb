class HomeController < ApplicationController
  def index
    redirect_to manage_quiz_banks_path if user_signed_in?
  end
end
