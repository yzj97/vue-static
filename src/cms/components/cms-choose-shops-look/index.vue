<template>
  <div class="cms-choose-shops-look">
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('选择店铺')"
      append-to-body
      width="960px">
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
          <ody-store-choose
            :multiple="true"
            :search-field="['storeCode', 'storeName', 'storeOnlineType', 'merchantId', 'channelCode']"
            :result-field="['storeCode', 'storeName', 'storeOnlineTypeName', 'merchantName', 'channelCodes']"
            name="ids"
            @ok="changeStore"
          />
        </div>
      </div>
      <div class="table-area">
        <ody-table
          ref="table"
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
  </div>
</template>

<script>

export default {
  components: {
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
      ids: [],
      channelsOption: [
        {
          label: '自建B2C',
          value: '110001'
        },
        {
          label: '自建B2B',
          value: '110002'
        },
        {
          label: '自建O2O',
          value: '110003'
        }
      ],
      importModel: {
        visible: false,
        isDownloadLocal: true,
        importApi: ['cms-web', 'cmsModuleData', 'customizeProduct', { pageId: this.pageId, moduleId: this.moduleId }],
        downloadApi: ['excelFile', 'mp-template.xlsx'],
        importLabel: '导入店铺'
      },
      checkedList: [],
      shopsSetVisible: false,
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
            label: '店铺编码',
            prop: 'storeCode',
            show: true
          },
          {
            label: '店铺名称',
            prop: 'storeName',
            show: true
          },
          {
            label: '商家名称',
            prop: 'merchantName',
            show: true
          },
          {
            label: '优先级',
            slot: 'sortValue',
            width: 150,
            show: true
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: '删除',
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
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    openChooseGoods() {
      if (this.goodsType === 0) {
        this.shopsSetVisible = true
      } else if (this.goodsType === 1) {
        this.promotionGoodsSetVisible = true
      }
    },
    query() {
      const params = {
        page: this.currentPage,
        limit: this.pageSize,
        filters: {
          moduleId: this.moduleId
        }
      }
      this.$cms.$api.cmsEdit.cmsModuleStoreList(params).then(res => {
        this.table.list = res.data || []
        this.total = res.total || 0
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
        id: item.id,
        sortValue: item.sortValue
      }
      this.$cms.$api.cmsEdit.cmsModuleStoreUpdate(params).then(res => {
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
        this.$message('请先选择要删除的店铺')
        return
      }
      const ids = this.checkedList.map(item => item.moduleDataId)
      this.$cms.$api.cmsEdit.deleteCmsModuleData(ids).then(res => {
        this.checkedList = []
        this.changeStore()
      })
    },
    deleteItem(item) {
      const id = [item.id]
      this.$cms.$api.cmsEdit.cmsModuleStoreDelete(id).then(res => {
        if (this.table.list.length === 1 && this.currentPage > 1) {
          this.currentPage = this.currentPage - 1
        }
        this.modityGoods()
      })
    },
    async changeStore(val) {
      if (val.length === 0) {
        return
      }

      // 这个接口需要传递整个数据
      val = val.map((x, index) => {
        // 传递数据需要对象转换下，并且删掉channelCodes
        x.channelCode = x.channelCodes[0]

        delete x.channelCodes

        return x
      })
      const params = {
        moduleId: this.moduleId,
        storeList: val,
        pageType: this.pageType
      }
      await this.$cms.$api.cmsEdit.cmsModuleStoreBatchAdd(params)
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
