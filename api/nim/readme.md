Plot and visualise data

# Example

Get API token http://pl0t.com and set it as `plot_api_token` env variable.

Install `nimble install pl0t`

```Nim
import pl0t, pl0t/jsonm
import std/strutils except `%`

var page = Page.init(
  title = "Some page",
  desc  = "Some description"
)


page.text "Some text", """
  Some formula $E=mc^2$

  Some code `echo "Hello World"`
""".dedent


let table_data = @[
  (name: "Jim Raynor",   age: 30,     hp: 250,  is_alive: true ),
  (name: "Angus Mengsk", age: 50,     hp: 100,  is_alive: false ),
  (name: "Amon",         age: 30000,  hp: 500,  is_alive: true)
]
page.table "Some table", table_data, %{
  columns: [
    { id: "name" },
    { id: "age" },
    { id: "hp", format: { type: "line", ticks: [100] } },
    { id: "is_alive" }
  ]
}


let chart_data = (
  a: [1, 2, 3,  4, 5],
  b: [1, 3, 2, -1, 2]
)
page.chart "Some chart", chart_data, %[
  "bar",
  { x: "a", type: "nominal" },
  { y: "b" }
]

# plot will pick up the `plot_api_token` environment variable if it's defined
page.plot "http://al6x.pl0t.com/nim_test/page.json"

# Open URL in Browser http://al6x.pl0t.com/nim_test/page.json:view
```

For all possible options checkout the online demos and
  [data schema](https://github.com/al6x/pl0t/blob/main/files/view/schema/blocks.ts).