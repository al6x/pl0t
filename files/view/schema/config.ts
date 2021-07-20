import type { BaseBlock } from "./blocks"

export interface PlotConfig {
  blocks_limit:                number
  narrow_width:                number
  height_in_narrow_width_mode: number

  // Used to parse files, by default JSON, YAML, CSV supported
  parsers: { [file_extension: string]: (data: string) => Promise<any> },

  // If no explicit block spec provided, the block type inferred by file extension
  blocks_for_file_extensions: { [extension: string]: string }

  // Blocks available, as Svelte components, blocks could be used inside apps.
  blocks: { [block_name: string]: { default: any, definition: BlockDefinition<any> } }

  // Apps available, as Svelte components, apps can have blocks.
  apps: { [block_name: string]: { default: any, definition: BlockDefinition<any> } }
}

export interface BlockExt extends BaseBlock {
  id:     string
  hash:   string
}

export interface BlockState {
  // suggested_width_px: number
  is_narrow: boolean
  collapsed: boolean
}

export interface BlockImplProps<T> {
  block: T
  state: BlockState
}

export interface AppImplProps {
  data: any
}

export type RawData = object | any[] | string | number | boolean
export interface BlockDefinition<T> {
  match:      (data: RawData) => boolean
  normalize?: (data: RawData) => T
}

export const plot_config: PlotConfig = {
  blocks_limit:                100,
  narrow_width:                480, // Should be same as in styles.css
  height_in_narrow_width_mode: 200,

  parsers: {},

  blocks_for_file_extensions: {
    md:   'text',
    text: 'text'
  },

  blocks: {},

  apps: {}
}
;(window as any).plot_config = plot_config // Also available globally