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

  get "/quiz_banks" ,to:"quiz_banks#index" ,as: :quiz_banks
  get "/quiz_banks/without_repo" ,to:"quiz_banks#without_repo", as: :quiz_banks_without_repo
  get "/topics/search",to:"topics#search",as: :topics_search
  get "/questions/true_false_edit", to:"questions#true_false_edit",as: :true_false_edit
  get "/questions/open_ended_edit", to: "questions#open_ended_edit", as: :open_ended_edit
  get "/questions/fill_in_the_blank_edit", to: "questions#fill_in_the_blank_edit", as: :fill_in_the_blank_edit
  get "/questions/mcq_edit", to: "questions#mcq_edit", as: :mcq_edit
  get "quiz_banks/:id/update_title", to: "quiz_banks#update_title", as: :update_title
  get "quiz_banks/:id/add_instructions", to: "quiz_banks#add_instructions", as: :add_instructions
  get "repositories/:id/update_title", to: "repositories#update_title", as: :repo_update_title
  get "sections/:id/update_title", to: "sections#update_title", as: :section_update_title
  post "sections/change_question_positions", to: "sections#change_question_positions", as: :change_question_positions
  post "sections/change_question_section", to: "sections#change_question_section", as: :change_question_section
  post "sections/change_section_positions", to: "sections#change_section_positions", as: :change_section_positions
  post "sections/update_section_before_destroy", to: "sections#update_section_before_destroy", as: :update_section_before_destroy

  resources :question_topics
  resources :student_groups 
  resources :invites
  resources :contacts do
    collection do
      post "create_new_contacts"
    end
  end
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
    end 
  end
  resources :users do
    collection do
      post 'update_change_password'
    end 
    member do
      get 'profile'
      get 'change_password'
    end
  end
  resources :topics
  resources :repositories do
    collection do
      get 'shared'
    end
    member do
      get 'get_all_collaborators'
    end
    resources :collaborators
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
