class AddPublicToQuizBanks < ActiveRecord::Migration
  def change
    add_column :quiz_banks, :public, :integer
  end
end
