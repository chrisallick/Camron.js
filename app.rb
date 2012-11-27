require 'sinatra'
require 'sinatra/partial'
require 'sinatra/reloader' if development?

require 'base64'
require 'fileutils'

require 'redis'

configure do
  redisUri = ENV["REDISTOGO_URL"] || 'redis://localhost:6379'
  uri = URI.parse(redisUri) 
  $redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
end

class Helpers
    @@S3_KEY=''
    @@S3_SECRET=''

    def self.s3_upload(img_data, bucket, extension, uuid)
        name = uuid + extension

        connection = Fog::Storage.new(
            :provider                 => 'AWS',
            :aws_secret_access_key    => @@S3_SECRET,
            :aws_access_key_id        => @@S3_KEY
        )

        directory = connection.directories.create(
            :key    => bucket,
            :public => true
        )
    
        content_type = case extension
        when ".gif"
            "image/gif"
        when ".png"
            "image/png"
        when ".jpeg" || ".jpg"
            "image/jpeg"
        else
            ""
        end

        file = directory.files.create(
            :key    => name,
            :body   => img_data,
            :content_type => content_type,
            :public => true
        )
    
        if extension == ".gif"
            return "https://s3.amazonaws.com/"+bucket+"/"+name
        else
            return "http://trash.imgix.net/#{name}"
        end
    end
end


@@S3_BUCKET='trash-images'
@@allowed_video_upload_formats = [".png", ".gif", ".jpeg", ".jpg"]

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
    all = $redis.lrange("images:home", 0, $redis.llen("images:home"))
    all.each do |image|
        images.push( image )
    end
    { :result => "success", :iamges => images }.to_json
end


post '/upload' do
    if params[:image]
        uuid = UUIDTools::UUID.random_create.to_s

        File.open('test.jpeg', 'wb') do|f|
          f.write(Base64.decode64(params[:image]))
        end

        imgix_url = Helpers.s3_upload( Base64.decode64(params[:image]), @@S3_BUCKET, ".jpeg", uuid )
        $redis.lpush( "images:home", imgix_url )

        return { :result => "success", :msg => imgix_url }.to_json
    end
end