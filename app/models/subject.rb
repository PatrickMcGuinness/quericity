class Subject < ActiveRecord::Base
  attr_accessible :title

  def self.for_select
    Subject.all.map{|r| [r.title, r.id]}
  end
end
