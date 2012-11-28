require 'sinatra'
require 'sinatra/partial'
require 'sinatra/reloader' if development?

require './helpers.rb' #s3 upload

require 'base64' #decode image data
require 'fileutils' #write to disk

require 'redis' #db

configure do
  redisUri = ENV["REDISTOGO_URL"] || 'redis://localhost:6379'
  uri = URI.parse(redisUri) 
  $redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
end

@@S3_BUCKET='trash-images'

get '/', :agent => /iPhone/ do
    erb :mobile, :locals => {
        :mobile => true
    }
end

get '/' do
    erb :main, :locals => {
        :mobile => false
    }
end

get '/images' do
    channel = params[:channel]

    images = []
    all = $redis.lrange("images:#{channel}", 0, $redis.llen("images:#{channel}"))
    all.each do |image|
        images.push( image )
    end
    { :result => "success", :images => images }.to_json
end

post '/upload' do
    if params[:image]
        uuid = UUIDTools::UUID.random_create.to_s

        imgix_url = Helpers.s3_upload( Base64.decode64(params[:image]), @@S3_BUCKET, ".jpeg", uuid )
        
        $redis.lpush( "images:camronjs", imgix_url )
        $redis.ltrim("images:camronjs", 0, 10)

        return { :result => "success", :msg => imgix_url }.to_json
    end
end