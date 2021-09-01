// -------------------------------------------------------------------------------------------------
// support -----------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// deno, is_browser --------------------------------------------------------------------------------
let deno = 'Deno' in window ? (window as any).Deno : undefined
const is_browser = deno == undefined


// -------------------------------------------------------------------------------------------------
// Env ---------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
const env_cache = new Map<string, string | undefined>()

function get_env(key: string): string
function get_env(key: string, deflt: string): string
function get_env(key: string, deflt?: string): string | undefined {
  if (!env_cache.has(key)) {
    try {
      const value = is_browser ? ((window as any).env || {})[key] : deno.env.get(key)
      env_cache.set(key, value)
    } catch(e) {
      // If there's no permission in Deno
      env_cache.set(key, undefined)
    }
  }
  const value = env_cache.get(key)
  if (value === undefined) {
    if (deflt !== undefined) return deflt
    else                     throw new Error(`env var '${key}' is not defined`)
  } else {
    return value
  }
}


// environment mode --------------------------------------------------------------------------------
function is_prod(): boolean { return get_env("env", "dev") == "prod" }
function is_test(): boolean { return get_env("env", "dev") == "test" }
function is_dev():  boolean { return get_env("env", "dev") == "dev" }



// -------------------------------------------------------------------------------------------------
// Test --------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
const tests: { name: string, test: (() => void) | (() => Promise<void>) }[] = []
let last_runned_test = 0, testing_in_progress = false
function run_tests () {
  if (testing_in_progress) return
  testing_in_progress = true
  setTimeout(async () => {
    while (last_runned_test < tests.length) {
      let { name, test } = tests[last_runned_test]
      last_runned_test += 1
      try {
        console.log(`  test | ${name}`)
        let promise = test()
        if (promise) await promise
      } catch (e) {
        console.error(`  test | ${name} failed`)
        console.error(e)
        if (!is_browser) throw e
      }
    }
    // console.log(`  test | success`)
    testing_in_progress = false
  }, 0)
}

let test_enabled_s: string
try   { test_enabled_s = get_env("test", "").toLowerCase() }
catch { test_enabled_s = "false" }
let slow_test_enabled = test_enabled_s == "all"
let test_enabled = slow_test_enabled || (test_enabled_s == "true")

function test(name: string | { name: string }, test: (() => void) | (() => Promise<void>)) {
  name = is_string(name) ? name : name.name
  tests.push({ name, test })
  if (test_enabled || name.toLowerCase() == test_enabled_s) run_tests()
}

function slow_test(name: string | { name: string }, test: (() => void) | (() => Promise<void>)) {
  name = is_string(name) ? name : name.name
  tests.push({ name, test })
  if (slow_test_enabled || name.toLowerCase() == test_enabled_s) run_tests()
}

window.run_tests = run_tests
window.test = test
window.slow_test = slow_test


// -------------------------------------------------------------------------------------------------
// global ------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
declare global {
  function p(...args: any[]): void
  function discard<T>(v: T): void // Needeed to discard Svelte properties, to avoid unused warnings

  export type E<R> = { is_error: true, message: string } | { is_error: false, value: R }

  interface Assert {
    (condition: boolean, message?: string | (() => string)): void
    equal<T>(a: T, b: T, message?: string | (() => string)): void
    fail(cb: () => void, message?: string | (() => string)): void
    aequal(a: number, b: number, message?: string | (() => string), deltaRelative?: number): void
  }
  const assert: Assert

  function test(name: string | { name: string }, test: (() => void) | (() => Promise<void>)): void
  function slow_test(name: string | { name: string }, test: (() => void) | (() => Promise<void>)): void
  function run_tests(): void

  function is_number(v: unknown): v is number
  function is_array(v: unknown): v is unknown[]
  function is_string(v: unknown): v is string
  function is_boolean(v: unknown): v is boolean
  function is_object(v: unknown): v is { [key: string]: any }
  function is_function(v: unknown): v is Function
  function is_promise(v: unknown): v is Promise<any>
  function is_undefined(v: unknown): v is undefined

  function set_timeout(fn: () => void, delay_ms: number): number
  function clear_timeout(handler: number): void

  function set_interval(fn: () => void, delay_ms: number, immediate?: boolean): number
  function clear_interval(fn: () => void, delay_ms: number): number

  function to_json(o: unknown, pretty?: boolean): string
  function from_json<T>(klass: { new(arg: any): T }, s: string): T

  function ensure<T>(value: (T | undefined) | E<T>, info?: string): T

  function ensure_error(error: unknown, defaultMessage?: string): Error

  function get_env(key: string): string
  function get_env(key: string, deflt: string): string

  function is_prod(): boolean
  function is_test(): boolean
  function is_dev():  boolean

  function sleep(ms: number): Promise<void>
}

window.p = p
window.discard = function<T>(v: T): void {}

window.is_number    = function(v: unknown): v is number {
  return (typeof v == 'number') && Number.isFinite(v) // also checking for NaN
}
window.is_array     = function(v: unknown): v is unknown[] { return Array.isArray(v) }
window.is_string    = function(v: unknown): v is string { return typeof v == 'string'}
window.is_boolean   = function(v: unknown): v is boolean { return typeof v == 'boolean'}
window.is_object    = function(v: unknown): v is { [key: string]: any } {
  return typeof v == 'object' && v !== null
}
window.is_function  = function(v: unknown): v is Function { return typeof v == 'function' }
window.is_promise   = function(v: unknown): v is Promise<any> {
  return typeof v == 'object' && v !== null && (typeof ((v as any).then) == 'function')
}
window.is_undefined = function(v: unknown): v is undefined { return v === undefined }

window.set_timeout = function(fn, delay_ms) { return setTimeout(fn, delay_ms) }
window.clear_timeout = clearTimeout

window.set_interval = function(fn, delay_ms, immediate = false) {
  if (immediate) fn()
  return setInterval(fn, delay_ms)
}
window.clear_timeout = clearTimeout

window.to_json = to_json
window.from_json = from_json

window.ensure = function ensure<T>(value: (T | undefined) | E<T>, info?: string): T {
  if (value === undefined) {
    throw new Error(`value${info ? ' ' + info : ''} not defined`)
  } else if (is_object(value) && ('is_error' in value)) {
    if (value.is_error) throw new Error(value.message || `value${info ? ' ' + info : ''} not found`)
    else                return value.value
  } else {
    return value
  }
}

