<template>
  <div class="cp-pc-preview">
    <!-- {{ h5Iphone.list.length }} -->
    <el-scrollbar ref="scrollbar" wrap-class="menu1-wrap2" style="height:100%">
      <ody-draggable
        :list="h5Iphone.list"
        group="people"
        style="minHeight: 1000px"
        @change="updateMessge"
      >
        <div
          v-for="(item, index) in h5Iphone.list"
          :key="item.code"
          :ref="'active'+index"
          :class="{'active': index === h5Iphone.index, 'has-error': item.hasError}"
          name="handleChangeIndex"
          class="list-group-item"
          @click="handleChangeIndex(index)"
        >
          <component :ref="item.code" :is="'cms-' + changeCase(item.code)" :model="item.model" :item-data="item" :operation="operation" :base-config="baseConfig"/>
        </div>
      </ody-draggable>

    </el-scrollbar>
    <div v-if="btnTop >= 0 && h5Iphone.list.length > 0" :style="{'top': btnTop + 'px'}" class="operation-btn">
      <span name="showEdit" class="set" @click="showEdit"/>
      <span v-if="h5Iphone.index === 0" class="up-disable"/>
      <span v-else name="moveCmsModule" class="up" @click="moveCmsModule(-1)"/>
      <span v-if="h5Iphone.index === h5Iphone.list.length - 1" class="down-disable"/>
      <span v-else name="moveCmsModule5" class="down" @click="moveCmsModule(1)"/>
      <span name="deleteCmsModule" class="delete" @click="deleteCmsModule" />
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import changeCase from 'packages/utils/change-case'
const moduleComponents = {}
const allVue = require.context('@/pc-components', true, /index\.vue$/)

// TODO: 引用pc下的组件，里面组件不用rem，都是用px
allVue.keys().map(key => {
  const match = key.match(/([^/]+)\/index.vue$/)
  if (match && match[1]) {
    moduleComponents['Cms' + changeCase(match[1], 'pascal')] = allVue(key).default
  }
})

