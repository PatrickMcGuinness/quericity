module ServedQuizzesHelper

	def show_date(created_at)
		if Date.today.day > created_at.day
			return "#{created_at.day}-#{created_at.month}-#{created_at.year}"
		else
			return "#{time_ago_in_words(created_at)} ago"
		end
	end

	def show_served_quiz_status(served_quiz)
		status = "Not Served"
		if served_quiz.date.day <= Date.today.day and served_quiz.start_time < Time.now
			status = "Served"
		end
		if served_quiz.close_date.day <= Date.today.day and served_quiz.end_time < Time.now
			status = "Expired"
		end
		link_to status, get_status_served_quiz_path(served_quiz), remote:true
	end
	
end
