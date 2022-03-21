var fs = require('fs')
var path = require('path')
var join = path.join

function getJsonFiles(jsonPath) {
  const jsonFileMap = {}
  const rootPath = jsonPath
  function findJsonFile(path) {
    const files = fs.readdirSync(path)
    files.forEach(function(item, index) {
      const fPath = join(path, item)
      const stat = fs.statSync(fPath)
      if (stat.isDirectory() === true) {
        findJsonFile(fPath)
      }
      if (stat.isFile() === true && /\.vue/.test(fPath)) {
        const fContent = fs.readFileSync(fPath, 'utf-8')
        // console.log('fContent', fContent)
        const allRequest = fContent.match(/\.\$api\.\w+\.\w+/g) || []
        const allPostRequest = fContent.match(/\.\$post\([^),]+/g) || []
        const allGetRequest = fContent.match(/\.\$get\([^),]+/g) || []
        const allRequestList = [...new Set(allRequest), ...new Set(allPostRequest), ...new Set(allGetRequest)]

        const allRequestList2 = allRequestList.map(request => {
          const { 1: fileName, 2: methodName } = request.match(/\.\$api\.(\w+)\.(\w+)/)

          if (fileName) {
            try {
              // console.log('fileName', rootPath, fPath, fileName, methodName)
              const fileContent = fs.readFileSync(join(rootPath, 'api', `${fileName}.js`), 'utf-8')
              const fileContentFunctionStr = fileContent.slice(fileContent.indexOf('{'))
              var testObj
              var baseUrl = fileContent.match(/baseUrl ='([^']+)'/)

              if (baseUrl) {
                baseUrl = baseUrl[1]
              }

              eval('(testObj = ' + fileContentFunctionStr + ')')

              return testObj[methodName] && testObj[methodName].url || ''
            } catch (ex) {
              return ''
            }
          }

          return request
        })

        jsonFileMap[fPath] = allRequestList2
        // jsonFiles.push(fPath)
      }
    })
  }
  findJsonFile(jsonPath)
  return jsonFileMap
}

// getJsonFiles('src/agent')
// getJsonFiles('packages')

function getPoolFiles() {
  const pools = fs.readdirSync('src')

  pools.forEach(pool => {
    const fPath = join('src', pool)
    const stat = fs.statSync(fPath)
    if (stat.isDirectory() === true) {
      const txt = getJsonFiles(`src/${pool}`)

      fs.writeFileSync(path.join(`src/${pool}.txt`), JSON.stringify(txt, null, 4))
    }
  })

  const txt = getJsonFiles('packages')
  fs.writeFileSync(path.join(`src/packages.txt`), JSON.stringify(txt, null, 4))
}

getPoolFiles()
