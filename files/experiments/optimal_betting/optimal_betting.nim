# How to run:
#
# nim r optimal_betting.nim && open optimal_betting.html

require base, pl0t, ./simulation

var page = Page.init %{
  title: "Investor's First Rule, Optimal Betting",
  desc: """
  *This [page is open][source] and you can run it yourself, customise calculations or add your own.*

  Optimal Betting is what Buffet calls "The rule N1", also known as Kelly Criterion. It answers
  question how to **get max money while avoiding ruin**.

  The game - there's a biased coin with 60% of win. You bet some money, if you won your bet is
  doubled, if not you loose the bet.

  ```Nim
  proc play*(money: float, bet: float): float =
    if money <= 0.01: return 0.01 # Can't play when less than 0.01
    let biased_coin_toss = rand(1..100) <= 60 # 60% probability of wining
    let betting = money * bet
    (money - betting) + (if biased_coin_toss: betting * 2 else: 0)
  ```

  How to **win most money**? What proportion of your money should you bet in each game?

  [source]: https://github.com/al6x/pl0t/blob/main/files/experiments/optimal_betting/optimal_betting.nim
  """
}
let (blue, green, yellow, red, grey) = ("#1f77b4", "#047857", "#D97706", "#DC2626", "#4B5563")

let (players, steps, simulation_bet) = (100, 100, 0.6)
let simulation = simulate(players, steps, simulation_bet)

block: # Plotting simulation
  let title = fmt"{players} players playing game"
  let desc = fmt"""
  Using simulation to play game for {players} players each playing {steps} times, sequentially with
  same {simulation_bet} bet.

  This is loosing strategy, almost all players lost everything.
  """
  page.chart title, desc, simulation.games.to_columns, %[
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
    """
    Not much could be seen on the previous chart, zooming in and limiting amount of players to 5.
    """,
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
    """
    Using log scale to better see the how exactly players loose money.
    """,
    less_players.to_columns,
    %[
      "line",
      { x: "step", title: "Game step" },
      { y: "money", title: "Money", scale: "log", vega: { axis: { values: [0.01, 0.1, 1, 10, 100] } } },
      { color: "player", scheme: "category10" },
      { height: 300 }
    ])


page.text "Why players loosing money?","""
The game is winning, expected value for 100% bet is positive $E(bet=1)=1.2$ so why
players loose money?

The reason is over exposure, players betting too much and going bust.

The expected value calculations are wrong, as they can't be applied to this case. Classical stats use
space averages, assuming it will be the same as time averages. In some cases it works, but this case
an many others cases in finance it doesn't.

This game is not simple, even it may look so. It's nonlinear stochastic differential equation, and
our intuition and common sense doesn't work well in such cases.

Thankfully there's a good and simple way to deal with such cases using simulations.
"""


block: # Simulation with mean and mean growth
  let data =
    simulation.games.map((v) => %v) &
    simulation.mean.map((v, i) => %{ mstep: i, mean: v }) &
    simulation.mean_growth.map((v, i) => %{ mgstep: i, mean_growth: [(v * i.float).exp, 0.01].max })

  let axis_config = %{ axis: { values: [0.01, 0.1, 1, 10, 100, 1000, 10000] } }
  let title = fmt"{players} players playing game, log scale"
  let desc = fmt"""
  Plotting same simulation for {players} players each playing {steps} times, sequentially with
  same {simulation_bet} bet but with log scale, to better see what's going on.

  We can see that while there are some ups, eventually almost all players are loosing money and
  going to zero. Because they are over exposed.

  """ & """
  And plotting mean $\langle{X}\rangle$ (**space** average, blue) and
  mean growth $\langle{ln{X}}\rangle$ (**time** average, green).

  """ & fmt"""
  As we can see those are **diverging**. Mean (wrongly) shows us that game with {simulation_bet}
  bet is winning, while mean growth (correctly) shows us that game with {simulation_bet} bet is loosing.
  """
  page.chart title, desc, data.to_columns, %[
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
  let desc = fmt"""
  Using simulation to calculate mean growth for every bet size and choosing the maximal one. The optimal
  bet is {optimal_bet}.

  - Smaller bets are safe but would produce less money.
  - Larger but still positive bets are not make sense as it would produce less money is more risky
    and lock extra money costing opportunity.
  - Larger negative bets means ruin.
  """
  page.chart fmt"Optimal Growth", desc, data, %[
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

page.text fmt"Usage in practice", fmt"""
Optimal betting known in many forms, as Kelly Criterion or as Buffet calls it two most important rules
of investing:

> Rule No.1: Never lose money.
>
> Rule No.2: Never forget rule No.1

When used in practice for optimal portfolio allocation, there are extra complications. Probabilities
and game mechanics are unknown, multiple bets/games should be placed simultaneously, and there's no
safe storage of money.

It's very usefull to know about how optimal betting works but it's not always directly applicable
to practice. And simpler approaches could be used like 1/N or Fractional Kelly.

Also, searching for the most optimised solution is dangerous, because optimisation on subset of known
data or overfitting produces fragile system that may break on unexpected event.

It's important to know how this thing works, but it should be used wisely.
"""


# Source Code
page.text fmt"Simulation code", fmt"""
Full [source code](source)

```Nim
{fs.read("./simulation.nim")}
```

[source]: https://github.com/al6x/pl0t/blob/main/files/experiments/optimal_betting/optimal_betting.nim
"""

page.save "optimal_betting.html"

