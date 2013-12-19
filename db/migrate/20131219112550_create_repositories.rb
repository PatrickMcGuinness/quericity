class CreateRepositories < ActiveRecord::Migration
  def change
    create_table :repositories do |t|
      t.string :title
      t.string :description
      t.references :user
      t.timestamps
    end
  end
end
