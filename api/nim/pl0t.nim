import std/httpclient, std/strformat, std/os, std/tables
import std/json, std/jsonutils

proc to_json_hook*(n: JsonNode): JsonNode =
  n

template throw(message: string) = raise Exception.new_exception(message)


var plot_api_token* = get_env("plot_api_token", "")

proc build_plot_url(url: string): string =
  if plot_api_token == "":
    throw "plot_api_token not defined, define it explicitly or as as `plot_api_token` environment variable"
  fmt"{url}?api_token={plot_api_token}"

proc plot*(url: string, data: JsonNode): void =
  let url   = build_plot_url url
  let client = new_http_client()
  defer: client.close
  discard client.post_content(url, data.pretty)


proc del_plot*(url: string): void =
  let url = build_plot_url url
  let client = new_http_client()
  defer: client.close
  discard client.delete(url)


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

proc plot*(url: string, page: Page): void =
  plot url, page.to_json
proc plot*(page: Page, url: string): void =
  plot url, page.to_json