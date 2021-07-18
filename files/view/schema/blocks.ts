import type { Plot, Data, DataUrl } from './plot'
import type { Table } from './table'

export interface BaseBlock {
  id?:            string | number
  title?:         string
  description?:   string
  collapsed?:     boolean
  tags?:          string[]

  hash?:          string
  order?:         number
  // binary_hashes?: string[]
  // options?:       Object
  // created_at:    number
}

export interface TextBlock extends BaseBlock {
  text: string | DataUrl
}

export interface ImageBlock extends BaseBlock {
  image: string | DataUrl
}

export type VegaSpec = { vega_spec: object }
export interface ChartBlock extends BaseBlock {
  chart:         Plot | VegaSpec // Both Plot and VegaSpec supported
  data:          Data | DataUrl
  vega_options?: Object // Applied to both Plot and VegaSpec
}

export interface TableBlock extends BaseBlock {
  table:  Table
  data:   Data | DataUrl
}

export type Block = TextBlock | ImageBlock | ChartBlock | TableBlock