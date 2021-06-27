import std/strutils, std/options, std/httpclient, std/strformat, std/sugar
import std/json, std/jsonutils

# --------------------------------------------------------------------------------------------------
# Schema -------------------------------------------------------------------------------------------
# --------------------------------------------------------------------------------------------------
# Please vote for this issue to make Nim enums better https://github.com/nim-lang/RFCs/issues/373
type PlotDataType* {.pure.} = enum
  string_e  = "string",
  number_e  = "number",
  boolean_e = "boolean",
  unknown_e = "unknown"

converter to_plot_data_type*(s: string): PlotDataType = parse_enum[PlotDataType](s)


type PlotAlign* {.pure.} = enum
  left_e   = "left",
  center_e = "center",
  right_e  = "right"

converter to_plot_align*(s: string): PlotAlign = parse_enum[PlotAlign](s)


type PlotFormatType* {.pure.} = enum
  string_e  = "string",
  number_e  = "number",
  line_e    = "line",
  boolean_e = "boolean",
  unknown_e = "unknown"

converter to_plot_format_type*(s: string): PlotFormatType = parse_enum[PlotFormatType](s)


type FormatOptions* = object
  align*: Option[PlotAlign]

  case `type`: PlotFormatType
  of "string":
    discard

  of "number":
    round*: Option[int]

  of "line":
    max*:   Option[float] # custom max value for line length, if not provided max value will be calculated
    color*: Option[string]
    ticks*: Option[seq[float]]

  of "boolean":
    `true`*:  Option[string]
    `false`*: Option[string]

  of "unknown":
    discard


type PlotOrder* {.pure.} = enum
  asc_e = "asc", desc_e = "desc"

converter to_plot_order*(s: string): PlotOrder = parse_enum[PlotOrder](s)


type PlotColumnOrder* = (string, PlotOrder)


type PlotTableColumn* = object
  id*:      string
  `type`*:  PlotDataType # also possible to use custom types for third party formatters
  title*:   Option[string] # same as id if not specified
  format*:  Option[FormatOptions] # by default same as type, also possible to use custom formatters
  width*:   Option[float] # default = 1, width as weight, not as pixels or percentages
  min_max*: Option[(float, float)] # Min/max range for values, used for
                                  # better weighted sorting, see `wsortTable`

proc to_json_hook*(o: PlotTableColumn): JsonNode =
  result = new_JObject()
  for k, v in o.field_pairs:
    when k == "min_max":
      result[k] = v.map((mm) => @[mm[0], mm[1]]).to_json
    else:
      result[k] = v.to_json


type TableOptions*[Row] = object
  columns*:    Option[seq[PlotTableColumn]]
  rows*:       seq[Row]
  title*:      Option[string]

  order*:      Option[seq[PlotColumnOrder]]
  query*:      Option[string]  # default = "" filter query

  id*:         Option[string]
  selectable*: Option[bool] # default = true
  sortable*:   Option[bool] # default = true
  toolbar*:    Option[bool] # default = true
  warnings*:   Option[bool] # default = true
  # `_i`*:       Option[bool] # default = false, show row indices

  wsort*:      Option[bool] # default = true, weighted sorting see `wsortTable` for details,
                           # use false for ordinary sorging


type PlotConfig* = object
  base_url*:  string
  api_token*: string


# --------------------------------------------------------------------------------------------------
# Support ------------------------------------------------------------------------------------------
# --------------------------------------------------------------------------------------------------
template throw(message: string) = raise Exception.new_exception(message)


# --------------------------------------------------------------------------------------------------
# API ----------------------------------------------------------------------------------------------
# --------------------------------------------------------------------------------------------------
var config = PlotConfig.none

proc configure_plot*(base_url: string, api_token: string): void =
  if base_url.ends_with("/"): throw "base_url shouldn't end with /!"
  config = PlotConfig(base_url: base_url, api_token: api_token).some


proc build_plot_url(path: string): string =
  if config.is_none: throw "plot config not defined, use configure_plot to define it!"
  if not path.ends_with(".json"): throw "path should end with .json!"
  if not path.starts_with("/"): throw "path should start with /"
  fmt"{plot_base_url.get}{path}?api_token={plot_api_token.get}"


# Table.plot ---------------------------------------------------------------------------------------
proc plot*(path: string, table: TableOptions): void =
  let url        = build_plot_url path
  let table_json = table.to_json.pretty

  let client = new_http_client()
  defer: client.close
  discard client.post_content(url, table_json)

proc plot*[Row](
  path:       string,
  columns:    Option[seq[PlotTableColumn]] = seq[PlotTableColumn].none,
  rows:       seq[Row] = Row.none,
  title:      Option[string] = string.none,

  order:      Option[seq[PlotColumnOrder]] = seq[PlotColumnOrder].none,
  query:      Option[string] = string.none,  # default = "" filter query

  id:         Option[string] = string.none,
  selectable: Option[bool] = bool.none, # default = true
  sortable:   Option[bool] = bool.none, # default = true
  toolbar:    Option[bool] = bool.none, # default = true
  warnings:   Option[bool] = bool.none, # default = true

  wsort:      Option[bool] = bool.none # default = true, weighted sorting see `wsortTable` for details,
                                       # use false for ordinary sorging
): void =
  let table = TableOptions[Row](
    columns: columns, rows: rows, title: title, order: order, query: query, id: id,
    selectable: selectable, sortable: sortable, toolbar: toolbar, warnings: warnings, wsort: wsort
  )
  plot path, table


# del_plot -----------------------------------------------------------------------------------------
proc del_plot*(path: string): void =
  let url = build_plot_url path
  let client = new_http_client()
  defer: client.close
  discard client.delete(url)


# --------------------------------------------------------------------------------------------------
# Test ---------------------------------------------------------------------------------------------
# --------------------------------------------------------------------------------------------------
if is_main_module:
  configure_plot "http://al6x.plot.com", "stub_token"

  let rows = @[
    (name: "Jim",  age: 30),
    (name: "Kate", age: 27)
  ]
  plot "/nim_test/table.json", rows = rows