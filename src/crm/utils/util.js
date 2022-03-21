export default {
  confirm(that, message, successCallback, cancelCallback) {
    that.$confirm(message, that.$t('system_hints'), {
      confirmButtonText: that.$t('common.confirm'),
      cancelButtonText: that.$t('common.cancel'),
      type: 'warning'
    }).then(() => {
      if (typeof successCallback === 'function') {
        successCallback()
      }
    }).catch(() => {
      if (typeof cancelCallback === 'function') {
        cancelCallback()
      }
    })
  },
  removeRepeatInterests(list, vue) {
    // 折扣和积分的排除掉无用的，只留优惠力度最大的
    const resultList = []
    const compareMap = {}
    for (const i of list) {
    // 如果类型为3-优惠券，4-自定义，直接保留
      const type = i.type
      if (type === 3 || type === 4) {
        resultList.push(i)
        continue
      }
      // 获取该类型目前数值最大的一条数据
      const maxNow = compareMap[type]
      if (!maxNow) {
      // 如果当前最大的不存在，直接设置成本条
        compareMap[type] = i
      } else {
      // 如果当前数值最大的小于本条，则将当前最大的更新成本条
        if (parseFloat(maxNow.param) < parseFloat(i.param)) {
          compareMap[type] = i
        }
      }
    }

    for (const i of Object.keys(compareMap)) {
      resultList.push(compareMap[i])
    }
    return resultList
  }
}
