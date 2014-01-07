class CreateQuestions < ActiveRecord::Migration
  def change
    create_table :questions do |t|
      t.integer :subject_id
      t.integer :seq, :default => 0
      t.text :description
      t.integer :type
      t.integer :difficulty_level
      t.text :reference_url
      t.integer :section_id
      t.timestamps
    end
  end
end
