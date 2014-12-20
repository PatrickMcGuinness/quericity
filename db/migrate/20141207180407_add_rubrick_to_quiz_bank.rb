class AddRubrickToQuizBank < ActiveRecord::Migration
  def change
  	add_column :quiz_banks ,:have_rubrics ,:boolean
  end
end
