class AddGradeToQuizBank < ActiveRecord::Migration
  def change
    add_column :quiz_banks, :grade, :integer
  end
end
