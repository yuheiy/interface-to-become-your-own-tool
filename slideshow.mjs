const slideItemElements = slides.children

const changeIndex = (index) => {
  Array.prototype.forEach.call(slideItemElements, (element) => {
    element.hidden = true
  })
  slideItemElements[index].hidden = false
}

window.addEventListener(
  'message',
  (event) => {
    // if (event.origin !== "http://example.com:8080") {
    //   return;
    // }

    if (typeof event.data === 'number') {
      console.log(event.data)
      changeIndex(event.data)
    }
  },
  false,
)

changeIndex(0)
