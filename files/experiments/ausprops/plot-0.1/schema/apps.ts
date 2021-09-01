import type { Block } from './blocks.ts'
import type { DataUrl } from './plot.ts'

export type Style = 'normal' | 'full' | 'narrow'

export interface Page {
  app:      ['page', 0.1]
  page:     Block[]

  id?:      string | number
  title?:   string
  desc?:    string
  tags?:    string[]
  style?:   Style
  css?:     string | DataUrl // Apply custom CSS
}

export type Single = Block & {
  app:      ['block', 0.1]
  style?:   Style
  css?:     string | DataUrl // Apply custom CSS
}

export interface Dash {
  app:     ['dash', 0.1]
  blocks:  { [layout_id: string]: Block }


  // Block layout, letter - layout_id, the size will be proportional
  //   const layout = `
  //     A A B
  //     A A B
  //     D D C
  //   `
  layout:   string

  id?:      string | number
  title?:   string
  desc?:    string
  tags?:    string[]
  style?:   Style
  css?:     string | DataUrl // Apply custom CSS
}

export type App = Page | Single | Dash
