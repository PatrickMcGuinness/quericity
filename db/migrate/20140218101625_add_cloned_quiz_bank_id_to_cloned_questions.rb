class AddClonedQuizBankIdToClonedQuestions < ActiveRecord::Migration
  def change
    add_column :cloned_questions, :cloned_quiz_bank_id, :integer
  end
end
