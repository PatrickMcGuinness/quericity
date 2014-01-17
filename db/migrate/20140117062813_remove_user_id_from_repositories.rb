class RemoveUserIdFromRepositories < ActiveRecord::Migration
  def up
  	remove_column :repositories, :user_id
  end

  def down
  end
end
