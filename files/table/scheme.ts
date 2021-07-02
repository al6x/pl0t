// -------------------------------------------------------------------------------------------------
// Types -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
export type  Type  =  "string" | "number" | "boolean" | "unknown"
export const Type_ = ["string",  "number",  "boolean",  "unknown"]


// -------------------------------------------------------------------------------------------------
// Formats -----------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
export type Align = "left" | "center" | "right"
export interface StringFormatOptions {
  type: "string"
  align?: Align
  small?: boolean // small font size, false by default
}

export interface NumberFormatOptions {
  type:   "number"
  align?: Align
  small?: boolean // small font size, false by default
  round?: number // default 2
}

export interface LineFormatOptions {
  type:      "line"
  align?:  Align
  small?:  boolean // small font size, false by default
  domain?: [number, number] // domain or min/max values, if not provided will be calculated

  scale?:  "linear" | "log" // default = linear

  // "log_unit" could be used only with log scale, it rounds values in [0..1] range to 1, usefull to
  // display quantity of some units, like money, when we would like to round small
  // sums with less than $1 to avoid log being negative.
  log_unit?: boolean // default = false

  // range?:  "L" | "R" | "LR" // if left and right sides of scale should be displaeyd
                             // with 0 center for linear and 1 for log scale
  color?:  string
  ticks?:  number[]
}

export interface BooleanFormatOptions {
  type:   "boolean"
  align?: Align
  true?:  string
  false?: string
}

export interface UnknownFormatOptions {
  type:   "unknown"
  align?: Align
  small?: boolean // small font size, false by default
}

export type FormatOptions =
  StringFormatOptions | NumberFormatOptions | BooleanFormatOptions | LineFormatOptions | UnknownFormatOptions


// -------------------------------------------------------------------------------------------------
// Table -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
export interface TableOptions {
  version?:       1        // Table Version
  columns?:       Column[]
  alter_columns?: Column[] // Sometimes it's easier to override only some columns
  rows:           (Record<string, unknown>|unknown[])[]

  title?:      string

  order?:      ColumnOrder[] // max 3 columns
  query?:      string  // default = "" filter query

  id?:         string
  selectable?: boolean // default = true
  sortable?:   boolean // default = true
  toolbar?:    boolean // default = true
  // warnings?:   boolean // default = true
  _i?:         boolean // default = false, show row indices

  wsort?:      boolean // default = false, weighted sorting see `wsortTable` for details,
                        // use false for ordinary sorging
  // editable?:   boolean // disabled by default
}

export type ColumnOrder = [string, "asc" | "desc"]

export interface Column {
  id:      string
  type:    Type   // also possible to use custom types for third party formatters
  title?:  string // same as id if not specified
  format?: FormatOptions // by default same as type, also possible to use custom formatters
  width?:  number // default = 1, width as weight, not as pixels or percentages

  min_max?: [number, number] // Min/max range for values, used for better weighted sorting, see `wsortTable`
}