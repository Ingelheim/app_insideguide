class FBHelper
	def self.get_new_access_token(connection_code)

		facebook_response = CGI::parse(open("https://graph.facebook.com/oauth/access_token?client_id=#{FACEBOOK_APP_ID}&redirect_uri=http://insideguide.herokuapp.com/facebook_auth&client_secret=#{FACEBOOK_SECRET}&code=#{connection_code}").read)
		access_token = facebook_response["access_token"][0]
		@token_expiration_date = facebook_response["expires"][0]
		fb_user = JSON.parse(open("https://graph.facebook.com/me?fields=name,email&access_token=#{access_token}").read)
		fb_name = fb_user["name"]
		fb_id = fb_user["id"]
		email = fb_user["email"]
		user = User.find_or_create_by_fb_id(fb_id)
		user.update_attributes(	:name => fb_name, 
								:email => email, 
								:fb_id => fb_id, 
								:fb_access_token => access_token,
								:fb_expiration_date => get_exp_date
		)
		user.save
		user
	end

	def self.get_exp_date
			Time.now + (2*7*24*60*60)
	end

	def self.get_fb_params
		"user_photos"
	end

	def self.get_login_link
		"https://graph.facebook.com/oauth/authorize?client_id=#{FACEBOOK_APP_ID}&redirect_uri=http://insideguide.herokuapp.com/facebook_auth&scope=#{get_fb_params}"
	end

	def self.get_fb_img(id, width=50, height=50)
		"http://graph.facebook.com/#{id}/picture?width=#{width}&height=#{height}"
	end
end


