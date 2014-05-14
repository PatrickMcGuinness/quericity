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

    STDERR.puts "********************* Adding 2 Section in the Quiz Banks ***********"

    question_types = [1,2,3,4]
    sections = []
    QuizBank.find_each do |quiz_bank|
      2.times do |n|
        sections << Section.new(:title => "Section #{n}", :quiz_bank_id => quiz_bank.id)
      end
    end

    STDERR.puts "Adding Sections in Database"

    Section.import sections

    STDERR.puts "Adding 4 Question in each section **************"

    questions = []
    question_types.each do |q_type|
      Section.find_each do |section|
        #Faker::Lorem.sentence(rand(2..10))
        question_type = q_type
        difficulty_level = [1,2,3].sample
        section_id = section.id
        questions << Question.create(:description => "This is the description of the question",:question_type => question_type,
          :difficulty_level => difficulty_level,:section_id => section_id)
      end
    end
    
    STDERR.puts "******** Adding the questions in database"
    
    #Question.import questions
    
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
          :is_correct => true, :answer => "asdfas dkfsa kldjf aslkjdfh aksljdhflkasjhdfklajsf")#Faker::Lorem.sentence(rand(2..10)))
      end

      if question.question_type == 4
        question_options << QuestionOption.new(:question_id => question.id,
          :is_correct => true, :answer => "blank")
      end
    end

    STDERR.puts "Adding the question options to databse *********"

    QuestionOption.import question_options
    
    STDERR.puts "***************************************************"
    STDERR.puts "Adding 8 Students"
    8.times do |n|
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
      5.times do |n|
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

  task serve_quizzes: :environment do

    STDERR.puts "***********Serving the quizzes *********"
    sharings = []
    User.where("role = ?",'Professor').each do |user|
      user.quiz_banks.each do |quiz_bank|
        cloned_quiz_bank = ClonedQuizBank.create(:description => quiz_bank.description,
          :repository_id => quiz_bank.repository_id, :quiz_bank_id => quiz_bank.id,
          :title => quiz_bank.title, :subject => quiz_bank.subject, :instructions => quiz_bank.instructions)
        quiz_bank.questions.each do |question|
          cloned_question = ClonedQuestion.create(:description => question.description, :question_type => question.question_type,
            :difficulty_level => question.difficulty_level,:cloned_quiz_bank_id => cloned_quiz_bank.id)
          question.question_options.each do |question_option|
            ClonedQuestionOption.create(:answer => question_option.answer,
              :cloned_question_id => cloned_question.id,:is_correct => question_option.is_correct)
          end
        end
        served_quiz = ServedQuiz.create(:owner_id => user.id, :quiz_bank_id => quiz_bank.id,:answer => ServedQuiz::Answers::AFTERQUIZ,:date => Time.now - (2*24*60*60),
                :close_date => Time.now + (2*7*24*60*60),:end_time => Time.now + (2*7*24*60*60), 
                  :instructions => quiz_bank.instructions,:random => ServedQuiz::Random::NO,:start_time => Time.now - (2*24*60*60),
                  :infinite_duration => ServedQuiz::Infinite::YES, :show_all_questions => ServedQuiz::ShowAllQuestions::YES, :cloned_quiz_bank_id => cloned_quiz_bank.id)
        user.students.each do |student|
          sharings << Sharing.new(:user_id => student.id, :served_quiz_id => served_quiz.id, :status => Sharing::Status::PENDING)
        end
      end
    end
    
    Sharing.import sharings
    
    #STDERR.puts "****** Done with serving the quizzes **********"
    #STDERR.puts "************ Now Students Attempting the quizzes ******"

    #answers = []
    
    #Sharing.find_each do |sharing|
      #cloned_questions = sharing.served_quiz.cloned_quiz_bank.cloned_questions
      #cloned_questions.each do |cloned_question|
        #if cloned_question.question_type == 1
          
          #student_answer = [true,false].sample
          
          #is_correct = true if  student_answer == cloned_question.cloned_question_options.first.is_correct
          #is_correct = false unless student_answer == cloned_question.cloned_question_options.first.is_correct
          
          #answers << Answer.new(:student_id => sharing.user_id, :cloned_question_id => cloned_question.id,
          #:student_answer => student_answer, :answer => cloned_question.cloned_question_options.first.is_correct, :is_correct => is_correct,
          #:served_quiz_id => sharing.served_quiz_id, :graded_by_teacher => 0)
        
        #end
        
        #if cloned_question.question_type == 2
          
          #question_option = cloned_question.cloned_question_options.sample
          
          #is_correct = [true,false].sample
          
          #answers << Answer.new(:student_id => sharing.user_id, :cloned_question_id => cloned_question.id,
          #:student_answer => question_option.answer, :answer => cloned_question.cloned_question_options.first.is_correct, :is_correct => is_correct,
          #:served_quiz_id => sharing.served_quiz_id, :graded_by_teacher => 0)
        #end
        
        #if cloned_question.question_type == 3
          
          #student_answer = Faker::Lorem.sentence(rand(2..10))
          
          #answers << Answer.new(:student_id => sharing.user_id, :cloned_question_id => cloned_question.id,
          #:student_answer => student_answer, :answer => cloned_question.cloned_question_options.first.answer, :is_correct => false,
          #:served_quiz_id => sharing.served_quiz_id, :graded_by_teacher => 0)
        #end

        #if cloned_question.question_type == 4
          #student_answer = ["blank","sdfasdfs"].sample
          #is_correct = true if student_answer == cloned_question.cloned_question_options.first.answer
          #is_correct = false unless student_answer == cloned_question.cloned_question_options.first.answer

          #answers << Answer.new(:student_id => sharing.user_id, :cloned_question_id => cloned_question.id,
          #:student_answer => student_answer, :answer => cloned_question.cloned_question_options.first.answer, :is_correct => is_correct,
          #:served_quiz_id => sharing.served_quiz_id, :graded_by_teacher => 0)
        
        #end
      #end 
    #end
    #Answer.import answers
  end
end