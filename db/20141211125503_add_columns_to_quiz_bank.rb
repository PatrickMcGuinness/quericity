class AddColumnsToQuizBank < ActiveRecord::Migration
  def change
	add_column :quiz_banks ,:sections ,:boolean
	add_column :quiz_banks ,:custom_scoring ,:boolean
	add_column :quiz_banks ,:explanations ,:boolean
	add_column :quiz_banks ,:advanced_question_types ,:boolean
	add_column :quiz_banks ,:difficulty_levels ,:boolean
  end
end
