get '/' do
  @users = User.all
  @fb_login_link = FBHelper.get_login_link
  erb :index
end


get '/facebook_auth' do
	user = FBHelper.get_new_access_token(params[:code])
	session[:user_id] = user.id
	redirect to '/'
end


get '/logout' do 
	session[:user_id] = nil
	redirect to '/'
end
