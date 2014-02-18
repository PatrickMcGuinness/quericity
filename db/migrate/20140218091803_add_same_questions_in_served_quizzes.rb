class AddSameQuestionsInServedQuizzes < ActiveRecord::Migration
  def up
    add_column :served_quizzes, :same_questions, :integer
    add_column :served_quizzes, :show_in_sequence, :integer
  end

  def down
  end
end
