class CreateSharings < ActiveRecord::Migration
  def change
    create_table :sharings do |t|
      t.integer :quiz_bank_id
      t.integer :user_id
      t.timestamps
    end
  end
end
