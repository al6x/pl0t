import type { Plot, Data, DataUrl } from './plot'
import type { Table } from './table'


export type Block = TextBlock | ImageBlock | ChartBlock | TableBlock


// BaseBlock ---------------------------------------------------------------------------------------
export interface BaseBlock {
  id?:        string | number
  title?:     string
  desc?:      string
  collapsed?: boolean
  tags?:      string[]

  // Block are usually inferred, but also could be specified explicitly with block name and version
  block?:         [string, 0.1]
  hash?:          string // Identity hash, optional

  // order?:         number
  // binary_hashes?: string[]
  // options?:       Object
  // created_at:    number
}


// TextBlock ---------------------------------------------------------------------------------------
export interface TextBlock extends BaseBlock {
  text: string | DataUrl
}


// ImageBlock --------------------------------------------------------------------------------------
export interface ImageBlock extends BaseBlock {
  image: string | DataUrl
}


// ChartBlock --------------------------------------------------------------------------------------
export interface ChartBlock extends BaseBlock {
  chart:         Plot | VegaSpec // Both Plot and VegaSpec supported
  data:          Data | DataUrl
  vega_options?: Object // Applied to both Plot and VegaSpec
}

export type VegaSpec = { vega_spec: object }


// ChartBlock --------------------------------------------------------------------------------------
export interface TableBlock extends BaseBlock {
  table?: Table
  data:   Data | DataUrl
}