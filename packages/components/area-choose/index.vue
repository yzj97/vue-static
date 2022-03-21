<template>
  <div class="area-choose">
    <ody-dialog :visible="visible" title="选择区域" width="900px" @close="closeDialog">
      <div slot="content" class="content">
        <div>
          区域：
          <el-checkbox v-model="allchecked" @change="changeAllStatus">全国</el-checkbox>
        </div>
        <div v-for="province in dataList" :key="province.code" :class="['code-' + province.code]">
          <div class="item">
            <div class="left">
              <el-checkbox
                v-model="province.checked"
                :label="province.name"
                :indeterminate="province.isIndeterminate"
                @change="changeStatus(province)"
              />
            </div>
            <div class="right">
              <div v-for="city in province.children" :key="city.code" :class="['right-item', 'code-' + city.code]">
                <el-checkbox
                  v-model="city.checked"
                  :label="city.name"
                  :indeterminate="city.isIndeterminate"
                  class="right-item-checkbox"
                  @change="changeStatus(city)"
                />
                <el-popover
                  v-if="city.children && city.children.length > 0"
                  placement="bottom"
                  width="180"
                  trigger="hover"
                >
                  <div class="citys">
                    <div v-for="area in city.children" :key="area.code" :class="['citys-item', 'code-' + area.code]">
                      <el-checkbox
                        v-model="area.checked"
                        :label="area.name"
                        :indeterminate="area.isIndeterminate"
                        @change="changeStatus(area)"
                      />
                    </div>
                  </div>
                  <div slot="reference" class="city-container">
                    <span>({{ getChoseLength(city.children) }})</span>
                    <i class="el-icon-arrow-down" />
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
        <div v-loading="true" v-if="dataList && dataList.length === 0" class="loading"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <ody-button code="ui" type="primary" @click="sendData">确 定</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
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
    }
  },
  data() {
    return {
      dataList: [],
      allchecked: false
    }
  },
  created() {
    this.listTree()
  },
  mounted() {
  },
  methods: {
    changeAllStatus(value) {
      if (value) {
        this.dataList.map(item => {
          item.checked = true
          this.changeStatus(item)
        })
      } else {
        this.dataList.map(item => {
          item.checked = false
          this.changeStatus(item)
        })
      }
    },
    echoData() {
      if (this.setData.length === 0) {
        return false
      }
      const checkedCodes = this.setData.map(item => +item.districtCode)
      // debugger
      let count = 0
      const checkCityFn = itemData => {
        itemData.map(item => {
          if (!item.children) {
            count = count + 1
          }

          if (checkedCodes.includes(item.code)) {
            item.checked = true
            // 相当于changeStatus
            this.changeDown(item)
            this.loopFn(this.dataList, item)
          }
          item.children && checkCityFn(item.children)
        })
      }
      checkCityFn(this.dataList)
      if (count === checkedCodes.length) {
        this.allchecked = true
      } else {
        this.allchecked = false
      }
    },
    listTree() {
      this.$api.area.listTree({ parentCode: '100000' }).then(res => {
        this.dealData(res.data)
      })
    },
    dealData(list) {
      // 对请求的数据的数据进行初始化
      const checkFn = (itemData, parentCodeList) => {
        itemData.map(item => {
          item.checked = false
          item.isIndeterminate = false
          item.parentCodeList = [...parentCodeList]
          item.children &&
            checkFn(item.children, [...parentCodeList, item.code])
        })
      }
      checkFn(list, [100000]) // 100000 代表请求到中国的地区
      // this.dataList = list
      // console.time('start')
      this.setDataChecked(list) // 回显数据
      // console.timeEnd('start')
    },
    setDataChecked(treeList) {
      if (this.setData.length === 0) {
        this.dataList = treeList
        return false
      }
      const checkedCodes = this.setData.map(item => +item.districtCode)
      const flatData = this.$portal.tree2arr(treeList, 'code', 'children', 'parentCode', 0)

      // console.log('treeList', treeList)

      // 绑定事件
      flatData.forEach(item => {
        const event = new window.Vue()

        item.$event = event

        item.$event.$on('checked', function(val) {
          // 影响自己
          item.checked = val
          item.isIndeterminate = false

          // 影响子
          item.$event.$emit('children-checked', val)

          // 影响父
          item.$event.$emit('parent-checked')
        })

        item.$event.$on('children-checked', function(val) {
          // 影响子
          if (item.children) {
            item.children.forEach(x => {
              x.checked = val
              x.isIndeterminate = false
              x.$event.$emit('children-checked', val)
            })
          }
        })

        item.$event.$on('parent-checked', function() {
          const [parent] = flatData.filter(x => x.code === item.parentCode)

          if (parent) {
            const allChecked = parent.children.every(x => x.checked)
            const hasChecked = parent.children.some(x => x.checked || x.isIndeterminate)

            parent.checked = allChecked
            parent.isIndeterminate = !allChecked && hasChecked

            parent.$event.$emit('parent-checked')
          }
        })
      })

      // 设置原始数据

      const checkedList = flatData.filter(x => checkedCodes.includes(x.code))

      // console.log('checkedList', checkedList)

      checkedList.forEach(x => {
        x.$event.$emit('checked', true)
      })

      // 转换tree

      flatData.forEach(x => delete x.$event)

      const dataList = this.$portal.arr2tree(flatData, 'code', 'children', 'parentCode', 0)

      // console.log('dataList', dataList)

      this.dataList = dataList

      // 设置全国

      const allLast = flatData.filter(x => !x.children)

      this.allchecked = allLast.length === checkedCodes.length

      // console.log('checkedCodes', checkedCodes)
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
        key.children && this.loopFn(key.children, item)
      })
    },
    getFatherItem(item) {
      // 如果到达顶层 则返回
      if (item === this.dataList) {
        let allchecked = true
        const checkAllStatusFn = itemData => {
          for (let index = 0; index < itemData.length; index++) {
            const element = itemData[index]

            if (!element.checked) {
              allchecked = false
              break
            }

            element.children && checkAllStatusFn(element.children)
          }
        }

        checkAllStatusFn(item)
        this.allchecked = allchecked
      }
      const checkFather = itemData => {
        itemData.map(key => {
          if (key.children === item) {
            this.changeUp(key)
            // 再次向上查找 把itemData 给loopFn
            this.loopFn(itemData, key)
            return false
          }
          key.children && checkFather(key.children)
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
          key.children && checkFn(key.children)
        })
      }
      item.children && checkFn(item.children)
    },
    // 向上整理
    changeUp(item) {
      // 如果这个层级中containerCitys中有一个isIndeterminate为true 则它本身的isIndeterminate也为true 就直接可以定性了
      let flag = false
      item.children.map(key => {
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
      item.children.map(key => {
        if (key.checked) {
          count++
        }
      })
      const len = item.children.length
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
      this.$emit('cancel')
    },
    sendData() {
      var arr = []
      const choseCity = itemData => {
        itemData.map(item => {
          if (item.checked && !item.children) {
            item.provinceCode = item.parentCodeList[1]
            item.cityCode = item.parentCodeList[2]
            item.districtCode = item.code
            arr.push(item)
          } else {
            item.children && choseCity(item.children)
          }
        })
      }
      choseCity(this.dataList)
      // debugger
      this.$emit('ok', arr)
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
.area-choose {
  .content {
    .loading {
      height: 50px;
    }
  }
  .item {
    display: flex;
    display: -webkit-flex;
    margin-bottom: 20px;
    .left {
      margin-top: 10px;
      min-width: 136px;
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

