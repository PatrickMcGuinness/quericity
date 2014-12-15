class AddColumnsToQuizBank < ActiveRecord::Migration
  def change
	add_column :quiz_banks ,:have_sections ,:boolean
	add_column :quiz_banks ,:have_custom_scoring ,:boolean
	add_column :quiz_banks ,:have_explanations ,:boolean
	add_column :quiz_banks ,:have_advanced_question_types ,:boolean
	add_column :quiz_banks ,:have_difficulty_levels ,:boolean
  end
end
