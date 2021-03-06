module Students::QuizBanksHelper


  def show_status(sharing) 
    "Completed" if sharing.is_attempted?
    "Expired" if sharing.is_expired?
  end

  def show_duration_statement(served_quiz)
  	if served_quiz.is_infinite?
  		"Quiz has no time limit, Take your time to solve it"
  	else
  		"Quiz has #{served_quiz.duration} mins, Make sure you give equal time to each question"
  	end
  end

  def show_answers_statement(served_quiz)
  	if served_quiz.show_answer_after_question?
  		"Answer will be shown after each question"
  	elsif served_quiz.show_answer_after_quiz?
  		"All Answer will be shown after quiz"
  	else
  		"You can discuss the answers with the teacher"
  	end
  end

  def show_result(answer)
    unless answer.cloned_question.is_open_ended?
      if answer.is_correct
        "Correct"
      else
        "Wrong"
      end
    else
      "Answer will be graded later"
    end 
  end

  def quiz_serve_time_and_date(served_quiz)
    "Quiz will be served on #{served_quiz.date.day}-#{served_quiz.date.month}-#{served_quiz.date.year} at #{served_quiz.start_time.hour}/#{served_quiz.start_time.min}/#{served_quiz.start_time.sec}"
  end

  def quiz_expire_time_and_date(served_quiz)
    "Quiz expired on #{served_quiz.close_date.day}-#{served_quiz.close_date.month}-#{served_quiz.close_date.year} at #{served_quiz.end_time.hour}/#{served_quiz.end_time.min}/#{served_quiz.end_time.sec}"
  end

end