window.ensure_error = ensure_error

window.get_env = get_env
window.is_prod = is_prod
window.is_dev  = is_dev
window.is_test = is_test

window.sleep = function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}


// -------------------------------------------------------------------------------------------------
// Object ------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
declare global {
  interface ObjectConstructor {
    is_empty(o: object): boolean
    size(o: object): number
    each<T>(o: { [k: string]: T }, fn: (v: T, i: string) => void): void
    map<T, R>(o: { [k: string]: T }, fn: (v: T, i: string) => R): { [k: string]: R }
    filter<T>(o: { [k: string]: T }, fn: (v: T, i: string) => boolean): { [k: string]: T }
  }

  interface Object {
    is_equal<T>(this: T, other: T): boolean // Deep equality check
    to_s<T>(this: T, format?: 'json' | undefined, custom?: string): string
    clone<T>(this: T): T
    to_success<T>(this: T): { is_error: false, value: T }
  }
}


export function extend(prototype: object, functions: Record<string, Function>): void {
  for (const name in functions) {
    Object.defineProperty(prototype, name, { value: functions[name], configurable: false, writable: true })
  }
}

Object.size = function(o: object): number {
  let i = 0
  for (let k in o) if (o.hasOwnProperty(k)) i++
  return i
},

Object.is_empty = function(o: object): boolean {
  for (let k in o) if (o.hasOwnProperty(k)) return false
  return true
}

Object.each = function <T>(o: { [k: string]: T }, fn: (v: T, k: string) => void): void {
  for (const k in o) {
    if (!o.hasOwnProperty(k)) continue
    const v = o[k]
    fn(v, k)
  }
}

Object.map = function <T, R>(o: { [k: string]: T }, fn: (v: T, k: string) => R): { [k: string]: R } {
  const r: { [k: string]: R } = {}
  for (const k in o) {
    if (!o.hasOwnProperty(k)) continue
    const v = o[k]
    r[k] = fn(v, k)
  }
  return r
}

Object.filter = function<T>(o: { [k: string]: T }, fn: (v: T, k: string) => boolean): { [k: string]: T } {
  const r: { [k: string]: T } = {}
  for (const k in o) {
    if (!o.hasOwnProperty(k)) continue
    const v = o[k]
    if (fn(v, k)) r[k] = v
  }
  return r
}

// const toStringOriginal = Object.prototype.toString
// function toStringOverriden(this: object): string {
//   return this.to_s() // Allowing using `to_s` same way as `toString`
// }

extend(Object.prototype, {
  is_equal: function<T>(this: T, another: T): boolean {
    return is_equal(this, another)
  },

  to_s: function(this: object): string {
    // return this.toString == toStringOverriden ? toStringOriginal.call(this) : this.toString()
    return this.toString()
  },

  clone: function<T>(this: T): T {
    return { ...this }
  },

  to_success: function<T>(this: T): { is_error: false, value: T } {
    return { is_error: false, value: this }
  },

  // toString: toStringOverriden
})


// -------------------------------------------------------------------------------------------------
// Array -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
declare global {
  interface ArrayConstructor {
    fill<T>(size: number, v: T | ((i: number) => T)): T[]

    // Converts compressed columnar data to TidyData
    from_columns<T>(columns: { [key: string]: any[] }): T[]
  }

  interface Array<T> {
    add(v: T): void

    batch(n: number): T[][]

    is_empty(): boolean

    size(): number

    clone(): Array<T>

    has(v: T): boolean
    has(f: (v: T, i: number) => boolean): boolean

    group_by(f: (v: T, i: number) => number): Hash<T[], number>
    group_by(f: (v: T, i: number) => string): Hash<T[], string>

    i(v: T): number | undefined
    i(f: (v: T, i: number) => boolean): number | undefined

    take(n: number): Array<T>

    filter_map<R>(fn: (v: T, i: number) => R | undefined): R[]

    sample(n: number): T[]

    // Converts tidydata to compressed columnar format
    to_columns<T extends object>(this: T[], skip?: string[]): { [key: string]: any[] }

    skip_undefined<T>(this: (T | undefined)[]): T[]

    find(v: T): T | undefined
    find(f: (v: T, i: number) => boolean): T | undefined

    first(): T
    first(n: number): T[]

    last(): T
    last(n: number): T[]

    lasti(v: T): number | undefined
    lasti(f: (v: T, i: number) => boolean): number | undefined

    max<T extends { compare(other: T): number }>(this: T[]): T
    max(f: ((v: T) => number)): number

    min<T extends { compare(other: T): number }>(this: T[]): T
    min(f: ((v: T) => number)): number

    maxi<T extends { compare(other: T): number }>(this: T[]): number
    maxi(f: ((v: T) => number)): number

    mini<T extends { compare(other: T): number }>(this: T[]): number
    mini(f: ((v: T) => number)): number

    median(this: number[], is_sorted?: boolean): number
    mean(this: number[]): number

    each(fn: (v: T, i: number) => void): void

    apply(fn: (v: T, i: number) => void): T[]

    quantile(this: number[], q: number, is_sorted?: boolean): number

    partition(f: (v: T, i: number) => boolean): [Array<T>, Array<T>]
    partition(keys: number[]): [Array<T>, Array<T>]

    rev(): T[]

    unique<T, K extends string | number | boolean>(this: T[], by?: (v: T) => K): T[]

    shuffle(random?: () => number): T[]

    asc<CT extends T & { compare(other: T): number }>(this: CT[]): CT[]
    asc(by: (v: T) => string | number | boolean): T[]
    // sort_by deprecated, use asc
    // sort_by<K extends string | number | boolean>(by: (v: T) => string | number | boolean): T[]

    sum(this: number[]): number

    to_set(): HSet<T>

    to_hash<K>(key: (v: T, i: number) => K): Hash<T, K>
  }
}

Array.fill = function fill<T>(size: number, v: T | ((i: number) => T)): T[] {
  const f: ((i: number) => T) = typeof v == 'function' ? v as ((i: number) => T) : () => v
  const list: T[] = []
  for (let i = 0; i < size; i++) list.push(f(i))
  return list
}

