module QuizBanksHelper

  def get_comma_separated_tags(quiz_bank)
    tags = ""
    quiz_bank.question_topics.each  do |question_topic|
      if tags.blank?
        tags = question_topic.topic.title.downcase
      else
        tags = tags + "," + question_topic.topic.title.downcase
      end
    end
    tags
  end



end
