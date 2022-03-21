
const rtv = {}
const allJs = require.context('./', true, /\.js$/)

allJs.keys().map(key => {
  const [, fileName] = key.match(/\.\/([\w-_]*?)\.js/)
  if (fileName !== 'index') {
    rtv[fileName] = allJs(key).default
  }
})

export default rtv
