require "yaml"
require "http"

class Page

  def initialize(@title : String, @desc : String)
    @page = [] of YAML::Any
  end

  def text(id : String, text : String)
    add_block({ id: id, text: text })
  end

  def table(id : String, data, table)
    add_block({ id: id, table: table, data: data })
  end

  def chart(id : String, data, chart)
    add_block({ id: id, chart: chart, data: data })
  end

  def image(id : String, data)
    add_block({ id: id, data: data })
  end

  def save(path : String)
    html = @standalone.sub("{type}", "yaml").sub("{data}", data.to_yaml)
    File.write path, html
  end

  def publish(url : String)
    api_token = ENV["plot_api_token"]
    resp = HTTP::Client.post url, headers: HTTP::Headers{"api_token" => api_token}, body: data.to_yaml
    raise "can't publish to #{url}" unless resp.success?
  end

  def self.unpublish(url : String)
    api_token = ENV["plot_api_token"]
    resp = HTTP::Client.delete url, headers: HTTP::Headers{"api_token" => api_token}
    raise "can't delete #{url}" unless resp.success?
  end

  private def add_block(block)
    @page << YAML.parse(block.to_yaml)
  end

  private def data
    { title: @title, desc: @desc, page: @page }
  end

  # standalone begin
  @standalone = <<-HTML
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
  
    <title>pl0t</title>
  
    <link rel="icon" type="image/png" href="http://files.pl0t.com/view-1/favicon.ico">
  
    <!-- PL0T begin, putting it at the end of the page to avoid blocking other content -->
    <script>
      window.env = {
        base_url: "http://files.pl0t.com/view-1"
      }
    </script>
    <link rel="stylesheet" href="http://files.pl0t.com/view-1/releases/2021-08-28-f89351/bundle.css">
    <script defer src="http://files.pl0t.com/view-1/releases/2021-08-28-f89351/bundle.js"></script>
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