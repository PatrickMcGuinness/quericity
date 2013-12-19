class CreateQuizBanks < ActiveRecord::Migration
  def change
    create_table :quiz_banks do |t|
      t.string :title
      t.string :description
      t.references :repository
      t.timestamps
    end
  end
end
