export default {
  copy(obj) {
    return JSON.parse(JSON.stringify(obj))
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
  timestamp2TimeString(timestamp) {
    var time = new Date(timestamp) // 先将时间戳转为Date对象，然后才能使用Date的方法
    var year = time.getFullYear()
    var month = time.getMonth() + 1 // 月份是从0开始的
    var day = time.getDate()
    var hour = time.getHours()
    var minute = time.getMinutes()
    var second = time.getSeconds()
    // add0()方法在后面定义
    return year + '-' + this.add0(month) + '-' + this.add0(day) + ' ' + this.add0(hour) + ':' + this.add0(minute) + ':' + this.add0(second)
  },
  add0(m) {
    return m < 10 ? '0' + m : m
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