Array.from_columns = function from_columns<T>(columns: { [key: string]: any[] }): T[] {
  const results: T[] = [], keys = Object.keys(columns)
  if (keys.length == 0) return results
  const l = columns[keys[0]].length
  for (const key of keys) {
    if (columns[key].length != l) throw new Error(`columns ${keys[0]} and ${key} have different length`)
  }
  for (let i = 0; i < l; i++) {
    const o: any = {}
    for (const key of keys) {
      const v = columns[key][i]
      if (v !== null && v !== undefined) o[key] = v
    }
    results.push(o)
  }
  return results
}

extend(Array.prototype, {
  add: function<T>(this: T[], v: T): void {
    this.push(v)
  },

  batch,

  size: function<T>(this: T[]): number {
    return this.length
  },

  is_empty: function<T>(this: T[]): boolean {
    return this.length == 0
  },

  clone: function<T>(this: T[]){
    return [...this]
  },

  has<T>(this: T[], finder: T | ((v: T, i: number) => boolean)): boolean {
    const predicate = finder instanceof Function ? finder : (v: T) => v == finder
    for(let i = 0; i < this.length; i++) {
      const v = this[i]
      if (predicate(v, i)) return true
    }
    return false
  },

  group_by<T, K extends string | number>(this: T[], f: (v: T, i: number) => K): Hash<T[], K> {
    const map = new Hash<T[], K>()
    for (let i = 0; i < this.length; i++) {
      const v = this[i]
      map.getm(f(v, i), []).push(v)
    }
    return map
  },

  i<T>(this: T[], finder: T | ((v: T, i: any) => boolean)): number | undefined {
    const predicate = finder instanceof Function ? finder : (v: T) => v == finder
    for(let i = 0; i < this.length; i++) if (predicate(this[i], i)) return i
    return undefined
  },

  take: function<T>(this: T[], n: number): T[] {
    return this.slice(0, n)
  },

  filter_map<T, R>(this: T[], fn: (v: T, i: number) => R | undefined): R[] {
    const filtered: R[] = []
    for (let i = 0; i < this.length; i++) {
      const r = fn(this[i], i)
      if (r !== undefined) filtered.push(r)
    }
    return filtered
  },

  sample<T>(this: T[], n: number): T[] {
    return this.shuffle().take(n)
  },

  to_columns<T extends object>(this: T[], skip?: string[]): { [key: string]: any[] } {
    const keys = new Set<string>(), result: { [key: string]: any[] } = {}
    for (const o of this) for (const k in o) if (o.hasOwnProperty(k)) keys.add(k)
    for (const k of skip || []) keys.delete(k)
    for (const k of keys) result[k] = []
    for (const o of this) {
      for (const k of keys) {
        result[k].push(k in o ? (o as any)[k] : undefined)
      }
    }
    return result
  },

  skip_undefined<T>(this: (T | undefined)[]): T[] {
    return this.filter_map((v) => v)
  },

  find<T>(this: T[], finder: T | ((v: T, i: any) => boolean)): T | undefined {
    const predicate = finder instanceof Function ? finder : (v: T) => v == finder
    for(let i = 0; i < this.length; i++) {
      const v = this[i]
      if (predicate(v, i)) return v
    }
    return undefined
  },

  first<T>(this: T[], n?: number): T | T[] {
    const l = this.length
    if (n === undefined) {
      if (l < 1) throw new Error(`can't get first elements from empty list`)
      return this[0]
    } else {
      if (l < n) throw new Error(`can't get first ${n} elements from array of length ${l}`)
      else return this.slice(0, n)
    }
  },

  last<T>(this: T[], n?: number): T | T[] {
    const l = this.length
    if (n === undefined) {
      if (l < 1) throw new Error(`can't get last elements from empty array`)
      return this[l - 1]
    } else {
      if (l < n) throw new Error(`can't get last ${n} elements from array of length ${l}`)
      else return this.slice(l - n, l)
    }
  },

  lasti<T>(this: T[], finder: T | ((v: T, i: any) => boolean)): number | undefined {
    const predicate = finder instanceof Function ? finder : (v: T) => v == finder
    for(let i = this.length - 1; i >= 0; i--) if (predicate(this[i], i)) return i
    return undefined
  },

  max<T extends { compare(other: T): number }>(this: T[], f?: ((v: T) => number)): T {
    return this[f ? this.maxi(f) : this.maxi()]
  },

  min<T extends { compare(other: T): number }>(this: T[], f?: ((v: T) => number)): T {
    return this[f ? this.mini(f) : this.mini()]
  },

  maxi<T extends { compare(other: T): number }>(this: T[], f?: ((v: T) => number)): number {
    if (this.length == 0) throw new Error("can't find maxi for empty array")
    if (f) {
      let maxf = f(this[0]), maxi = 0
      for (let i = 0; i < this.length; i++) {
        const v = this[i], fv = f(v)
        if (fv > maxf) {
          maxf = fv; maxi = i
        }
      }
      return maxi
    } else {
      let max = this[0], maxi = 0
      for (let i = 0; i < this.length; i++) {
        const v = this[i]
        if (v.compare(max) > 0) {
          max = v; maxi = i
        }
      }
      return maxi
    }
  },

  mini<T extends { compare(other: T): number }>(this: T[], f?: ((v: T) => number)): number {
    if (this.length == 0) throw new Error("can't find mini for empty array")
    if (f) {
      let minf = f(this[0]), mini = 0
      for (let i = 0; i < this.length; i++) {
        const v = this[i], fv = f(v)
        if (fv < minf) {
          minf = fv; mini = i
        }
      }
      return mini
    } else {
      let min = this[0], mini = 0
      for (let i = 0; i < this.length; i++) {
        const v = this[i]
        if (v.compare(min) < 0) {
          min = v; mini = i
        }
      }
      return mini
    }
  },

  median(this: number[], is_sorted = false): number {
    return this.quantile(.5, is_sorted)
  },

  mean(this: number[]): number {
    let sum = 0
    for (const v of this) sum += v
    return sum / this.length
  },

  quantile(this: number[], q: number, is_sorted = false): number {
    if (this.length == 0) throw new Error("can't calculate quantile on empty array")
    const sorted = is_sorted ? this : [...this].sort((a, b) => a - b)
    const pos = (sorted.length - 1) * q
    const base = Math.floor(pos)
    const rest = pos - base
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base])
    } else {
      return sorted[base]
    }
  },

  each<T>(this: T[], fn: (v: T, i: number) => void): void {
    this.forEach(fn)
  },

  apply<T>(this: T[], fn: (v: T, i: number) => void): T[] {
    this.forEach(fn)
    return this
  },

  partition<T>(this: Array<T>, splitter: ((v: T, i: number) => boolean) | number[]): [Array<T>, Array<T>] {
    const selected: T[] = [], rejected: T[] = []
    const f = splitter instanceof Function ? splitter : (_v: T, i: number) => splitter.includes(i)
    for (let i = 0; i < this.length; i++) {
      const v = this[i]
      if (f(v, i)) selected.push(v)
      else         rejected.push(v)
    }
    return [selected, rejected]
  },

  rev<T>(this: T[]): T[] {
    return [...this].reverse()
  },

  unique,

  shuffle<T>(this: T[], random?: () => number): T[] {
    if (random == undefined) random = () => Math.random()
    const list = [...this]
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]]
    }
    return list
  },

  asc<T, K extends string | number | boolean>(this: T[], by?: (v: T) => K): T[] {
    if (by) return (sort_by as any).call(this, by)
    else {
      const copy = [...this]
      return copy.sort((a, b) => (a as any).compare(b))
    }
  },

  // sort_by,

  sum(this: number[]): number {
    let sum = 0
    for (const v of this) sum += v
    return sum
  },

  to_set<T>(this: T[]): HSet<T> { return new HSet(this) },

  to_hash<T, K>(this: T[], key: (v: T, i: number) => K): Hash<T, K> {
    const h = new Hash<T, K>()
    for (let i = 0; i < this.length; i++) {
      const v = this[i]
      h.set(key(v, i), v)
    }
    return h
  }
})

