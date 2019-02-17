const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const globby = require('globby')

module.exports = async () => {
  const slides = yaml.safeLoad(fs.readFileSync('_data/_slides.yaml', 'utf8'))
  const images = (await globby('slides/*')).sort()
  return slides.map(([alt, ...lines], index) => {
    const image = images[index]
    return {
      id: image ? path.parse(image).name : '',
      image: {
        src: image,
        alt,
      },
      lines,
    }
  })
}
