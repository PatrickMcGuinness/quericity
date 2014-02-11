class ServedQuiz < ActiveRecord::Base
  attr_accessible :owner_id, :quiz_bank_id,:answer, :duration, :date, :close_date, :instructions,:random,:start_time

  validates :owner_id, presence:true
  validates :quiz_bank_id, presence: true


  belongs_to :owner, :class_name => "User", :foreign_key => "owner_id"
  belongs_to :quiz_bank
  has_many :sharings

  class Random
    YES = 1
    NO = 2
  end
  class Answer
    YES = 1
    NO = 2
  end

  def background_job_for_create(user,student_ids,invite_ids)
    if student_ids.present?
      student_ids.each do |student_id|
        Sharing.create(:user_id => student_id,:served_quiz_id => self.id)
      end
    end
    invites = Invite.find_by_list(invite_ids)
    default_group = user.default_group
    invites.each do |invite|
      new_user = User.invite!({:email => invite.receiver_email, :role => "Student"},user)
      Sharing.create(:user_id => new_user.id,:served_quiz_id => self.id)
      StudentGroup.create(:group_id => default_group.id, :student_id => new_user.id)
    end
    Invite.where("invitable_id = ? and invitable_type = ?",self.quiz_bank_id,"QuizBank").destroy_all
  end
  handle_asynchronously :background_job_for_create, :run_at => Proc.new { Time.now }
end
