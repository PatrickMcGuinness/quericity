class CreateUserRepositories < ActiveRecord::Migration
  def change
    create_table :user_repositories do |t|
      t.references :user
      t.references :repository
      t.string :permission
      t.timestamps
    end
  end
end
