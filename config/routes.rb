Rails.application.routes.draw do
  resources :user_ruby_methods
  resources :ruby_methods
  resources :ruby_modules
  get 'home/index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
