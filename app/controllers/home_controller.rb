class HomeController < ApplicationController
  layout :determine_layout

  def index
    #redirect_to manage_quiz_banks_path if user_signed_in?
  end

  def determine_layout
    if user_signed_in?
     "dynamic"
   else
     "application"
   end
 end
end
