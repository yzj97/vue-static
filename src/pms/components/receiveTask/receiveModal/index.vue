<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('收货')"
      width="960px"
      @open="init"
      @change-max-height="handleMaxHeight">
      <section class="pg-productModal-list">
        <el-form>
          <el-row>
            <el-col :span="8" style="margin-bottom:10px;">
              <span >{{ $t('收货任务单号') }}：</span><span class="f14">{{ receiveDetail.receiveCode }}</span>
            </el-col>
            <el-col :span="8" style="margin-bottom:10px;">
              <span class="detail" >{{ $t('商家') }}：</span><span class="f14">{{ receiveDetail.merchantName }}</span>
            </el-col>
            <el-col :span="8" style="margin-bottom:10px;">
              <span class="detail" >{{ $t('供应商') }}：</span><span class="f14">{{ receiveDetail.supplierName }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="17" style="margin-bottom:10px;">
              <span style="font-weight: bold;font-size: 18px" >{{ $t('备注') }}：</span>
              <el-input v-model="formData.remark" name="receive_remark" maxlength="100" show-word-limit/>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item :label="$t('附件')">
              <!-- 附件 -->
              <ody-upload-doc
                v-model="fileList"
                :doc-type="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png']"
                @change="changeFiles"
              >
                <template name="tip">
                  todo
                </template>
              </ody-upload-doc>
            </el-form-item>
          </el-row>
          <ody-list-table-area style="margin-top: -60px;">
            <div slot="table">
              <el-table
                v-loading="loading"
                :data="list"
                :max-height="tableMaxHeight"
                name="formData_productList190"
                style="width: 100%">
                <el-table-column
                  :label="$t('商品编码')"
                  prop="productCode"
                  align="center"
                  min-width="150"/>
                <el-table-column
                  :label="$t('商品名称')"
                  prop="productCname"
                  align="center"
                  min-width="150"/>
                <el-table-column
                  :label="$t('条码')"
                  prop="productBarCode"
                  align="center"
                  min-width="150"/>
                <el-table-column
                  :label="$t('SPU编码')"
                  prop="productSpuCode"
                  align="center"
                  min-width="150"/>
                <el-table-column
                  :label="$t('货号')"
                  prop="productArtNo"
                  align="center"
                  min-width="150"/>
                <el-table-column
                  :label="this.$t('规格属性')"
                  prop="productAttribute"
                  align="center"
                  min-width="120"/>
                <el-table-column
                  :label="$t('计量单位')"
                  prop="productUnit"
                  align="center"
                  min-width="100"/>
                <el-table-column
                  :label="$t('收货任务总量')"
                  prop="productItemNum"
                  align="center"
                  min-width="100"/>
                <el-table-column
                  :label="$t('待收货数量')"
                  prop="unReceiveNum"
                  align="center"
                  min-width="100"/>
                <el-table-column
                  :label="$t('本次收货数量')"
                  align="center"
                  min-width="140">
                  <template slot-scope="scope">
                    <div v-if="scope.row.batchStrategyId != null" class="batch_but_div">
                      <ody-product-batch-receive-drawer :product="scope.row" />
                    </div>
                    <div v-else>
                      <ody-input-number
                        v-model="scope.row.realReceiveNum"
                        :step="1"
                        :step-strictly="true"
                        :min="1"
                        :max="scope.row.unReceiveNum"
                        name="scope_row_productItemNum"
                        size="small"
                        controls-position="right"
                        style="width: 120px;"
                      />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="this.$t('备注')"
                  align="center"
                  min-width="120"
                  max-width="120">
                  <template slot-scope="scope">
                    <div>
                      <el-link name="showEditRemark" @click="showEditRemark(scope.row)">
                        {{ scope.row.remark }}
                        <i class="el-icon-edit-outline" />
                      </el-link>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </ody-list-table-area>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <ody-button :disabled="submiting" name="handleClose" size="small" type="primary" code="ui" @click="handleReceiveOperation">{{ $t('确认收货') }}</ody-button>
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
      </span>
    </ody-dialog>
    <!-- 修改备注模态框 -->
    <EditRemark :visible.sync="showEditRemarkModal" :product.sync="selectedProduct" @ok="refreshTable" />
  </div>
</template>
<script>
import EditRemark from '@/components/receiveTask/editRemark'
export default {
  components: {
    EditRemark
  },
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
      dialogMaxHeight: 0,
      tableMaxHeight: 0,
      searchForm: {},
      fileList: [],
      loading: false,
      list: [],
      submiting: false,
      showEditRemarkModal: false,
      selectedProduct: { },
      formData: {
        receiveCode: null,
        remark: null,
        receiveRecordItemList: [],
        receiveAttachmentList: []
      }
    }
  },
  computed: {
  },
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
      self.list = []
      self.formData.remark = ''
      self.fileList = []
      this.searchForm.filters = { receiveCode: this.receiveCode }
      this.$pms.$api.receiveTask.receiveItemListPage(this.searchForm).then(res => {
        res.data.forEach(x => {
          if (x.receiveNum === null) {
            x.receiveNum = 0
          }
          x.unReceiveNum = x.productItemNum - x.receiveNum
          // 批次组件的receiveNum是本次收货数量（接口返回的receiveNum是已收货数量）
          x.receiveNum = 0
          x.remark = ''
          if (x.unReceiveNum !== 0) {
            self.list.push(x)
          }
        })
      })
    },
    init() {
      this.query()
    },
    async handleClose() {
      const confirm = await this.$confirm(
        this.$t('取消会导致录入的页面信息丢失，确认取消') + '？',
        this.$t('common_prompt')
      )
      if (confirm) {
        this.$emit('update:visible', !this.visible)
      }
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
      vue.formData.receiveRecordItemList = []
      // vue.formData.receiveAttachmentList = []
      vue.formData.receiveCode = vue.receiveDetail.receiveCode
      var booleanAdd = true
      vue.list.forEach(item => {
        const recordItem = {}
        recordItem.receiveTaskItemId = item.id
        if (item.realReceiveNum) {
          recordItem.receiveNum = item.realReceiveNum
          recordItem.remark = item.remark
          vue.formData.receiveRecordItemList.push(recordItem)
        }
        if (item.batchInfo && item.receiveNum > 0) {
          recordItem.batchInfo = item.batchInfo.map(x => {
            return {
              receiveNum: x.receiveNum,
              batchAttrs: JSON.stringify(x.batchAttrs)
            }
          })
          vue.formData.receiveRecordItemList.push(recordItem)
        }
      })
      if (vue.formData.receiveRecordItemList.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请至少设置一行填写收货数量')
        })
        booleanAdd = false
        this.submiting = false
      }
      if (booleanAdd === true) {
        console.log('提交对象:' + JSON.stringify(vue.formData))
        vue.$pms.$api.receiveTask.confirmReceive(vue.formData).then((result) => {
          if (result.code === '0') {
            this.$emit('update:visible', !this.visible)
            this.$message({
              type: 'success',
              message: this.$t('收货成功')
            })
            if (vue.receiveType !== 2) {
              vue.$router.push({
                name: 'ReceiveTaskList',
                params: {
                  menuName: 'ReceiveTaskList'
                }
              })
              this.$emit('ok')
              // vue.$portal.delViewByName('ReceiveTaskList')
            } else {
              vue.$portal.delViewByName('ReceiveTaskList')
            }
          } else {
            console.log('error')
          }
        }).finally(() => {
          this.submiting = false
        })
      }
    }
  }
}

</script>

<style lang="less" scoped>
  .pg-productModal-list{
    .cp-search-item{
      width: 33.33333%;
    }
  }
</style>
