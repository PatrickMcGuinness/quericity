module AnalyticsHelper

	def show_correct(answer)
		ans = nil
		if answer.is_correct == true
			ans = "Correct"
		else
			ans = "Wrong"
		end
		ans
	end

end
