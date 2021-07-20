import std/strutils, std/httpclient, std/strformat, std/sugar, std/os, std/tables
import std/json, std/jsonutils


template throw(message: string) = raise Exception.new_exception(message)


var plot_base_url*  = get_env("plot_base_url", "")
var plot_api_token* = get_env("plot_api_token", "")

proc build_plot_url(path: string): string =
  if plot_base_url == "":
    throw "plot_base_url not defined, define it explicitly or as as `plot_base_url` environment variable"
  if plot_api_token == "":
    throw "plot_api_token not defined, define it explicitly or as as `plot_api_token` environment variable"
  if not path.ends_with(".json"): throw "path should end with .json!"
  if not path.starts_with("/"): throw "path should start with /"
  fmt"{plot_base_url}{path}?api_token={plot_api_token}"


proc plot*(path: string, data: JsonNode): void =
  let url   = build_plot_url path
  let client = new_http_client()
  defer: client.close
  discard client.post_content(url, data.pretty)


proc del_plot*(path: string): void =
  let url = build_plot_url path
  let client = new_http_client()
  defer: client.close
  discard client.delete(url)