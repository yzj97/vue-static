import changeCase from 'packages/utils/change-case'

const allConfig = require.context('./', true, /\/config.json$/)
const routerList = []

allConfig.keys().map(filePath => {
  const fileContent = allConfig(filePath)
  const fileExport = fileContent.default || fileContent
  const filePathArr = filePath.split('/')
  const [fileName] = filePathArr.slice(-2, -1)

  if (fileExport.category) {
    const parentItem = routerList.find(x => x.path === fileExport.category)

    if (parentItem) {
      parentItem.children.push({
        path: fileName,
        component: () => import('packages/details/' + filePathArr.slice(1, -1).join('/') + '/index.vue'),
        name: changeCase('details-' + parentItem.path + '-' + fileName, 'pascal'),
        meta: fileExport
      })

      parentItem.children.sort((a, b) => (a.meta.title + '').localeCompare(b.meta.title + ''))
    } else {
      routerList.push({
        path: fileExport.category,
        component: () => import('packages/views/blank'),
        name: changeCase('details-' + fileExport.category, 'pascal'),
        meta: {
          title: changeCase(fileExport.category, 'pascal')
        },
        redirect: 'noRedirect',
        children: [
          {
            path: fileName,
            component: () => import('packages/details/' + filePathArr.slice(1, -1).join('/') + '/index.vue'),
            name: changeCase('details-' + fileExport.category + '-' + fileName, 'pascal'),
            meta: fileExport
          }
        ]
      })
    }
  } else {
    routerList.push({
      path: fileName,
      component: () => import('packages/details/' + fileName + '/index.vue'),
      name: changeCase('packages-details-' + fileName, 'pascal'),
      meta: { title: fileExport.title }
    })
  }
})

export default routerList
