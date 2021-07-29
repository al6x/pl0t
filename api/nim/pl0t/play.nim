import ../pl0t, ./jsonm
import std/strutils except `%`

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

page.table "Some table", [
  [1, 2]
]

let data = (
  a: [1, 2, 3,  4, 5],
  b: [1, 3, 2, -1, 2]
)
page.chart "Some chart", data, %[
  "bar",
  { x: "a", type: "nominal" },
  { y: "b" }
]

# plot will pick up the `plot_api_token` environment variable if it's defined
page.plot "http://al6x.pl0t.com/nim_test/page.json"