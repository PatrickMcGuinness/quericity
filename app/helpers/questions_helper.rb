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

  def show_blank(question)
    first_description = question.get_first_description.chomp
    second_description = question.get_second_description.chomp
    description = first_description + "_______" + second_description
  end

  def show_options?
    action_name == 'edit' or action_name == 'delete' or action_name == 'create' or (controller.class == QuestionsController and action_name == 'update')
  end


end
