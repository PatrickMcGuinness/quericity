class UserMailer < ActionMailer::Base
  default from: 'notification@quericity.com'
 
  def welcome_email(collaborator)
    @user = collaborator
    mail(to: @user.email, subject: 'Added as collaborator')
  end

  def quiz_served_student_email(student,teacher,served_quiz)
  	@student = student
  	@teacher = teacher
  	@served_quiz = served_quiz
  	mail(to: @student.email, subject: "New Quiz Served")
  end

  def quiz_served_notification(teacher,served_quiz)
    @teacher = teacher
    @served_quiz = served_quiz
    mail(to: @teacher.email, subject: "Quiz Served")
  end

  def quiz_bank_shared_notification(teacher,owner,quiz_bank)
    @teacher = teacher
    @owner = owner
    @quiz_bank = quiz_bank
    mail(to: @teacher.email, subject: "Quiz shared with you")
  end

end
