require "bundler/inline"

gemfile do
  source "https://rubygems.org"

  gem "sinatra-contrib"  # inclut Sinatra + extensions utiles
  gem "webrick"
  gem "webrick"
  gem "activerecord"
  gem "mysql2"          # adapter sqlite3 (change si tu utilises une autre DB)
end

require "sinatra/base"
require "sinatra/reloader"
require "json"
require "active_record"

# Config ActiveRecord + DB

ActiveRecord::Base.establish_connection(
  adapter:  'mysql2',
  host:     'localhost',
  database: 'monkeytype_leaderboard',  # ta base MariaDB
  username: 'etd',
  password: 'shawi',
  encoding: 'utf8mb4'
)


# Modèle Score
class Score < ActiveRecord::Base
  validates :pseudo, presence: true, length: { in: 1..50 }, format: { with: /\A[a-zA-Z0-9]+\z/ }
  validates :wpm, :accuracy, :raw, :consistency, presence: true, numericality: true
end

class MySinatraApp < Sinatra::Base
  configure :development do
    register Sinatra::Reloader
  end

set :bind, "0.0.0.0"

  before do
    content_type :json
    headers "Access-Control-Allow-Origin" => "*"  # CORS pour ton frontend Apache
  end

  get "/get-scores" do
    scores = Score.order(wpm: :desc, accuracy: :desc).limit(50)
    scores.to_json
  end

  post "/add-score" do
    data = JSON.parse(request.body.read) rescue {}
    score = Score.new(
      pseudo: data["pseudo"],
      wpm: data["wpm"],
      accuracy: data["accuracy"],
      raw: data["raw"],
      consistency: data["consistency"],
      created_at: Time.now
    )
    if score.save
      { success: true, message: "Score added" }.to_json
    else
      status 400
      { success: false, errors: score.errors.full_messages }.to_json
    end
  end

  # Pour options CORS preflight
  options "*" do
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    200
  end

  run! if app_file == $0
end

