class Page
  @app = ['page', 0.1]

  attr_accessor :id, :title, :desc, :css, :page

  def initialize params = {}
    self.page = []
    params.each do |k, v|
      send("#{k}=", v)
    end
  end

  def text id, text
    page << { id: id, text: text }
  end

  def table id, data, table
    page << { id: id, table: table, data: data }
  end

  def chart id, data, chart
    page << { id: id, chart: chart, data: data }
  end

  def image id, data
    page << { id: id, data: data }
  end

  def to_html
    # Ruby emits non standard YAML that JavaScript can't parse. If you know how to make it to
    # output standard YAML, please fix it, as YAML is better format than JSON.
    #
    # require 'yaml'
    # Removing first line in YAML, ruby puts "--- !ruby/object:Page" there.
    # data = to_yaml.sub(/^---[^\n]+\n/, '')

    require 'json'
    # For strange reason `self.to_json` doesn't work, iterating over instance variables
    hash = {}
    instance_variables.each {|v| hash[v.to_s.delete("@")] = instance_variable_get(v) }
    data = hash.to_json

    @@standalone.sub('{type}', 'json').sub('{data}', data)
  end

  def save path
    File.write path, to_html
  end

  def publish url
    require 'net/http'
    require "uri"

    api_token = ENV['plot_api_token']
    raise "`plot_api_token` env variable is not set" if api_token.nil?
    resp = Net::HTTP.post URI(url), to_html, { api_token: api_token }
    raise "can't publish #{url}" unless resp.code == "200"
  end

  def self.unpublish url
    require 'net/http'
    require "uri"

    api_token = ENV['plot_api_token']
    raise "`plot_api_token` env variable is not set" if api_token.nil?

    # I don't know how to make HTTP DELETE request with Ruby, the code below doesn't work
    #
    # resp = Net::HTTP.delete URI(url, { api_token: api_token })
    # raise "can't delete #{url}" unless resp.code == "200"

    resp = `curl -s --request DELETE --header "api_token: #{api_token}" "#{url}"`
    raise "can't delete #{url}" unless /file deleted/ =~ resp
  end


  # standalone begin
  @@standalone = <<~HTML
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
  
    <title>pl0t</title>
  
    <link rel="icon" type="image/png" href="http://files.pl0t.com/view-1/favicon.ico">
  
    <!-- PL0T begin -->
    <script>
      window.env = {
        base_url: "http://files.pl0t.com/view-1"
      }
    </script>
    <link rel="stylesheet" href="http://files.pl0t.com/view-1/releases/2021-09-13-5cd3a7/bundle.css">
    <script defer src="http://files.pl0t.com/view-1/releases/2021-09-13-5cd3a7/bundle.js"></script>
    <!-- PL0T end -->
  </head>
  <body>
  
  <!-- PL0T data, type could be 'yaml', 'json' or 'md' -->
  <script id="data" type="{type}">
  {data}
  </script>
  
  
  <script>
    window.on_plot_loaded = function() {
      window.plot_api.run()
    }
  </script>
  
  </body>
  </html>
  HTML
  # standalone end
end