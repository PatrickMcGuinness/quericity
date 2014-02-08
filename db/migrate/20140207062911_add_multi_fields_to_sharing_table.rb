class AddMultiFieldsToSharingTable < ActiveRecord::Migration
  def change
    add_column :sharings, :date, :datetime
    add_column :sharings, :close_date, :datetime
    add_column :sharings, :duration, :integer
    add_column :sharings, :answer, :integer
    add_column :sharings, :random, :integer
    add_column :sharings, :instructions, :text
  end
end
