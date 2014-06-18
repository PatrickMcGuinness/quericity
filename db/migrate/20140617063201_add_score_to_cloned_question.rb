class AddScoreToClonedQuestion < ActiveRecord::Migration
  def change
    add_column :cloned_questions, :score, :integer
  end
end
