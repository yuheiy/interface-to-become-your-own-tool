import {
  LitElement,
  html,
} from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module'

function deepActiveElement() {
  let a = document.activeElement
  while (a && a.shadowRoot && a.shadowRoot.activeElement) {
    a = a.shadowRoot.activeElement
  }
  return a
}

const slideItemElements = slides.children

const highlightCurrentSlide = (index) => {
  Array.prototype.forEach.call(slideItemElements, (element) => {
    element.removeAttribute('aria-current')
  })
  slideItemElements[index].setAttribute('aria-current', 'true')

  // スライド部分のliが可視領域に入ってない場合のみ
  if (!true) {
    slideItemElements[index].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  }
}

let slideshowWindow = null

export class SlideshowController extends LitElement {
  static get properties() {
    return {
      isPlaying: Boolean,
      currentIndex: Number,
      slideCount: {
        type: Number,
        converter: (value, type) => {
          return type(value)
        },
      },
    }
  }

  constructor() {
    super()
    this.isPlaying = false
    this.currentIndex = 0
  }

  firstUpdated() {
    document.addEventListener('keydown', (event) => {
      if (!this.isPlaying) {
        return
      }

      if (deepActiveElement().tagName === 'INPUT') {
        return
      }

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault()
          this.goToNext()
          break
        case 'ArrowLeft':
          event.preventDefault()
          this.goToPrev()
          break
      }
    })

    Array.prototype.forEach.call(slideItemElements, (element, index) => {
      element.addEventListener('click', () => {
        if (!this.isPlaying) {
          return
        }

        this.currentIndex = index
      })
    })
  }

  updated(changedProperties) {
    if (!this.isPlaying) {
      return
    }

    if (changedProperties.has('currentIndex')) {
      slideshowWindow.postMessage(this.currentIndex, '*')
      highlightCurrentSlide(this.currentIndex)
    }
  }

  get hasNextSlide() {
    return this.currentIndex < this.slideCount - 1
  }

  get hasPrevSlide() {
    return this.currentIndex >= 1
  }

  goToNext() {
    if (this.hasNextSlide) {
      this.currentIndex++
    }
  }

  goToPrev() {
    if (this.hasPrevSlide) {
      this.currentIndex--
    }
  }

  onClickPlay() {
    if (slideshowWindow == null || slideshowWindow.closed) {
      slideshowWindow = window.open(
        './slideshow.html',
        'SlideshowWindowName',
        'titlebar=yes',
      )
      this.isPlaying = true
      this.currentIndex = 0
      slides.classList.add('playing')
      highlightCurrentSlide(this.currentIndex)
      finished.hidden = false
    } else {
      slideshowWindow.focus()
    }
  }

  onChangeIndex(event) {
    const element = event.currentTarget

    if (element.checkValidity()) {
      this.currentIndex = Number(element.value) - 1
    }
  }

  onBlurIndex(event) {
    const element = event.currentTarget

    if (!element.checkValidity()) {
      element.value = this.currentIndex + 1
    }
  }

  render() {
    return html`
      <style>
        summary {
          cursor: pointer;
        }
        input,
        button {
          font-size: inherit;
        }
        img {
          width: 8rem;
          cursor: pointer;
        }
      </style>
      <details>
        <summary>スライドショー</summary>
        <p>
          <button type="button" @click=${this.onClickPlay}>
            ${this.isPlaying ? '再生中' : '再生'}
          </button>
        </p>
        <p>
          <button
            type="button"
            ?disabled=${!this.isPlaying || !this.hasPrevSlide}
            @click=${this.goToPrev}
          >
            <
          </button>
          <input
            type="number"
            .value=${this.currentIndex + 1}
            min="1"
            max=${this.slideCount}
            required
            ?disabled=${!this.isPlaying}
            @input=${this.onChangeIndex}
            @blur=${this.onBlurIndex}
          />
          / ${this.slideCount}
          <button
            type="button"
            ?disabled=${!this.isPlaying || !this.hasNextSlide}
            @click=${this.goToNext}
          >
            >
          </button>
          <br />
          <input
            type="range"
            .value=${this.currentIndex + 1}
            min="1"
            max=${this.slideCount}
            ?disabled=${!this.isPlaying}
            @input=${this.onChangeIndex}
          />
          <br />
          <img
            src=${slideItemElements[this.currentIndex].querySelector('img').src}
            alt=""
            ?hidden=${!this.isPlaying}
            @click=${() => {
              slideItemElements[this.currentIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest',
              })
            }}
          />
        </p>
      </details>
    `
  }
}

customElements.define('slideshow-controller', SlideshowController)
