module ServedQuizzesHelper

	def show_date(created_at)
		if Date.today.day > created_at.day
			return "#{created_at.day}-#{created_at.month}-#{created_at.year}"
		else
			return "#{time_ago_in_words(created_at)} ago"
		end
	end
end
