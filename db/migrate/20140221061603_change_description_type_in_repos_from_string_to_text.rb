class ChangeDescriptionTypeInReposFromStringToText < ActiveRecord::Migration
  def up
    change_column :repositories, :description,:text
  end

  def down
  end
end
