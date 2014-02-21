class AddSlugToRepositories < ActiveRecord::Migration
  def change
    add_column :repositories,:slug,:string
  end
end
