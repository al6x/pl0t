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
  round?: number  // default 2
}

export interface LineFormatOptions {
  type:    "line"
  align?:  Align
  small?:  boolean // small font size, false by default
  color?:  string
  ticks?:  number[]
  scale?:  "linear" | "log" // default = linear

  // "log_unit" could be used with log scale only, it replaces values in [0..1] range with 1, usefull to
  // display quantity of some units, like money. When we would like to round small values with less than
  // $1 cash, to avoid log being negative.
  log_unit?: boolean // default = false
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
  version:        0.1      // Table Version
  columns?:       Column[]
  alter_columns?: Column[] // Sometimes it's easier to override only some columns
  rows:           (Row | unknown[])[] // Row could be Tidy Data or Array

  title?:       string
  description?: string

  sort?:          ColumnOrder[] // ordinary sorting, max 3 columns
  wsort?:         { [column_id: string]: number } // weighted sorting

  filter?:  string  // default = "" filter query, matches for any column
  filters?: { [column_id: string]: ColumnFilter } // column filters, match for specific column

  id?:            string
  selectable?:    boolean // default = true
  sortable?:      boolean // default = true
  show_controls?: boolean // default = true

  debug?:         boolean // default = false, used for debug
}

export type Row = Record<string, unknown>

export type ColumnOrder = [string, "asc" | "desc"]

export interface Column {
  id:      string
  type:    Type          // also possible to use custom types for third party formatters
  title?:  string        // same as id if not specified
  format?: FormatOptions // by default same as type, also possible to use custom formatters
  width?:  number        // default = 1, width as weight, not as pixels or percentages

  // domain, min/max values, for "number" columns only, if not provided will be calculated. Used for better weighted
  // sorting and line format.
  domain?: [number, number]
}

export type  FilterCondition =   "<=" | "<" | "=" | "!=" | ">" | ">=" | "~"
export const FilterCondition_ = ["<=",  "<",  "=",  "!=",  ">",  ">=",  "~"]

export type ColumnFilter = [FilterCondition, number | string | boolean]