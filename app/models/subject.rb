class Subject < ActiveRecord::Base
  attr_accessible :title

  def self.for_select
    subject_for_select = Subject.order("title ASC").map{|r| [r.title, r.id]}
    subject_for_select << ["Other",'other']
  end
end
