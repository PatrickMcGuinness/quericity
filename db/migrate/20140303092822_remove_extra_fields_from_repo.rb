class RemoveExtraFieldsFromRepo < ActiveRecord::Migration
  def up
    remove_column :repositories, :description
    remove_column :repositories, :public
  end

  def down
  end
end
