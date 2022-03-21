<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('提示')"
      width="450px"
      @change-max-height="handleMaxHeight"
      @open="init"
      @ok="refreshTable">
      <section class="pg-productModal-list">
        <el-form>
          <el-row>
            <el-col :span="17" style="margin-bottom:10px;">
              <span>{{ $t('确认一键完成收货？') }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="17" style="margin-bottom:10px;">
              <div style="margin-top: 10px">
                <span>{{ $t('备注') }}：</span>
              </div>
              <div style="margin-left: 50px;margin-top: -18px">
                <el-input
                  v-model="textarea"
                  type="textarea"
                  placeholder="请输入备注"
                  rows = "3"
                  maxlength="100"
                  show-word-limit

                />
              </div>
            </el-col>
          </el-row>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <ody-button
          :disabled="submiting"
          name="handleClose"
          size="small"
          type="primary"
          code="ui"
          @click="handleReceiveOperation"
        >{{ $t('确认') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    receiveCode: {
      type: String,
      default: null
    },
    receiveType: {
      type: String,
      default: null
    },
    receiveDetail: {
      type: Object,
      default: function() {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      textarea: '',
      dialogMaxHeight: 0,
      tableMaxHeight: 0,
      searchForm: {},
      fileList: [],
      loading: false,
      list: [],
      submiting: false,
      showEditRemarkModal: false,
      selectedProduct: {},
      formData: {
        receiveCode: null,
        remark: null
      }
    }
  },
  computed: {},
  async mounted() {

  },
  methods: {
    handleMaxHeight(maxHeight) {
      this.dialogMaxHeight = maxHeight

      if (maxHeight === 0) {
        this.tableMaxHeight = 1000
        return false
      }

      const dialogHeight = 48
      const dialogPaddingTop = 24
      const dialogTitleHeight = 200
      const dialogPaddingBottom = 12
      const tableMaxHeight =
        maxHeight -
        dialogHeight -
        dialogPaddingTop -
        dialogTitleHeight -
        dialogPaddingBottom -
        90
      // console.log(111)
      this.tableMaxHeight = tableMaxHeight
    },
    showEditRemark(item) {
      this.selectedProduct = item
      this.showEditRemarkModal = true
    },
    refreshTable() {
      const index = this.list.indexOf(this.selectedProduct)
      // 刷新视图
      this.$set(this.list, index, this.selectedProduct)
    },
    async query() {
      const self = this
      self.receiveDetail.remark = ''
      this.searchForm.filters = { receiveCode: this.receiveCode }
      console.log('有进来')
      this.$pms.$api.receiveTask.receiveItemListPage(this.searchForm).then(res => {
        self.list = res.data
        console.log(self.list)
        // self.list.forEach(l => {
        //   if (l.receiveNum === null) {
        //     l.receiveNum = 0
        //   }
        //   l.unReceiveNum = l.productItemNum - l.receiveNum
        //   // 批次组件的receiveNum是本次收货数量（接口返回的receiveNum是已收货数量）
        //   l.receiveNum = 0
        //   l.remark = ''
        // })
      })
    },
    async handleClose() {
      // const confirm = await this.$confirm(
      //   this.$t('取消会导致录入的页面信息丢失，确认取消') + '？',
      //   this.$t('common_prompt')
      // )
      // if (confirm) {
      this.$emit('update:visible', !this.visible)
      const vue = this
      vue.textarea = ''
      // }
    },
    handleOk(item, operationType, isInit) {
      // this.$emit('ok', item, operationType, isInit)
    },
    changeFiles() {
      if (this.fileList) {
        this.formData.receiveAttachmentList = []
        this.fileList.forEach(item => {
          const fileItem = {}
          fileItem.refCode = this.receiveDetail.receiveCode
          fileItem.refType = 2
          fileItem.name = item.name
          fileItem.path = item.url
          this.formData.receiveAttachmentList.push(fileItem)
        })
      }
    },
    handleReceiveOperation() {
      this.submiting = true
      const vue = this
      vue.formData.receiveCode = this.receiveCode
      vue.formData.remark = this.textarea
      // console.log('提交对象:' + JSON.stringify(vue.formData))
      // JSON.stringify(vue.formData)
      vue.$pms.$api.receiveTask.oneKeyAddReceive(vue.formData).then((result) => {
        if (result && result.code === '0') {
          // this.query()
          this.$message({
            type: 'success',
            message: this.$t('一键收货成功')
          })
          // this.$emit('ok')
          // vue.$portal.delViewByName('ReceiveTaskList')
          // if (vue.receiveType !== 2) {
          vue.$router.push({
            name: 'ReceiveTaskList',
            params: {
              menuName: 'ReceiveTaskList'
            }
          })
          this.$emit('ok')
          // vue.$portal.delViewByName('ReceiveTaskList')
          // } else {
          //   vue.$portal.delViewByName('ReceiveTaskList')
          // }
        } else {
          console.log('error')
        }

        // this.query()
      }).finally(() => {
        this.submiting = false
        this.$emit('update:visible', !this.visible)
        vue.textarea = ''
      })
    }
  }
}

</script>

<style lang="less" scoped>
.pg-productModal-list {
  .cp-search-item {
    width: 33.33333%;
  }
}
</style>
