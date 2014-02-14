class CreateClonedQuizBanks < ActiveRecord::Migration
  def change
    create_table :cloned_quiz_banks do |t|
      t.integer :description
      t.string  :title
      t.integer :repository_id
      t.integer :subject_id
      t.text    :instructions
      t.integer :quiz_bank_id
      t.timestamps
    end
  end
end
