class DropTableUserRepositories < ActiveRecord::Migration
  def up
    drop_table :user_repositories
  end
end
