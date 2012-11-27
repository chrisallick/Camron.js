load 'deploy'
require 'bundler/capistrano'
require "rvm/capistrano"

set :application, "squetch"
set :user, "ec2-user"
set :deploy_to, "/srv/#{application}"
set :public_dir, "#{deploy_to}/current/public"

set :normalize_asset_timestamps, false

set :use_sudo, false
set :runner, "#{user}"
set :scm, :git
set :repository, "git@github.com:Elepath/squetch.git"
set :local_repository, "git@github.com:Elepath/squetch.git"
set :key_pair, "squetch"
set :rvm_type, :system

ssh_options[:keys] = "~/.ssh/#{key_pair}.pem"
server "squet.ch", :app, :primary => true

namespace :deploy do
 task(:start){}
 task(:stop){}

 task :restart do
   run "touch #{current_path}/tmp/restart.txt"
 end

 task :migrate do
 end

 task :symlink_uploads do
   run "ln -nfs #{shared_path}/uploads #{release_path}/uploads"
 end
 
end

after 'deploy', 'deploy:cleanup'
after 'deploy', 'deploy:symlink_uploads'