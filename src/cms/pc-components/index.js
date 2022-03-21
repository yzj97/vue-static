const rtv = []
const allConfig = require.context('./', true, /\/config.js$/)

allConfig.keys().map(key => {
  rtv.push(allConfig(key).default)
})
export default rtv
