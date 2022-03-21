<template>
  <div class="cp-components-list">
    <el-scrollbar wrap-class="menu1-wrap2" style="height:100%">
      <div v-for="(val, key, index) in list" :key="index" class="group">
        <div name="val_spread" class="group-name" @click="val.spread = !val.spread">
          <span v-if="!val.spread" class="up"/>
          <span v-if="val.spread" class="down"/>
          <span>{{ val.groupChineseName }}</span>
        </div>
        <div v-if="val.spread">
          <ody-draggable
            :list="val.children"
            :group="{ name: 'people', pull: 'clone', put: false }"
            :clone="hanldeClone"
            class="item-list"
          >
            <div
              v-for="item in val.children"
              :key="item.code"
              name="pushItem"
              class="item"
              @mouseenter="item.hoverFlag = true"
              @mouseleave="item.hoverFlag = false"
              @click="pushItem(item)">
              <div v-if="!item.hoverFlag" class="item-icon">
                <img :src="require(`./img/${item.code}.png`)" width="44">
              </div>
              <div v-else class="item-icon">
                <img :src="require(`./img/${item.code}-active.png`)" width="44">
              </div>
              <div class="component-name">{{ $t(item.name) }}</div>
            </div>
          </ody-draggable>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import componentsList from '@/h5-components/index'
import pcComponentsList from '@/pc-components/index'
const group = {
  common: '通用',
  goods: '商品',
  shops: '店铺',
  market: '营销',
  navigate: '导航'
}

export default {
  props: {
    codeList: {
      type: Object,
      default: () => []
    },
    h5Iphone: {
      type: Object,
      default: () => {}
    },
    pageType: {
      type: String,
      default: ''
    },
    platform: {
      type: Number,
      default: 2 // 1是pc 2是手机
    }
  },
  data() {
    return {
      list: {}
    }
  },
  watch: {
    codeList: {
      handler(val) {
        this.dealList()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    hanldeClone(item) {
      const itemClone = this.$portal.deepClone(item)
      this.changeCustomName(itemClone)
      return itemClone
    },
    changeCustomName(item) {
      if (item.model.hasOwnProperty('use')) {
        const nowDate = new Date()
        item.model.use = [this.$portal.parseTime(nowDate), this.$portal.parseTime(nowDate.setFullYear(nowDate.getFullYear() + 1))]
      }
      if (!item.model.hasOwnProperty('customName')) {
        return
      }
      let maxNum = 1
      this.h5Iphone.list.map(row => {
        if (row.code === item.code && row.model.customName) {
          const num = row.model.customName.split('-')[1]
          if (num && maxNum <= +num) {
            maxNum = +num + 1
          }
        }
      })
      item.model.customName = `${item.name}-${maxNum}`
      // 如果是积分商城首页 页面的首页不显示购买按钮
      this.handleGoodsForType(item)
    },
    handleGoodsForType(item) {
      if (+this.pageType === 18) {
        if (item.model && item.model.hasOwnProperty('displayBuyBtn')) {
          item.model.displayBuyBtn = false
        }
        if (item.fields) {
          const displayBuyBtnIndex = item.fields.findIndex(row => row.prop === 'displayBuyBtn')
          if (displayBuyBtnIndex > -1) {
            item.fields.splice(displayBuyBtnIndex, 1)
          }
          const goodsTypeIndex = item.fields.findIndex(row => row.prop === 'goodsType')
          if (goodsTypeIndex > -1) {
            item.fields.splice(goodsTypeIndex, 1)
          }
          const dataSortRoleIndex = item.fields.findIndex(row => row.prop === 'dataSortRole')
          if (dataSortRoleIndex > -1) {
            item.fields[dataSortRoleIndex].children.push(...[{
              label: this.$t('按积分从高到低'),
              value: 5,
              tag: 'el-option'
            },
            {
              label: this.$t('按积分从低到高'),
              value: 6,
              tag: 'el-option'
            }])
          }
        }
      }
      if (+this.pageType === 8) {
        if (item.fields) {
          const displayBuyBtnIndex = item.fields.findIndex(row => row.prop === 'displayBuyBtn')
          if (displayBuyBtnIndex > -1) {
            item.fields.splice(displayBuyBtnIndex, 1)
          }
          const displayNavIndex = item.fields.findIndex(row => row.prop === 'displayNav')
          if (displayNavIndex > -1) {
            item.fields.splice(displayNavIndex, 1)
          }
          const displayEvaluateIndex = item.fields.findIndex(row => row.prop === 'displayEvaluate')
          if (displayEvaluateIndex > -1) {
            item.fields.splice(displayEvaluateIndex, 1)
          }
        }
      }
    },
    dealList() {
      let comList
      if (this.platform === 1) {
        comList = pcComponentsList
      } else {
        comList = componentsList
      }
      this.list = comList.reduce((obj, item) => {
        if (this.codeList.indexOf(item.code) > -1) {
          item.hoverFlag = false
          if (obj[item.groupName]) {
            obj[item.groupName].children.push(item)
          } else {
            obj[item.groupName] = {
              groupName: item.groupName,
              groupChineseName: group[item.groupName],
              children: [item],
              spread: true
            }
          }
        }
        return obj
      }, {})
    },
    pushItem(item) {
      const itemClone = this.$portal.deepClone(item)
      this.changeCustomName(itemClone)
      eventBus.$emit('CmsAddComponent', itemClone)
    }
  }
}
</script>

<style lang="less" scoped>
.cp-components-list {
  width: 200px;
  height: 900px;
  background-color: #fff;
  border-left: 1px solid #E6E6E6;
  border-right: 1px solid #E6E6E6;
  .group {
    border-bottom: 1px solid #EEF5F9;
  }
  .group-name{
    font-size: 14px;
    color: #333;
    padding-left: 12px;
    height: 38px;
    line-height: 38px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .up {
      display: inline-block;
      height: 16px;
      width: 16px;
      background: url('./img/up.png') no-repeat center center;
      background-size: 100%;
      margin-right: 9px;
    }
    .down {
      display: inline-block;
      height: 16px;
      width: 16px;
      background: url('./img/down.png') no-repeat center center;
      background-size: 100%;
      margin-right: 9px;
    }
  }
  .item-list {
    display: flex;
    flex-wrap: wrap;
    .item {
      &:hover{
        background-color: rgba(24,144,255,0.1);
      }
      cursor: pointer;
      width: 80px;
      height: 80px;
      text-align: center;
      margin: 9px;
      .component-name {
        color: #333;
        font-size: 14px;
      }
    }
  }
}
</style>
