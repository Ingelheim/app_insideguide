get '/' do
  if session[:url]
    redirect 'map#{session[:url]'
  else  
  erb :index
end
end


get '/populate' do
  data = []
  url = params.keys.first
  map = Map.find_by_url(url)

  map.tags.each do |tag|
    data << [tag.latitude, tag.longitude, tag.place, tag.description, tag.select, FBHelper.get_fb_img(tag.user_fb_id.to_i), tag.user_name]
  end
  data.to_json
end


post '/data' do
	lat = params["lat"]
	lng = params["lng"]
  place = params["place"]
  description = params["description"]
  user_id = params["user_id"]
  user_name = params["user_name"]
  select = params["select"].capitalize

  tag = Tag.new(latitude: lat, longitude: lng, place: place, description: description.to_s, select: select, user_fb_id: user_id, user_name: user_name) 
  map = Map.find_by_url(params[:url])
  tag.map = map
  tag.save

  [tag.latitude, tag.longitude, tag.place, tag.description, tag.select, FBHelper.get_fb_img(tag.user_fb_id.to_i), tag.user_name].to_json
end


post '/create_map' do
  map = Map.create(user_id: current_user.id, longitude: params[:longtitude], latitude: params[:latitude], city: params[:city])
  # session[:url] = map.url
"insideguide.herokuapp.com/map/#{map.url}"
end


get '/map/:url' do
  url = params[:url]
  if session[:user_id]
    @map = Map.find_by_url(params[:url])
    @lat = @map.latitude
    @lng = @map.longitude
    @creator = @map.user
    @url = params[:url]
    erb :display_map
  else
    session[:url] = url
    redirect '/' 
  end  
end
