module Students::QuizBanksHelper


  def show_status(sharing) 
    "Attempted" if sharing.is_attempted?
    "Expired" if sharing.is_expired?
  end

end