function batch<T>(this: T[], n: number): T[][] {
  const result: T[][] = []
  let i = 0
  while (true) {
    const group: T[] = []
    if (i < this.length) result.push(group)

    for (let j = 0; j < n; j++) {
      if ((i + j) < this.length) group.push(this[i + j])
      else return result
    }

    i+= n
  }
}

test(batch, () => {
  assert.equal([1, 2, 3].batch(2), [[1, 2], [3]])
  assert.equal([1, 2].batch(2), [[1, 2]])
  assert.equal([1].batch(2), [[1]])
  assert.equal([].batch(2), [])
})


// -------------------------------------------------------------------------------------------------
// Hash --------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
declare global {
  class Hash<V, K = string> {
    map<R>(f: (v: V, k: K) => R): Hash<R, K>

    each(f: (v: V, k: K) => void): void

    apply(f: (v: V, k: K) => void): Hash<V, K>

    set(k: K, v: V): void

    get(k: K): V
    get(k: K, deflt: V): V

    getm(k: K, deflt: V): V

    size(): number

    is_empty(): boolean

    values(): V[]

    keys(): K[]

    filter(fn: (v: V, k: K) => boolean): Hash<V, K>

    filter_map<V, K, R>(this: Hash<V, K>, fn: (v: V, k: K) => R | undefined): Hash<R, K>

    entries(): [V, K][]

    del(k: K): void

    has(k: K): boolean

    clone(): Hash<V, K>

    to_a(): [K, V][]

    to_json_hook(): { [key: string]: V }

    static from_json_hook<V, K = string>(this: { new: Hash<V, K> }, json: { [k: string]: V }): Hash<V, K>

    // toJSON(): { [key: string]: V }
  }
}

(window as any).Hash = class Hash<V, K = string> {
  private m: Map<K, V>

  constructor(map?: Map<K, V> | Hash<V, K> | { [k: string]: V }) {
    if (is_undefined(map))        this.m = new Map()
    else if (map instanceof Map)  this.m = new Map(map)
    else if (map instanceof Hash) this.m = new Map(map.m)
    else                          this.m = new Map(Object.entries(map) as any[])
  }

  map<R>(f: (v: V, k: K) => R): Hash<R, K> {
    const h = new Hash<R, K>()
    for (const [k, v] of this.m) h.set(k, f(v, k))
    return h
  }

  each(f: (v: V, k: K) => void): void {
    for (const [k, v] of this.m) f(v, k)
  }

  apply(f: (v: V, k: K) => void): Hash<V, K> {
    for (const [k, v] of this.m) f(v, k)
    return this
  }

  set(k: K, v: V): void { this.m.set(k, v) }

  get(k: K, deflt?: V): V {
    const v = this.m.get(k) || deflt
    if (v === undefined) throw new Error(`key ${k} doesn't exist`)
    return v
  }

  getm(k: K, deflt: V): V {
    if (!this.has(k)) this.set(k, deflt)
    return this.m.get(k)!
  }

  size(): number { return this.m.size }

  is_empty(): boolean { return this.m.size == 0 }

  values(): V[] {
    const values: V[] = []
    for (const v of this.m.values()) values.add(v)
    return values
  }

  keys(): K[] {
    const keys: K[] = []
    for (const k of this.m.keys()) keys.add(k)
    return keys
  }

  filter(fn: (v: V, k: K) => boolean): Hash<V, K> {
    const r = new Hash<V, K>()
    for (const k of this.m.keys()) {
      const v = this.m.get(k)!
      if (fn(v, k)) r.set(k, v)
    }
    return r
  }

  filter_map<R>(fn: (v: V, k: K) => R | undefined): Hash<R, K> {
    const filtered = new Hash<R, K>()
    for (const k of this.m.keys()) {
      const r = fn(this.m.get(k)!, k)
      if (r !== undefined) filtered.set(k, r)
    }
    return filtered
  }

  entries(): [V, K][] {
    const entries: [V, K][] = []
    for (const [k, v] of this.m.entries()) entries.add([v, k])
    return entries
  }

  del(k: K): void { this.m.delete(k) }

  has(k: K): boolean { return this.m.has(k) }

  clone(): Hash<V, K> { return new Hash(this) }

  to_a(): [K, V][] {
    const results: [K, V][] = []
    for (const entry of this.m) results.push(entry)
    return results
  }

  to_json_hook(): { [key: string]: V } {
    const h: { [key: string]: V } = {}
    for (const [k, v] of this.m) h['' + k] = v
    return h
  }

  // toJSON(): { [key: string]: V } { return this.to_json_hook() }

  static from_json_hook<V, K = string>(this: { new: Hash<V, K> }, json: { [k: string]: V }): Hash<V, K> {
    return new Hash(json)
  }
}

