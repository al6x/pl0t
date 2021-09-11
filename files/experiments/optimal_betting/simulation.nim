import base, std/random
randomize 4

proc play*(money: float, bet: float): float =
  if money <= 0.01: return 0.01 # Can't play when less than 0.01
  let biased_coin_toss = rand(1..100) <= 60 # 60% probability of wining
  let betting = money * bet
  let money2 = (money - betting) + (if biased_coin_toss: betting * 2 else: 0)
  if money2 <= 0.01: 0.01 else: money2.round(3) # Rounding to save space in JSON


type Simulation* = tuple
  games:       seq[tuple[player: int, step: int, money: float]]
  mean:        seq[float]
  mean_growth: seq[float]

proc simulate*(players: int, steps: int, bet: float): Simulation =
  # Simulating N players playing game M times, sequentially
  var moneys = fill(players, 1.0); var simulation: Simulation
  for step in 0..steps: # Playing game N times
    for player in 0..<players: # For N players
      if step > 0: # n=0 is the initial condition
        moneys[player] = play(moneys[player], bet)
      simulation.games.add (player: player, step: step, money: moneys[player])
    simulation.mean.add moneys.mean
    simulation.mean_growth.add moneys.map((m) => m.ln / steps.float).mean
  simulation

proc simulate_growth*(players: int, steps: int): seq[tuple[bet: float, mean_growth: float]] =
  for betp in 0..100:
    let bet = betp.float / 100.0
    let mean_growth = simulate(players, steps, bet).mean_growth.last
    result.add (bet, mean_growth)