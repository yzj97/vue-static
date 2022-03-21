const fs = require('fs')
const path = require('path')
const arg = process.argv[2]
const IS_REPLACE = true

let unSetting = []
let allSetting = []

if (arg === 'all') {
  const modulesChildren = fs.readdirSync(resolve('src'))

  modulesChildren.forEach(dir => {
    var fsInfo = fs.statSync(resolve(`src/${dir}`))

    if (fsInfo.isDirectory()) {
      const {
        unSetting: oneUnSetting,
        allSetting: oneAllSetting
      } = getSettingKeyByPool(dir)

      unSetting = [...new Set([...unSetting, ...oneUnSetting])]
      allSetting = [...new Set([...allSetting, ...oneAllSetting])]
    }
  })
} else {
  const hasDir = fs.existsSync(resolve(`src/${arg}`))

  if (hasDir) {
    const fsInfo = fs.statSync(resolve(`src/${arg}`))

    if (fsInfo.isDirectory()) {
      const {
        unSetting: oneUnSetting,
        allSetting: oneAllSetting
      } = getSettingKeyByPool(arg)

      unSetting = oneUnSetting
      allSetting = oneAllSetting
    } else {
      throw new Error('不能选中非目录文件')
    }
  } else {
    const hasFile = fs.existsSync(resolve(arg))

    if (hasFile) {
      const {
        unSetting: oneUnSetting,
        allSetting: oneAllSetting
      } = getSettingKeyByFile(arg)

      unSetting = oneUnSetting
      allSetting = oneAllSetting
    } else {
      throw new Error('没有找到该文件')
    }
  }
}

const packagesEn = eval('(' + fs.readFileSync(resolve(`packages/lang/en_US.js`), 'utf-8').replace('export default', '') + ')')

console.log(unSetting.length, allSetting.length, Object.keys(packagesEn).length)

const hasKey = []
const noKey = []

unSetting.forEach(item => {
  if (packagesEn[item]) {
    hasKey.push(item)
  } else {
    packagesEn[item] = ''
    noKey.push(item)
  }
})

console.log(hasKey.length, noKey.length, Object.keys(packagesEn).length)

if (IS_REPLACE) {
  const jsonString = JSON.stringify(packagesEn, null, 2).slice(1, -1)
  const replaceJsonString = unescape(escape(jsonString).replace(/%22/g, '\'').replace(/%27/g, '\\\''))
  fs.writeFileSync(resolve(`packages/lang/en_US.js`), `export default {${replaceJsonString}}`)
}

console.log('noKey', noKey)

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

function getSettingKeyByPool(poolName) {
  const hasFile = fs.existsSync(resolve(`src/${poolName}`))

  const rtv = {
    unSetting: [],
    allSetting: []
  }

  if (!hasFile) {
    return
  }

  const fsInfo = fs.statSync(resolve(`src/${poolName}`))

  if (!fsInfo.isDirectory()) {
    return
  }

  const vueFileList = findVue(`src/${poolName}/views/`)

  vueFileList.forEach(file => {
    const {
      unSetting,
      allSetting
    } = getSettingKeyByFile(file)

    if (unSetting && unSetting.length) {
      // fs.writeFileSync(resolve(file), fileContent, 'utf-8')

      rtv.unSetting = [...new Set([...rtv.unSetting, ...unSetting])]
    }

    if (allSetting && allSetting.length) {
      rtv.allSetting = [...new Set([...rtv.allSetting, ...allSetting])]
    }
  })

  const vueComponentsFileList = findVue(`src/${poolName}/components/`)

  vueComponentsFileList.forEach(file => {
    const {
      unSetting,
      allSetting
    } = getSettingKeyByFile(file)

    if (unSetting && unSetting.length) {
      // fs.writeFileSync(resolve(file), fileContent, 'utf-8')

      rtv.unSetting = [...new Set([...rtv.unSetting, ...unSetting])]
    }

    if (allSetting && allSetting.length) {
      rtv.allSetting = [...new Set([...rtv.allSetting, ...allSetting])]
    }
  })

  return rtv
}

