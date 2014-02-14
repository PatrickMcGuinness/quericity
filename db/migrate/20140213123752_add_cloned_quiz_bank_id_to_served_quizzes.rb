class AddClonedQuizBankIdToServedQuizzes < ActiveRecord::Migration
  def change
    add_column :served_quizzes, :cloned_quiz_bank_id, :integer
  end
end
