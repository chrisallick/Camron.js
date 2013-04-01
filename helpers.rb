require './configure.rb'

class Helpers
    @@S3_KEY='AKIAJNFVHNCXMSLWZOAA'
    @@S3_SECRET='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'

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

        return "http://trashio.imgix.net/#{name}"
    end
end