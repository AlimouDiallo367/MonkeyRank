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
DB ||= Mysql2::Client.new(
    host: "localhost",
    username: "etd",
    password: "shawi",
    database: "monkeyrank",
    symbolize_keys: true
)

class MySinatraApp < Sinatra::Base
    set :bind, "0.0.0.0"

    # Servir le frontend statique
    set :public_folder, File.expand_path("../../frontend/UI", __dir__)

    configure :development do 
        register Sinatra::Reloader
    end 

    before do
        # content_type :json
        headers "Access-Control-Allow-Origin" => "*" # Combo Apache + Sinatra 
    end

    # Route par défaut : index.html
    get "/" do
        send_file File.join(settings.public_folder, "index.html")
    end

    get "/onboarding" do
        send_file File.join(settings.public_folder, "onboarding.html")
    end

    get "/user/:pseudo" do
        pseudo = params[:pseudo]
        # Ici tu peux servir une page userpage.html
        send_file File.join(settings.public_folder, "userpage.html")
    end

    get "/api/user/:pseudo" do
        content_type :json
        pseudo = params[:pseudo]
        result = DB.query("SELECT * FROM scores WHERE pseudo = ? ORDER BY wpm DESC LIMIT 50", pseudo)
        result.to_a.to_json
    end


    
    get "/scores" do 
        content_type :json
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

    # Admin
    post "/reset-scores" do 
        data = JSON.parse(request.body.read) rescue {}
        if data["token"] == "secret123"
            DB.query("TRUNCATE TABLE scores")
            { success: true, feedback: "Scores réinitialisés" }.to_json
        else 
            halt 403, { success: false, error: "Accès interdit" }.to_json
        end
    end 


    # CORS***
    options "*" do
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        200
    end

    run! if app_file == $0
end 