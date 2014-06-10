QuizLib::Application.routes.draw do

  mount Ckeditor::Engine => '/ckeditor'

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  
  post "sections/change_question_positions", to: "sections#change_question_positions", as: :change_question_positions
  post "sections/change_question_section", to: "sections#change_question_section", as: :change_question_section
  post "sections/change_section_positions", to: "sections#change_section_positions", as: :change_section_positions
  post "sections/update_section_before_destroy", to: "sections#update_section_before_destroy", as: :update_section_before_destroy
  get "/subjects", to: "subjects#index", as: :subjects
  get "/topics", to: "topics#index", as: :topics
  get "/home/verify_email", to: "home#verify_email", as: :verify_email
  resources :favourite_quiz_banks do
    member do
      get "is_favourite"
      
    end
  end
  
  
  
  resources :student_groups 
  resources :invites
  resources :answers do
    member do
      get "student_answers_in_served_quiz"
    end
  end
  resources :served_quizzes do
    member do
      get "pending"
      get "completed"
      get "invited"
      get "attempted_answers"
      get "graded_answers"
      get "questions_to_grade"
      get "questions_to_attempt"
      get "student_quiz_report"
      get "quiz_report"
      get "histogram_data"
    end
    collection do
      get "student_served_quizzes"
      get "student_started_quizzes"
      get "student_pending_quizzes"
      get "student_attempted_quizzes"
      get "first_served_quiz"
    end
    resources :sharings do
      collection do
        get "student_sharing"
      end
    end
  end
  resources :groups do
    member do
      get 'get_student_groups'
      get 'students'
    end
  end
  resources :users do
    collection do
      get 'get_current_user'
      get 'get_students'
      get 'system_students'
      get "get_served_students"
      get "search_teacher_by_email"
    end
    member do
      get 'get_student_details'
      get "bar_graph_data"
      get "line_graph_data"
      get "dashboard_details"
      get "dashboard_bar_graph_data"
      get "dashboard_line_graph_data"
      post "upload_image"
    end
  end
  resources :topics do
    collection do
      get "search"
    end
  end
  resources :repositories do
    collection do
      get "default_repo"
    end
  end

  resources :quiz_banks do
    collection do
      get "shared_quiz_banks"
      get "quiz_banks_list"
    end
    member do
      get "repo_quiz_banks"
      get "clone"
      get "questions"
      get "share_with_list"
    end
    resources :cloned_quiz_banks do
      collection do
        get "create_the_clone"
      end
      resources :cloned_questions do
        resources :cloned_question_options
      end
    end
    resources :question_topics do
      collection do
        get "destroy_all"
      end
    end
    resources :sections do
      resources :questions do
        resources :question_options
      end
    end
  end

  namespace :students do

    resources :users do
      member do
        get "profile"
      end
    end
  end

  
  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'
  
  root :to => "home#index"
  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
