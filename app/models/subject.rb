class Subject < ActiveRecord::Base
  attr_accessible :title
  
  has_many :cloned_quiz_banks
  has_many :quiz_banks

  def self.for_select
    subject_for_select = Subject.order("title ASC").map{|r| [r.title, r.id]}
    subject_for_select << ["Other",'other']
  end

  def self.for_left_panel
  	Subject.joins(:cloned_quiz_banks).uniq
  end

  def average
  	#Subject.joins()/Subject.joins(:cloned_quiz_banks).count
  end
end
