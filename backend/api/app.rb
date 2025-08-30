require "bundler/inline"

gemfile do 
    source "https://rubygems.org"
    
    gem "sinatra-contrib"
    gem "rackup"    
    # gem "webrick"    
    gem "puma"    
    gem "mysql2"
    gem "bigdecimal"    
end 

require "sinatra/base"
require "sinatra/reloader"
require "json" 
require "mysql2"

# DB Connection
DB = Mysql2::Client.new(
    host: "localhost",
    username: "etd",
    password: "shawi",
    database: "monkeyrank",
    symbolize_keys: true
)

class MySinatraApp < Sinatra::Base
    set :bind, "0.0.0.0"
    configure :development do 
        register Sinatra::Reloader
    end 

    before do
        content_type :json
        headers "Access-Control-Allow-Origin" => "*" # Combo Apache + Sinatra 
    end

    get "/" do 
        return "Bienvenue sur Monkey Rank".to_json
    end 
    
    get "/scores" do 
        results = DB.query("SELECT * FROM scores ORDER BY wpm DESC, accuracy DESC LIMIT 50")
        results.to_a.to_json
    end 

    post "/scores" do 
        data = JSON.parse(request.body.read) rescue {}
        sql = "INSERT INTO scores (pseudo, wpm, accuracy, raw, consistency, created_at)
               VALUES (?, ?, ?, ?, ?, NOW())"
        
        query = DB.prepare(sql)
        query.execute(
            data["pseudo"],
            data["wpm"],
            data["accuracy"],
            data["raw"],
            data["consistency"]
        )
        { success: true, feedback: "Score ajouté!" }.to_json
    end 

    # CORS***
    options "*" do
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        200
    end

    run! if app_file == $0
end 