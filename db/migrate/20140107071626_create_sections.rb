class CreateSections < ActiveRecord::Migration
  def change
    create_table :sections do |t|
      t.integer :seq, :default => 0 
      t.integer :quiz_bank_id
      t.string :title
      t.timestamps
    end
  end
end
