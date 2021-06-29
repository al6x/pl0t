import json except to, `%`, `%*`
import std/jsonutils, std/macros

export json except to, `%`, `%*`, pretty, toUgly
export jsonutils except json_to, from_json, Joptions


proc to_s*(json: JsonNode, pretty = true): string =
  if pretty: pretty(json) else: $json


proc json_to*(json: JsonNode, T: typedesc): T =
  from_json(result, json, Joptions(allow_extra_keys: true))


proc to_json_hook*[T: tuple](o: T): JsonNode =
  result = new_JObject()
  for k, v in o.field_pairs: result[k] = v.to_json

proc to_json_hook*(list: openarray[(string, JsonNode)]): JsonNode =
  # Needed for `toJoImpl` to work properly
  result = newJObject()
  for item in list: result[item[0]] = item[1]

proc to_json_hook*(n: JsonNode): JsonNode =
  n


proc toJoImpl(x: NimNode): NimNode {.compileTime.} =
  # Same as `%*` but:
  # - allows not to quote object keys
  # - uses jsonutils.to_json instead of json.%
  case x.kind
  of nnkBracket: # array
    if x.len == 0: return newCall(bindSym"newJArray")
    result = newNimNode(nnkBracket)
    for i in 0 ..< x.len:
      result.add(toJoImpl(x[i]))
    result = newCall(bindSym("to_json", brOpen), result)
  of nnkTableConstr: # object
    if x.len == 0: return newCall(bindSym"newJObject")
    result = newNimNode(nnkTableConstr)
    for i in 0 ..< x.len:
      x[i].expectKind nnkExprColonExpr
      let key = if x[i][0].kind == nnkIdent: newStrLitNode(x[i][0].str_val) else: x[i][0]
      result.add newTree(nnkExprColonExpr, key, toJoImpl(x[i][1]))
    result = newCall(bindSym("to_json", brOpen), result)
  of nnkCurly: # empty object
    x.expectLen(0)
    result = newCall(bindSym"newJObject")
  of nnkNilLit:
    result = newCall(bindSym"newJNull")
  of nnkPar:
    if x.len == 1: result = toJoImpl(x[0])
    else: result = newCall(bindSym("to_json", brOpen), x)
  else:
    result = newCall(bindSym("to_json", brOpen), x)

macro jo*(v: untyped): JsonNode =
  ## Convert an expression to a JsonNode directly, without having to specify
  ## `%` for every element.
  toJoImpl(v)

macro jinit*[T](TT: type[T], x: untyped): T =
  let jobject = toJoImpl(x)
  quote do:
    `jobject`.json_to(`TT`)


proc update_from*[T](o: var T, partial: JsonNode): void =
  for k, v in o.field_pairs:
    if k in partial.fields:
      v = partial.fields[k].json_to(typeof v)