class AddNumberOfQuestionInServedQuizzes < ActiveRecord::Migration
  def up
    add_column :served_quizzes, :number_of_questions, :integer
  end

  def down
  end
end
