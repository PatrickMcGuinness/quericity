class AddPublicToRepository < ActiveRecord::Migration
  def change
    add_column :repositories, :public, :integer, :default => 0
  end
end
