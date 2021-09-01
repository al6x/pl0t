// Ignore this schema, it's needed only if you would like to extend PL0T

import type { BaseBlock } from './blocks.ts'

export interface PlotConfig {
  blocks_limit:                number
  narrow_width:                number
  height_in_narrow_width_mode: number

  // Used to parse files, by default JSON, YAML, CSV supported
  parsers: { [file_extension: string]: (data: string) => Promise<any> },

  // If no explicit block spec provided, the block type inferred by file extension
  blocks_for_file_extensions: { [extension: string]: string }

  // Blocks available, as Svelte components, blocks could be used inside apps.
  blocks: { [block_name: string]: { default: any, definition: BlockDefinition<unknown> } }

  // Apps available, as Svelte components, apps can have blocks.
  apps: { [block_name: string]: { default: any, definition: AppDefinition<unknown> } }
}

// Parsed and normalized block
export interface BlockExt extends BaseBlock {
  id:     string
  hash:   string

  // block_name: string // Block name
  // klass:      any    // Svelte component
  // ndata:      any    // Block data normalized by block's `match_and_normalize`
}

export interface BlockImplProps<T> {
  block:     T
  is_narrow: boolean
}

export interface AppImplProps {
  default_title: string | undefined
  data:          any
}

export type RawData = { [key: string]: any } | any[] | string | number | boolean
export interface BlockDefinition<T> {
  match_and_normalize: (data: RawData) => T | undefined
}
export interface AppDefinition<T> {
  match_and_normalize: (data: RawData) => T | undefined
}

export const plot_config: PlotConfig = {
  blocks_limit:                100,
  narrow_width:                480, // Should be same as in styles.css
  height_in_narrow_width_mode: 200,

  parsers: {},

  blocks_for_file_extensions: {
    md:       'text',
    markdown: 'text',
    text:     'text',
    txt:      'text'
  },

  blocks: {},

  apps: {}
}
;(window as any).plot_config = plot_config // Also available globally