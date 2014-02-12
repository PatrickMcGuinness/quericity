class AddInstructionsToQuizBank < ActiveRecord::Migration
  def change
    add_column :quiz_banks, :instructions, :text
  end
end
