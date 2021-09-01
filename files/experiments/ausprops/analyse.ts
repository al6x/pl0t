

import { http_get } from './base/base.ts'
import { Block, App, toHtml } from './plot-0.1/pl0t.ts'


type Type = 'house' | 'apartment' | 'land' | 'rural' | 'house_plan' | 'apartment_plan'

interface Property {
  state:      string
  price:      number | undefined
  beds:       number
  baths:      number
  parking:    number
  land_area:  number | undefined
  house_area: number | undefined
  type:       Type
}

const data_url = 'https://raw.githubusercontent.com/al6x/pl0t/main/files/experiments/ausprops/data-2021-08.json'
const all_props = Array.from_columns<Property>(JSON.parse(await http_get(data_url)))

const page_main_section: Block[] = []      // Main section of the page
const page_secondary_section: Block[] = [] // Secondary part of the page, with less important details etc.


{ // Plotting 10 random properties, to better understand the shape of data
  page_secondary_section.push({
    id: 'Sampling data, 10 random properties',
    desc: `To better understand how the data looks like.`,
    table: {}, // The columns of the table will be inferred from the data
    data: all_props.sample(10)
  })
}


{ // Analysing property types
  // To get better understanding of data, how much houses with prices, house and land values, and
  // how much is undefined
  interface TypeStats { type: Type, total: number, with_price: number, with_harea: number, with_larea: number }
  const stats = new Hash<TypeStats>()
  for (const prop of all_props) {
    const stat = stats.getm(prop.type, {
      type: prop.type, total: 0, with_price: 0, with_harea: 0, with_larea: 0
    })
    stat.total += 1
    if (!is_undefined(prop.price)) stat.with_price += 1
    if (!is_undefined(prop.house_area)) stat.with_harea += 1
    if (!is_undefined(prop.land_area)) stat.with_larea += 1
  }

  const table = stats.values().map(({ type, total, with_price, with_harea, with_larea }) => ({
    type,
    total_rel: (total / all_props.length).round(2),
    with_price_rel: (with_price / total).round(2),
    with_harea_rel: (with_harea / total).round(2),
    with_larea_rel: (with_larea / total).round(2)
  }))

  page_secondary_section.push({
    id: 'Property Types',
    desc: `
      How much properties of different types, and what percentage of those are with defined price,
      house and land area. To better understand what kind of data we have and what's missing.
    `,
    table: {
      columns: [
        { id: 'type', title: 'Type' },
        { id: 'total_rel', title: 'Total %',            format: { type: 'line', ticks: [.5, 1] } },
        { id: 'with_price_rel', title: 'With Price %',  format: { type: 'line', ticks: [.5, 1] } },
        { id: 'with_harea_rel', title: 'With H Area %', format: { type: 'line', ticks: [.5, 1] } },
        { id: 'with_larea_rel', title: 'With L Area %', format: { type: 'line', ticks: [.5, 1] } },
      ],
      sort: [['total_rel', 'desc']],
      show_toolbar: false
    },
    data: table.to_columns(),
  })
}


// Filtering out all properties except houses and appartments
type HAType = 'house' | 'apartment'
const ha_props = all_props.filter_map((prop) => {
  if (prop.type == 'house' || prop.type == 'apartment') {
    const type: HAType = prop.type
    return {...prop, type }
  }
})

const beds_to_sm_approx: { [key: string]: number } = {}
function beds_to_sm(type: HAType, beds: number): number | undefined {
  return beds_to_sm_approx[`${type} ${beds}`]
}

