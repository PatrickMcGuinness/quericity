class AddMultipleColumnsToServedQuiz < ActiveRecord::Migration
  def change
    add_column :served_quizzes, :close_date, :datetime
    add_column :served_quizzes, :duration, :integer
    add_column :served_quizzes, :answer, :integer
    add_column :served_quizzes, :random, :integer
    add_column :served_quizzes, :instructions, :text
  end
end
