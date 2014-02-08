class CreateServedQuizzes < ActiveRecord::Migration
  def change
    create_table :served_quizzes do |t|
      t.integer :owner_id
      t.integer :quiz_bank_id
      t.timestamps
    end
  end
end