// -------------------------------------------------------------------------------------------------
// HSet --------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
declare global {
  class HSet<V> {
    constructor(set?: V[] | HSet<V>)

    map<R>(f: (v: V) => R): HSet<R>

    each(f: (v: V) => void): void

    add(v: V): void

    size(): number

    is_empty(): boolean

    to_a(): V[]

    del(k: V): void

    has(k: V): boolean

    clone(): HSet<V>

    to_json_hook(): V[]

    static from_json_hook<V>(this: { new: HSet<V> }, json: V[]): HSet<V>

    // toJSON(): V[]
  }
}

(window as any).HSet = class HSet<V> {
  private s: Set<V>

  constructor(set?: V[] | HSet<V>) {
    if      (is_undefined(set))   this.s = new Set()
    else if (is_array(set))       this.s = new Set(set)
    else if (set instanceof HSet) this.s = new Set(set.s)
    else                          throw "invalid usage"
  }

  map<R>(f: (v: V) => R): HSet<R> {
    const set = new HSet<R>()
    for (const v of this.s) set.add(f(v))
    return set
  }

  each(f: (v: V) => void): void { for (const v of this.s) f(v) }

  add(v: V): void { this.s.add(v) }

  size(): number { return this.s.size }

  is_empty(): boolean { return this.s.size == 0 }

  to_a(): V[] { return Array.from(this.s) }

  del(v: V): void { this.s.delete(v) }

  has(k: V): boolean { return this.s.has(k) }

  clone(): HSet<V> { return new HSet(this) }

  to_json_hook(): V[] { return this.to_a() }

  static from_json_hook<V>(this: { new: HSet<V> }, json: V[]): HSet<V> {
    return new HSet(json)
  }

  // toJSON(): V[] { return this.to_json_hook() }
}


// -------------------------------------------------------------------------------------------------
// String ------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
declare global {
  interface String {
    is_empty(): boolean
    size(): number
    clone(): string
    take(n: number): string
    to_error<T>(): E<T>
    downcase(): string
    upcase(): string
    trim(): string
    dedent(): string
    last(n?: number): string
    ljust(n: number, s: string): string
    rjust(n: number, s: string): string
    compare(other: string): number // implements Comparable
    split2(delimiter: string): [string, string]
    split3(delimiter: string): [string, string, string]
  }
}

extend(String.prototype, {
  size: function(this: string): number {
    return this.length
  },

  is_empty: function(this: string): boolean {
    return this == ""
  },

  clone: function(this: string): string {
    return '' + this
  },

  take: function(this: string, n: number): string {
    return this.slice(0, n)
  },

  to_error: function<T>(this: string): E<T> {
    return { is_error: true, message: this }
  },

  downcase: function(this: string): string {
    return this.toLowerCase()
  },

  upcase: function(this: string): string {
    return this.toUpperCase()
  },

  trim(this: string): string {
    return this.replace(/^[\t\s\n]+|[\t\s\n]+$/g, '')
  },

  dedent,

  last(this: string, n?: number): string {
    const l = this.length
    if (n === undefined) {
      if (l < 1) throw new Error(`can't get last elements from empty string`)
      return this[l - 1]
    } else {
      if (l < n) throw new Error(`can't get last ${n} elements from string of length ${l}`)
      else return this.slice(l - n, l)
    }
  },

  ljust(this: string, n: number, s: string): string { return this.padEnd(n, s) },

  rjust(this: string, n: number, s: string): string { return this.padStart(n, s) },

  compare(this: string, other: string): number { return this.localeCompare(other) },

  split2(this: string, delimiter: string): [string, string] {
    const parts = this.split(delimiter)
    if (parts.length != 2) throw new Error(`expected to split in two, but found ${parts.length} parts`)
    return parts as any
  },

  split3(this: string, delimiter: string): [string, string, string] {
    const parts = this.split(delimiter)
    if (parts.length != 3) throw new Error(`expected to split in three, but found ${parts.length} parts`)
    return parts as any
  }
})


// dedent ------------------------------------------------------------------------------------------
function dedent(this: string): string {
  const text = this.replace(/^\s*\n|[\n\s]+$/, "") // Replacing the first and last empty line
  const match = /^(\s+)/.parse(text)
  if (match.length == 0) return text
  return text.split("\n").map((s) => s.startsWith(match[0]) ? s.replace(match[0], '') : s).join("\n")
  // return text.replace(new RegExp("^\\s{" + match[0].length + "}", "gm"), "")
}
test("dedent", () => {
  assert.equal(dedent.call("\n  a\n  b\n    c"), "a\nb\n  c")
})


// -------------------------------------------------------------------------------------------------
// Number ------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
declare global {
  interface Number {
    round(digits?: number): number,
    pow(y: number): number
    div(y: number): number
    rem(y: number): number
    div_rem(y: number): [number, number]
    pluralize(singular: string): string
    compare(other: number): number // Comparable
    abs(): number
  }
}

extend(Number.prototype, {
  round,

  pow(this: number, y: number) { return Math.pow(this, y) },

  div(this: number, y: number) { return Math.floor(this / y) },

  rem(this: number, y: number) { return this % y },

  div_rem(this: number, y: number) { return [Math.floor(this / y), this % y]  },

  pluralize(this: number, singular: string): string { return this == 1 ? singular : singular + 's' },

  compare(this: number, other: number): number { return this - other },

  abs(this: number): number { return Math.abs(this) }
})


function round(this: number, digits: number = 0): number {
  return digits == 0 ?
    Math.round(this) :
    Math.round((this + Number.EPSILON) * Math.pow(10, digits)) / Math.pow(10, digits)
}
test("round", () => {
  assert.equal(round.call(0.05860103881518906, 2), 0.06)
})


// -------------------------------------------------------------------------------------------------
// Function ----------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
declare global {
  interface Function {
    to_safe<Args extends any[], R>(this: ((...args: [...Args]) => R)): ((...args: [...Args]) => E<R>)
    debounce<F extends (...args: any[]) => void>(this: F, timeout: number, immediate?: boolean): F
    once<F extends Function>(f: F): F
  }
}


