import std/httpclient, std/strformat, std/os, std/tables, std/strutils
import std/json, std/jsonutils


# Helpers ------------------------------------------------------------------------------------------
proc to_json_hook*(n: JsonNode): JsonNode = n

template throw(message: string) = raise Exception.new_exception(message)


# publish, unpublish -------------------------------------------------------------------------------
var plot_api_token* = get_env("plot_api_token", "")

proc build_plot_url(url: string): string =
  if plot_api_token == "":
    throw "plot_api_token not defined, define it explicitly or as as `plot_api_token` environment variable"
  fmt"{url}?api_token={plot_api_token}"

proc publish*(data: JsonNode, url: string): void =
  let url   = build_plot_url url
  let client = new_http_client()
  defer: client.close
  discard client.post_content(url, data.pretty)

proc unpublish*(url: string): void =
  let url = build_plot_url url
  let client = new_http_client()
  defer: client.close
  discard client.delete(url)


# Standalone HTML template -------------------------------------------------------------------------
# standalone begin
let standalone = """<!DOCTYPE html>
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
  <link rel="stylesheet" href="http://files.pl0t.com/view-1/releases/2021-07-31-4ecaae/bundle.css">
  <script defer src="http://files.pl0t.com/view-1/releases/2021-07-31-4ecaae/bundle.js"></script>
  <!-- PL0T end -->

</head>
<body>

<!-- PL0T data, specify 'json', 'yml' or 'md' formats in the `type` attribute -->
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
# standalone end


# Page ---------------------------------------------------------------------------------------------
type Page* = ref object
  title*: string
  desc*:  string
  page*:  seq[JsonNode]

proc init*(_: type[Page], title: string, desc: string): Page =
  Page(title: title, desc: desc)

proc text*(page: var Page, id: string, text: string): void =
  page.page.add (id: id, text: text).to_json

proc table*[D](page: var Page, id: string, data: D, table: JsonNode = newJObject()): void =
  page.page.add (id: id, table: table, data: data).to_json

proc chart*[D](page: var Page, id: string, data: D, chart: JsonNode): void =
  page.page.add (id: id, chart: chart, data: data).to_json

proc publish*(page: Page, url: string): void =
  page.to_json.publish url

proc save*(page: Page, path: string): void =
  let html = standalone.replace("{type}", "json").replace("{data}", page.to_json.pretty)
  if file_exists path: remove_file path
  write_file(path, html)