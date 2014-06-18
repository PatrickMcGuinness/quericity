class AddBasicScoringToServedQuizzes < ActiveRecord::Migration
  def change
    add_column :served_quizzes, :basic_scoring, :boolean, :default => true
  end
end
