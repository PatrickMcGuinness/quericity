class AddServeQuizIdToAnswer < ActiveRecord::Migration
  def change
    add_column :answers, :served_quiz_id, :integer
  end
end
