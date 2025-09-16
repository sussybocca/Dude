require 'json'
require 'fileutils'

assets = {
  sprites: Dir["../assets/sprites/*"].map{|f| File.basename(f)},
  sounds: Dir["../assets/sounds/*"].map{|f| File.basename(f)}
}

FileUtils.mkdir_p("../data")
File.open("../data/assets.json","w"){|f| f.write(JSON.pretty_generate(assets)) }

puts "✅ Assets indexed!"