function to_safe(this: Function) {
  const self = this
  return function(...args: any[]) {
    try {
      return { is_error: false, value: self(...args) }
    } catch (e) {
      return { is_error: true, message: ensure_error(e).message }
    }
  } as any
}

function debounce<F extends (...args: any[]) => void >(
  this: F, timeout: number, immediate = false
): F {
  let timer: any = undefined, self = this
  return ((...args: any[]) => {
    if (immediate) {
      immediate = false
      self(...args)
    } else {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => self(...args), timeout)
    }
  }) as F
}

function once<F extends Function>(f: F): F {
  let called = false, result: any = undefined
  return function (this: any) {
    if (called) return result
    result = f.apply(this, arguments)
    called = true
    return result
  } as any
}

extend(Function.prototype, { to_safe, debounce, once })


// -------------------------------------------------------------------------------------------------
// RegExp ------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
declare global {
  interface RegExp {
    parse(s: string): string[]
    parse_named(s: string): Record<string, string>
    parse1(s: string): string
    parse2(s: string): [string, string]
    parse3(s: string): [string, string, string]
  }
}

extend(RegExp.prototype, { parse, parse_named, parse1, parse2, parse3 })

// parse -------------------------------------------------------------------------------------------
function parse(this: RegExp, s: string): string[] {
  const found = s.match(this)
  if (!found) return []
  if (found.length == 1) return [] // matched but there's no capture groups
  return found.slice(1, found.length)
}
test("parse", () => {
  assert.equal(parse.call(/.+ (\d+) (\d+)/, "a 22 45"), ["22", "45"])
  assert.equal(parse.call(/[^;]+;/, "drop table; create table;"), [])
})


// parse_named -------------------------------------------------------------------------------------
function parse_named(this: RegExp, s: string): Record<string, string> {
  const found = s.match(this)
  return found?.groups || {}
}
test("parseNamed", () => {
  assert.equal(parse_named.call(/.+ (?<a>\d+) (?<b>\d+)/, "a 22 45"), { "a": "22", "b": "45" })
})


// parse1,2,3,4 ------------------------------------------------------------------------------------
function parse1(this: RegExp, s: string): string {
  const found = this.parse(s)
  if (found.length != 1) throw new Error(`expected 1 match but found ${found.length}`)
  return found[0]
}

function parse2(this: RegExp, s: string): [string, string] {
  const found = this.parse(s)
  if (found.length != 2) throw new Error(`expected 2 matches but found ${found.length}`)
  return [found[0], found[1]]
}

function parse3(this: RegExp, s: string): [string, string, string] {
  const found = this.parse(s)
  if (found.length != 3) throw new Error(`expected 3 matches but found ${found.length}`)
  return [found[0], found[1], found[2]]
}


// -------------------------------------------------------------------------------------------------
// Helpers -----------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------


// p -----------------------------------------------------------------------------------------------

function pretty_print(v: any, colors = false) {
  return deno && is_object(v) ? deno.inspect(v, { colors }) : v
}
function p(...args: any): void {
  if (is_browser) console.log(...args)
  else {
    const formatted = args.map((v: any) => pretty_print(v, true))
    // It won't printed properly for multiple arguments
    args.length == 1 ? console.log(...formatted) : console.log(...formatted)
  }
}


// assert ------------------------------------------------------------------------------------------
const assert_impl = <Assert>function(condition, message): void {
  const messageString = message ? (message instanceof Function ? message() : message) : 'Assertion error!'
  if (!condition) throw new Error(messageString)
}
// assert.warn = (condition, message) => { if (!condition) log('warn', message || 'Assertion error!') }
assert_impl.equal = (a, b, message) => {
  if (!is_equal(a, b)) {
    const messageString = message ?
      (message instanceof Function ? message() : message) :
      `Assertion error: ${to_json(a, true)} != ${to_json(b, true)}`
    throw new Error(messageString)
  }
}
assert_impl.fail = (cb, message) => {
  let failed = false
  try { cb() } catch { failed = true }
  if (!failed) {
    const messageString = message ?
      (message instanceof Function ? message() : message) :
      `Assertion error: expected to fail but didn't`
    throw new Error(messageString)
  }
}
assert_impl.aequal = (a, b, message, deltaRelative) => {
  deltaRelative = deltaRelative || 0.001
  const average = (Math.abs(a) + Math.abs(b)) / 2
  const deltaAbsolute = average * deltaRelative
  if (Math.abs(a - b) > deltaAbsolute) {
    const messageString = message ? (message instanceof Function ? message() : message) :
      `Assertion error: ${to_json(a, true)} != ${to_json(b, true)}`
    throw new Error(messageString)
  }
}
(window as any).assert = assert_impl


// deep_clone_and_sort -----------------------------------------------------------------------------
// Clone object with object and nested objects with properties sorted
export function deep_clone_and_sort<T>(o: T): T {
  if      (is_array(o))  return o.map(deep_clone_and_sort) as any
  else if (is_object(o)) {
    if ('to_json_hook' in o)  {
      return (o as any).to_json_hook()
    } else {
      return Object.assign({},
        ...Object.entries(o)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .map(([k, v]) => ({ [k]: deep_clone_and_sort(v) })
      ))
    }
  }
  else return o
}

// to_json -----------------------------------------------------------------------------------------
// https://stackoverflow.com/questions/42491226/is-json-stringify-deterministic-in-v8
// Stable JSON
export function to_json(obj: unknown, pretty = true): string {
  return pretty ? JSON.stringify(deep_clone_and_sort(obj), null, 2) : JSON.stringify(deep_clone_and_sort(obj))
}

// from_json ---------------------------------------------------------------------------------------
export function from_json<T>(klass: { new(arg: any): T }, s: string): T {
  const json = JSON.parse(s)
  return 'from_json_hook' in klass ? (klass as any).from_json_hook(json) : json
}

export function as_json_string<T>(klass: { new(s: string): T }): void {
  const aclass = klass as any
  aclass.prototype.to_json_hook = function(): string { return this.to_s() }
  aclass.from_json_hook = function(s: string): T { return new klass(s) }
}

// is_equal ----------------------------------------------------------------------------------------
export function is_equal(a: unknown, b: unknown): boolean {
  return to_json(a) === to_json(b)
}

