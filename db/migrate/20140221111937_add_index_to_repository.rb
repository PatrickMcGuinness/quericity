class AddIndexToRepository < ActiveRecord::Migration
  def change
    add_index :repositories, :slug, unique: true
  end
end
