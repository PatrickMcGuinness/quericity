class CreateClonedSections < ActiveRecord::Migration
  def change
    create_table :cloned_sections do |t|
      t.string :title
      t.integer :seq
      t.integer :cloned_quiz_bank_id
      t.timestamps
    end
  end
end
