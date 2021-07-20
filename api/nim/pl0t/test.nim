import ../pl0t, ./jsonm

plot_base_url  = "http://al6x.pl0t.com"
# plot_api_token will pick up the $plot_api_token environment variable if it's defined

plot "/nim_test/table.json", %{
  table: {
    columns: [
      { id: "name", type: "string" },
      { id: "age",  type: "number" }
    ]
  },
  data: [
    { name: "Jim",  age: 30 },
    { name: "Kate", age: 25 },
  ]
}

# Open http://al6x.pl0t.com/nim_test/table.json:view