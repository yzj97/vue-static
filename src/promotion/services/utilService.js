export function isEmpty(e) {
  if (e !== 0 && !e) {
    return true
  } else if (e.length === 0) {
    return true
  }
  return false
}

export function msg(str) {
  this.$alert(str, this.$t('系统提示'), {
    confirmButtonText: this.$t('确定'),
    callback: action => {
      this.$message({
        type: 'info',
        message: `action: ${action}`
      })
    }
  })
}

// 通过字典获取名称
export function getDictionaryText(id, dictionary) {
  for (let i = 0; i < dictionary.length; i++) {
    if (dictionary[i]['id'] === id || dictionary[i]['value'] === id) {
      return dictionary[i]['text'] || dictionary[i]['label']
    }
  }
}

// 正整数校验
export function validateNum(str) {
  const re = new RegExp('^[1-9]\\d*$')
  return re.test(str)
}

// 所有渠道
export async function getChannelCodeByBusiness(API) {
  try {
    // 保存商家渠道信息
    const channelArrByBusiness = await getChannelArrByBusiness(API)
    const channelArr = []
    // 商家渠道信息和配置的渠道信息code取交集
    let item
    for (item in channelArrByBusiness) {
      if (Object.prototype.hasOwnProperty.call(channelArrByBusiness, item)) {
        channelArr.push(channelArrByBusiness[item])
      }
    }
    return channelArr
  } catch (e) {
    console.error(e)
  }
}

// 商家和配置的渠道信息取交集
export async function getChannelCodeByBusinessAndOscConfig(type, API) {
  try {
    // 保存配置渠道信息
    let channelArrByPageConfig = await getChannelArrByPageConfig(API)
    // 保存商家渠道信息
    const channelArrByBusiness = await getChannelArrByBusiness(API)
    // 取OSC配置渠道信息
    channelArrByPageConfig.forEach(function(item) {
      if (item.promotionType === type) {
        channelArrByPageConfig = item.channelCodes
      }
    })
    // 商家渠道信息和配置的渠道信息code取交集
    return channelArrByPageConfig.map((item) => {
      return channelArrByBusiness[item]
    }).filter(x => x)
  } catch (ex) {
    console.error(ex)
  }
}

// 读取配置渠道信息
export function getChannelArrByPageConfig(API) {
  return new Promise((resolve, reject) => {
    API.loadOscConfigUrl('PROMOTION_CHANNEL_CODES').then(response => {
      if (!isEmpty(response) && !isEmpty(response.data) && !isEmpty(response.data.result)) {
        resolve(response.data.result)
        return false
      }
      resolve([])
    }, reject)
  })
}

// 读取商家渠道信息
export function getChannelArrByBusiness(API) {
  return new Promise(resolve => {
    API.queryChannelMap().then(response => {
      if (!isEmpty(response.data)) {
        resolve(response.data)
        return false
      }
      response([])
    })
  })
}

// 通过channelCode获取中文名
export function getDictionaryTextByChannelCode(id, dictionary) {
  for (let i = 0; i < dictionary.length; i++) {
    if (dictionary[i]['channelCode'] === id) {
      return dictionary[i]['channelName']
    }
  }
}

// 时间正确性校验
export function validateTime(str) {
  const reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
  return reg.test(str)
}
export function getGabDaysBetweenTwoDate(sDate, eDate) {
  const time1 = Date.parse(new Date(sDate))
  const time2 = Date.parse(new Date(eDate))
  const leftsecond = parseInt(Math.abs((time2 - time1)) / 1000)
  return parseInt(leftsecond / (3600 * 24)) // 计算出相差天数
}
// 判断是否为空
export function isBlank(e) {
  if (e !== 0 && !e) {
    return true
  }
  return false
}

// 查看营销报告
export function seeMarketingReport(id) {
  const { href } = this.$router.resolve({
    name: 'activityEffectAnalysis',
    path: '/obi-web/#/activityEffectAnalysis',
    query: { promotionId: id }
  })
  window.open(href, '_blank')
}

