(function() {
  function add_samples() {
    const images_n = 20, cards_n = 100

    // Images urls
    const images = []
    for (let i = 1; i <= images_n; i++) { images.push(`http://pl0t.com/samples/${i}.png`) }

    // Creating pane
    const pane = document.createElement('div')
    pane.classList.add('pane')

    const wail = document.createElement('div')
    wail.classList.add('wail')
    pane.appendChild(wail)

    document.body.appendChild(pane)

    // Dimensions
    const swidth = pane.offsetWidth, sheight = pane.offsetHeight
    const s = 200

    // Adding images to pane
    for (let i = 0; i < cards_n; i++) {
      // Creating coordinates
      const offset = s/4
      const l = random_int(-offset, swidth - offset)
      const t = random_int(-offset, sheight - offset)
      const r = random_int(-30, 30)

      // Adding image
      const img_i = random_int(0, images_n - 1)
      const url = images[img_i]
      if (url === undefined) {
        console.log(images)
        console.log(img_i)
      }
      const card = document.createElement('div')
      card.style =
        `left: ${l}px; top: ${t}px; z-index: ${i+1};` +
        ` transform: rotate(${r}deg); transform-origin: 50% 50%;`
      card.classList.add('card')

      const img = document.createElement('img')
      img.src = url
      card.appendChild(img)

      pane.appendChild(card)
    }
  }

  function random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Not loading untill pl0t is loaded
  const ih = setInterval(() => {
    if (window.plot_api) {
      clearInterval(ih)
      // Waiting just a little bit more after loading pl0t, to allow dynamic libraries be loaded
      setTimeout(add_samples, 300)
    }
  }, 100)
})()