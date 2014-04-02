class AddStatusToTheQuizBanks < ActiveRecord::Migration
  def change
    add_column :quiz_banks, :status, :integer, :default => 0
  end
end
