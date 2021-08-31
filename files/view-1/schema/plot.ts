// Colors https://vega.github.io/vega-lite-v1/docs/scale.html#color-palette


// Data --------------------------------------------------------------------------------------------
export type Value   = string | number | boolean | Date | undefined | null
export type Row     = Value[] | object // Record<string, Value>
export type Data    = Row[] | { [key: string]: Value[] }
export type DataUrl = { url: string }


// Plot --------------------------------------------------------------------------------------------
export type LayerPlot = (
  Calculate | Filter |
  Mark | MarkSpec | Encoding |
  Properties |
  VegaPart
)[]

export type Plot = (
  Calculate | Filter |
  Mark | MarkSpec | Encoding |
  Properties |
  LayerPlot |
  Facet |
  Concat |
  VegaPart
)[]


// Properties --------------------------------------------------------------------------------------
export interface Properties {
  width?:  number
  height?: number
  config?: Object
}


// Interpolate -------------------------------------------------------------------------------------
export type Interpolate =
  'linear' | 'linear-closed' | 'step' | 'step-before' | 'step-after' | 'basis' | 'basis-open' |
  'basis-closed' | 'cardinal' | 'cardinal-open' | 'cardinal-closed' | 'bundle' | 'monotone'


// Mark --------------------------------------------------------------------------------------------
export type Mark =
  'point' | 'circle' | 'line' | 'area' | 'bar' | 'rect' | 'rule' | 'square' | 'text' | 'tick' | 'trail'


export interface MarkSpec {
  mark:         Mark
  color?:       string
  size?:        number
  point?:       boolean
  interpolate?: Interpolate
  opacity?:     number
  thickness?:   number
  vega?:        Object
}


// FieldType ---------------------------------------------------------------------------------------
export type FieldType =
  'nominal' | 'ordinal' | 'quantitative' | 'temporal'


// Aggregate ---------------------------------------------------------------------------------------
export type Aggregate =
  'count' | 'valid' | 'missing' | 'distinct' | 'sum' | 'mean' | 'average' |
  'variance' | 'variancep' | 'stdev' | 'stdevp' | 'stderr' | 'median' | 'q1' | 'q3' | 'ci0' | 'ci1' |
  'min' | 'max' | 'argmin' | 'argmax' |
  'product'


// Channel -----------------------------------------------------------------------------------------
export type Channel =
  'x' | 'y' | 'x2' | 'y2' | 'xError' | 'yError' | 'xError2' | 'yError2' |                    // Position
  'longitude' | 'latitude' | 'longitude2' | 'latitude2' |                                    // Geographic Position
  'color' | 'opacity' | 'fillOpacity' | 'strokeOpacity' | 'shape' | 'size' | 'strokeWidth' | // Mark
  'text' | 'tooltip' |                                                                       // Text and Tooltip
  'href' |                                                                                   // Hyperlink
  'detail' |                                                                                 // Level of Detail
  'key' |                                                                                    // Key
  'order'                                                                                    // Order


// Scale -------------------------------------------------------------------------------------------
export type ScaleType =
  'linear' | 'pow' | 'sqrt' | 'symlog' | 'log' | 'time' | 'utc' |
  'ordinal' | 'band' | 'point' |
  'bin-ordinal' | 'quantile' | 'quantize' | 'threshold'

export type ScaleDomain = (number | string | boolean)[]

export type ScaleRange = string | (number | string)[]


// TimeUnit ----------------------------------------------------------------------------------------
export type TimeUnit =
  'year' | 'yearquarter' | 'yearquartermonth' | 'yearmonth' | 'yearmonthdate' |
  'yearmonthdatehours' | 'yearmonthdatehoursminutes' | 'yearmonthdatehoursminutesseconds' | 'quarter' |
  'quartermonth' | 'month' | 'monthdate' | 'date' | 'day' | 'hours' | 'hoursminutes' | 'hoursminutesseconds' |
  'minutes' | 'minutesseconds' | 'seconds' | 'secondsmilliseconds' | 'milliseconds'


// BinValue ----------------------------------------------------------------------------------------
export type BinValue = boolean | number | 'binned'


// EncodingValue -----------------------------------------------------------------------------------
export type EncodignSimpleValue = string | number | boolean | string
export type EncodignValue = EncodignSimpleValue |
  // condition, value
  [  string,    EncodignSimpleValue] |
  // condition, value,               else value
  [  string,    EncodignSimpleValue, EncodignSimpleValue]


// Encoding ----------------------------------------------------------------------------------------
export interface SharedEncoding {
  readonly type?:           FieldType
  readonly aggregate?:      Aggregate
  readonly legend?:         string | boolean
  readonly title?:          string | boolean
  readonly labels?:         boolean
  readonly time_unit?:      TimeUnit
  readonly timeUnit?:       TimeUnit
  readonly bin?:            BinValue
  readonly zero?:           boolean
  readonly scale?:          ScaleType
  readonly domain?:         ScaleDomain
  readonly range?:          ScaleRange
  readonly value?:          EncodignValue
  readonly override_value?: string
  readonly scheme?:         string
  readonly reverse?:        boolean
  // readonly condition?
  // readonly nice?:      boolean
  readonly vega?:           Object
}

export interface XEncoding extends SharedEncoding { x: string }
export interface YEncoding extends SharedEncoding { y: string }
export interface X2Encoding extends SharedEncoding { x2: string }
export interface Y2Encoding extends SharedEncoding { y2: string }
export interface SizeEncoding extends SharedEncoding { size: string }
export interface ColorEncoding extends SharedEncoding { color: string }
export interface OpacityEncoding extends SharedEncoding { opacity: string }
export interface ShapeEncoding extends SharedEncoding { shape: string }
export interface TooltipEncoding extends SharedEncoding { tooltip: string }

export type Encoding = XEncoding | YEncoding | X2Encoding | Y2Encoding | SizeEncoding |
  ColorEncoding | OpacityEncoding | ShapeEncoding | TooltipEncoding


// Calculate ---------------------------------------------------------------------------------------
export interface Calculate {
  calculate: string
  as:        string
}


// Filter ------------------------------------------------------------------------------------------
export interface Filter {
  filter: string
}


// Facet -------------------------------------------------------------------------------------------
export interface ColumnFacet {
  readonly column: string
  readonly type?:  FieldType
}
export interface RowFacet {
  readonly row:    string
  readonly type?:  FieldType
}
export interface ColumnsFacet {
  readonly facet:    string
  readonly type?:    FieldType
  readonly columns?: number
}
export type Facet = RowFacet | ColumnFacet | ColumnsFacet


// Concat ------------------------------------------------------------------------------------------
export interface Concat {
  concat: 'vertical' | 'horizontal'
}


// VegaPart ----------------------------------------------------------------------------------------
export type VegaPart = { vega: Object }