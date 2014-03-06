class AnalyticsController < ApplicationController

  before_filter :authenticate_user!

  def index
  	@served_quiz = current_user.served_quizzes.last if current_user.served_quizzes.present?
  end

  def show
    @served_quiz = current_user.served_quizzes.find(params[:id])
  end

  def all_quizzes
  	@served_quizzes = current_user.served_quizzes
  end

  def one_quiz
  	@served_quiz = current_user.served_quizzes.find(params[:id])
  end
  
  def all_students
  	@students = current_user.students
  end

  def one_student
  	@student = current_user.students.find(params[:id])
  end

  def all_subjects
  	@subjects = Subject.for_left_panel
  end

  def one_subject
  	@subject = Subject.find(params[:id])
  end

  def student_grades
    @sharing = Sharing.find(params[:id])
  end
end
