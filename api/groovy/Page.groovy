import groovy.json.JsonOutput
import java.io.IOException
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

class Page {
  String title
  String desc
  def    page = []

  def text(String id, String text) {
    page.add([ id: id, text: text ])
  }

  def table(String id, data, table) {
    page.add([ id: id, table: table, data: data ])
  }

  def chart(String id, data, chart) {
    page.add([ id: id, chart: chart, data: data ])
  }

  def image(String id, data) {
    page.add([ id: id, data: data ])
  }

  def save(String path) {
    def html = standalone.replace('{type}', 'json').replace('{data}', toJson())
    new File(path).withWriter('utf-8') {
      writer -> writer.write html
    }
  }

  def publish(String url) {
    HttpClient client = HttpClient.newHttpClient()
    HttpRequest request = HttpRequest.newBuilder()
      .uri(URI.create(url))
      .header('api_token', Page.api_token())
      .POST(HttpRequest.BodyPublishers.ofString(toJson()))
      .build()
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString())
    if (response.statusCode() != 200) throw new Exception("can't publish $url")
  }

  def static unpublish(String url) {
    HttpClient client = HttpClient.newHttpClient()
    HttpRequest request = HttpRequest.newBuilder()
      .uri(URI.create(url))
      .header('api_token', Page.api_token())
      .DELETE()
      .build()
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString())
    if (response.statusCode() != 200) throw new Exception("can't unpublish $url")
  }

  def protected toJson(String path) {
    JsonOutput.toJson([ title: title, desc: desc, page: page ])
  }

  def static api_token() {
    def api_token = System.getenv("plot_api_token")
    if (!api_token) throw new Exception("the 'plot_api_token' env variable is not defined")
    api_token
  }


// standalone begin
String standalone = """<!DOCTYPE html>
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
  <link rel="stylesheet" href="http://files.pl0t.com/view-1/releases/2021-09-01-6ce2d4/bundle.css">
  <script defer src="http://files.pl0t.com/view-1/releases/2021-09-01-6ce2d4/bundle.js"></script>
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
"""
// standalone end
}

