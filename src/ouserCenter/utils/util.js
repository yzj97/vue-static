export default {
  copy(obj) {
    return JSON.parse(JSON.stringify(obj))
  },
  formatDate(arr, datePropName, pattern) {
    if (Array.isArray(arr)) {
      for (let i = 0; i < arr.length; i++) {
        const o = arr[i]
        const dateProp = o[datePropName]
        const date = new Date(dateProp)
        if (pattern) {
          o[datePropName + 'Str'] = formate(date, pattern)
        } else {
          o[datePropName + 'Str'] = formate(date, 'yyyy-MM-dd hh:mm:ss')
        }
      }
    }
  },
  arr2tree(arr, idPropName, pIdProdName, labelPropName) {
    if (!Array.isArray(arr)) { return [] }
    for (let i = 0; i < arr.length; i++) {
      const o = arr[i]
      o.originalId = o.id
      o.originalPId = o.pId
      o.originalLabel = o.label
      o.id = o[idPropName]
      o.label = o[labelPropName]
      o.pId = o[pIdProdName]
    }
    const result = []
    arr.forEach(item => {
      if (item.pId === null || item.pId === '0' || item.pId === 0) {
        result.push(item)
        convertChild(arr, item, item.id)
      }
    })
    return result
  },
  getOnePropByKeyFromArr(arr, keyPropValue, keyPropName, targetPropName) {
    if (!keyPropName) {
      keyPropName = 'value'
    }
    if (!targetPropName) {
      targetPropName = 'label'
    }
    if (!Array.isArray(arr)) { return null }
    for (let i = 0; i < arr.length; i++) {
      const o = arr[i]
      if (o[keyPropName] === keyPropValue) {
        return o[targetPropName]
      }
    }
    return null
  }
}
function convertChild(arr, parentItem, parentId) {
  arr.forEach(item => {
    if (item.pId === parentId) {
      parentItem.children = parentItem.children ? parentItem.children : []
      item.parentLabel = parentItem.label
      parentItem.children.push(item)
      convertChild(arr, item, item.id)
    }
  })
}

function formate(date, fmt) { // author: meizz
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  }
  return fmt
}
