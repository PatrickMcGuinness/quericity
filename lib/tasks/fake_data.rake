namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do


    
    STDERR.puts "***************************************************"
    STDERR.puts "Adding Students"
    7.times do |n|
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

  end
end



