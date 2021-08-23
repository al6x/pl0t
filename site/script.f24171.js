(function() {
  function add_samples_m(pane, images, cards_n) {
    const card_size = 200 // in px

    // Dimensions
    const swidth = pane.offsetWidth, sheight = pane.offsetHeight

    // Adding images to pane
    for (let i = 0; i < cards_n; i++) {
      // Creating coordinates
      const offset = card_size/4
      const [x, y] = random_x_y(offset, swidth - offset, offset, sheight - offset)
      const r = random_int(-30, 30)

      // Adding image
      const img_i = random_int(0, images.length - 1)
      const url = images[img_i]
      if (url === undefined) {
        console.log(images)
        console.log(img_i)
      }
      const card = document.createElement('div')
      card.style =
        `display: none; left: ${x - card_size/2}px; top: ${y - card_size/2}px; z-index: ${i+1};` +
        ` transform: rotate(${r}deg); transform-origin: 50% 50%;`
      card.classList.add('card')

      const img = document.createElement('img')
      img.src = url
      img.onload = () => card.style.display = 'block'
      card.appendChild(img)

      pane.appendChild(card)
    }
  }

  async function run() {
    // Not loading untill pl0t is loaded
    while (!window.plot_api) await sleep(100)
    await sleep(500)

    const images_n = 21

    // Images urls
    const images = []
    for (let i = 1; i <= images_n; i++) { images.push(`http://pl0t.com/samples/${i}.png`) }

    const pane = document.getElementsByClassName('pane')[0]

    // Adding first 5 images first and after a delay the rest
    add_samples_m(pane, images.slice(0, 5), 20)
    await sleep(1000)
    add_samples_m(pane, images.slice(5, images.length), 80)
  }
  run()

  // Helpers ---------------------------------------------------------------------------------------
  function random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function sleep(ms) {
    return new Promise((resolve, _reject) => setTimeout(resolve, ms))
  }

  function random_x_y(min_x, max_x, min_y, max_y) {
    return [random_int(min_x, max_x), y = random_int(min_y, max_y)]
  }

  // Generates random number evenly distributed on 2D plane
  const added_x_y = []
  function random_even_x_y(min_x, max_x, min_y, max_y) {
    let max_distance = 0, mx, my
    for (let i = 0; i < 15; i++) {
      x = random_int(min_x, max_x), y = random_int(min_y, max_y)
      if (added_x_y.length == 0) {
        mx = x
        my = y
      } else {
        const distances = added_x_y.map(([xi, yi]) => Math.sqrt(Math.pow(x - xi, 2) + Math.pow(y - yi, 2)))
        const min_of_distances = Math.min(...distances)
        if (min_of_distances >= max_distance) {
          mx = x
          my = y
          max_distance = min_of_distances
        }
      }
    }
    added_x_y.push([mx, my])
    console.log([mx, my])
    return [mx, my]
  }
})()


// // Creating pane
// const pane = document.createElement('div')
// pane.classList.add('pane')

// const wail = document.createElement('div')
// wail.classList.add('wail')
// pane.appendChild(wail)

// document.body.appendChild(pane)