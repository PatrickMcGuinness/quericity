class RemoveColumnsFromSharingsTable < ActiveRecord::Migration
  def change
    remove_column :sharings, :quiz_bank_id
    remove_column :sharings, :owner_id
    add_column :sharings, :served_quiz_id, :integer
  end
end