/**
 * 根据时间和状态获得真实状态
 * @param status 当前状态
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @param status_notStart 未开始状态的值
 * @param status_ongoing 进行中状态的值
 * @param status_expired 已过期状态的值
 * @returns 真实状态
 */
export function getTrueStatusByStatusAndTimeRange(status, startTime, endTime,
  status_notStart, status_ongoing, status_expired) {
  let trueStatus
  if (status === status_ongoing || status === status_expired || status === status_notStart) {
    const now = new Date()

    let sDate = null
    if (typeof startTime === 'string') { // 兼容IE的日期函数
      sDate = new Date(startTime.replace(/-/g, '/'))
    } else {
      sDate = new Date(startTime)
    }

    let eDate = null
    if (typeof endTime === 'string') { // 兼容IE的日期函数
      eDate = new Date(endTime.replace(/-/g, '/'))
    } else {
      eDate = new Date(endTime)
    }

    // 状态为进行中时，需要根据时间判断是未开始、进行中还是已过期
    if (now < sDate) { // 活动未开始
      trueStatus = status_notStart
    } else if (now > eDate) { // 活动已过期
      trueStatus = status_expired
    } else { // 活动进行中
      trueStatus = status_ongoing
    }
  } else {
    trueStatus = status
  }
  return trueStatus
}