{ // Correlation between Beds and Square Meters
  interface BedsStats { type: HAType, beds: number, area: number }
  const beds = ha_props.filter_map<BedsStats>(({ type, beds, house_area }) =>
    !is_undefined(house_area) &&
    (beds > 0 && beds < 7) &&
    (house_area > 1 && house_area < 1000)
    ?
      { type, beds, area: house_area } :
      undefined
  )


  page_secondary_section.push({
    id: 'Beds to Square Meters',
    desc: `
      Australian real estate use notion of "beds" instead of "square meters". It's too vague, would
      be better to use more formal and uniform measure, let's see how number of beds is related to
      square meters.
    `,
    chart: [
      'tick',
      { x: 'beds', type: 'ordinal', title: 'N of beds' },
      { y: 'area', scale: 'log', title: 'm2', vega: {
        axis: { values: [1, 10, 50, 100, 200, 1000] } }
      },
      { opacity: '', value: .5 },
      { column: 'type' }
    ],
    data: beds.sample(500).to_columns(),
  })

  // Distribution for 3 beds
  {
    // Making same points count for apartment and house, will be better looking on chart
    const ah3 = beds.filter(({ beds, area }) => beds == 3 && area < 500 && area > 0)
    const houses = ah3.filter(({ type }) => type == 'house')
    const apartments = ah3.filter(({ type }) => type == 'apartment')
    const smallest = [houses.length, apartments.length].min()
    const table = [...houses.sample(smallest), ...apartments.sample(smallest)]

    page_secondary_section.push({
      id: '3 Beds to Square Meters, Histogram',
      desc: `
        Taking closer look at correlation of beds and area, with 3 beds as example. Creating a
        histogram for ${smallest} houses and ${smallest} apartments.
        To have better understanding of the data shape and if it could be approximated with single
        point estimation like median.
      `,
      chart: [
        'bar',
        { x: 'area', bin: true, title: 'm2' },
        { y: '', aggregate: 'count',  title: 'Count' },
        { column: 'type' },
      ],
      data: table.to_columns(),
    })
  }

  // Calculating median areas
  interface MedianArea {
    beds: number, house_area?: number, apartment_area?: number
  }
  const approximated = beds
    .group_by(({ beds }) => beds)
    .map((group, beds) => {
      const houses = group.filter(({ type }) => type == 'house')
      const house_area = houses.length < 20 ?
        undefined :
        houses.map(({ area }) => area).median().round()

      const apartments = group.filter(({ type }) => type == 'apartment')
      const apartment_area = apartments.length < 20 ?
        undefined :
        apartments.map(({ area }) => area).median().round()

      return { beds, house_area, apartment_area }
    })
    .values()

  approximated.each(({ beds, house_area, apartment_area}) => { // Saving for later use
    if (house_area) beds_to_sm_approx[`house ${beds}`] = house_area
    if (apartment_area) beds_to_sm_approx[`apartment ${beds}`] = apartment_area
  })

  page_secondary_section.push({
    id: 'Beds to Square Meters, approximated',
    desc: `
      The approximation for property area needed to calculate price per square meter for properties
      where the area is not specified explicitly.

      It should be ok to use median as an approximation in cases where property area is
      not specified. The idea is - if property has huge size, the agent probably would mention it
      as an advantage. So if area is not specified it's probably a property with an average area, and
      we can use median as an approximation.
    `,
    table: {
      columns: [
        { id: 'beds',           title: 'Beds' },
        { id: 'apartment_area', title: 'Apartment m2' },
        { id: 'house_area',     title: 'House m2' },
      ],
      sort: [['beds', 'asc']],
      show_toolbar: false
    },
    data: approximated,
  })
}


{ // Prices per whole house or apartment
  interface PropPrice { type: HAType, state: string, price: number }

  let prices: PropPrice[] = []
  for (const prop of ha_props) {
    if (is_undefined(prop.price)) continue
    if (prop.price < 50000 || prop.price > 5000000) continue
    prices.add({ state: prop.state, type: prop.type, price: prop.price })
  }
  prices = prices.asc(({ state }) => state)

  const median_prices = prices
    .group_by(({ state, type }) => `${state}/${type}`)
    .map((group, key) => {
      const [state, type] = key.split2('/')
      return ({ state, type, median_price: group.map(({ price }) => price).median().round() })
    })
    .values()

  const price_scale = {
    domain: [50000, 5000000],
    vega: {
      axis: { values: [50000, 100000, 250000, 500000, 1000000, 2000000, 5000000] }
    }
  }

  page_main_section.push({
    id: 'Median Price per single Apartment or House',
    desc: `Prices and median price. Per single apartment or house, with no regard of beds or area.`,
    chart: [
      [
        { mark: 'tick', size: 5 },
        { x: 'type', type: 'ordinal' },
        { y: 'price', scale: 'log', ...price_scale },
        { opacity: '', value: .5 },
      ],
      [
        { mark: 'tick', color: 'black', thickness: 2, size: 12 },
        { x: 'type', type: 'ordinal' },
        { y: 'median_price', scale: 'log', ...price_scale },
      ],
      { column: 'state' },
    ],
    // Sampling only 200 points for every state, to reduce size of the report
    data: [
      ...prices.group_by(({ state }) => state).map((group) => group.sample(200)).values().flat(),
      ...median_prices
    ].to_columns()
  })
}


