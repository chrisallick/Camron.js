class Configure
    @@S3_KEY = 'AKIAJNFVHNCXMSLWZOAA'
    @@S3_SECRET = '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'

	def self.getKey()
		return @@S3_KEY
	end

	def self.getSecret()
		return @@S3_SECRET
	end
end