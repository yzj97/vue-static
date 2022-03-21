<template>
  <div class="bg-promotion-single-set-product">
    <div class="activity-merchant">
      <div>
        <ody-tip-star :content="$t('设置活动商品')" />
        <el-button
          name="goodsVisible"
          size="small"
          type="primary"
          @click="goodsVisible = true"
        >{{ append ? $t('添加追加商品'):$t('添加活动商品') }}</el-button>
        <el-button
          v-if="selectFlag === '2'"
          name="reAddPromotionScope"
          size="small"
          class="batch-delete"
          @click="reAddPromotionScope(checkedMutexProductList)"
        >{{ $t('批量重新添加') }}</el-button>
        <el-button
          v-if="selectFlag === '1'"
          name="deleteSelectionProduct"
          size="small"
          class="batch-delete"
          @click="deleteSelectionProduct(checkedProductList)"
        >{{ $t('批量删除') }}</el-button>
        <el-button
          v-if="selectFlag === '1'"
          name="handleShowSearch"
          size="small"
          class="batch-delete"
          @click="handleShowSearch"
        >{{ $t('搜索') }}</el-button>
      </div>

      <div class="search-wrap">
        <el-button
          name="importVisible"
          size="small"
          plain
          @click="importVisible = true"
        >{{ $t('批量导入') }}</el-button>
      </div>
    </div>

    <ody-list-search-area v-show="searchShow && selectFlag === '1'">
      <div slot="content">
        <el-form ref="mpSearch" :model="mpSearch" label-width="100px" class="form">
          <ody-search-item :label="$t('商家')" prop="obj.merchantId" name="obj.merchantId">
            <promotion-merchant-select
              v-model="mpSearch.obj.merchantId"
              :search=" {
                merchantType: merchantType,
                promotionId: promotionId } "
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码')" prop="obj.mpCode" name="obj.mpCode">
            <el-input v-model="mpSearch.obj.mpCode" name="mpSearch_obj_mpCode" />
          </ody-search-item>
          <ody-search-item :label="$t('商品名称')" prop="obj.mpName" name="obj.mpName">
            <el-input v-model="mpSearch.obj.mpName" name="mpSearch_obj_mpName" />
          </ody-search-item>
          <ody-search-item :label="$t('商品条码')" prop="obj.barcode" name="obj.barcode">
            <el-input v-model="mpSearch.obj.barcode" name="mpSearch_obj_barcode" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <el-button name="ui" code="ui" size="small" type="primary" @click.prevent="query('effect')">{{ $t('查询') }}</el-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="selectFlag" name="selectFlag" @tab-click="handleTabChange">
          <el-tab-pane :label="`${$t('生效商品')}(${mpTableListTotal})`" name="1">
            <div>
              <ody-table
                ref="mpTable"
                :columns="mpTable.columns"
                :operates="mpTable.operates"
                :multiple="true"
                :default-expand-all="false"
                :request-url="mpTable.requestUrl"
                :is-tree="true"
                :tree-props="treeProps"
                :can-filter="false"
                :load="loadChildren"
                :selectable="selectable"
                :response="mpTableResponse"
                row-key="id"
                @getTableList="getMpTableList"
                @getTableListTotal="getMpTableListTotal"
                @selection-change="handleSelectionChange"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane :label="`${$t('互斥商品')}(${mutexTableListTotal})`" name="2">
            <div>
              <ody-table
                ref="mutexTable"
                :columns="mutexTable.columns"
                :operates="mutexTable.operates"
                :multiple="true"
                :default-expand-all="false"
                :request-url="mutexTable.requestUrl"
                :is-tree="true"
                :tree-props="treeProps"
                :load="loadChildren"
                :can-filter="false"
                :selectable="selectableMutex"
                :response="mutexTableResponse"
                row-key="id"
                @getTableListTotal="getMutexTableListTotal"
                @selection-change="handleMutexSelectionChange"
              >
                <template slot="exclusiveRecordingTime" slot-scope="scope">
                  <span
                    v-if="!!scope.row.exclusiveRecordingTime"
                  >{{ scope.row.exclusiveRecordingTime | parseTime }}</span>
                </template>
              </ody-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </ody-list-table-area>

    <promotion-batch-import-product-model
      :visible.sync="importVisible"
      :activity-id="promotionId"
      :prom-type="promType"
      @close="handleImportClose"
    />

    <promotion-goods-dialog-choose
      v-if="goodsVisible"
      :visible.sync="goodsVisible"
      :multiple="true"
      :prom-type="promType"
      :params="searchParams"
      choose-key="mpId"
      @ok="ok"
    />
    <promotion-mutex-goods-look
      v-if="visibleMutex"
      :scope-id="scopeItemId"
      :prom-type="promType"
      :visible.sync="visibleMutex"
    />
  </div>
