CarrierWave.configure do |config|
  if Rails.env.development? or Rails.env.test? 
    config.fog_credentials = {
    :provider              => 'AWS',
    :aws_access_key_id     => 'AKIAJYTU5DEP6WRYBI4A',
    :aws_secret_access_key => '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',
    :region                => 'us-east-1'    }
    config.fog_directory  = 'cause2share'  
    config.fog_public     = true                                    # optional, defaults to true
    config.fog_attributes = {'Cache-Control' => 'max-age=315576000'}  # optional, defaults to {}
  elsif Rails.env.production?
    config.fog_credentials = {
    :provider              => 'AWS',
    :aws_access_key_id     => 'AKIAJGRTFYY22RQIBXFQ',
    :aws_secret_access_key => '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',
    :region                => 'us-east-1'    }
    config.fog_directory  = 'c2s_test'  
    config.fog_public     = true                                    # optional, defaults to true
    config.fog_attributes = {'Cache-Control' => 'max-age=315576000'}  # optional, defaults to {}
  elsif false and Rails.env.development?
    config.fog_credentials = {
    :provider              => 'AWS',
    :aws_access_key_id     => 'AKIAJGRTFYY22RQIBXFQ',
    :aws_secret_access_key => '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',
    :region                => 'us-east-1'    }
    config.fog_directory  = 'c2s_dev'  
    config.fog_public     = true                                    # optional, defaults to true
    config.fog_attributes = {'Cache-Control' => 'max-age=315576000'}  # optional, defaults to {}
  else  
   config.storage = :file
   config.enable_processing = false
  end    
end

module CarrierWave
  module MiniMagick
    def quality(percentage)
      manipulate! do |img|
        
        img.quality(percentage.to_s) 
        img = yield(img) if block_given?
        img
      end
    end
  end
end