// ensure_error ------------------------------------------------------------------------------------
function ensure_error(error: unknown, defaultMessage = "Unknown error"): Error {
  if (is_object(error) && (error instanceof Error)) {
    if (!error.message) error.message = defaultMessage
    return error
  } else {
    return new Error('' + (error || defaultMessage))
  }
  // return '' + ((error && (typeof error == 'object') && error.message) || defaultMessage)
}


// unique ------------------------------------------------------------------------------------------
function unique<T>(this: T[], by?: (v: T) => string | number | boolean): T[] {
  const set = new Set<any>()
  const fn = by || ((v: T) => v)
  return this.filter((v) => {
    const key = fn(v)
    if (set.has(key)) return false
    else {
      set.add(key)
      return true
    }
  })
}


// sort_by -----------------------------------------------------------------------------------------
function sort_by<T, K extends string | number | boolean>(this: T[], by: (v: T) => K): T[] {
  if (this.length == 0) return this
  else {
    const fn: any = by
    const type = typeof by(this[0])
    let comparator: (a: T, b: T) => number
    if        (type == 'number') {
      comparator = function(a, b) { return fn(a) - fn(b) }
    } else if (type == 'boolean') {
      comparator = function(a, b) { return (fn(a) ? 1 : 0) - (fn(b) ? 1 : 0) }
    } else if (type == 'string') {
      comparator = function(a, b) { return fn(a).localeCompare(fn(b)) }
    } else {
      throw new Error(`invalid return type for 'by' '${type}'`)
    }

    let sorted: T[]
    sorted = [...this]
    sorted.sort(comparator)
    return sorted
  }
}
test('sort_by', () => {
  assert.equal(
    [{ v: true }, { v: false }].asc(({v}) => v),
    [{ v: false }, { v: true }]
  )

  assert.equal(
    [{ v: "b" }, { v: "" }, { v: "c" }].asc(({v}) => v),
    [{ v: "" }, { v: "b" }, { v: "c" }]
  )
})


// Useful constants --------------------------------------------------------------------------------
export const kb = 1024, mb = 1024 * kb
export const sec = 1000, min = 60 * sec, hour = 60 * min, day = 24 * hour
export const million = 1000000, billion = 1000 * million


// documentation -----------------------------------------------------------------------------------
export interface TextDoc {
  readonly tags?:  string[]
  readonly title:  string
  readonly text:   string
}
export interface TodoDoc {
  readonly priority?: 'low' | 'normal' | 'high'
  readonly tags?:     string[]
  readonly todo:      string
}
export type Doc = TextDoc | TodoDoc
export const allDocs: Doc[] = []
export function doc(...docs: (Doc | (() => Doc))[]) {
  allDocs.push(...(docs.map((d) => is_function(d) ? d() : d)))
}
export function as_code(code: string) { return "\`\`\`\n" + code + "\n\`\`\`" }


// http_call ---------------------------------------------------------------------------------------
export type HttpMethod = 'get' | 'post' | 'put' | 'delete'
export interface HttpCallOptions {
  method?:  HttpMethod
  headers?: { [key: string]: string }
  params?:  { [key: string]: string | undefined }
  timeout?: number
}
export async function http_call<In, Out>(
  url: string, body: In | {} = {}, options: HttpCallOptions = {}
): Promise<Out> {
  async function call_without_timeout() {
    try {
      // const copied_options1 = { ...{ method: 'post' }, ...options }
      // delete copied_options.timeout
      const urlWithParams = options.params ? build_url(url, options.params) : url
      const method = (options.method ?  options.method  : 'post').upcase()
      const response = await fetch(
        urlWithParams,
        {
          method,
          headers: options.headers ? options.headers : { 'Content-Type': 'application/json' },
          body:    method != 'get' ? JSON.stringify(body) : undefined
        }
      )
      if (!response.ok)
        throw new Error(`can't ${method} ${url} ${response.status} ${response.statusText}`)
      let data = await response.json()
      if (data.is_error) throw new Error(data.message || "Unknown error")
      return data
    } catch (e) {
      throw e
    }
  }
  return new Promise((resolve, reject) => {
    if (options.timeout)
    setTimeout(() => reject(new Error(`request timed out ${url}`)), options.timeout)
    call_without_timeout().then(resolve, reject)
  })
}


// http_post ---------------------------------------------------------------------------------------
export interface HttpRawOptions {
  headers?:    { [key: string]: string }
  timeout_ms?: number
}

export function http_get(url: string, options?: HttpRawOptions): Promise<string> {
  return http_call_raw("get", url, "", options)
}

export function http_post(url: string, content = "", options?: HttpRawOptions): Promise<string> {
  return http_call_raw("post", url, content, options)
}

async function http_call_raw(
  method: string, url: string, content = "", options?: HttpRawOptions
): Promise<string> {
  async function call_without_timeout() {
    try {
      const response = await fetch(url, {
        method: method.upcase(),
        ...(options?.headers ? { headers: options?.headers } : {}),
        ...(content != "" ? { body: content } : {})
      })
      if (!response.ok) throw new Error(`can't  post ${url} ${response.status} ${response.statusText}`)
      return await response.text()
    } catch (e) {
      throw e
    }
  }
  return new Promise((resolve, reject) => {
    if (options?.timeout_ms) setTimeout(() => reject(new Error(`request timed out ${url}`)), options.timeout_ms)
    call_without_timeout().then(resolve, reject)
  })
}

// get_data, post_data -----------------------------------------------------------------------------
export async function get_data<Res>(url: string, options?: HttpRawOptions): Promise<Res> {
  const headers = { "Content-Type": "application/json" }
  const json = await http_get(url, { headers, ...(options || {}) })
  const data = parse_data<Res>(JSON.parse(json))
  if (data.is_error) throw new Error(data.message)
  else               return data.value
}

export async function post_data<Req, Res>(url: string, req: Req, options?: HttpRawOptions): Promise<Res> {
  const headers = { "Content-Type": "application/json" }
  const json = await http_post(url, to_json(req), { headers, ...(options || {}) })
  const data = parse_data<Res>(JSON.parse(json))
  if (data.is_error) throw new Error(data.message)
  else               return data.value
}

export function parse_data<T>(data: any): E<T> {
  if (is_object(data) && 'is_error' in data) {
    if (data.is_error) return { is_error: true,  message: (data.message || 'Unknown error') }
    else               return { is_error: false, value: data.value }
  } else {
    return { is_error: false, value: data }
  }
}



