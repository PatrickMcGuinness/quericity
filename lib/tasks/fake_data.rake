namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do

    
    
    STDERR.puts "***************************************************"
    
    STDERR.puts "Adding User it will take some time as each creation generates an email"
    
    STDERR.puts "***************Adding 5 Teachers*******************"
    
    5.times do |n|
      f_name = Faker::Name.first_name
      l_name = Faker::Name.last_name
      email = Faker::Internet.safe_email(f_name)
      password = "password"
      role = "Professor"
      user = User.new(email: email,
                      password: password,
                      password_confirmation: password,
                      first_name: f_name,
                      last_name: l_name,
                      role: role
      )
      user.save!
      user.confirm!  
    end
    STDERR.puts "Adding 10 repositories for each teacher" 
    repositories = []
    
    User.find_each do |user|
      10.times do |n|
        repositories << Repository.new(:title => "repo#{n}", :user_id => user.id)
      end
    end

    STDERR.puts "********************* Saving Repositories in database ***************"

    Repository.import repositories

    STDERR.puts "************************** Adding 5 Quizzes in Each Repository *****"
    quiz_banks = []
    Repository.find_each do |repo|
      title = Faker::Lorem.words(rand(2..4)).join("")
      description = Faker::Lorem.sentence(rand(2..10))
      repository_id = repo.id
      subject = Faker::Lorem.words(rand(2..4)).join("")
      instructions =  Faker::Lorem.paragraphs(rand(2..8)).join("")
      public = [0,1].sample
      status = 1 
      quiz_banks << QuizBank.new(:description => description, :title => title, 
        :repository_id => repository_id, :subject => subject, :instructions => instructions,
        :public => public,:status => status)
    end

    STDERR.puts "****************** Saving Quiz Banks to Database **********"
    QuizBank.import quiz_banks

    STDERR.puts "********************* Adding 4 Section in the Quiz Banks ***********"

    question_types = [1,2,3,4]
    sections = []
    QuizBank.find_each do |quiz_bank|
      4.times do |n|
        sections << Section.new(:title => "Section #{n}", :quiz_bank_id => quiz_bank.id)
      end
    end

    STDERR.puts "Adding Sections in Database"

    Section.import sections

    STDERR.puts "Adding 4 Question in each section **************"

    questions = []
    question_types.each do |q_type|
      Section.find_each do |section|
        description = Faker::Lorem.sentence(rand(2..10))
        question_type = q_type
        difficulty_level = [1,2,3].sample
        section_id = section.id
        questions << Question.new(:description => description,:question_type => question_type,
          :difficulty_level => difficulty_level,:section_id => section_id)
      end
    end
    
    STDERR.puts "******** Adding the questions in database"
    
    Question.import questions
    
    STDERR.puts "*********** Adding options in the questions ****"

    question_options = []
    
    Question.find_each do |question|
      if question.question_type == 1
        question_options << QuestionOption.new(:question_id => question.id,
          :is_correct => true, :answer => "True")
      end
      if question.question_type == 2
        
        question_options << QuestionOption.new(:question_id => question.id,
          :is_correct => true, :answer => "This is the correct statement")
        question_options << QuestionOption.new(:question_id => question.id,
          :is_correct => false, :answer => "This is the false statement")
        question_options << QuestionOption.new(:question_id => question.id,
          :is_correct => false, :answer => "This is the false statement")
        question_options << QuestionOption.new(:question_id => question.id,
          :is_correct => false, :answer => "This is the false statement")
      
      end
      
      if question.question_type == 3 
        question_options << QuestionOption.new(:question_id => question.id,
          :is_correct => true, :answer => Faker::Lorem.sentence(rand(2..10)))
      end

      if question.question_type == 4
        question_options << QuestionOption.new(:question_id => question.id,
          :is_correct => true, :answer => "blank")
      end
    end

    STDERR.puts "Adding the question options to databse *********"

    QuestionOption.import question_options
    
    STDERR.puts "***************************************************"
    STDERR.puts "Adding 20 Students"
    20.times do |n|
       f_name  = Faker::Name.first_name
      l_name  = Faker::Name.last_name
      email = "student-#{n+1}@quizlib.com"
      password  = "password"
      role = "Student"
      user = User.new(email: email,
                      password: password,
                      password_confirmation: password,
                      first_name: f_name,
                      last_name: l_name,
                      role: role
      )

      user.save!
      user.confirm!
    end


    STDERR.puts "Adding 10 Groups for each teacher"

    groups = []
    User.where("role = ?",'Professor').each do |user|
      10.times do |n|
        groups << Group.new(:title => "Group #{n}", :owner_id => user.id)
      end
    end

    STDERR.puts "Saving the groups in the database"

    Group.import groups

    STDERR.puts "Adding Random number of students in each group"

    student_groups = []
    Group.find_each do |group|
      student_ids = User.where("role = ?","Student").sample(rand(User.select{|u| u.is_student?}.count)).map(&:id)
      student_ids.each do |student_id|
        student_groups << StudentGroup.new(:student_id => student_id, :group_id => group.id)
      end
    end

    StudentGroup.import student_groups



  end
end