class AddColumnsToServedQuizzes < ActiveRecord::Migration
  def change
    add_column :served_quizzes, :show_all_questions, :integer, :default => 0
    add_column :served_quizzes, :questions_per_page, :integer
  end
end
