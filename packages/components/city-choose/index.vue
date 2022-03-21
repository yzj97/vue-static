<template>
  <div class="city-choose">
    <ody-dialog :visible="visible" title="选择区域" width="50%" @close="closeDialog">
      <div slot="content" class="content">
        <div v-for="region in dataList" :key="region.code">
          <div class="item">
            <div class="left">
              <el-checkbox
                v-model="region.checked"
                :label="region.region"
                :indeterminate="region.isIndeterminate"
                @change="changeStatus(region)"
              />
            </div>
            <div class="right">
              <div
                v-for="province in region.containerCitys"
                :key="province.code"
                class="right-item"
              >
                <el-checkbox
                  v-model="province.checked"
                  :label="province.region"
                  :indeterminate="province.isIndeterminate"
                  class="right-item-checkbox"
                  @change="changeStatus(province)"
                />
                <el-popover
                  v-if="province.containerCitys.length > 0"
                  placement="bottom"
                  width="180"
                  trigger="click"
                >
                  <div class="citys">
                    <div
                      v-for="city in province.containerCitys"
                      :key="city.code"
                      class="citys-item"
                    >
                      <el-checkbox
                        v-model="city.checked"
                        :label="city.region"
                        :indeterminate="city.isIndeterminate"
                        @change="changeStatus(city)"
                      />
                    </div>
                  </div>
                  <div slot="reference" class="city-container">
                    <span>({{ getChoseLength(province.containerCitys) }})</span>
                    <i class="el-icon-arrow-down" />
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <ody-button code="ui" type="primary" @click="sendData">确 定</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
import data from './mock.js'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    setData: {
      type: Array,
      default: () => {
        return []
      }
    },
    hideDialog: {
      type: Function,
      default: () => {}
    },
    confirm: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      dataList: []
    }
  },
  mounted() {
    console.log('mount')
    this.getDate()
  },
  methods: {
    echoData() {
      if (this.setData.length === 0) {
        return false
      }
      const checkCityFn = itemData => {
        itemData.map(item => {
          if (this.setData.indexOf(item.region) > -1) {
            item.checked = true
            // 相当于changeStatus
            this.changeDown(item)
            this.loopFn(this.dataList, item)
          }
          item.containerCitys && checkCityFn(item.containerCitys)
        })
      }
      checkCityFn(this.dataList)
    },
    getDate() {
      setTimeout(() => {
        this.dealData(data)
      }, 100)
    },
    dealData(list) {
      // 对请求的数据的数据进行初始化
      const checkFn = itemData => {
        itemData.map(item => {
          item.checked = false
          item.isIndeterminate = false
          item.containerCitys && checkFn(item.containerCitys)
        })
      }
      checkFn(list)
      this.dataList = list
      this.echoData() // 回显数据
    },
    changeStatus(item) {
      this.changeDown(item)
      this.loopFn(this.dataList, item)
    },
    // 该循环函数是为了得到 点击所在的数组 知道该数组后 再通过getFatherItem 查出父级 向上监听变化
    loopFn(itemData, item) {
      itemData.map(key => {
        if (key === item) {
          // 找到了点击的父级对应的containerCitys的数组 itemData
          this.getFatherItem(itemData)
          return false
        }
        key.containerCitys && this.loopFn(key.containerCitys, item)
      })
    },
    getFatherItem(item) {
      // 如果到达顶层 则返回
      if (item === this.dataList) return false
      const checkFather = itemData => {
        itemData.map(key => {
          if (key.containerCitys === item) {
            this.changeUp(key)
            // 再次向上查找 把itemData 给loopFn
            this.loopFn(itemData, key)
            return false
          }
          key.containerCitys && checkFather(key.containerCitys)
        })
      }
      checkFather(this.dataList)
    },
    // 向下整理
    changeDown(item) {
      item.isIndeterminate = false
      const checkFn = itemData => {
        itemData.map(key => {
          key.isIndeterminate = false
          if (item.checked === true) {
            key.checked = true
          } else {
            key.checked = false
          }
          key.containerCitys && checkFn(key.containerCitys)
        })
      }
      item.containerCitys && checkFn(item.containerCitys)
    },
    // 向上整理
    changeUp(item) {
      // 如果这个层级中containerCitys中有一个isIndeterminate为true 则它本身的isIndeterminate也为true 就直接可以定性了
      let flag = false
      item.containerCitys.map(key => {
        if (key.isIndeterminate) {
          item.checked = false
          item.isIndeterminate = true
          flag = true
          return false
        }
      })
      // 直接定性 没有走的必要了
      if (flag) {
        return false
      }
      let count = 0
      item.containerCitys.map(key => {
        if (key.checked) {
          count++
        }
      })
      const len = item.containerCitys.length
      if (count === 0) {
        item.checked = false
        item.isIndeterminate = false
      } else if (count !== 0 && count !== len) {
        item.checked = false
        item.isIndeterminate = true
      } else {
        item.checked = true
        item.isIndeterminate = false
      }
    },
    getChoseLength(arr) {
      let count = 0
      arr.map(item => {
        if (item.checked) {
          count++
        }
      })
      return count
    },
    closeDialog() {
      this.$emit('hide-dialog')
    },
    sendData() {
      var arr = []
      const choseCity = itemData => {
        itemData.map(item => {
          // 第一级的不取， 如: 华中 华东
          if (itemData === this.dataList) {
            item.containerCitys && choseCity(item.containerCitys)
            return false
          }
          if (item.checked) {
            arr.push(item.region)
          } else {
            item.containerCitys && choseCity(item.containerCitys)
          }
        })
      }
      choseCity(this.dataList)
      this.$emit('confirm', arr)
    }
  }
}
</script>
<style lang="scss" scoped>
.citys {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  .citys-item {
    margin-bottom: 6px;
  }
}
.city-container {
  display: inline-block;
  cursor: pointer;
}
.city-choose {
  .item {
    display: flex;
    display: -webkit-flex;
    margin-bottom: 20px;
    .left {
      margin-top: 10px;
    }
    .right {
      margin-left: 36px;
      .right-item {
        display: inline-block;
        margin-right: 20px;
        margin-top: 10px;

        &-checkbox {
          margin-right: 0;
        }
      }
    }
  }
}
</style>