{ // Prices per Square Meter
  interface PropPrice { type: HAType, state: string, price_sm: number }

  let prices: PropPrice[] = []
  for (const prop of ha_props) {
    if (is_undefined(prop.price)) continue
    if (prop.price < 50000 || prop.price > 5000000) continue

    let area: number
    // const approximated_area = beds_to_sm(prop.type, prop.beds)
    if (is_number(prop.house_area)) area = prop.house_area
    // else if (approximated_area)     area = approximated_area
    else                            continue

    const price_sm = (prop.price / area).round()
    if (price_sm < 100) continue

    prices.add({ state: prop.state, type: prop.type, price_sm })
  }
  prices = prices.asc(({ state }) => state)

  const median_prices = prices
    .group_by(({ state, type }) => `${state}/${type}`)
    .map((group, key) => {
      const [state, type] = key.split2('/')
      return ({ state, type, median_price_sm: group.map(({ price_sm }) => price_sm).median().round() })
    })
    .values()

    const price_scale = {
      vega: {
        axis: { values: [100, 1000, 5000, 10000, 20000, 50000, 100000] }
      }
    }

    // Prices per m2
    page_main_section.push({
      id: 'Median Price per Square Meter',
      desc: `Prices and median price per Square Meter.`,
      chart: [
        [
          { mark: 'tick', size: 5 },
          { x: 'type', type: 'ordinal' },
          { y: 'price_sm', scale: 'log', ...price_scale },
          { opacity: '', value: .5 },
        ],
        [
          { mark: 'tick', color: 'black', thickness: 2, size: 12 },
          { x: 'type', type: 'ordinal' },
          { y: 'median_price_sm', scale: 'log', ...price_scale },
        ],
        { column: 'state' },
      ],
      // Sampling evely 200 points for every state
      data: [
        ...prices.group_by(({ state }) => state).map((group) => group.sample(200)).values().flat(),
        ...median_prices
      ].to_columns()
    })

    // Table, Median Price per Square Meter
    type MedianPriceRow = { state: string, hprice_sm: number, aprice_sm: number }
    const median_prices_table = median_prices.map(({ state }) => state).unique()
      .map<MedianPriceRow>((state) => ({
        state,
        hprice_sm: ensure(median_prices.find((item) => item.state == state && item.type == 'house'))
          .median_price_sm,
        aprice_sm: ensure(median_prices.find((item) => item.state == state && item.type == 'apartment'))
          .median_price_sm
      }))

    page_main_section.push({
      id: 'Median Price per Square Meter, table',
      table: {
        columns: [
          { id: 'state',      title: 'State' },
          { id: 'aprice_sm', title: 'Apartment $/m2, median' },
          { id: 'hprice_sm', title: 'House $/m2, median' },
        ],
        sort: [['state', 'asc']],
        show_toolbar: false
      },
      data: median_prices_table,
    })


    // Price histogram for NSW
    {
      const nsw = prices.filter(({ state, type, price_sm }) =>
        state == 'NSW' && type == 'apartment' && price_sm < 20000
      )

      page_main_section.push({
        id: 'Price histogram for Apartments in NSW',
        desc: `
          Histogram of price per square meter for apartments in NSW.
        `,
        chart: [
          'bar',
          { x: 'price_sm', bin: true, title: 'm2' },
          { y: '', aggregate: 'count',  title: 'Count' },
          // { column: 'type' },
        ],
        // data: table.to_columns(),
        data: nsw.to_columns()
      })
    }
}


{ // Generating report, run as `deno run --allow-net --unstable analyse.ts > report-2021-08.html`
  const page: App = {
    app:   ['page', 0.1],
    title: 'Australian Real Estate Stats 2021-08',
    page: [
      {
        id: `How to customise this report`,
        text: `
          This [report is open](https://github.com/al6x/pl0t/blob/main/files/experiments/ausprops/analyse.ts)
          and you can run it yourself, if you wish to customise calculations or add your own.
          You would need Deno to run it:

              deno run --allow-net --unstable https://raw.githubusercontent.com/al6x/pl0t/main/files/experiments/ausprops/analyse.ts > report-2021-08.html
              open report-2021-08.html
        `
      },
      ...page_main_section,
      {
        id: `Second part`,
        text: `You can **ignore the second part**, it's some random data explorations.`
      },
      ...page_secondary_section
    ]
  }
  console.log(toHtml(page))
}


// // deno run -A --unstable --import-map=import_map.json analyse.ts