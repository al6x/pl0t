import ../pl0t
import std/strutils except `%`

# Optional, alters Nim 'json' module, to allow keys `%{ a: 1 }` instead of `%{ "a": 1 }`
import ./jsonm

var page = Page.init(
  title = "Some page",
  desc  = "Some description"
)


page.text "Some text", """
  Some formula $E=mc^2$

  Some code

  ```Ruby
  puts "Hello World"
  ```
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