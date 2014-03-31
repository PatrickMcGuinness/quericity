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
  resources :favourite_quiz_banks do
    member do
      get "is_favourite"
      
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
  
  
  
  resources :student_groups 
  resources :invites
  resources :groups do
    member do
      get 'get_student_groups'
    end
  end
  resources :users do
    collection do
      get 'get_current_user'
      get 'get_students'
      get 'system_students'
    end
  end
  resources :topics
  resources :repositories do
    collection do
      get "default_repo"
    end
  end

  resources :quiz_banks do
    collection do
      get "shared_quiz_banks"
    end
    member do
      get "repo_quiz_banks"
      get "clone"
    end
    resources :question_topics
    resources :sections do
      resources :questions do
        resources :question_options
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
