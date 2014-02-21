class ChangeTheDescriptionOfQuizBankFromStringToText < ActiveRecord::Migration
  def up
    change_column :quiz_banks, :description, :text
  end

  def down
  end
end
