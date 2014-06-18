class AddScoreToAnswers < ActiveRecord::Migration
  def change
    add_column :answers, :student_score, :integer
  end
end
