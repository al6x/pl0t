import std/strutils, std/options, std/httpclient, std/strformat, std/sugar, std/os, std/tables
import std/json, std/jsonutils


# --------------------------------------------------------------------------------------------------
# Support ------------------------------------------------------------------------------------------
# --------------------------------------------------------------------------------------------------
template throw(message: string) = raise Exception.new_exception(message)


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
func to_json_hook*(e: PlotDataType): JsonNode = ($e).to_json


type PlotAlign* {.pure.} = enum
  left_e   = "left",
  center_e = "center",
  right_e  = "right"

converter to_plot_align*(s: string): PlotAlign = parse_enum[PlotAlign](s)
func to_json_hook*(e: PlotAlign): JsonNode = ($e).to_json


type PlotFormatType* {.pure.} = enum
  string_e  = "string",
  number_e  = "number",
  line_e    = "line",
  boolean_e = "boolean",
  unknown_e = "unknown"

converter to_plot_format_type*(s: string): PlotFormatType = parse_enum[PlotFormatType](s)
func to_json_hook*(e: PlotFormatType): JsonNode = ($e).to_json


type PlotLineScale* {.pure.} = enum
  linear_e  = "linear",
  log_e     = "log"

converter to_plot_line_scale*(s: string): PlotLineScale = parse_enum[PlotLineScale](s)
func to_json_hook*(e: PlotLineScale): JsonNode = ($e).to_json


type FormatOptions* = object
  align*: Option[PlotAlign]
  small*: Option[bool] # small font size, false by default

  case `type`*: PlotFormatType
  of "string":
    discard

  of "number":
    round*: Option[int] # default = 2

  of "line":
    max*:      Option[float] # custom max value for line length, if not provided max value will be calculated
    color*:    Option[string]
    ticks*:    Option[seq[float]]
    scale*:    Option[PlotLineScale]    # default = linear
    log_unit*: Option[bool] # default = false
    # "log_unit" could be used only with log scale, it replaces values in [0..1] range with 1, usefull to
    # display quantity of some units, like money. When we would like to round small values with less than
    # $1 cash, to avoid log being negative.

  of "boolean":
    `true`*:  Option[string]
    `false`*: Option[string]

  of "unknown":
    discard


type PlotOrder* {.pure.} = enum
  asc_e = "asc", desc_e = "desc"

converter to_plot_order*(s: string): PlotOrder = parse_enum[PlotOrder](s)
func to_json_hook*(e: PlotOrder): JsonNode = ($e).to_json


type PlotColumnOrder* = (string, PlotOrder)

func to_json_hook*(order: PlotColumnOrder): JsonNode = [order[0], $(order[1])].to_json


type PlotFilterCondition* {.pure.} = enum
  lte_e = "<=",
  lt_e  = "<",
  eq_e  = "=",
  neq_e = "!=",
  gt_e  = ">",
  gte_e = ">=",
  aeq_e = "~"

converter to_plot_filter_condition*(s: string): PlotFilterCondition = parse_enum[PlotFilterCondition](s)
func to_json_hook*(e: PlotFilterCondition): JsonNode = ($e).to_json


type PlotColumnFilter* = (PlotFilterCondition, string)

func to_json_hook*(filter: PlotColumnFilter): JsonNode = [$(filter[0]), filter[1]].to_json
proc from_json_hook*(v: var PlotColumnFilter, json: JsonNode) =
  let sv: string = case json[1].kind
  of JString: json[1].str
  of JInt:    $(json[1].num)
  of JFloat:  $(json[1].fnum)
  of JBool:   $(json[1].bval)
  else:       throw fmt"unsupported value {json[1]}"
  v = (json[0].get_str.to_plot_filter_condition, sv)


type PlotTableColumn* = object
  id*:      string
  `type`*:  PlotDataType # also possible to use custom types for third party formatters
  title*:   Option[string] # same as id if not specified
  format*:  Option[FormatOptions] # by default same as type, also possible to use custom formatters
  width*:   Option[float] # default = 1, width as weight, not as pixels or percentages
  domain*:  Option[(float, float)] # Min/max range for values, used for
                                  # better weighted sorting, see `wsortTable`

proc to_json_hook*(o: PlotTableColumn): JsonNode =
  result = new_JObject()
  for k, v in o.field_pairs:
    when k == "min_max":
      result[k] = v.map((mm) => @[mm[0], mm[1]]).to_json
    else:
      result[k] = v.to_json


# type PlotTableWeights = Table[string, float]


type TableOptions* = object
  columns*:       Option[seq[PlotTableColumn]]
  alter_columns*: Option[seq[PlotTableColumn]] # Sometimes it's easier to override only some columns
  title*:         Option[string]

  sort*:          Option[seq[PlotColumnOrder]]
  wsort*:         Option[Table[string, float]] # weighted sorting

  filter*:        Option[string]  # default = "" filter query
  filters*:       Option[Table[string, PlotColumnFilter]] # column filters, column_id => condition

  id*:            Option[string]
  selectable*:    Option[bool] # default = true
  sortable*:      Option[bool] # default = true
  show_controls*: Option[bool] # default = true
  # `_i`*:          Option[bool] # default = false, show row indices


# --------------------------------------------------------------------------------------------------
# API ----------------------------------------------------------------------------------------------
# --------------------------------------------------------------------------------------------------
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


# Table.plot ---------------------------------------------------------------------------------------
proc plot*[Row](path: string, rows: seq[Row], options: TableOptions = TableOptions()): void =
  let url   = build_plot_url path
  var jdata = options.to_json
  jdata["version"] = 0.1.to_json
  jdata["rows"]    = rows.to_json

  let client = new_http_client()
  defer: client.close
  discard client.post_content(url, jdata.pretty)

proc plot*[Row](path: string, rows: seq[Row], options: JsonNode): void =
  var parsed: TableOptions
  from_json(parsed, options, Joptions(allow_extra_keys: false))
  plot(path, rows, parsed)


# del_plot -----------------------------------------------------------------------------------------
proc del_plot*(path: string): void =
  let url = build_plot_url path
  let client = new_http_client()
  defer: client.close
  discard client.delete(url)


# --------------------------------------------------------------------------------------------------
# Notes --------------------------------------------------------------------------------------------
# --------------------------------------------------------------------------------------------------
#
# TypeScript advantages compared to Nim for DSL and Schema Definition
#
# - In TS Data = Language = Types, 1 to 1 match, in Nim it is not.
# - In TS no need for Option. In Nim .some and .none needed.
# - In TS Discriminated Union for Formatter Options. In Nim less convenient Variant Object
# - In TS data autocasted to correct types. In Nim does not, and converters won't help as they don't
#   work with nested objects.
# - In TS enums are Literal Types. In Nim Enums are not clean so you had to use prefixes pr_enum_name
#   or Type.enum_name.
# - In TS there's no reserved words for keys. In Nim `type` and other can't be used as keys.