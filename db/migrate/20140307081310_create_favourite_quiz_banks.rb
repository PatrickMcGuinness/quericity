class CreateFavouriteQuizBanks < ActiveRecord::Migration
  def change
    create_table :favourite_quiz_banks do |t|
      t.integer :user_id
      t.integer :quiz_bank_id
      t.timestamps
    end
  end
end
