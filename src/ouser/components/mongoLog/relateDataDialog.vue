<template>
  <div>
    <ody-dialog
      :visible.sync="visible"
      title="关联数据"
      width="980px"
      @open="init"
      @close="closeDialog"
    >
      <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item" :name="item">
            <div>
              <el-input v-model="dataMap[item]" type="textarea" rows="30"/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer">
        <ody-button v-clipboard:copy="dataMap[activeName]" v-clipboard:success="clipboardSuccess" code="ui" size="small" type="primary" icon="document">
          复制
        </ody-button>
        <ody-button code="ui" size="small" @click="closeDialog">关闭</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    uuid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      activeName: null,
      rowString: null,
      dataMap: {
        action: null,
        detail: null,
        invoke: null,
        model: null,
        operation: null,
        stack: null
      },
      defaultOrder: [
        'action',
        'invoke',
        'operation',
        'detail',
        'model',
        'stack'
      ],
      tabs: []

    }
  },
  mounted() {
    // this.init()
  },
  methods: {
    init() {
      for (const p in this.dataMap) {
        this.dataMap[p] = null
      }
      this.activeName = this.type
      this.initTabsOrder()
      this.query(this.activeName)
    },
    query(type) {
      const mongoLogService = this.$ouser.$api.mongoLogService
      const self = this
      mongoLogService[type]({
        baseQuery: {
          uuid: this.uuid
        }
      }).then(res => {
        const list = res.data || []
        self.dataMap[type] = JSON.stringify(list, null, 4)
      })
    },
    initTabsOrder() {
      this.tabs = [this.type]
      this.defaultOrder.forEach((item, index) => {
        if (this.tabs.indexOf(item) === -1) {
          this.tabs.push(item)
        }
      })
    },
    handleClick(tab, event) {
      if (this.dataMap[this.activeName] === null) {
        this.query(this.activeName)
      }
    },
    closeDialog() {
      this.visible = false
      this.$emit('update:visible', false)
    },
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>
