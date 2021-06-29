Plot and visualise data

# Example

Get API token http://pl0t.com

```Nim
import pl0t, pl0t/jsonm

plot_base_url  = "http://your-subdomain.pl0t.com" # Use your subdomain
plot_api_token = get_env("plot_api_token")        # Define plot_api_token env variable

let rows = @[
  (name: "Jim",  age: 30),
  (name: "Kate", age: 25),
]

plot "/test_table.json", rows, jo {
  columns: [
    { id: "name", type: "string" },
    { id: "age",  type: "number" }
  ]
}

# Open http://your-subdomain.pl0t.com/test_table.json:table-dev
```

For all possible options checkout the online demos and Nim data schema in `pl0t.nim`