// build_url ----------------------------------------------------------------------------------------
export function build_url(
  url: string, query: { [key: string]: string | number | undefined | boolean | null } = {}
): string {
  const querystring: string[] = []
  for (const key in query) {
    const value = query[key]
    if (key !== null && key !== undefined && value !== null && value !== undefined)
      querystring.push(`${encodeURIComponent(key)}=${encodeURIComponent('' + query[key])}`)
  }
  if (querystring.length > 0) return `${url}${url.includes('?') ? '&' : '?'}${querystring.join('&')}`
  else                        return url
}


// Timer -------------------------------------------------------------------------------------------
export function timer_ms(): () => number {
  const start = Date.now()
  return function(){ return Date.now() - start }
}

export function timer_sec(): () => number {
  const start = Date.now()
  return function(){ return Math.round((Date.now() - start) / 1000) }
}


// -------------------------------------------------------------------------------------------------
// Other -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------


// NeverError --------------------------------------------------------------------------------------
export class NeverError extends Error {
  constructor(message: never) { super(`NeverError: ${message}`) }
}

export async function parallel<In, Out>(
  tasks: In[], process: (arg: In, i: number) => Promise<Out>, workers: number
): Promise<E<Out>[]> {
  return new Promise<E<Out>[]>((resolve) => {
    const results: E<Out>[] = []
    let next_i = 0, in_process = 0
    function try_process_next(): void {
      if (in_process >= workers) return
      if (next_i == tasks.length) return resolve(results)
      const i = next_i
      next_i++
      try {
        in_process++
        process(tasks[i], i)
          .then((value) => {
            results[i] = { is_error: false, value: value! }
            in_process--
            try_process_next()
          })
          .catch((e) => {
            results[i] = { is_error: true, message: ensure_error(e).message }
            in_process--
            try_process_next()
          })
      } catch (e) {
        results[i] = { is_error: true, message: ensure_error(e).message }
        in_process--
        try_process_next()
      }
      try_process_next()
    }
    try_process_next()
  })
}

// Promise -----------------------------------------------------------------------------------------
// For better logging, by default promise would be logged as `{}`
// Promise.prototype.to_json_hook = function() { return 'Promise' }
// ;(Promise.prototype as any).toJSON = Promise.prototype.to_json_hook
// Object.defineProperty(Promise.prototype, "cmap", { configurable: false, enumerable: false })


// Error.to_json -----------------------------------------------------------------------------------
// Otherwise JSON will be empty `{}`
// Error.prototype.to_json_hook = function(this: Error) {
//   return { message: this.message, stack: this.stack }
// }
// ;(Error.prototype as any).to_json = Error.prototype.to_json_hook

// Map.toJSON ---------------------------------------------------------------------
// Otherwise JSON will be empty `{}`
// Map.prototype.to_json_hook = function(this: Map<any, any>) {
//   const json: any = {}
//   for (const [k, v] of this) json[k] = v
//   return json
// }
// ;(Map.prototype  as any).toJSON = Map.prototype.to_json_hook


// deep_map ----------------------------------------------------------------------------------------
// export function deep_map(obj: any, map: (o: any) => any): any {
//   obj = map(obj)
//   if      (obj === null || !is_object(obj)) return obj
//   else if ('map' in obj)                            return obj.map((v: any) => deep_map(v, map))
//   else                                              return Object.assign({},
//       ...Object.entries(obj)
//         .map(([k, v]) => ({ [k]: deep_map(v, map) })
//     ))
// }
// test("deepMap", () => {
//   class Wrapper<T> {
//     constructor(readonly v: T) {}
//     toJSON() { return this.v }
//   }
//   const a = new Wrapper([1, 2])
//   assert.equal(deep_map(a, (v) => v.to_json), [1, 2])

//   const aL2 = new Wrapper([a, 3])
//   assert.equal(deep_map(aL2, (v) => v.to_json), [[1, 2], 3])
// })


// export function logWithUser(
//   level: LogLevel, user: string, message: string, short?: any, detailed?: any
// ): string { return log(level, `${pad(user, 8)} ${message}`, short, detailed) }


// cleanStack -------------------------------------------------------------------------------------
// export let cleanStack: (stack: string) => string
// {
//   // const stack_skip_re = new RegExp([
//   //   '/node_modules/',
//   //   'internal/(modules|bootstrap|process)',
//   //   'at new Promise \\(<anonymous>\\)',
//   //   'at Object.next \\(',
//   //   'at step \\(',
//   //   'at __awaiter \\(',
//   //   'at Object.exports.assert \\('
//   // ].join('|'))
//   cleanStack = (stack) => {
//     // const lines = stack
//     //   .split("\n")
//     //   .filter((line) => {
//     //     return !stack_skip_re.test(line)
//     //   })
//     //   .map((line, i) =>
//     //     i == 0 ? line : line.replace(/([^\/]*).*(\/[^\/]+\/[^\/]+\/[^\/]+)/, (_match, s1, s2) => s1 + '...' + s2)
//     //   )
//     // return lines.join("\n")
//     return stack
//   }
// }

// uniglobal.process && uniglobal.process.on('uncaughtException', function(error: any) {
//   error.stack = cleanStack(error.stack)
//   console.log('')
//   console.error(error)
//   process.exit()
// })


// // CustomError --------------------------------------------------------------------
// export class CustomError extends Error {
//   constructor(message: string) {
//     super(message)
//     Object.setPrototypeOf(this, CustomError.prototype)
//   }
// }



// sort ---------------------------------------------------------------------------
// function sort(list: string[], comparator?: (a: string, b: string) => number): string[]
// function sort(list: number[], comparator?: (a: number, b: number) => number): number[]
// function sort<V>(list: V[], comparator?: (a: V, b: V) => number): V[] {
//   if (list.length == 0) return list
//   else {
//     if (comparator) {
//       list = [...list]
//       list.sort(comparator)
//       return list
//     } else {
//       if      (is_number(list[0]))
//         comparator = function(a: number, b: number) { return a - b } as any
//       else if (is_string(list[0]))
//         comparator = function(a: string, b: string) { return a.localeCompare(b) } as any
//       else
//         throw new Error(`the 'comparator' required to sort a list of non numbers or strings`)

//       list = [...list]
//       list.sort(comparator)
//       return list
//     }
//   }
// }
// export { sort }