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
        component: () => import('packages/components/' + filePathArr.slice(1, -1).join('/') + '/readme.md'),
        name: changeCase('components-' + parentItem.path + '-' + fileName, 'pascal'),
        meta: fileExport
      })

      parentItem.children.sort((a, b) => (a.meta.title + '').localeCompare(b.meta.title + ''))
    } else {
      routerList.push({
        path: fileExport.category,
        component: () => import('packages/views/blank'),
        name: changeCase('components-' + fileExport.category, 'pascal'),
        meta: {
          title: changeCase(fileExport.category, 'pascal')
        },
        redirect: 'noRedirect',
        children: [
          {
            path: fileName,
            component: () => import('packages/components/' + filePathArr.slice(1, -1).join('/') + '/readme.md'),
            name: changeCase('components-' + fileExport.category + '-' + fileName, 'pascal'),
            meta: fileExport
          }
        ]
      })
    }
  } else {
    routerList.push({
      path: fileName,
      component: () => import('packages/components/' + fileName + '/readme.md'),
      name: changeCase('packages-components-' + fileName, 'pascal'),
      meta: { title: fileExport.title }
    })
  }
})

export default routerList
