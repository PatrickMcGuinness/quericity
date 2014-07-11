class AddValuesToGradeInQuizBanks < ActiveRecord::Migration
  def change
    QuizBank.where("status = ?", QuizBank::Status::SAVED).update_all(:grade => 12)
  end
end
