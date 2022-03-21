import changeCase from 'packages/utils/change-case'
// 拖拽
const rtv = {
}
const allVue = require.context('./', true, /\/index.vue$/)

allVue.keys().forEach(filePath => {
  const fileContent = allVue(filePath)
  const fileExport = fileContent.default || fileContent
  const filePathArr = filePath.split('/')
  const [fileName] = filePathArr.slice(-2, -1)
  const componentName = changeCase('ody-' + fileName, 'pascal')

  rtv[componentName] = fileExport
})

// 这里的组件可以给子项目使用
export default rtv
