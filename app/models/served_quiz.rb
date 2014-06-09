class ServedQuiz < ActiveRecord::Base
  attr_accessible :owner_id, :no_expiration,:quiz_bank_id,:answer, :duration, :date, :close_date,:end_time, 
                  :instructions,:random,:start_time,:infinite_duration,:number_of_questions, :status,
                  :same_questions,:show_in_sequence, :show_all_questions, :questions_per_page,:cloned_quiz_bank_id

  #validates :owner_id, presence:true
  #validates :quiz_bank_id, presence: true


  belongs_to :owner, :class_name => "User", :foreign_key => "owner_id"
  belongs_to :quiz_bank
  belongs_to :cloned_quiz_bank
  has_many :sharings, dependent: :destroy
  #has_many :answers, dependent: :destroy

  validates :owner_id, :quiz_bank_id,:close_date,:date,:cloned_quiz_bank_id, presence: true
  #validates :start_time, :end_time, presence: true 
  
  class Random
    YES = 1
    NO = 0
  end
  
  class Infinite
    YES = 1
    NO = 0
  end

  class Answers
    AFTERQUESTION = 1
    AFTERQUIZ = 2
    DONTSHOW = 3
    def self.get_all_answers
      [["After Question",1],["After Quiz",2],["Don't Show",3]]
    end
  end

  class Sequence
    NO = 0
    YES = 1
  end

  class ShowAllQuestions
    NO = 0
    YES = 1
  end

  class NoExpiration
    NO = 0
    YES = 1
  end

  class Status
    OPEN = 0
    CLOSE = 1
  end


  def pending_sharings
    self.sharings.where("status = ?",Sharing::Status::STARTED)
  end

  def completed_sharings
    self.sharings.where("status = ?",Sharing::Status::ATTEMPTED)
  end

  def invited_sharings
    self.sharings.where("status = ?",Sharing::Status::PENDING)
  end

  def attempted_answers
    Answer.where("served_quiz_id = ?",self.id)
  end
  
  def show_all_questions_in_preview?
    self.show_all_questions == ServedQuiz::ShowAllQuestions::YES
  end

  def open_ended_questions_in_answered_questions
    self.cloned_quiz_bank.cloned_questions.joins(:answers).where("cloned_questions.question_type = ?",Question::QuestionType::OPENENDED)
  end

  def open_ended_questions_to_grade
    self.cloned_quiz_bank.cloned_questions.joins(:answers).where("cloned_questions.question_type = ? and answers.graded_by_teacher = ?", Question::QuestionType::OPENENDED, 0)
  end

  def open_ended_answers_to_grade
    Answer.joins(:cloned_question).where("cloned_questions.question_type = ? and answers.served_quiz_id = ? and answers.graded_by_teacher = ?",Question::QuestionType::OPENENDED,self.id,0)
  end

  def all_students_average_in_quiz
    (self.sharings.map{|s| s.get_correct_answers_count}.inject(:+) * 100)/self.cloned_quiz_bank.cloned_questions.count
  end

  def graded_answers
    ids = self.open_ended_answers_to_grade.pluck(:id)
    answers = self.attempted_answers if ids.blank? 
    answers = self.attempted_answers.where("id NOT IN (?)",ids) unless ids.blank? 
    #self.attempted_answers.count - self.open_ended_questions_to_grade.count
    answers
  end

  def graded_by_system
    self.cloned_quiz_bank.cloned_questions.joins(:answers).count - self.open_ended_questions_to_grade.count
  end

  def is_infinite?
    self.infinite_duration == ServedQuiz::Infinite::YES
  end

  def quiz_is_random?
    self.random == ServedQuiz::Random::YES
  end

  def show_answer_after_question?
    self.answer == ServedQuiz::Answers::AFTERQUESTION
  end

  def is_expired?
    self.close_date.day <= Date.today.day and self.end_time < Time.now
  end

  def is_not_served?
    self.date.day >= Date.today.day and self.start_time > Time.now
  end


  def is_served?
    self.date.day <= Date.today.day and self.start_time < Time.now
  end

  def show_answer_after_quiz?
    self.answer == ServedQuiz::Answers::AFTERQUIZ
  end

  def dont_show_answer?
    self.answer == ServedQuiz::Answers::DONTSHOW
  end

  def histogram_data
    common = {averages:["below 60","60-70","70-80","80-90","above 90"], students: [0,0,0,0,0]}
    self.sharings.each do |sharing|
      average = sharing.get_average
      common[:students][0] = common[:students][0] + 1 if average < 60
      common[:students][1] = common[:students][1] + 1 if average >= 60 and average < 70
      common[:students][2] = common[:students][2] + 1 if average >= 70 and average < 80
      common[:students][3] = common[:students][3] + 1 if average >= 80 and average < 90
      common[:students][4] = common[:students][4] + 1 if average > 90 
    end
    common
  end

  def self.get_time_zone_hrs_min(user)
    user.time_zone.to_s.split(".").collect{|i| i.to_i}
  end
  
  def self.create_served_quiz(user,params)
    quiz_bank = QuizBank.find(params[:served_quiz][:quiz_bank_id])
    cloned_quiz_bank = ClonedQuizBank.create_the_clone(quiz_bank)
    if params[:random].to_i == 0
      ServedQuiz.clone_question_list(params,cloned_quiz_bank)
    else
      ClonedQuestion.create_random(cloned_quiz_bank,quiz_bank,params[:number_of_questions].to_i)
    end
    params[:served_quiz][:cloned_quiz_bank_id] = cloned_quiz_bank.id
    served_quiz = user.served_quizzes.create(params[:served_quiz])
    Sharing.share_with_student_list(served_quiz, params[:selected_students])
    served_quiz.delay.send_emails
    served_quiz
  end

  def send_emails
    self.sharings.each do |sharing|
      UserMailer.quiz_served_student_email(sharing.user,self.owner,self).deliver
    end

    
  end

  def self.clone_question_list(params,cloned_quiz_bank)
    params[:selected_questions].each do |selected_question|
      ClonedQuestion.create_the_clone(cloned_quiz_bank,selected_question[:id])
    end
  end

  def self.get_start_local_time(served_quiz,user)
    time_zone_hrs_min = ServedQuiz.get_time_zone_hrs_min(user)
    ServedQuiz.local_time(served_quiz.date,time_zone_hrs_min)

  end

  def self.get_end_local_time(served_quiz,user)
    
    time_zone_hrs_min = ServedQuiz.get_time_zone_hrs_min(user)

    ServedQuiz.local_time(served_quiz.close_date,time_zone_hrs_min)
  end

  
  def self.local_time(date,time_zone_hrs_min)
    minutes = date.min
    hours = date.hour
    if(time_zone_hrs_min[0] > 0)
      minutes = minutes + time_zone_hrs_min[1]
      if(minutes > 60)
        minutes = minutes%60
        hours = hours + 1
      end
    else
      minutes = minutes - time_zone_hrs_min[1]
      if(minutes < 0)
        hours = hours - 1
        minutes = 60 - minutes.abs
      end
    end
    hours = hours + time_zone_hrs_min[0]
    served_quiz_day = date.change(:hour => hours)
    served_quiz_day = served_quiz_day.change(:min => minutes)
    if(hours < 0)
      hours = 24 - (hours.abs)
      day = date.day - 1
      served_quiz_day = day.change(:day => day)
      served_quiz_day = served_quiz_day.change(:hour => hours)
      served_quiz_day = served_quiz_day.change(:min => minutes)
    end
    
    if(hours > 24)
      hours = (hours.abs)%24
      day = date.day + 1
      served_quiz_day = day.change(:day => day)
      served_quiz_day = served_quiz_day.change(:hour => hours)
      served_quiz_day = served_quiz_day.change(:min => minutes)
    end
    served_quiz_day
  end

  
  
  
  
  
  def get_quiz_report
    common = {served_quiz: self.as_json(),Answers: Answer.where("served_quiz_id = ?",self.id).as_json(),correct_answers:Answer.quiz_correct_answers(self),
    wrong_answers:Answer.quiz_wrong_answers(self).as_json(), sharings: []}
    self.sharings.each do |sharing|
      common[:sharings].push({id: sharing.id, user:sharing.user.as_json(),served_quiz_id: sharing.served_quiz_id,attempted_answers: Answer.student_answers_in_served_quiz(self,sharing.user).as_json(),
        correct_answers: Answer.student_correct_answers(self,sharing.user).as_json(), 
        wrong_answers: Answer.student_wrong_answers(self,sharing.user).as_json(),graded_answers: self.graded_answers.as_json()})
      
    end
    common
  end

  def question_number(user)
    count = user.answers.where("served_quiz_id = ?",self.id).count
    count = count + 1
  end
  
  def self.answer_options_for_select
    ServedQuiz::Answers.get_all_answers
  end

  def get_average
    total_sharing = self.sharings.count
    sum = self.sharings.map{|s| s.get_average}.inject(:+)
    average = (sum/total_sharing)
  end
  
  def serve_to_group(group)
    student_ids = group.student_groups.pluck(:student_id)
    self.share_with_student_ids(student_ids)
  end



  def share_with_student_ids(student_ids)
    student_ids.each do |student_id|
      Sharing.create(:user_id => student_id, :served_quiz_id => self.id)
    end
  end

  def self.create_the_clone(params)
    quiz_bank_id = params[:served_quiz][:quiz_bank_id]
    quiz_bank = QuizBank.find(quiz_bank_id)
    ClonedQuizBank.create_the_clone(quiz_bank,params)
  end

  def questions_to_attempt(student)
    attempted_questions_id = self.cloned_quiz_bank.cloned_questions.joins(:answers).where("answers.student_id = ?",student.id).pluck(:id)
    questions = self.cloned_quiz_bank.cloned_questions if attempted_questions_id.blank?
    questions = self.cloned_quiz_bank.cloned_questions.where("id NOT IN (?)",attempted_questions_id) unless attempted_questions_id.blank?
    questions
  end
  def as_json(opts = nil)
    opts ||={}
    {
      :id  => id,
      :answer => answer,
      :duration => duration,
      :date => date,
      :close_date => close_date,
      :end_time => end_time,
      :no_expiration => no_expiration,
      :close_status => status,
      :created_at => created_at,
      :updated_at => updated_at,
      :quiz_bank => quiz_bank_id,
      :owner => owner.as_json(),
      :sharings => sharings.as_json(),
      :pending_sharings => pending_sharings.as_json(),
      :completed_sharings => completed_sharings.as_json(),
      :invited_sharings => invited_sharings.as_json(),
      :instructions => instructions,
      :random => random,
      :start_time => start_time,
      :infinite_duration => infinite_duration,
      :number_of_questions => number_of_questions, 
      :same_questions => same_questions,
      :show_in_sequence => show_in_sequence, 
      :show_all_questions => show_all_questions, 
      :questions_per_page => questions_per_page,
      :cloned_quiz_bank => cloned_quiz_bank.as_json(),
      :local_date => self.date,
      :local_close_date => self.close_date  
    }
    
  end
end