// console.log(moduleComponents)
export default {
  components: {
    ...moduleComponents
  },
  props: {
    h5Iphone: {
      type: Object,
      default: () => ({ list: [], index: 0 })
    },
    pageId: {
      type: String,
      default: ''
    },
    pageModel: {
      type: Object,
      default: () => ({ model: {}})
    },
    pageType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnTop: 0,
      cmsApi: this.$cms.$api.cmsEdit,
      operation: { // 传入对于商品 优惠券 的基础操作 比如 请求商品 加入购物车 跳转到详情页面
        getGoodsList: this.getGoodsList,
        getPriceStockList: this.getPriceStockList
      },
      baseConfig: { // 传入对于商品 优惠券 组件的基础config
        isEdit: true,
        isLogin: true
      }
    }
  },
  watch: {
    'h5Iphone.index': {
      handler(val) {
        this.wheel()
      }
    },
    'pageModel.model.bgColor': {
      handler(val) {
        if (val) {
          this.$el.style.background = val
        } else {
          this.$el.style.background = '#ffffff'
        }
      }
    }
  },
  created() {
    eventBus.$on('CmsAddComponent', this.addCmsModuleOn)
    window.addEventListener('scroll', this.wheel, true)
  },
  mounted() {
    document.documentElement.style.fontSize = '100px'
    document.body.style.fontSize = '14px'
  },
  beforeDestroy() {
    eventBus.$off('CmsAddComponent', this.addCmsModuleOn)
    window.removeEventListener('scroll', this.wheel, true)
  },
  methods: {
    async addCmsModuleOn(message) {
      await this.addCmsModule(message)
    },
    async updateMessge(item) {
      if (item.added) {
        const message = item.added.element

        this.h5Iphone.list.splice(item.added.newIndex, 1)
        var index = item.added.newIndex
        if (item.added.newIndex > 0) { // 删除的时候的漏洞
          index = this.h5Iphone.list[index - 1].sortValue + 1
        }
        const res = await this.addCmsModuleAjax(message, index)
        message.sortValue = index
        message.id = res.data
        // 这个是为了让list重新渲染 编辑form可以拿到id
        this.h5Iphone.list = [...this.h5Iphone.list.slice(0, item.added.newIndex), message, ...this.h5Iphone.list.slice(item.added.newIndex)]

        this.h5Iphone.index = item.added.newIndex
        console.log(this.h5Iphone.list, 11111)
      }
      // console.log(item)
    },
    async addCmsModule(message) {
      const index = this.h5Iphone.list.length

      const res = await this.addCmsModuleAjax(message, index)
      message.id = res.data
      message.sortValue = index

      this.h5Iphone.list.push(message)
      this.h5Iphone.index = index
    },
    async addCmsModuleAjax(message, index) {
      const params = {
        pageId: this.pageId,
        name: message.model.customName,
        templateCode: message.code,
        dataType: message.dataType,
        sortValue: index,
        templateVariable: message.model
      }
      if (message.model.use && message.model.use.length > 0) {
        params.startDate = message.model.use[0]
        params.endDate = message.model.use[1]
      }
      const res = await this.cmsApi.addCmsModule(params)
      return res
    },
    async deleteCmsModule() {
      this.$confirm(this.$t('删除后不可恢复，确认要删除吗?'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'info'
      }).then(async() => {
        await this.cmsApi.deleteCmsModule({ id: this.h5Iphone.list[this.h5Iphone.index].id })
        this.h5Iphone.list.splice(this.h5Iphone.index, 1)
        if (this.h5Iphone.index === this.h5Iphone.list.length) {
          this.h5Iphone.index = this.h5Iphone.list.length - 1
        }
      })
    },
    moveCmsModule(step) {
      [this.h5Iphone.list[this.h5Iphone.index + step], this.h5Iphone.list[this.h5Iphone.index]] =
        [this.h5Iphone.list[this.h5Iphone.index], this.h5Iphone.list[this.h5Iphone.index + step]]

      this.h5Iphone.index = this.h5Iphone.index + step
      // this.$forceUpdate()
    },
    wheel() {
      this.$nextTick(() => {
        if (this.h5Iphone.list.length === 0) return
        const scrollTop = this.$refs['scrollbar'].wrap.scrollTop
        const offsetTop = this.$refs['active' + this.h5Iphone.index][0].offsetTop
        this.btnTop = offsetTop - scrollTop
      })
    },
    changeCase(str) {
      return changeCase(str, 'kebab')
    },
    handleChangeIndex(index) {
      this.h5Iphone.index = index
    },
    showEdit() {
      this.$emit('changeEditPageStatus')
    },
    getGoodsList(params) {
      params.pageType = this.pageType
      return this.$cms.$api.cmsEdit.cmsGetModuleData(params)
    },
    getPriceStockList(params) {
      if (+this.pageType === 18) {
        params.pricingMethod = 2
      }
      params.platformId = 2
      return this.$cms.$api.cmsEdit.getPriceStockList(params)
    }
  }
}
</script>

<style lang="less" scoped>
.cp-pc-preview {
  width: 1202px;
  min-height: 1000px;
  margin-right: 66px;
  background-color: #fff;
  position: relative;

  .list-group-item {
    width: 1202px;
    position: relative;
    &.has-error {
      border: 1px solid #EF5351;
    }
    &.active {
      border: 1px solid #1890FF;
    }
  }
  .operation-btn {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    right: -44px;
    z-index: 99;
    background: #ffffff;
    width: 32px;
    height: 148px;
    .span {
      height: 18px;
      width: 18px;
      flex: 1;
      cursor: pointer;
    }
    .set {
      .span;
      background: url('../../img/set.png') no-repeat center center;
      background-size: 100%;
    }
    .up-disable {
      .span;
      background: url('../../img/up-disable.png') no-repeat center center;
      background-size: 100%;
    }
    .up {
      .span;
      background: url('../../img/up.png') no-repeat center center;
      background-size: 100%;
    }
    .down-disable {
      .span;
      background: url('../../img/down-disable.png') no-repeat center center;
      background-size: 100%;
    }
    .down {
      .span;
      background: url('../../img/down.png') no-repeat center center;
      background-size: 100%;
    }
    .delete {
      .span;
      background: url('../../img/delete.png') no-repeat center center;
      background-size: 100%;
    }

  }
}
</style>
