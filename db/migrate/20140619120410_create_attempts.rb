class CreateAttempts < ActiveRecord::Migration
  def change
    create_table :attempts do |t|
      t.integer :sharing_id
      t.integer :served_quiz_id
      t.timestamps
    end
  end
end
