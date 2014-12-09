class AddRubrickToQuizBank < ActiveRecord::Migration
  def change
  	add_column :quiz_banks ,:rubricks ,:boolean
  end
end
