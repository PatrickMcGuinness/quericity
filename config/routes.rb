QuizLib::Application.routes.draw do

  devise_for :users

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
  resources :question_topics
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
    resources :collaborators
    resources :quiz_banks, :except => :index do
      resources :sections do
        resources :questions
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
