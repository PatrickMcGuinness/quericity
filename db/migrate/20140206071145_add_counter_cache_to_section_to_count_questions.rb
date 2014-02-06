class AddCounterCacheToSectionToCountQuestions < ActiveRecord::Migration
  def change
    add_column :sections, :questions_count, :integer, :default => 0
  end
end
