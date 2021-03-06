PL0T and **See the Data**

# Example

![](screenshot.png)

The example below could be run with deno safely, without any permissions as:

    deno run https://raw.githubusercontent.com/al6x/pl0t/main/api/deno/play.ts > play.html

It generates the `play.html` notebook page, that could be used locally, or shared on any site.

The code:

```TypeScript
import {
  Block, App, toHtml, save, publish
} from 'https://raw.githubusercontent.com/al6x/pl0t/main/api/deno/0.1/pl0t.ts'

const blocks: Block[] = []


blocks.push({ id: 'Some text', text: `
  Some formula $E=mc^2$

  Some code \`puts 'Hello World'\`
` })


const table_data = [
  { name: 'Jim Raynor',   age: 30, hp: 250,  is_alive: true },
  { name: 'Angus Mengsk', age: 50, hp: 100,  is_alive: false },
  { name: 'Amon',                            is_alive: true }
]
blocks.push({ id: 'Some table', data: table_data, table: {
  columns: [
    { id: 'name' },
    { id: 'age' },
    { id: 'hp', format: { type: 'line', ticks: [100] } },
    { id: 'is_alive' }
  ]
} })


const chart_data = {
  a: [1, 2, 3,  4, 5],
  b: [1, 3, 2, -1, 2]
}
blocks.push({ id: 'Some chart', data: chart_data, chart: [
  'bar',
  { x: 'a', type: 'nominal' },
  { y: 'b' }
] })


const page: App = {
  app:   ['page', 0.1],
  title: 'Some page',
  desc:  'Some description',
  page:  blocks
}


// Saving report as HTML file, open it the Browser to see the Notebook
// You can publish Notebook by copying it to any Web Server
// Run as `deno run play.ts > play.html`
console.log(toHtml(page))

// You can also use `save` and run as `deno run --allow-write play.ts`
// await save(page, 'play.html')


// Optionally, you can publish Notebook on the http://pl0t.com site.
// You would need to get API Token from http://pl0t.com and store it as `plot_api_token` env variable
// The Notebook will be available as http://al6x.pl0t.com/deno_test/page.json:view
// Run as `deno run --allow-write --allow-env --allow-net play.ts`
// await publish(page, 'http://al6x.pl0t.com/deno_test/page.json')
```

For more examples checkout [online demos](http://pl0t.com).