import ../pl0t, ./jsonm

plot_base_url  = "http://al6x.plot.com"
plot_api_token = "stub"

let rows = @[
  (name: "Jim",  age: 30),
  (name: "Kate", age: 25),
]

plot "/nim_test/table.json", rows, jo {
  columns: [
    { id: "name", type: "string" },
    { id: "age",  type: "number" }
  ]
}