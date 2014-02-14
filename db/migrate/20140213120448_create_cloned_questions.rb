class CreateClonedQuestions < ActiveRecord::Migration
  def change
    create_table :cloned_questions do |t|
      t.integer :seq
      t.text    :description
      t.integer :question_type
      t.integer  :difficulty_level
      t.string  :reference_url
      t.integer :cloned_section_id
      t.timestamps
    end
  end
end
