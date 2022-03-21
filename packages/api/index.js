import changeCase from 'packages/utils/change-case'
const rtv = {}
const allJs = require.context('./', true, /\.js$/)

// 可以把当前目录下非index 的所有js导出

allJs.keys().map(key => {
  const [, fileName] = key.match(/\.\/([\w-_]*?)\.js/)
  if (fileName !== 'index') {
    rtv[changeCase(fileName)] = allJs(key).default
  }
})

export default rtv