</template>

<script>
import PromotionMerchantSelect from '@/components/promotion-merchant-select'
import PromotionBatchImportProductModel from '@/components/promotion-batch-import-product-model'
import PromotionGoodsDialogChoose from '@/components/promotion-goods-dialog-choose'
import PromotionMutexGoodsLook from '@/components/promotion-mutex-goods-look'

export default {
  components: {
    PromotionMerchantSelect,
    PromotionBatchImportProductModel,
    PromotionGoodsDialogChoose,
    PromotionMutexGoodsLook
  },
  props: {
    append: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    selected: {
      type: Object,
      default: () => {}
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'text'
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    },
    promType: {
      type: String,
      default: ''
    },
    promotionId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scopeItemId: '',
      visibleMutex: false,
      useAppendList: [],
      isAppend: false,
      mutexTableListTotal: '',
      mpTableListTotal: '',
      searchParams: {
        merchantType: '',
        promType: this.promType,
        promotionId: this.promotionId,
        searchType: 1,
        sellType: 1,
        storeIds: [],
        categoryType: '1',
        brandType: '1',
        brandIds: [],
        categoryIds: []
      },
      goodsSelected: [],
      goodsVisible: false,
      batchEdit: false,
      importVisible: false,
      searchShow: false,
      selectFlag: '1',
      treeProps: {
        rootVal: '0',
        parentKey: 'parentId',
        hasChildren: 'hasChildren',
        children: 'childMpList'
      },
      mpSearch: {
        obj: {
          merchantId: '',
          mpCode: '',
          mpName: '',
          barcode: '',
          activityId: this.promotionId,
          isMutexList: [0]
        }
      },
      mpTable: {
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商品条码'),
            prop: 'barcode',
            minWidth: 120, show: true
          },
          {
            label: this.$t('计量单位'),
            prop: 'mainUnitName',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            minWidth: 120, show: true
          },
          {
            label: this.$t('零售价（元）'),
            prop: 'salePrice',
            minWidth: 120, show: true
          }
        ],
        operates: {
          width: 80,
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              method: (index, row) => {
                this.deleteSelectionProduct([row])
              },
              disabled: (index, row) => {
                return this.append && row.isAvailable === 1
              },
              code: 'button024'
            }
          ]
        },
        data: [],
        requestUrl:
          '/back-promotion-web/promotionActivityRead/querySelectionProductList.do'
      },
      mutexSearch: {
        obj: {
          merchantId: '',
          mpCode: '',
          mpName: '',
          barcode: '',
          activityId: this.promotionId,
          isMutexList: [-1]
        }
      },
      mutexTable: {
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            minWidth: 250, show: true
          },
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            minWidth: 200, show: true
          },
          {
            label: this.$t('商品条码'),
            prop: 'barcode',
            minWidth: 120, show: true
          },
          {
            label: this.$t('计量单位'),
            prop: 'mainUnitName',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            minWidth: 120, show: true
          },
          {
            label: this.$t('互斥记录时间'),
            slot: 'exclusiveRecordingTime',
            minWidth: 120, show: true
          }
        ],
        operates: {
          width: 120,
          fixed: 'right',
          list: [
            {
              label: this.$t('重新添加'),
              method: (index, row) => {
                this.reAddPromotionScope([row])
              },
              // disabled: (index, row) => {
              //   return this.append
              // },
              code: 'button025'
            },
            {
              label: this.$t('查看更多'),
              method: (index, row) => {
                this.viewMutexGoods(row)
              },
              hidden: (index, row) => {
                return !!row.childMpList
              },
              // disabled: (index, row) => {
              //   return this.append
              // },
              code: 'button020'
            }
          ]
        },
        requestUrl:
          '/back-promotion-web/promotionActivityRead/querySelectionProductList.do'
      },
      batchConfig: {
        promPrice: '',
        channelMerchantLimit: '',
        channelStoreLimit: '',
        channelIndividualLimit: '',
        orderLimit: ''
      },
      promotionAPI: null,
      contentType: '',
      merchantType: '',
      checkedProductList: [],
      checkedMutexProductList: []
    }
  },
  watch: {},
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.queryPromotionActivityDetail()

    this.$nextTick(async() => {
      await this.query('effect')
      await this.query('mutex')
    })
  },
  methods: {
    viewMutexGoods(row) {
      this.scopeItemId = row.id
      this.visibleMutex = true
    },
    async reAddPromotionScope(row) {
      if (row.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请选择需要重新添加的商品')
        })
        return
      }
      const ids = []
      row.forEach(x => {
        if (x.childMpList) {
          ids.push(x.childMpList[0].id)
        } else {
          if (!ids.includes(x.id)) {
            ids.push(x.id)
          }
        }
      })
      const querySelectionProductList = []
      row.forEach(x => {
        if (x.childMpList) {
          querySelectionProductList.push({
            activityId: this.promotionId,
            barcode: x.childMpList[0].barcode,
            id: x.childMpList[0].mpId,
            contentType: this.contentType,
            isAvailable: 1,
            merchantId: x.childMpList[0].merchantId,
            merchantName: x.childMpList[0].merchantName,
            mpCode: x.childMpList[0].mpCode,
            mpId: x.childMpList[0].mpId,
            mpName: x.childMpList[0].mpName,
            scopeType: x.childMpList[0].scopeType,
            productId: x.childMpList[0].productId,
            promotionType: this.promType,
            typeOfProduct: x.childMpList[0].typeOfProduct,
            deliveryTimeString: null,
            preSellEndTime: null,
            preSellStartTime: null
          })
        } else {
          if (
            querySelectionProductList.findIndex(y => x.mpId === y.id) === -1
          ) {
            querySelectionProductList.push({
              activityId: this.promotionId,
              barcode: x.barcode,
              id: x.mpId,
              contentType: this.contentType,
              isAvailable: 1,
              merchantId: x.merchantId,
              merchantName: x.merchantName,
              mpCode: x.mpCode,
              mpId: x.mpId,
              mpName: x.mpName,
              scopeType: x.scopeType,
              productId: x.productId,
              promotionType: this.promType,
              typeOfProduct: x.typeOfProduct,
              deliveryTimeString: null,
              preSellEndTime: null,
              preSellStartTime: null
            })
          }
        }
      })
      const res = await this.promotionAPI.reAddPromotionScope({
        ids: ids,
        promType: this.promType,
        querySelectionProductList: querySelectionProductList
      })
      if (res.code === '0') {
        await this.querySelectionProductList('effect')
        await this.querySelectionProductList('mutex')
      }
    },
    getMutexTableListTotal(total) {
      this.mutexTableListTotal = total
    },
    getMpTableListTotal(total) {
      this.mpTableListTotal = total
    },
    mutexTableResponse(res) {
      const {
        data: { listObj }
      } = res
      const listData = listObj || []

      listData.forEach(x => {
        x.id = x.mpId
        const merchantProductList = x.childMpList
        merchantProductList &&
          merchantProductList.forEach(y => {
            x.salePrice = y.salePrice
            // 如果是系列品
            if (y.typeOfProduct === 3) {
              y.hasChildren = true
            }
          })
      })
      return res
    },
    mpTableResponse(res) {
      const {
        data: { listObj }
      } = res
      const listData = listObj || []
      this.useAppendList = this.$portal.deepClone(listData)
      listData.forEach(x => {
        x.id = x.mpId
        const merchantProductList = x.childMpList
        merchantProductList &&
          merchantProductList.forEach(y => {
            x.salePrice = y.salePrice
            x.barcode = y.barcode
            x.merchantName = y.merchantName
            // 如果是系列品
            if (y.typeOfProduct === 3) {
              y.hasChildren = true
            }
          })
      })

      return res
    },
    async loadChildren(tree, treeNode, resolve) {
      const params = {
        mpId: treeNode.mpId,
        promotionId: this.promotionId
      }
      const res = await this.promotionAPI.getPromotionChildMpSelectedList(
        params
      )
      res.data && res.data.forEach(item => {
        item.disable = true
      })
      resolve(res.data)
    },
    selectable(row, index) {
      return !row.disable && !(this.append && row.isAvailable === 1)
    },
    selectableMutex() {
      return !this.append
    },
    getMpTableList(list) {
      this.mpTable.data = list || []
    },
    async ok(val) {
      const querySelectionProductList = val.map(item => {
        return {
          // activityId: this.promotionId,
          // barcode: item.barcode,
          // contentType: this.contentType,
          // id: item.mpId,
          // isAvailable: 1,
          // merchantId: item.merchantId,
          // merchantName: item.merchantName,
          // mpCode: item.mpCode,
          // mpName: item.mpName,
          // productId: item.productId,
          // promotionType: this.promType,
          // typeOfProduct: item.typeOfProduct,
          // scopeType: item.scopeType
          activityId: this.promotionId,
          id: item.mpId,
          isAvailable: this.append ? 0 : 1,
          mpCode: item.mpCode,
          mpName: item.mpName,
          merchantId: item.merchantId,
          merchantName: item.merchantName,
          productId: item.productId,
          contentType: this.contentType,
          barcode: item.barcode,
          typeOfProduct: item.typeOfProduct,
          promotionType: this.promType,
          preSellStartTime: this.promotionActivityDetail.preSellStartTime,
          preSellEndTime: this.promotionActivityDetail.preSellEndTime,
          deliveryTimeString: this.promotionActivityDetail.deliveryTimeString,
          scopeType: this.promotionActivityDetail.scopeType
        }
      })

      const params = {
        isCommonPrice: true,
        querySelectionProductList: querySelectionProductList,
        selectionType: 1
      }
      await this.saveSelectionProduct(params)
    },
    async saveSelectionProduct(params) {
      const { code } = await this.promotionAPI.saveSelectionProduct(params)
      if (code === '0') {
        await this.query('effect')
        await this.query('mutex')
      }
    },
    async handleImportClose(val) {
      await this.query('effect')
      await this.query('mutex')
    },

    async handleReset() {
      this.formReset('mpSearch')
      await this.query('effect')
    },
    async query(type) {
      await this.querySelectionProductList(type)
    },
    handleSelectionChange(val) {
      if (Array.isArray(val)) {
        this.checkedProductList = val.filter(item => {
          return item.isChecked
        })
      }
    },
    handleMutexSelectionChange(val) {
      if (Array.isArray(val)) {
        this.checkedMutexProductList = val.filter(item => {
          return item.isChecked
        })
      }
    },
    async deleteSelectionProduct(row) {
      if (row.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请选择需要删除的商品')
        })
        return
      }

      const res = await this.$confirm(this.$t('确定删除吗?'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })

      if (!res) {
        return
      }

      const ids = row
        .map(x => {
          if (x.typeOfProduct === 1000) {
            return x.childMpList[0].id
          }
          return x.id
        })

      await this.promotionAPI.deleteSelectionProduct({
        ids: [...new Set(ids)]
      })
      await this.querySelectionProductList('effect')
      await this.querySelectionProductList('mutex')
    },

    async handleTabChange(val) {
      this.selectFlag = val.name
    },
    async queryPromotionActivityDetail() {
      const params = {
        id: this.promotionId
      }

      const { data = {}, code } = await this.promotionAPI.getPromotionDetailUrl(
        params
      )

      if (code === '0') {
        this.promotionActivityDetail = data
        this.contentType = data.promotionMethod
        this.merchantType = data.merchantType
        this.searchParams.merchantType = data.merchantType
        this.searchParams.promType = data.frontPormotionType
      }
    },
    // type : 'effect' 生效商品， 'mutex' 互斥商品
    async querySelectionProductList(type) {
      if (type === 'effect') {
        this.$refs.mpTable.getList(this.mpSearch)
      } else {
        this.$refs.mutexTable.getList(this.mutexSearch)
      }
    },
    handleShowSearch() {
      this.searchShow = !this.searchShow
    },
    isCanSave() {
      return new Promise((resolve, reject) => {
        var params = {
          obj: {
            activityId: this.promotionId
          },
          currentPage: 0,
          itemsPerPage: 10
        }
        this.promotionAPI.querySelectionProListMethod(params).then(res => {
          resolve(res)
        })
      })
    },
    async appendSave() {
      const params = {
        activityId: this.promotionId,
        promType: this.promType
      }
      const { code } = await this.promotionAPI.appendPromotionMps(params)
      if (code === '0') {
        this.$message({
          message: this.$t('追加商品成功'),
          type: 'success'
        })
        await this.query('effect')
        await this.query('mutex')
      }
    },
    getUseAppendList() {
      return this.useAppendList
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-promotion-single-set-product {
  padding: 20px 10px 10px 10px;

  .activity-merchant {
    margin-bottom: 20px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .search-wrap {
      display: flex;

      .batch-delete {
        margin-left: 10px;
      }

      /deep/ .el-input-group__prepend {
        width: 120px;
        background-color: #fff;
      }

      /deep/ .el-input-group__append {
        padding: 0;
        background-color: #fff;

        /deep/ .el-button--default:hover,
        .el-button--default:focus {
          background: transparent !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }
      }
    }
  }
}
/deep/ .cp-search-item {
  overflow: unset !important;
}
/deep/ .cp-list-search-area .box{
  overflow: unset !important;
}
/deep/ .cp-list-search-area .inner{
  overflow: unset !important;
}
</style>