export function setProductLimitInfo(data, contentType) {
  const productLimitInfo = {}
  let minSalePrice = 0
  let maxSalePrice = 0
  let minContentValue = 0
  let maxContentValue = 0
  let minChannelMerchantLimit = 0
  let maxChannelMerchantLimit = 0
  let minChannelStoreLimit = 0
  let maxChannelStoreLimit = 0
  let minChannelIndividualLimit = 0
  let maxChannelIndividualLimit = 0
  let minOrderLimit = 0
  let maxOrderLImit = 0
  let minGiftNum = 0
  let maxGiftNum = 0
  let minUpgradeAmount = 0
  let maxUpgradeAmount = 0
  let minPresellTotalPrice = 0
  let maxPresellTotalPrice = 0
  let minPresellDownPrice = 0
  let maxPresellDownPrice = 0
  let minPresellOffsetPrice = 0
  let maxPresellOffsetPrice = 0
  let minBookNum = 0
  let maxBookNum = 0
  data.childMpList.forEach(function(e) {
    if (!isEmpty(e.agentList) && contentType !== null) {
      for (let i = 0; i < e.agentList.length; i++) {
        if (!isEmpty(e.agentList[i].contentValue)) {
          if (contentType === 1 || contentType === 3) {
            const contentValue = compareAndSetParam(minContentValue, maxContentValue, e.agentList[i].contentValue)
            minContentValue = contentValue.minParam
            maxContentValue = contentValue.maxParam
          } else if (contentType === 2) {
            const contentValue = compareAndSetParam(minContentValue, maxContentValue, e.agentList[i].contentValue)
            minContentValue = contentValue.minParam
            maxContentValue = contentValue.maxParam
          }
        }
        // 预定数量
        if (!isEmpty(e.agentList[i].bookNum)) {
          const bookNum = compareAndSetParam(minBookNum, maxBookNum, e.agentList[i].bookNum)
          minBookNum = bookNum.minParam
          maxBookNum = bookNum.maxParam
        }
        // 预售价
        if (!isEmpty(e.agentList[i].presellTotalPrice)) {
          const presellTotalPrice = compareAndSetParam(minPresellTotalPrice, maxPresellTotalPrice, e.agentList[i].presellTotalPrice)
          minPresellTotalPrice = presellTotalPrice.minParam
          maxPresellTotalPrice = presellTotalPrice.maxParam
        }
        // 定金
        if (!isEmpty(e.agentList[i].presellDownPrice)) {
          const presellDownPrice = compareAndSetParam(minPresellDownPrice, maxPresellDownPrice, e.agentList[i].presellDownPrice)
          minPresellDownPrice = presellDownPrice.minParam
          maxPresellDownPrice = presellDownPrice.maxParam
        }
        // 定金折扣金额
        if (!isEmpty(e.agentList[i].presellOffsetPrice)) {
          const presellOffsetPrice = compareAndSetParam(minPresellOffsetPrice, maxPresellOffsetPrice, e.agentList[i].presellOffsetPrice)
          minPresellOffsetPrice = presellOffsetPrice.minParam
          maxPresellOffsetPrice = presellOffsetPrice.maxParam
        }
      }
    }
    const channelMerchantLimit = compareAndSetParam(minChannelMerchantLimit, maxChannelMerchantLimit, e.channelMerchantLimit)
    minChannelMerchantLimit = channelMerchantLimit.minParam
    maxChannelMerchantLimit = channelMerchantLimit.maxParam
    const channelStoreLimit = compareAndSetParam(minChannelStoreLimit, maxChannelStoreLimit, e.channelStoreLimit)
    minChannelStoreLimit = channelStoreLimit.minParam
    maxChannelStoreLimit = channelStoreLimit.maxParam
    const channelIndividualLimit = compareAndSetParam(minChannelIndividualLimit, maxChannelIndividualLimit, e.channelIndividualLimit)
    minChannelIndividualLimit = channelIndividualLimit.minParam
    maxChannelIndividualLimit = channelIndividualLimit.maxParam
    const orderLimit = compareAndSetParam(minOrderLimit, maxOrderLImit, e.orderLimit)
    minOrderLimit = orderLimit.minParam
    maxOrderLImit = orderLimit.maxParam
    const salePrice = compareAndSetParam(minSalePrice, maxSalePrice, e.salePrice)
    minSalePrice = salePrice.minParam
    maxSalePrice = salePrice.maxParam
    const giftNum = compareAndSetParam(minGiftNum, maxGiftNum, e.giftNum)
    minGiftNum = giftNum.minParam
    maxGiftNum = giftNum.maxParam
    const upgradeAmount = compareAndSetParam(minUpgradeAmount, maxUpgradeAmount, e.upgradeAmount)
    minUpgradeAmount = upgradeAmount.minParam
    maxUpgradeAmount = upgradeAmount.maxParam
  })
  // 单一促销：特价、折扣、直降设置
  if (contentType != null) {
    if (numCompare(minContentValue, maxContentValue) === 0) {
      if (minContentValue === 0) {
        productLimitInfo.contentValue = ''
      } else {
        if (contentType === 1 || contentType === 3) {
          productLimitInfo.contentValue = (minContentValue / 100) + ''
        } else if (contentType === 2) {
          productLimitInfo.contentValue = (minContentValue / 10) + ''
        }
      }
    } else if (numCompare(minContentValue, maxContentValue) !== 0 && minContentValue === 0) {
      if (contentType === 1 || contentType === 3) {
        productLimitInfo.contentValue = (maxContentValue / 100) + ''
      } else if (contentType === 2) {
        productLimitInfo.contentValue = (maxContentValue / 10) + ''
      }
    } else {
      if (contentType === 1 || contentType === 3) {
        productLimitInfo.contentValue = (minContentValue / 100) + '-' + (maxContentValue / 100)
      } else if (contentType === 2) {
        productLimitInfo.contentValue = (minContentValue / 10) + '-' + (maxContentValue / 10)
      }
    }
  }
  // 商家单渠道限量
  if (numCompare(minChannelMerchantLimit, maxChannelMerchantLimit) === 0) {
    if (minChannelMerchantLimit === 0) {
      productLimitInfo.channelMerchantLimit = ''
    } else {
      productLimitInfo.channelMerchantLimit = minChannelMerchantLimit + ''
    }
  } else if (numCompare(minChannelMerchantLimit, maxChannelMerchantLimit) !== 0 && minChannelMerchantLimit === 0) {
    productLimitInfo.channelMerchantLimit = maxChannelMerchantLimit + ''
  } else {
    productLimitInfo.channelMerchantLimit = minChannelMerchantLimit + '-' + maxChannelMerchantLimit
  }
  // 门店单渠道限量
  if (numCompare(minChannelStoreLimit, maxChannelStoreLimit) === 0) {
    if (minChannelStoreLimit === 0) {
      productLimitInfo.channelStoreLimit = ''
    } else {
      productLimitInfo.channelStoreLimit = minChannelStoreLimit + ''
    }
  } else if (numCompare(minChannelStoreLimit, maxChannelStoreLimit) !== 0 && minChannelStoreLimit === 0) {
    productLimitInfo.channelStoreLimit = maxChannelStoreLimit + ''
  } else {
    productLimitInfo.channelStoreLimit = minChannelStoreLimit + '-' + maxChannelStoreLimit
  }
  // 个人单渠道限量
  if (numCompare(minChannelIndividualLimit, maxChannelIndividualLimit) === 0) {
    if (minChannelIndividualLimit === 0) {
      productLimitInfo.channelIndividualLimit = ''
    } else {
      productLimitInfo.channelIndividualLimit = minChannelIndividualLimit + ''
    }
  } else if (numCompare(minChannelIndividualLimit, maxChannelIndividualLimit) !== 0 && minChannelIndividualLimit === 0) {
    productLimitInfo.channelIndividualLimit = maxChannelIndividualLimit + ''
  } else {
    productLimitInfo.channelIndividualLimit = minChannelIndividualLimit + '-' + maxChannelIndividualLimit
  }
  // 订单限量
  if (numCompare(minOrderLimit, maxOrderLImit) === 0) {
    if (minChannelIndividualLimit === 0) {
      productLimitInfo.orderLimit = ''
    } else {
      productLimitInfo.orderLimit = minOrderLimit + ''
    }
  } else if (numCompare(minOrderLimit, maxOrderLImit) !== 0 && minOrderLimit === 0) {
    productLimitInfo.orderLimit = maxOrderLImit + ''
  } else {
    productLimitInfo.orderLimit = minOrderLimit + '-' + maxOrderLImit
  }
  // 销售价
  if (numCompare(minSalePrice, maxSalePrice) === 0) {
    if (minSalePrice === 0) {
      productLimitInfo.salePrice = '0'
    } else {
      productLimitInfo.salePrice = minSalePrice + ''
    }
  } else if (numCompare(minSalePrice, maxSalePrice) !== 0 && minSalePrice === 0) {
    productLimitInfo.salePrice = maxSalePrice + ''
  } else {
    productLimitInfo.salePrice = minSalePrice + '-' + maxSalePrice
  }
  // 赠品数量
  if (numCompare(minGiftNum, maxGiftNum) === 0) {
    if (minGiftNum === 0) {
      productLimitInfo.giftNum = ''
    } else {
      productLimitInfo.giftNum = minGiftNum + ''
    }
  } else if (numCompare(minGiftNum, maxGiftNum) !== 0 && minGiftNum === 0) {
    productLimitInfo.giftNum = maxGiftNum + ''
  } else {
    productLimitInfo.giftNum = minGiftNum + '-' + maxGiftNum
  }
  // 换购价
  if (numCompare(minUpgradeAmount, maxUpgradeAmount) === 0) {
    if (minUpgradeAmount === 0) {
      productLimitInfo.upgradeAmount = ''
    } else {
      productLimitInfo.upgradeAmount = minUpgradeAmount + ''
    }
  } else if (numCompare(minUpgradeAmount, maxUpgradeAmount) !== 0 && minUpgradeAmount === 0) {
    productLimitInfo.upgradeAmount = maxUpgradeAmount + ''
  } else {
    productLimitInfo.upgradeAmount = minUpgradeAmount + '-' + maxUpgradeAmount
  }
  // 预定数量
  if (numCompare(minBookNum, maxBookNum) === 0) {
    if (minBookNum === 0) {
      productLimitInfo.bookNum = 0
    } else {
      productLimitInfo.bookNum = minBookNum + ''
    }
  } else if (numCompare(minBookNum, maxBookNum) !== 0 && minBookNum === 0) {
    productLimitInfo.bookNum = maxBookNum + ''
  } else {
    productLimitInfo.bookNum = minBookNum + '-' + maxBookNum
  }
  // 预售价
  if (numCompare(minPresellTotalPrice, maxPresellTotalPrice) === 0) {
    if (minPresellTotalPrice === 0) {
      productLimitInfo.presellTotalPrice = ''
    } else {
      productLimitInfo.presellTotalPrice = minPresellTotalPrice + ''
    }
  } else if (numCompare(minPresellTotalPrice, maxPresellTotalPrice) !== 0 && minPresellTotalPrice === 0) {
    productLimitInfo.presellTotalPrice = maxPresellTotalPrice + ''
  } else {
    productLimitInfo.presellTotalPrice = minPresellTotalPrice + '-' + maxPresellTotalPrice
  }
  // 定金
  if (numCompare(minPresellDownPrice, maxPresellDownPrice) === 0) {
    if (minPresellDownPrice === 0) {
      productLimitInfo.presellDownPrice = ''
    } else {
      productLimitInfo.presellDownPrice = minPresellDownPrice + ''
    }
  } else if (numCompare(minPresellDownPrice, maxPresellDownPrice) !== 0 && minPresellDownPrice === 0) {
    productLimitInfo.presellDownPrice = maxPresellDownPrice + ''
  } else {
    productLimitInfo.presellDownPrice = minPresellDownPrice + '-' + maxPresellDownPrice
  }
  // 定金折扣金额
  if (numCompare(minPresellOffsetPrice, maxPresellOffsetPrice) === 0) {
    if (minPresellOffsetPrice === 0) {
      productLimitInfo.presellOffsetPrice = ''
    } else {
      productLimitInfo.presellOffsetPrice = minPresellOffsetPrice + ''
    }
  } else if (numCompare(minPresellOffsetPrice, maxPresellOffsetPrice) !== 0 && minPresellOffsetPrice === 0) {
    productLimitInfo.presellOffsetPrice = maxPresellOffsetPrice + ''
  } else {
    productLimitInfo.presellOffsetPrice = minPresellOffsetPrice + '-' + maxPresellOffsetPrice
  }
  data.productLimitInfo = productLimitInfo
}

