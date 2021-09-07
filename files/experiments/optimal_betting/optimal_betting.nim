require base, pl0t, ./simulation


var page = Page.init %{
  title: "Optimal Betting",
  desc: """
  Finding an optimal way to deal with uncetainty. Using simple coin toss game as example.

  The game - there's a biased coin with 60% of win. You bet some money, if you win your money doubled, if
  not you loose you bet.

  What proportion of your money should you bet?
  """
}
let (blue, green, yellow, red, grey) = ("#1f77b4", "#047857", "#D97706", "#DC2626", "#4B5563")

let (players, steps, simulation_bet) = (100, 100, 0.6)
let simulation = simulate(players, steps, simulation_bet)

block: # Plotting simulation
  let title = fmt"{players} players playing game {steps} times with {simulation_bet} bet"
  page.chart title, simulation.games.to_columns, %[
    "line",
    { x: "step", title: "Game step" },
    { y: "money", title: "Money" },
    { opacity: "", value: 0.3 },
    { detail: "player" },
    { height: 300 }
  ]


block: # Plotting less players
  let less_players = simulation.games.filter((v) => v.player < 5)

  page.chart(
    fmt"5 players",
    less_players.to_columns,
    %[
      "line",
      { x: "step", title: "Game step" },
      { y: "money", title: "Money", vega: { axis: { values: [0.01, 0.1, 1, 10, 100] } } },
      { color: "player", scheme: "category10" },
      { height: 300 }
    ])

  page.chart(
    fmt"5 players, log scale",
    less_players.to_columns,
    %[
      "line",
      { x: "step", title: "Game step" },
      { y: "money", title: "Money", scale: "log", vega: { axis: { values: [0.01, 0.1, 1, 10, 100] } } },
      { color: "player", scheme: "category10" },
      { height: 300 }
    ])


block: # Simulation with mean and mean growth
  let data =
    simulation.games.map((v) => %v) &
    simulation.mean.map((v, i) => %{ mstep: i, mean: v }) &
    simulation.mean_growth.map((v, i) => %{ mgstep: i, mean_growth: [(v * i.float).exp, 0.01].max })

  let axis_config = %{ axis: { values: [0.01, 0.1, 1, 10, 100, 1000, 10000] } }
  let title = fmt"{players} players playing game {steps} times, in log scale with {simulation_bet} bet"
  page.chart title, data.to_columns, %[
    [ # Games
      { mark: "line", color: grey, size: 1 },
      { x: "step", title: "Game step" },
      { y: "money", title: "Money", scale: "log", vega: axis_config },
      { opacity: "", value: 0.3 },
      { detail: "player" }
    ],
    [ # Mean
      { mark: "line", color: blue, size: 3 },
      { x: "mstep", title: "Game step" },
      { y: "mean", title: "Money", scale: "log", vega: axis_config },
    ],
    [ # Mean growth
      { mark: "line", color: green, size: 3 },
      { x: "mgstep", title: "Game step" },
      { y: "mean_growth", title: "Money", scale: "log", vega: axis_config },
    ],
    { height: 400 }
  ]


block: # Optimal growth
  let growths = simulate_growth(players, steps)
  let optimal_bet = growths.findmax((v) => v.mean_growth).bet
  let data = growths.map(proc (d: auto): auto =
    let color =
      if   d.mean_growth < 0:    red
      elif d.bet <= optimal_bet: green
      else:                      yellow
    (bet: d.bet, mean_growth: d.mean_growth, color: color)
  )

  page.chart fmt"Optimal Growth", data, %[
    [
      "circle",
      { x: "bet", title: "Bet" },
      { y: "mean_growth", title: "Mean Growth" },
      { color: "color", type: "nominal", vega: { scale: nil } },
      # { color: "", value: ["datum.mean_growth >= 0", "green", "red"] },
    ],
    [
      { mark: "rule", color: green, size: 3 },
      { x: "", value: optimal_bet }
    ],
    [
      { mark: "rule", color: red, size: 1 },
      { x: "", value: simulation_bet }
    ],
    { height: 300 }
  ]


# Source Code
page.text fmt"Simulation code", fmt"""
Full source

```Nim
{fs.read("./simulation.nim")}
```
"""

page.save "optimal_betting.html"

