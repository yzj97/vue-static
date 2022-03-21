import changeCase from 'packages/utils/change-case'
const moduleComponents = {}
const allVue = require.context('./', true, /index\.vue$/)

allVue.keys().map(key => {
  const match = key.match(/([^/]+)\/index.vue$/)
  if (match && match[1]) {
    moduleComponents['Cms' + changeCase(match[1], 'pascal')] = allVue(key).default
  }
})

window.moduleComponents = moduleComponents