// 比较参数并返回最大最小值
export function compareAndSetParam(minParam, maxParam, source) {
  if (isEmpty(minParam)) {
    minParam = source
  }
  if (isEmpty(maxParam)) {
    maxParam = source
  }
  if (numCompare(minParam, source) === 1) {
    minParam = source
  } else if (numCompare(maxParam, source) === -1) {
    maxParam = source
  }
  var num = { 'minParam': minParam, 'maxParam': maxParam }
  return num
}

/**
 * 数字比较大小
 * @param num1
 * @param num2
 * @returns {num1<num2 return -1, num1=num2 return 0, num1>num2 return 1}
 */
export function numCompare(num1, num2) {
  if (num1 * 1.0 < num2 * 1.0) {
    return -1
  } else if (num1 * 1.0 === num2 * 1.0) {
    return 0
  } else {
    return 1
  }
}

export function contains(e, list) {
  if (isEmpty(list) || isEmpty(e)) {
    return false
  }
  for (var i = 0; i < list.length; i++) {
    if (e === list[i]) {
      return true
    }
  }
  return false
}

/**
 * 校验京东开始时间
 * @param startTime
 */
export function validateJdStartTime(startTime) {
  var timeDifference = startTime.getTime() - (new Date()).getTime()
  if (timeDifference < 1000 * 60 * 60) {
    return false
  }
  return true
}

export function isRuleRepeat(tempFavourableList) {
  var hash = {}
  for (var i in tempFavourableList) {
    if (hash[tempFavourableList[i].favourableCondition]) {
      return true
    }
    hash[tempFavourableList[i].favourableCondition] = true
  }
  return false
}
// 价格校验（9位整数，两位小数，不为0）
export function validatePrice(str) {
  var pattern = /^(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/
  return pattern.test(str)
}
// 折扣正确性校验（一位整数，一位小数，不为0）
export function validateDiscount(str) {
  var pattern = /^[1-9](\.\d)?$|^0\.[1-9]$/
  return pattern.test(str)
}
// 传入数字*100之后返回
export function multiply100(num) {
  if (num) {
    return (num * 100).toFixed(0)
  } else {
    return num
  }
}
// 传入数字*10之后返回
export function multiply10(num) {
  if (num) {
    return (num * 10).toFixed(0)
  } else {
    return num
  }
}
