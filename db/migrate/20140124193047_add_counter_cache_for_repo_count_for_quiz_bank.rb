class AddCounterCacheForRepoCountForQuizBank < ActiveRecord::Migration
  def change
    add_column :repositories, :quiz_banks_count, :integer, :default => 0
  end
end
