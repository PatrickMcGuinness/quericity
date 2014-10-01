class ChangeScoreToDefaultScoreInClonedQuestion < ActiveRecord::Migration
  def change
	rename_column :cloned_questions ,:score ,:default_score 
  end
end
