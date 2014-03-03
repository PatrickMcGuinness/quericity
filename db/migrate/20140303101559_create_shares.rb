class CreateShares < ActiveRecord::Migration
  def change
    create_table :shares do |t|
      t.integer :shareable_id
      t.string :shareable_type
      t.integer :teacher_id
      t.timestamps
    end
  end
end