function findVue(dir) {
  const allFile = []

  innerLoop(dir)

  return allFile

  function innerLoop(dir) {
    const children = fs.readdirSync(resolve(dir))
    children.forEach(file => {
      const fileInfo = fs.statSync(resolve(path.join(dir, file)))

      if (fileInfo.isDirectory()) {
        innerLoop(dir + '/' + file)
      } else {
        if (/\.vue$/.test(file)) {
          allFile.push(path.join(dir, file))
        }
      }
    })
  }
}

function setHtmlFix(str) {
  const arr = str.split(/(\{\{[\s\S]*?\}\})/g)
  const cnList = []
  const content = arr.map(item => {
    if (/\{\{[\s\S]*?\}\}/.test(item)) {
      return item
    }

    return item.replace(/^[\u4e00-\u9fa5]+$/g, $0 => {
      cnList.push($0)
      return `{{ $t('${$0}') }}`
    })
  })

  return [cnList, content]
}

function setJsFix(str, prefix = 'this.') {
  const cnList = []
  const content = str.replace(/([\=\?\:\+\-]\s*)'(((?:[\S]*)?[\u4e00-\u9fa5](?:[\S]*)?))'/g, ($0, $1, $2) => {
    cnList.push($2)
    return `${$1}${prefix}$t('${$2}')`
  })
  return [cnList, content]
}

function getSettingKeyByFile(file) {
  const filePath = resolve(file)
  let cns = []
  let fileContent = fs.readFileSync(filePath, 'utf-8')
  const templateHtml = fileContent.split('</template>')
  const html = templateHtml.slice(0, -1).join('</template>') + '</template>'
  let jsAndCss = templateHtml.slice(-1).join('')
  const [jsAndCssCnList, jsAndCssContent] = setJsFix(jsAndCss)

  if (jsAndCssCnList && jsAndCssCnList.length) {
    cns = [...cns, ...jsAndCssCnList]
    jsAndCss = jsAndCssContent
  }

  fileContent =
    // 替换属性有中文
    html.replace(/(<(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>)([^<]+)?/g, ($0, htmlTag, htmlContent) => {
      // console.log(file, 'htmlContent=', htmlContent)
      // console.log('bbb=', htmlContent, 'xxx')
      let showHtml = htmlContent || ''
      const [contentCnList, contentHtml] = setHtmlFix(showHtml)

      if (contentCnList && contentCnList.length) {
        cns = [...cns, ...contentCnList]
        showHtml = contentHtml
      }

      return htmlTag.replace(/(.)([-\w]+)="([^"]+)"/g, ($0, $dot, $1, $2) => {
        if ($dot === ':') {
          const [attrCnList, attrValue] = setJsFix($2, '')

          if (attrCnList && attrCnList.length) {
            cns = [...cns, ...attrCnList]
            return `${$dot}${$1}="${attrValue}"`
          }

          return `${$dot}${$1}="${$2}"`
        }

        if (/[\u4e00-\u9fa5]/.test($2)) {
          cns.push($2)
          return `${$dot}:${$1}="$t('${$2}')"`
        }

        return `${$dot}${$1}="${$2}"`
      }) + showHtml
    }) + jsAndCss

  // 显示 /^(?![A-Za-z0-9]+$)[\u4e00-\u9fa5A-Za-z0-9]{1,3}$/

  if (IS_REPLACE) {
    fs.writeFileSync(filePath, fileContent, 'utf-8')
  }

  const unSetting = [...new Set(cns)]
  let allSetting = []

  fileContent.replace(/\$t\('([^']+)'\)/g, ($0, $1) => {
    allSetting.push($1)
  })

  allSetting = [...new Set(allSetting)]

  return {
    unSetting,
    fileContent,
    allSetting
  }
}
