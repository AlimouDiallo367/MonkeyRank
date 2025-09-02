# server.rb
require "sinatra"
require "json"

set :bind, "0.0.0.0"
set :port, 4567

before do
  response.headers["Access-Control-Allow-Origin"] = "*"
  response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
  response.headers["Access-Control-Allow-Headers"] = "*"
end

options "*" do
  response.headers["Access-Control-Allow-Origin"] = "*"
  response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
  response.headers["Access-Control-Allow-Headers"] = "*"
  200
end



post "/scores" do
  request.body.rewind
  data = JSON.parse(request.body.read) rescue {}
  puts "Reçu : #{data.inspect}"

  content_type :json
  { status: "ok", reçu: data }.to_json
end
