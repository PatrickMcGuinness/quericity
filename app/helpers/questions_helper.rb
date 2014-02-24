module QuestionsHelper

	def show_alert_text(question)
    text = ""
    if question.present?
      if question.is_true_false? or question.is_mcq?
        text = "Enter question and select correct answer"
      end
      if question.is_fill_in_the_blank? or question.is_open_ended?
        text = "Enter question and answer"
      end
    end
    text
  end

end
