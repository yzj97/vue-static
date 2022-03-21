<template>
  <div class="cms-choose-goods-look">
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('选择商品')"
      append-to-body
      width="960px"
      @change-max-height="handleMaxHeight">
      <div v-if="promotionInfo.promotionId" class="promotion-info">
        <el-row type="flex" >
          <el-col :span="3"><div class="lable-name">促销id:</div></el-col>
          <el-col :span="12"><div>{{ promotionInfo.promotionId }}</div></el-col>
        </el-row>
        <el-row type="flex" >
          <el-col :span="3"><div class="lable-name">促销时间:</div></el-col>
          <el-col :span="12"><div>{{ promotionInfo.startTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }} - {{ promotionInfo.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div></el-col>
        </el-row>
        <el-row type="flex" >
          <el-col :span="3"><div class="lable-name">活动名称:</div></el-col>
          <el-col :span="12"><div>{{ promotionInfo.themeName }} </div></el-col>
        </el-row>
        <el-row type="flex" >
          <el-col :span="3"><div class="lable-name">活动商家:</div></el-col>
          <el-col :span="12"><div>{{ promotionInfo.merchantNameList.join(',') }} </div></el-col>
        </el-row>
        <el-row type="flex" >
          <el-col :span="3"><div class="lable-name">活动类型:</div></el-col>
          <el-col :span="12"><div>{{ promotionInfo.promotionType }} </div></el-col>
        </el-row>
        <el-row type="flex" >
          <el-col :span="3"><div class="lable-name">活动平台:</div></el-col>
          <el-col :span="12"><div>{{ promotionInfo.promPlatform }} </div></el-col>
        </el-row>
      </div>
      <div class="btn-list">
        <div class="item-btn">
          <el-button
            name="openChooseGoods"
            size="mini"
            type="primary"
            @click="openChooseGoods">
            {{ goodsType === 0 ? '添加商品': '添加促销' }}
          </el-button>
          <el-button
            name="batchDeleteGoods"
            size="mini"
            @click="batchDeleteGoods"
          >
            批量删除商品
          </el-button>
          <ody-batch-import-button
            v-if="goodsType === 0&&formData.code!=='rank-landing-page'"
            :import-api="importModel.importApi"
            :import-label="importModel.importlabel"
            :download-local-file="importModel.downloadLocalFile"
            name="exportGoods"
            @ok="changeGoods"
          >
            批量导入商品
          </ody-batch-import-button>
          <ody-batch-import-button
            v-if="goodsType === 0&&formData.code==='rank-landing-page'"
            :import-api="importModelRank.importApi"
            :import-label="importModelRank.importlabel"
            :download-local-file="importModelRank.downloadLocalFile"
            name="exportGoods"
            @ok="changeGoods"
          >
            批量导入商品
          </ody-batch-import-button>
        </div>
      </div>
      <div class="table-area">
        <ody-table
          ref="table"
          :max-height="tableMaxHeight"
          :data="table.list"
          :columns="table.columns"
          :operates="table.operates"
          :multiple="true"
          :checked.sync="checkedList"
          name="table_list894"
        >
          <template slot="sortValue" slot-scope="scope">
            <el-input-number v-model="scope.row.sortValue" :min="1" name="scope_row_sortValue" size="small" @change="updateSort(scope.row)" />
          </template>
        </ody-table>
        <div class="block pagination-border-component">
          <ody-pagination
            :current-page="currentPage"
            :list="table.list"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>

      </div>
      <span slot="footer">
        <el-button name="handleClose" size="small" @click="handleClose">关 闭</el-button>
      </span>
    </ody-dialog>
    <cms-choose-goods-set
      v-if="goodsSetVisible"
      :channels-option="channelsOption"
      :module-id="moduleId"
      :page-type="pageType"
      :visible.sync="goodsSetVisible"
      :code="formData.code"
      @ok="changeGoods"/>
    <cms-choose-goods-set-promotion
      v-if="promotionGoodsSetVisible"
      :channels-option="channelsOption"
      :promotion-info="promotionInfo"
      :module-id="moduleId"
      :visible.sync="promotionGoodsSetVisible"
      @ok="changeGoods"/>
    <cms-choose-goods-property
      v-if="goodsPropertyVisible"
      :item-info="itemInfo"
      :module-id="moduleId"
      :visible.sync="goodsPropertyVisible"
      @ok="modityGoods"/>
  </div>
</template>

<script>
import CmsChooseGoodsSet from '@/components/cms-choose-goods-set'
import CmsChooseGoodsProperty from '@/components/cms-choose-goods-property'
import CmsChooseGoodsSetPromotion from '@/components/cms-choose-goods-set-promotion'
// console.log(require('@/excelFile/mp-template.xlsx'))
export default {
  components: {
    CmsChooseGoodsSet,
    CmsChooseGoodsSetPromotion,
    CmsChooseGoodsProperty
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    moduleId: {
      type: String,
      default: ''
    },
    goodsType: {
      type: Number,
      default: 0
    },
    formData: {
      type: Object,
      default: () => {}
    },
    pageId: {
      type: String,
      default: ''
    },
    pageType: {
      type: String,
      default: ''
    },
    pageModel: {
      type: String,
      default: () => {}
    }

  },
  data() {
    return {
      tableMaxHeight: 0, // 表格缩小后的高度
      channelsOption: [
        {
          label: this.$t('自建BBC'),
          value: '110001'
        },
        {
          label: this.$t('自建B2B'),
          value: '110002'
        },
        {
          label: this.$t('自建O2O'),
          value: '110003'
        }
      ],
      importModel: {
        visible: false,
        importApi: ['cms-web', 'cmsModuleData', 'customizeProduct', { pageId: this.pageId, moduleId: this.moduleId }],
        downloadLocalFile: [require('@/excelFile/mp-template.xlsx')],
        importLabel: this.$t('导入商品')
      },
      importModelRank: {
        visible: false,
        importApi: ['cms-web', 'cmsModuleData', 'customizeRankProduct', { pageId: this.pageId, moduleId: this.moduleId }],
        downloadLocalFile: [require('@/excelFile/mp-rank-template.xlsx')],
        importLabel: this.$t('导入商品')
      },
      checkedList: [],
      goodsSetVisible: false,
      promotionGoodsSetVisible: false,
      goodsPropertyVisible: false,
      itemInfo: {},
      promotionInfo: {},
      currentPage: 1,
      pageSize: 10,
      total: 0,
      table: {
        list: [],
        columns: [
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            show: true
          },
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            show: true
          },
          {
            label: this.$t('商品分类'),
            prop: 'categoryName',
            show: true
          },
          {
            label: this.$t('优先级'),
            slot: 'sortValue',
            minWidth: 180,
            show: true
          },
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            show: true
          },
          {
            label: this.$t('渠道'),
            prop: 'channel',
            show: true
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              method: (index, row) => {
                this.editItem(row)
              },
              code: 'ui'
            },
            {
              label: this.$t('删除'),
              method: (index, row) => {
                this.deleteItem(row)
              },
              code: 'ui'
            }
          ]
        }
      }
    }
  },
  mounted() {
    this.init()
    this.dealChannels()
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
      const dialogTitleHeight = 50
      const dialogPaddingBottom = 12
      const tableMaxHeight =
        maxHeight -
        dialogHeight -
        dialogPaddingTop -
        dialogTitleHeight -
        dialogPaddingBottom -
        100

      this.tableMaxHeight = tableMaxHeight
    },
    dealChannels() {
      if (this.pageModel.model && this.pageModel.model.channelCodeList && this.pageModel.model.channelCodeList.length > 0) {
        for (let i = 0; i < this.channelsOption.length; i++) {
          const index = this.pageModel.model.channelCodeList.findIndex(item => +item === +this.channelsOption[i].value)
          if (index === -1) {
            this.channelsOption.splice(i, 1)
            i--
          }
        }
      }
    },
    init() {
      this.currentPage = 1
      this.query()
      if (this.goodsType === 1) {
        this.queryModulePromotion()
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    openChooseGoods() {
      if (this.goodsType === 0) {
        this.goodsSetVisible = true
      } else if (this.goodsType === 1) {
        this.promotionGoodsSetVisible = true
      }
    },
    queryModulePromotion() {
      const params = {
        moduleId: this.moduleId
      }
      this.$cms.$api.cmsEdit.queryModulePromotion(params).then(res => {
        if (res.data) {
          this.promotionInfo = res.data[0] || {}
        }
      })
    },
    query() {
      const params = {
        moduleId: this.moduleId,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        pageType: this.pageType
      }
      this.$cms.$api.cmsEdit.cmsGetModuleData(params).then(res => {
        this.table.list = res.data.listObj || []
        this.total = res.data.total || 0
        this.$emit('setCount')
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.query()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.query()
    },
    updateSort(item) {
      const params = {
        id: item.moduleDataId,
        moduleId: this.moduleId,
        mpId: item.mpId,
        mpCode: item.mpCode,
        merchantId: item.merchantId,
        sortValue: item.sortValue
      }
      this.$cms.$api.cmsEdit.updateCmsModuleData(params).then(res => {
        this.query()
        this.formData.model.dataChange += 1
      })
    },
    editItem(item) {
      this.itemInfo = item
      this.goodsPropertyVisible = true
    },
    batchDeleteGoods() {
      if (this.checkedList.length === 0) {
        this.$message('请先选择要删除的商品')
        return
      }
      const ids = this.checkedList.map(item => item.moduleDataId)
      this.$cms.$api.cmsEdit.deleteCmsModuleData(ids).then(res => {
        this.checkedList = []
        this.changeGoods()
      })
    },
    deleteItem(item) {
      const id = [item.moduleDataId]
      this.$cms.$api.cmsEdit.deleteCmsModuleData(id).then(res => {
        if (this.table.list.length === 1 && this.currentPage > 1) {
          this.currentPage = this.currentPage - 1
        }
        this.modityGoods()
      })
    },
    changeGoods() {
      this.formData.model.dataChange += 1
      this.init()
    },
    modityGoods() {
      this.formData.model.dataChange += 1
      this.query()
    }
  }
}
</script>

<style lang="less" scoped>
.btn-list {
  display: flex;
}
.table-area {
  margin-top: 10px;
}
.promotion-info{
  .lable-name{
    text-align: right;
    margin-right: 20px;
  }
}

</style>
<style>
  .el-upload-list__item-name{
    max-width:180px;
  }
</style>
