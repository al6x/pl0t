import std/httpclient, std/strformat, std/os, std/tables, std/strutils

when (compiles do: import base/[basem, jsonm]):
  import base/[basem, jsonm]
else:
  import std/json, std/jsonutils
  proc to_json_hook*(n: JsonNode): JsonNode = n
  template throw(message: string) = raise Exception.new_exception(message)

template convert_to_json(data: JsonNode, pretty: bool): string =
  when compiles(data.to_s pretty):
    data.to_s pretty
  else:
    if pretty: data.pretty else: $data


# publish, unpublish -------------------------------------------------------------------------------
var plot_api_token* = get_env("plot_api_token", "")

proc build_plot_url(url: string): string =
  if plot_api_token == "":
    throw "plot_api_token not defined, define it explicitly or as as `plot_api_token` environment variable"
  fmt"{url}?api_token={plot_api_token}"

proc publish*(data: JsonNode, url: string, pretty = true): void =
  let url   = build_plot_url url
  let client = new_http_client()
  defer: client.close
  let json = convert_to_json(data, pretty)
  discard client.post_content(url, json)

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
  <link rel="stylesheet" href="http://files.pl0t.com/view-1/releases/2021-08-30-b1cf3c/bundle.css">
  <script defer src="http://files.pl0t.com/view-1/releases/2021-08-30-b1cf3c/bundle.js"></script>
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
# standalone end


# Page ---------------------------------------------------------------------------------------------
type Page* = ref object
  attrs: JsonNode
  page*: seq[JsonNode]

proc init*(_: type[Page], attrs: JsonNode): Page =
  Page(attrs: attrs)

proc text*(page: var Page, id: string, text: string): void =
  page.page.add (id: id, text: text).to_json

proc table*[D](page: var Page, id: string, data: D, table: JsonNode = newJObject()): void =
  page.page.add (id: id, table: table, data: data).to_json

proc chart*[D](page: var Page, id: string, data: D, chart: JsonNode): void =
  page.page.add (id: id, chart: chart, data: data).to_json

proc image*(page: var Page, id: string, data: JsonNode): void =
  page.page.add (id: id, image: data).to_json

proc as_json(page: Page): JsonNode =
  var json = ($(page.attrs)).parse_json # Have no idea how to clone it otherwise
  json["page"] = page.page.to_json
  json

proc publish*(page: Page, url: string, pretty = true): void =
  page.as_json.publish(url, pretty)

proc save*(page: Page, path: string, pretty = true): void =
  let json = page.as_json
  let json_s = convert_to_json(json, pretty)
  let html = standalone.replace("{type}", "json").replace("{data}", json_s)
  if file_exists path: remove_file path
  write_file(path, html)