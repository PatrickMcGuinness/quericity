class AddDeletedAtToReposQuizBanksSections < ActiveRecord::Migration
  def change
    add_column :repositories, :deleted_at, :datetime, :default => nil
    add_column :quiz_banks, :deleted_at, :datetime, :default => nil
    add_column :sections, :deleted_at, :datetime, :default => nil
  end
end
