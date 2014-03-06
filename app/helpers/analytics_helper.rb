module AnalyticsHelper

	def show_correct(answer)
		ans = nil
		if answer.is_correct == true
			ans = "Correct"
		else
			if answer.graded_by_teacher == Answer::Graded::NO
				ans = "Not Graded"
			else
				ans = "Wrong"
			end
		end
		ans
	end

  def get_date_and_time(served_quiz)
    "#{served_quiz.date.day}-#{served_quiz.date.month}-#{served_quiz.date.year}"
  end

end
