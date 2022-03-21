<template>
  <div>
    <ody-dialog
      :visible.sync="visible"
      title="数据详情"
      width="980px"
      @open="init"
      @close="closeDialog"
    >
      <div>
        <el-input v-model="rowString" type="textarea" rows="30"/>
      </div>
      <span slot="footer">
        <ody-button v-clipboard:copy="rowString" v-clipboard:success="clipboardSuccess" code="ui" size="small" type="primary" icon="document">
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
    rowData: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rowString: null

    }
  },
  mounted() {
    // this.init()
  },
  methods: {
    init() {
      if (this.rowData) {
        this.rowString = JSON.stringify(this.rowData, null, 4)
      } else {
        this.rowString = null
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
