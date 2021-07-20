export const version = 0.1

export interface PlotApi {
  version:         0.1
  run(args?: { data: any }): Promise<void>
}

export const plot_api: PlotApi = { version } as any
;(window as any).plot_api = plot_api // Also available globally