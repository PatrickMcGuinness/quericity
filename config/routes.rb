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

  get "/topics/search",to:"topics#search",as: :topics_search
  get "/questions/true_false_edit", to:"questions#true_false_edit",as: :true_false_edit
  get "/questions/open_ended_edit", to: "questions#open_ended_edit", as: :open_ended_edit
  get "/questions/fill_in_the_blank_edit", to: "questions#fill_in_the_blank_edit", as: :fill_in_the_blank_edit
  get "/questions/mcq_edit", to: "questions#mcq_edit", as: :mcq_edit
  get "quiz_banks/:id/update_quiz_bank", to: "quiz_banks#update_quiz_bank", as: :update_quiz_bank
  get "quiz_banks/:id/add_instructions", to: "quiz_banks#add_instructions", as: :add_instructions
  get "sections/:id/update_title", to: "sections#update_title", as: :section_update_title
  post "sections/change_question_positions", to: "sections#change_question_positions", as: :change_question_positions
  post "sections/change_question_section", to: "sections#change_question_section", as: :change_question_section
  post "sections/change_section_positions", to: "sections#change_section_positions", as: :change_section_positions
  post "sections/update_section_before_destroy", to: "sections#update_section_before_destroy", as: :update_section_before_destroy
  post "/quiz_banks/change_repo", to: "quiz_banks#change_repo", as: :change_repo
  
  resources :favourite_quiz_banks do
    member do
      get "make_favourite"
      get "make_unfavourite"
      get "make_stared_favourite"
      get "make_stared_unfavourite"
      get "make_shared_favourite"
      get "make_shared_unfavourite"
    end
  end
  resources :shares do
    member do
      get "make_public"
      get "make_private"
      get "make_stared_private"
      get "make_stared_public"
      get "make_shared_private"
      get "make_shared_private" 
    end 
  end
  resources :analytics do
    collection do
      get "all_quizzes"
      get "all_students"
      get "all_subjects"
    end
    member do
      get "student_grades"
      get "one_quiz"
      get "one_subject"
      get "one_student"
    end
  end
  resources :grade_quizzes do
    member do
      get "manual_check_the_answer"
      get "completed_students"
    end
  end
  resources :manage_quiz_banks do
    collection do
      get "starred_assessments"
      get "shared_assessments"
    end
  end
  resources :question_topics
  resources :student_groups 
  resources :invites
  resources :groups do
    member do
      get "get_student"
      get "edit_title"
      get "get_all_students"
      get "get_all_students_in_group" 
    end
    collection do
      get "search_group"
      get "add_students"
      get "add_students_edit"
    end 
  end
  resources :served_quizzes do
    collection do
      get "history_search"
      get "get_all_students"
      get "add_more_students" 
    end
    member do
      get "show_all_sharings"
      get "get_instructions"
      get "get_all_questions"
      get "get_status"
      get "invited_students"
      get "completed_students"
      get "pending_students"
      get "show_questions_to_grade"
    end 
  end
  resources :users do
    collection do
      post 'update_change_password'
      post "search_name_email_id"
    end 
    member do
      get 'profile'
      get 'change_password'
    end
  end
  resources :topics
  resources :repositories do
    resources :collaborators do
      collection do
        get 'public'
      end
    end
    resources :quiz_banks, :except => :index do
      member do
        get "quiz_preview"
      end
      resources :sections do
        resources :questions
        member do
          get "section_before_destroy"
        end
      end
    end
  end

  namespace :students do
    resources :quiz_banks do
      collection do
        get "attempted"
        get "pending"
        post "check_answer"
        get "answer_sheet"
      end
      member do
        get "take_quiz"
        get "attempt_quiz"
      end
    end

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
