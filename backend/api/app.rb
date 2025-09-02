require "bundler/inline"

gemfile do 
    source "https://rubygems.org"
    gem "sinatra-contrib"
    gem "rackup"
    gem "puma"
    gem "mysql2"
    gem "bigdecimal"
end 

require "sinatra/base"
require "sinatra/reloader"
require "json" 
require "mysql2"

DB ||= Mysql2::Client.new(
    host: "localhost",
    username: "etd",
    password: "shawi",
    database: "monkeyrank",
    symbolize_keys: true
)

class MySinatraApp < Sinatra::Base
    set :bind, "0.0.0.0"
    set :public_folder, File.expand_path("../../frontend", __dir__)

    configure :development do 
        register Sinatra::Reloader
    end 

    before do
        headers "Access-Control-Allow-Origin" => "*"
    end

    get "/" do
        send_file File.join(settings.public_folder, "pages/index.html")
    end

    get "/onboarding" do
        send_file File.join(settings.public_folder, "pages/onboarding.html")
    end

    get "/user/:pseudo" do
        send_file File.join(settings.public_folder, "pages/userpage.html")
    end

    get "/user/:pseudo/scores" do
        content_type :json
        pseudo = params[:pseudo]
        stmt = DB.prepare("SELECT * FROM scores WHERE pseudo = ? ORDER BY created_at DESC LIMIT 50")
        result = stmt.execute(pseudo)
        result.to_a.to_json
    end 

    get "/scores" do 
        content_type :json
        results = DB.query("
            SELECT s.*
            FROM scores s
            INNER JOIN (
                SELECT pseudo, MAX(wpm) AS best_wpm
                FROM scores
                GROUP BY pseudo
            ) best_scores
            ON s.pseudo = best_scores.pseudo AND s.wpm = best_scores.best_wpm
            ORDER BY s.wpm DESC, s.accuracy DESC
            LIMIT 50
        ")
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

    post "/reset-scores" do 
        data = JSON.parse(request.body.read) rescue {}
        if data["token"] == "secret123"
            DB.query("TRUNCATE TABLE scores")
            { success: true, feedback: "Scores réinitialisés" }.to_json
        else 
            halt 403, { success: false, error: "Accès interdit" }.to_json
        end
    end 

    options "*" do
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        200
    end

    run! if app_file == $0
end
