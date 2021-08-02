import { App } from './schema/mod.ts'

export * from './schema/mod.ts'

export function toHtml(app: App, pretty = false): string {
  const json = pretty ? JSON.stringify(app, null, 2) : JSON.stringify(app)
  return standalone.replace('{type}', 'json').replace('{data}', json)
}

export async function save(app: App, path: string, pretty = false): Promise<void> {
  let html = toHtml(app, pretty)
  await Deno.writeFile(path, (new TextEncoder()).encode(html))
}


export async function publish(app: App, url: string, pretty = false): Promise<void> {
  const json = pretty ? JSON.stringify(app, null, 2) : JSON.stringify(app)
  const headers = { api_token: api_token() }
  const resp = await fetch(url, { method: 'POST', headers, body: json })
  if (resp.status != 200) throw new Error(`can't publis page, ${resp.text()}`)
}


export async function unpublish(url: string): Promise<void> {
  const headers = { api_token: api_token() }
  const resp = await fetch(url, { method: 'DELETE', headers })
  if (resp.status != 200) throw new Error(`can't publis page, ${resp.text()}`)
}


function api_token(): string {
  let api_token = Deno.env.get('plot_api_token')
  if (!api_token) throw new Error("plot_api_token environment variable is not defined")
  return api_token
}


// standalone begin
const standalone = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <title>pl0t</title>

  <link rel="icon" type="image/png" href="http://files.pl0t.com/view-1/favicon.ico">

  <!-- PL0T begin, putting it at the end of the page to avoid blocking other content -->
  <script>
    window.env = {
      base_url: "http://files.pl0t.com/view-1"
    }
  </script>
  <link rel="stylesheet" href="http://files.pl0t.com/view-1/releases/2021-08-02-8bf84d/bundle.css">
  <script defer src="http://files.pl0t.com/view-1/releases/2021-08-02-8bf84d/bundle.js"></script>
  <!-- PL0T end -->

</head>
<body>

<!-- PL0T data, specify 'json', 'yml' or 'md' formats in the 'type' attribute -->
<script id="data" type="{type}">
{data}
</script>


<script>
  window.on_plot_loaded = function() {
    window.plot_api.run()
  }
</script>

</body>
</html>
`
// standalone end