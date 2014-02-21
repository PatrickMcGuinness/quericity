namespace :additions do
  
  task :add_slug => :environment do
    # This task add new countries and new cities from the csv files to the databases
  	puts "Add slug to all repos"
    Repository.find_each(&:save)
    puts "done"
  end
end
