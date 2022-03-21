export default {
  compareArr(arr, compareIndex, mustSmall = false) {
    var compareItem = arr[compareIndex]
    var errorInfo = ''

    arr.every((item, index) => {
      console.log(12)
      if (Number.isNaN(item)) {
        errorInfo = `$${index}必须为正整数`
        return false
      }
      return true
    })
    if (errorInfo) {
      return errorInfo
    }

    // console.log('arr', arr)
    arr.every((item, index) => {
      let rtv = true
      if (!item) {
        return rtv
      }

      if (index < compareIndex) {
        rtv = mustSmall ? item > compareItem : item >= compareItem

        if (!rtv) {
          errorInfo = `$${compareIndex}必须小于${mustSmall ? '' : '等于'}$${index}`
        }
      } else if (index > compareIndex) {
        rtv = mustSmall ? compareItem > item : compareItem >= item

        if (!rtv) {
          errorInfo = `$${compareIndex}必须大于${mustSmall ? '' : '等于'}$${index}`
        }
      }
      return rtv
    })

    return errorInfo
  },
  isEmpty(e) {
    if (e !== 0 && !e) {
      return true
    } else if (e.length === 0) {
      return true
    }
    return false
  },
  // 通过字典获取名称
  getDictionaryText(id, dictionary) {
    for (let i = 0; i < dictionary.length; i++) {
      if (dictionary[i]['id'] === id || dictionary[i]['value'] === id) {
        return dictionary[i]['text'] || dictionary[i]['label']
      }
    }
  },
  setFavourableList(detailData = {}, favourableList = []) {
    if (detailData.promotionType === 2 || detailData.promotionMethod === 16) {
      return favourableList.map((favourableItem) => {
        favourableItem.favourableCondition = favourableItem.favourableCondition * 100
        if (detailData.promotionMethod === 16) {
          favourableItem.favourableContentLimit = favourableItem.favourableContentLimit * 100
        }
        if (detailData.promotionMethod === 2 || detailData.promotionMethod === 16) {
          favourableItem.favourableContent = favourableItem.favourableContent * 10
        } else {
          favourableItem.favourableContent = favourableItem.favourableContent * 100
        }

        return favourableItem
      })
    }

    if (detailData.promotionType === 3 || detailData.promotionMethod === 15) {
      return favourableList.map((favourableItem) => {
        if (detailData.promotionMethod === 15) {
          favourableItem.favourableCondition = favourableItem.favourableCondition * 100
        }
        if (detailData.promotionMethod === 2) {
          favourableItem.favourableContent = favourableItem.favourableContent * 10
        } else {
          favourableItem.favourableContent = favourableItem.favourableContent * 100
        }

        return favourableItem
      })
    }

    if (detailData.promotionType === 10) {
      return favourableList.map((favourableItem) => {
        if (detailData.promotionMethod === 12) {
          favourableItem.favourableContent = favourableItem.favourableContent * 100
        }
        return favourableItem
      })
    }

    if (detailData.promotionType === 9) {
      return favourableList.map((favourableItem) => {
        if (detailData.conditionType === 1) {
          favourableItem.favourableCondition = favourableItem.favourableCondition * 100
        }
        return favourableItem
      })
    }

    return favourableList || []
  },
  getFavourableList(detailData = {}) {
    if (detailData.promotionType === 2 || detailData.promotionMethod === 16) {
      return detailData.favourableList.map((favourableItem) => {
        favourableItem.favourableCondition = favourableItem.favourableCondition / 100
        if (detailData.promotionMethod === 16) {
          favourableItem.favourableContentLimit = favourableItem.favourableContentLimit / 100
        }
        if (detailData.promotionMethod === 2 || detailData.promotionMethod === 16) {
          favourableItem.favourableContent = favourableItem.favourableContent / 10
        } else {
          favourableItem.favourableContent = favourableItem.favourableContent / 100
        }

        return favourableItem
      })
    }

    if (detailData.promotionType === 3 || detailData.promotionMethod === 15) {
      return detailData.favourableList.map((favourableItem) => {
        if (detailData.promotionMethod === 15) {
          favourableItem.favourableCondition = favourableItem.favourableCondition / 100
        }
        if (detailData.promotionMethod === 2) {
          favourableItem.favourableContent = favourableItem.favourableContent / 10
        } else {
          favourableItem.favourableContent = favourableItem.favourableContent / 100
        }

        return favourableItem
      })
    }

    if (detailData.promotionType === 10) {
      return detailData.favourableList.map((favourableItem) => {
        if (detailData.promotionMethod === 12) {
          favourableItem.favourableContent = favourableItem.favourableContent / 100
        }
        return favourableItem
      })
    }

    if (detailData.promotionType === 9) {
      return detailData.favourableList.map((favourableItem) => {
        if (detailData.conditionType === 1) {
          favourableItem.favourableCondition = favourableItem.favourableCondition / 100
        }
        return favourableItem
      })
    }

    return detailData.favourableList || []
  },
  // 金额正确性校验（9位整数，两位小数）
  validateMoney(str) {
    var pattern = /^[1-9]\d{0,8}(\.\d{1,2})?$|^0(\.\d{1,2})?$/
    return pattern.test(str)
  },
  // 折扣正确性校验（一位整数，一位小数，不为0）
  validateDiscount(str) {
    var pattern = /^[1-9](\.\d)?$|^0\.[1-9]$/
    return pattern.test(str)
  },
  // 价格校验（9位整数，两位小数，不为0）
  validatePrice(str) {
    var pattern = /^(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/
    return pattern.test(str)
  },
  // 传入数字*10之后返回
  multiply10(num) {
    if (num) {
      return (num * 10).toFixed(0)
    } else {
      return num
    }
  },
  // 传入数字*100之后返回
  multiply100(num) {
    if (num) {
      return (num * 100).toFixed(0)
    } else {
      return num
    }
  }
}
