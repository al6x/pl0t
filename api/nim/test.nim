import pl0t, pl0t/jsonm

plot_base_url  = "http://al6x.plot.com"
plot_api_token = "stub"

let rows = @[
  (name: "Jim",  age: 30)
]

plot "/nim_test/table.json", rows, jo {
  columns: [
    { id: "name", type: "string" },
    { id: "age",  type: "number" }
  ]
}