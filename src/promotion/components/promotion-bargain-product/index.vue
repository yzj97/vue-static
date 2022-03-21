<template>
  <div class="bg-promotion-bargain-set-product">
    <div class="activity-merchant">
      <div>
        <ody-tip-star :content="$t('设置活动商品')" />
        <el-button
          name="goodsVisible"
          size="small"
          type="primary"
          @click="goodsVisible = true"
        >{{ append ? $t('追加活动商品') : $t('添加活动商品') }}</el-button>
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
        <el-button
          v-if="selectFlag === '1'"
          name="handleShowEdit"
          size="small"
          class="batch-delete"
          @click="handleShowEdit"
        >{{ $t('批量编辑') }}</el-button>
      </div>
    </div>

    <ody-list-search-area v-if="batchEdit">
      <div slot="content">
        <el-form ref="batchConfig" :model="batchConfig" label-width="100px" class="form">
          <ody-search-item :label="$t('起始价(元)')" prop="startPrice" name="startPrice">
            <ody-input-number
              :min="0.01"
              :max="9999999.99"
              :decimal="2"
              v-model="batchConfig.startPrice"
              name="batchConfig_startPrice"
            />
          </ody-search-item>
          <ody-search-item :label="$t('砍价底线')" prop="endPrice" name="endPrice">
            <ody-input-number
              :min="0.01"
              :max="9999999.99"
              :decimal="2"
              :empty-tip="false"
              v-model="batchConfig.endPrice"
              name="batchConfig_endPrice"
            />
          </ody-search-item>
          <ody-search-item :label="$t('店铺单渠道限购')" prop="saleLimit" name="saleLimit">
            <ody-input-number
              v-model="batchConfig.saleLimit"
              :empty-tip="false"
              name="batchConfig_saleLimit"
            />
          </ody-search-item>
          <ody-search-item :label="$t('个人单渠道限购')" prop="individualLimit" name="individualLimit">
            <ody-input-number
              v-model="batchConfig.individualLimit"
              :empty-tip="false"
              name="batchConfig_individualLimit"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button
          code="ui"
          name="handleBatchSave"
          size="small"
          type="primary"
          @click="handleBatchSave"
        >{{ $t('保存') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-search-area v-if="searchShow && selectFlag === '1'">
      <div slot="content">
        <el-form ref="mpSearch" :model="mpSearch" label-width="100px" class="form">
          <ody-search-item :label="$t('商品编码')" prop="obj.mpCode" name="obj.mpCode">
            <el-input v-model="mpSearch.obj.mpCode" name="mpSearch_obj_mpCode" />
          </ody-search-item>
          <ody-search-item :label="$t('商品名称')" prop="obj.mpName" name="obj.mpName">
            <el-input v-model="mpSearch.obj.mpName" name="mpSearch_obj_mpName" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <el-button size="small" type="primary" @click.prevent="query()">{{ $t('查询') }}</el-button>
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
                :checked.sync="checkedProductList"
                :multiple="true"
                :default-expand-all="false"
                :request-url="mpTable.requestUrl"
                :response="mpTableResponse"
                :is-tree="true"
                :tree-props="treeProps"
                :can-filter="false"
                :load="loadChildren"
                :selectable="checkedSelectable"
                row-key="id"
                @getTableListTotal="getMpTableListTotal"
                @getTableList="getMpTableList"
              >
                <template slot="startPriceLabelSlot">
                  <ody-tip-star :content="$t('起始价（元）')" />
                </template>
                <template slot="endPriceLabelSlot">
                  <ody-tip-star :content="$t('砍价底线（元）')" />
                </template>
                <template slot="individualLimitLabelSlot">
                  <ody-tip-star :content="$t('个人单渠道限购')" />
                </template>
                <template slot="saleLimitLabelSlot">
                  <ody-tip-star :content="$t('店铺单渠道限购')" />
                </template>
                <template slot="startPrice" slot-scope="scope">
                  <ody-input-number
                    v-model="scope.row.startPrice"
                    :disabled="append && scope.row.isAvailable === 1"
                    :min="0.01"
                    :max="9999999.99"
                    :decimal="2"
                    :empty-tip="false"
                    name="scope_row_startPrice"
                    @focus="scope.row._startPrice = scope.row.startPrice;"
                    @change="updatePriceAndLimit(scope.row, 'startPrice')"
                  />
                </template>
                <template slot="endPrice" slot-scope="scope">
                  <ody-input-number
                    v-model="scope.row.endPrice"
                    :disabled="append && scope.row.isAvailable === 1"
                    :min="0.01"
                    :max="9999999.99"
                    :decimal="2"
                    :empty-tip="false"
                    name="scope_row_endPrice"
                    @focus="scope.row._endPrice = scope.row.endPrice;"
                    @change="updatePriceAndLimit(scope.row, 'endPrice')"
                  />
                </template>
                <template slot="individualLimit" slot-scope="scope">
                  <ody-input-number
                    v-if="scope.row.type === 'parent'"
                    v-model="scope.row.individualLimit"
                    :disabled="append && scope.row.isAvailable === 1"
                    :empty-tip="false"
                    name="scope_row_individualLimit"
                    @focus="scope.row._individualLimit = scope.row.individualLimit;"
                    @change="updatePriceAndLimit(scope.row, 'individualLimit')"
                  />
                </template>
                <template slot="saleLimit" slot-scope="scope">
                  <ody-input-number
                    v-if="scope.row.type === 'parent'"
                    v-model="scope.row.saleLimit"
                    :disabled="append && scope.row.isAvailable === 1"
                    :empty-tip="false"
                    name="scope_row_saleLimit"
                    @focus="scope.row._saleLimit = scope.row.saleLimit;"
                    @change="updatePriceAndLimit(scope.row, 'saleLimit')"
                  />
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
  </div>
</template>

<script>
import PromotionMerchantSelect from '@/components/promotion-merchant-select'
import PromotionBatchImportProductModel from '@/components/promotion-batch-import-product-model'
import PromotionGoodsDialogChoose from '@/components/promotion-goods-dialog-choose'
import util from '@/utils/util'

export default {
  components: {
    PromotionMerchantSelect,
    PromotionBatchImportProductModel,
    PromotionGoodsDialogChoose
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
      useAppendList: [],
      isAvailable: this.append ? 0 : 1,
      isAppend: false,
      mpTableListTotal: '',
      searchParams: {
        merchantType: '1',
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
      goodsVisible: false,
      batchEdit: false,
      importVisible: false,
      searchShow: false,
      selectFlag: '1',
      treeProps: {
        rootVal: '0',
        parentKey: 'parentId',
        hasChildren: 'hasChildren',
        children: 'children'
      },
      mpSearch: {
        obj: {
          mpCode: '',
          mpName: '',
          refThemeId: this.promotionId
        }
      },
      mpTable: {
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
            label: this.$t('店铺名称'),
            prop: 'storeName',
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
          },
          {
            labelSlot: 'startPriceLabelSlot',
            slot: 'startPrice',
            minWidth: 120, show: true
          },
          {
            labelSlot: 'endPriceLabelSlot',
            slot: 'endPrice',
            minWidth: 120, show: true
          },
          {
            labelSlot: 'individualLimitLabelSlot',
            slot: 'individualLimit',
            minWidth: 120, show: true
          },
          {
            labelSlot: 'saleLimitLabelSlot',
            slot: 'saleLimit',
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
              code: 'button020',
              disabled: (index, row) => {
                return this.append && row.isAvailable === 1
              }
            }
          ]
        },
        data: [],
        requestUrl:
          '/back-promotion-web/cutPriceRead/queryCutPriceMpList.action'
      },
      mutexSearch: {
        obj: {
          mpCode: '',
          mpName: '',
          refThemeId: this.promotionId
        }
      },
      batchConfig: {
        startPrice: '',
        endPrice: '',
        individualLimit: '',
        saleLimit: ''
      },
      promotionAPI: null,
      contentType: '',
      merchantType: '',
      checkedProductList: [],
      checkedMutexProductList: [],
      channelCode: ''
    }
  },
  watch: {},
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.queryPromotionActivityDetail()

    this.$nextTick(async() => {
      await this.query()
    })
  },
  methods: {
    async loadChildren(tree, treeNode, resolve) {
      // debugger
      const params = {
        mpId: treeNode.mpId,
        refThemeId: treeNode.refThemeId
      }
      const res = await this.promotionAPI.getPromotionCutPriceMpChildList(
        params
      )

      res.data && res.data.forEach(item => {
        // 设置禁用
        item.disable = true
      })

      resolve(res.data)
    },
    getMpTableListTotal(total) {
      this.mpTableListTotal = total
    },
    mpTableResponse(res) {
      // debugger
      const {
        data: { listObj }
      } = res
      const listData = listObj || []
      this.useAppendList = this.$portal.deepClone(listData)
      listData.forEach(x => {
        // console.log(x, 77)
        x.type = 'parent'
        // 如果是系列品
        // console.log(merchantProductList, 8888999)
        if (x.typeOfProduct === 3) {
          // console.log('2222')
          // x.children = []
          x.hasChildren = true
          // x.children = []
        }
      })

      return res
    },
    checkedSelectable(row, index) {
      // console.log(row, index, 2222)
      return !row.disable && !(this.append && row.isAvailable === 1)
    },
    getMpTableList(list) {
      // console.log(list, 8888)
      this.mpTable.data = list || []
    },
    cancel() {
      this.goodsVisible = false
    },
    async ok(val) {
      const querySelectionProductList = val.map(item => {
        return {
          refThemeId: this.promotionId,
          mpId: item.mpId,
          mpCode: item.mpCode,
          mpName: item.mpName,
          merchantId: item.merchantId,
          merchantName: item.merchantName,
          seriesId: item.seriesId,
          stock: item.stock,
          typeOfProduct: item.typeOfProduct,
          storeId: item.storeId,
          storeName: item.storeName,
          channelCode: item.channelCode,
          isAvailable: this.append ? 0 : 1
        }
      })

      const params = {
        cutPriceMpInputVOList: querySelectionProductList,
        refThemeId: this.promotionId
      }
      await this.saveSelectionProduct(params)
    },
    async saveSelectionProduct(params) {
      const { code } = await this.promotionAPI.saveCutPriceProduct(params)
      if (code === '0') {
        await this.query()
      }
    },
    async handleImportClose(val) {
      await this.query()
    },
    checkData(batch) {
      const checkResult = {
        flg: true,
        errMsg: ''
      }

      if (
        batch.endPrice &&
        !/^(0|[1-9][0-9]{0,7})(\.[0-9]{0,2}[1-9])?$/.test(batch.endPrice)
      ) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('起始价输入有误')
      }
      if (
        batch.startPrice &&
        !/^(0|[1-9][0-9]{0,7})(\.[0-9]{0,2}[1-9])?$/.test(batch.startPrice)
      ) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('砍价底线输入有误')
      }
      if (
        batch.individualLimit &&
        !/^[1-9][0-9]{0,3}$/.test(batch.individualLimit)
      ) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('个人单渠道限购数')
      }
      if (batch.saleLimit && !/^[1-9][0-9]{0,3}$/.test(batch.saleLimit)) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('店铺单渠道限购数')
      }

      if (batch.endPrice !== '' && batch.startPrice !== '') {
        if (+batch.endPrice > +batch.startPrice) {
          checkResult.flg = false
          checkResult.errMsg = this.$t('砍价底线应小于起始价，请重新填写')
        }
      }
      if (batch.individualLimit !== '' && batch.saleLimit !== '') {
        if (+batch.individualLimit > +batch.saleLimit) {
          checkResult.flg = false
          checkResult.errMsg = this.$t(
            '个人单渠道限购数应小于店铺单渠道限购数，请重新填写'
          )
        }
      }
      if (!checkResult.flg) {
        this.$message({
          type: 'error',
          message: checkResult.errMsg
        })
      }

      return checkResult.flg
    },
    async handleBatchSave() {
      if (this.checkedProductList.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请选择需要修改的商品')
        })
        return
      }

      const flag = this.checkData(this.batchConfig)

      if (!flag) {
        return
      }
      const params = this.checkedProductList.map(item => {
        return {
          id: item.id,
          mpId: item.mpId,
          mpName: item.mpName,
          typeOfProduct: item.typeOfProduct,
          refThemeId: this.promotionId,
          startPrice: this.batchConfig.startPrice || item.startPrice || '',
          endPrice: this.batchConfig.endPrice || item.endPrice || '',
          individualLimit: this.batchConfig.individualLimit || item.individualLimit || '',
          saleLimit: this.batchConfig.saleLimit || item.saleLimit || ''
        }
      })

      await this.promotionAPI.batchCutPriceMPPriceAndLimit(params)
      await this.query('effect')
      this.checkedProductList = []
    },
    async handleReset() {
      // this.formReset('mpSearch')
      this.mpSearch.obj.mpCode = null
      this.mpSearch.obj.mpName = null
      debugger
      await this.query()
    },
    async query(type) {
      await this.querySelectionProductList(type)
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

      await this.promotionAPI.batchDeleteCutPriceMP({
        ids: [...new Set(ids)],
        refThemeId: this.promotionId
      })
      await this.querySelectionProductList()
    },
    checkBlurData(row, type) {
      console.log('type', type)
      const limitList = ['saleLimit', 'individualLimit']
      const limitNameList = ['店铺单渠道限购数', '个人单渠道限购数']
      const limitIndex = limitList.indexOf(type)

      if (limitIndex >= 0) {
        const errMsg = util.compareArr([
          +row.saleLimit,
          +row.individualLimit
        ], limitIndex)

        if (errMsg) {
          this.$message({
            type: 'warning',
            message: this.$t(errMsg.replace(/\$(\d+)/g, ($0, $1) => limitNameList[$1]))
          })

          row[type] = row['_' + type]

          return false
        }
      }

      return true
    },

    async updatePriceAndLimit(row, type) {
      if (this.checkBlurData(row, type) === false) {
        return
      }

      let newRow

      if (row.hasChildren) {
        newRow = row
        // js更新子和父
        this.$refs.mpTable.tableData
          .filter(x => (x.parentId === row.id || x.id === row.parentId))
          .forEach(tableRow => {
            tableRow[type] = row[type]
          })
      } else {
        newRow = row
      }

      const params = [newRow].map(item => {
        return {
          endPrice: item.endPrice,
          id: item.id,
          individualLimit: item.individualLimit,
          mpId: item.mpId,
          mpName: item.mpName,
          refThemeId: this.promotionId,
          saleLimit: item.saleLimit,
          startPrice: item.startPrice,
          typeOfProduct: item.typeOfProduct
        }
      })

      await this.promotionAPI.batchCutPriceMPPriceAndLimit(params)
    },
    async handleTabChange(val) {
      this.selectFlag = val.name
    },
    async queryPromotionActivityDetail() {
      const params = {
        id: this.promotionId
      }

      const { data = {}, code } = await this.promotionAPI.queryCutPriceDetail(
        params.id
      )

      if (code === '0') {
        this.contentType = data.promotionMethod
        this.merchantType = data.merchantType
        this.searchParams.merchantType = data.merchantType
        this.searchParams.promType = data.frontPormotionType || this.promType
        this.channelCode = data.channelCode
      }
    },
    //
    async querySelectionProductList(type) {
      this.$refs.mpTable.getList(this.mpSearch)
    },
    handleShowEdit() {
      this.batchEdit = !this.batchEdit
      if (this.searchShow) {
        this.searchShow = !this.searchShow
      }
    },
    handleShowSearch() {
      this.searchShow = !this.searchShow
      if (this.batchEdit) {
        this.batchEdit = !this.batchEdit
      }
    },
    async comfirm() {
      const result = await this.promotionAPI.checkCutPriceMPPrice({
        refThemeId: this.promotionId
      })
      if (result.data.flag === false) {
        this.$message({
          type: 'error',
          message: result.data.errorMessage
        })
      }
      return result.data.flag
    },
    async appendSave() {
      const { code } = await this.promotionAPI.appendCutPriceMp(this.promotionId)
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
.bg-promotion-bargain-set-product {
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
</style>
