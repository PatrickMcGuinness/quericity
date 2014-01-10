class ChangeQuestionIdToQuizBankIdInQuestionTopic < ActiveRecord::Migration
  def change
    rename_column :question_topics, :question_id, :quiz_bank_id
  end
  
end
