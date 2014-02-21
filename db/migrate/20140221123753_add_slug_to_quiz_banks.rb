class AddSlugToQuizBanks < ActiveRecord::Migration
  def change
    add_column :quiz_banks, :slug, :string
    add_index :quiz_banks, :slug, unique:true
  end
end
