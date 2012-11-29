class Configure
    @@S3_KEY = 'AKIAIONDHVBZ6Z4CP75A'
    @@S3_SECRET = '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'

	def self.getKey()
		return @@S3_KEY
	end

	def self.getSecret()
		return @@S3_SECRET
	end
end