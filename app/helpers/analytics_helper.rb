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

end
