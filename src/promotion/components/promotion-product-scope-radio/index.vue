<template>
  <div class="cp-product-scope-radio">
    <el-form-item :label="$t('商品范围')" prop="productScope">
      <ody-radio2
        key="promotionGiftRule"
        v-model="promotionActivityDetail.productScope"
        :list-key="listKey"
        name="promotionActivityDetail_productScope"
        @change="handleGiftRuleChange"
      >
        <span slot="0" class="gift-limit-box">
          <el-form-item prop="countLimit4Skus" class="gift-limit-multy">
            <ody-input-number
              v-model="promotionActivityDetail.countLimit4Skus"
              name="promotionActivityDetail_countLimit4Skus"
              class="gift-limit-multy"
            />
            <span>{{ $t('件') }}</span>
          </el-form-item>
        </span>
        <span slot="1" class="gift-limit-box">
          <el-form-item class="gift-limit-multy">
            <el-button name="goodsVisible" type="primary" size="mini" @click="goodsVisible = true">{{ $t('添加商品') }}</el-button>
          </el-form-item>
          <div class="batch-settings">
            <ody-title :title="$t('批量设置')"/>
            <el-form ref="batchConfig" :model="batchConfig" label-width="100px" class="form">
              <ody-search-item :label="$t('限购总数')" prop="limitCount">
                <el-input v-model="batchConfig.limitCount" name="batchConfig_limitCount" />
              </ody-search-item>
              <ody-search-item>
                <el-button name="handleShowEdit" size="small" type="primary" @click="handleShowEdit">{{ $t('保存') }}</el-button>
              </ody-search-item>
            </el-form>
            <ody-list-table-area class="product-scope-table">
              <div slot="tabs">
                <ody-table
                  ref="mpTable"
                  :columns="mpTable.columns"
                  :multiple="true"
                  :default-expand-all="false"
                  :request-url="mpTable.requestUrl"
                  :response="mpTableResponse"
                  :is-tree="true"
                  :tree-props="treeProps"
                  row-key="id"
                  @getTableList="getMpTableList"
                  @selection-change="handleSelectionChange">
                  <template slot="promPrice" slot-scope="scope">
                    <el-input
                      v-model="scope.row.promPrice"
                      name="scope_row_promPrice"
                      @blur="updatePriceAndLimit(scope.row, 'promPrice')"
                    />
                  </template>
                  <template slot="channelMerchantLimit" slot-scope="scope">
                    <ody-input-number
                      :empty-tip="false"
                      :min="1"
                      :max="1000000000"
                      v-model="scope.row.channelMerchantLimit"
                      name="scope_row_channelMerchantLimit"
                      @blur="updatePriceAndLimit(scope.row, 'channelMerchantLimit')"
                    />
                  </template>
                  <template slot="channelStoreLimit" slot-scope="scope">
                    <ody-input-number
                      :empty-tip="false"
                      :min="1"
                      :max="1000000000"
                      v-model="scope.row.channelStoreLimit"
                      name="scope_row_channelStoreLimit"
                      @blur="updatePriceAndLimit(scope.row, 'channelStoreLimit')"
                    />
                  </template>
                  <template slot="channelIndividualLimit" slot-scope="scope">
                    <ody-input-number
                      :empty-tip="false"
                      :min="1"
                      :max="1000000000"
                      v-model="scope.row.channelIndividualLimit"
                      name="scope_row_channelIndividualLimit"
                      @blur="updatePriceAndLimit(scope.row, 'channelIndividualLimit')"
                    />
                  </template>
                  <template slot="orderLimit" slot-scope="scope">
                    <ody-input-number
                      :empty-tip="false"
                      :min="1"
                      :max="1000000000"
                      v-model="scope.row.orderLimit"
                      name="scope_row_orderLimit"
                      @blur="updatePriceAndLimit(scope.row, 'orderLimit')"
                    />
                  </template>
                  <template slot="totalLimit" slot-scope="scope">
                    <ody-input-number
                      :empty-tip="false"
                      :min="1"
                      :max="1000000000"
                      v-model="scope.row.totalLimit"
                      name="scope_row_totalLimit"
                      @blur="updatePriceAndLimit(scope.row, 'totalLimit')"
                    />
                  </template>
                </ody-table>
              </div>
            </ody-list-table-area>
          </div>
        </span>
      </ody-radio2>
    </el-form-item>
    <promotion-goods-dialog-choose
      :visible="goodsVisible"
      :selected.sync="goodsSelected"
      :multiple="true"
      :prom-type="promType"
      :params="searchParams"
      choose-key="mpId"
      @cancel="cancel"
      @ok="ok"
    />
  </div>
</template>

<script>
import util from '@/utils/util'
import PromotionGoodsDialogChoose from '@/components/promotion-goods-dialog-choose'
export default {
  components: {
    PromotionGoodsDialogChoose
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    selected: {
      type: Object,
      default: () => {}
    },
    // 2-单品x件优惠
    type: {
      type: Number,
      default: 1
    },
    listKey: {
      type: String,
      default: 'productScopeList'
    },
    promotionId: {
      type: String,
      default: ''
    },
    promType: {
      type: Number,
      default: 0
    },
    channelSelecteds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      totalLimit: '',
      batchConfig: {
        limitCount: ''
      },
      selectedBatchUpdateContent: [],
      selectFlag: '1',
      goodsVisible: false,
      goodsSelected: [],
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
        categoryIds: [],
        channelSelecteds: this.channelSelecteds
      },
      promotionActivityDetail: {
        countLimit4Skus: '',
        productScope: ''
      },
      mpTable: {
        columns: [
          {
            label: this.$t('类目'),
            prop: 'categoryName',
            minWidth: 150, show: true
          },
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            minWidth: 200, show: true
          },
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商品价格'),
            prop: 'price',
            minWidth: 120, show: true
          },
          {
            label: this.$t('店铺名称'),
            prop: 'storeName',
            minWidth: 120, show: true
          },
          {
            label: this.$t('个人限购总数'),
            slot: 'totalLimit',
            minWidth: 120, show: true
          }
        ],
        data: [],
        requestUrl: '/back-promotion-web/promotionActivityRead/querySelectionProductList.do'
      },
      treeProps: { rootVal: '0', parentKey: 'parentId', hasChildren: 'hasChildren', children: 'childMpList' }
    }
  },
  created() {
    // this.promotionId = this.$route.query.promotionId
    // this.status = this.$route.query.status
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    // await this.queryPromotionActivityDetail()
  },
  methods: {
    async query() {
      await this.querySelectionProductList()
    },
    async querySelectionProductList() {
      this.$refs.mpTable.getList(this.mpSearch)
      this.$emit('promotionProductScope', this.promotionActivityDetail)
      this.$emit('batchConfigProductScope', this.batchConfig)
    },
    async handleTabChange(val) {
      this.selectFlag = val.name
    },
    getMpTableList(list) {
      this.mpTable.data = list || []
    },
    handleSelectionChange(val) {
      if (Array.isArray(val)) {
        this.checkedProductList = val.filter((item) => {
          return item.isChecked
        })
      }
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

      this.checkedProductList.forEach(async(item) => {
        let key
        for (key in this.batchConfig) {
          if (Object.prototype.hasOwnProperty.call(this.batchConfig, key)) {
            const itemVal = this.batchConfig[key]
            await this.updatePriceAndLimit(item, key, itemVal)
          }
        }
      })

      this.$nextTick(async() => {
        const params = this.checkedProductList.filter(item => !item.childMpList).map((x) => {
          return {
            agentList: x.agentList,
            channelIndividualLimit: x.channelIndividualLimit,
            channelMerchantLimit: x.channelMerchantLimit,
            channelStoreLimit: x.channelStoreLimit,
            contentType: x.contentType,
            id: x.id,
            individualLimit: x.individualLimit,
            mpId: x.mpId,
            mpName: x.mpName,
            orderLimit: x.orderLimit,
            promPrice: x.promPrice,
            promotionId: x.promotionId,
            totalLimit: x.totalLimit,
            typeOfProduct: x.typeOfProduct
          }
        })
        await this.promotionAPI.updatePriceAndLimit(params)
      })
    },
    handleShowEdit() {
      // if (!this.isEmptySelectedProductChk()) {
      //   utilService.msg(this.i18n('请勾选要设置的商品', ''))
      // }
      this.$message({
        type: 'error',
        message: this.$t('请勾选要设置的商品')
      })

      // angular.forEach(this.selectedBatchUpdateContent, function(data) {
      //   data.limitCount = this.batchConfig.limitCount
      // })
    },
    mpTableResponse(res) {
      const { data: { listObj }} = res
      const listData = listObj || []
      listData.forEach((x) => {
        x.id = x.mpId
        const merchantProductList = x.childMpList
        merchantProductList && merchantProductList.forEach((y) => {
          x.channelIndividualLimit = y.channelIndividualLimit
          x.channelMerchantLimit = y.channelMerchantLimit
          x.channelStoreLimit = y.channelStoreLimit
          x.orderLimit = y.orderLimit
          x.salePrice = y.salePrice

          y.agentList && y.agentList.forEach((item) => {
            if (!util.isEmpty(item.contentValue)) {
              if (this.contentType === 1 || this.contentType === 3) {
                x.promPrice = +item.contentValue / 100
                y.promPrice = +item.contentValue / 100
              } else if (this.contentType === 2) {
                x.promPrice = +item.contentValue / 10
                y.promPrice = +item.contentValue / 10
              }
            }
          })
        })
      })
      return res
    },
    async remote() {
      const data = await this.getPublicCodeSelect()
      return data || []
    },
    async getPublicCodeSelect() {
      const { data } = await this.$promotion.$api.promotion.getPublicCodeSelect(
        {
          category: 'ORDER_SOURCE'
        }
      )
      return data
    },
    handleGiftRuleChange(val) {
      if (val === 1) {
        this.giftPromotion.giftLimit4Multy = null
      }
      if (this.type * 1 === 2) {
        this.$emit('input', val)
      }
    },
    cancel() {
      this.goodsVisible = false
    },
    async ok(val) {
      const querySelectionProductList = val.map((item) => {
        return {
          activityId: item.activityId,
          barcode: item.barcode,
          contentType: item.contentType,
          id: item.mpId,
          isAvailable: 1,
          merchantId: item.merchantId,
          merchantName: item.merchantName,
          mpCode: item.mpCode,
          mpName: item.mpName,
          productId: item.productId,
          promotionType: item.promotionType,
          typeOfProduct: item.typeOfProduct,
          scopeType: item.scopeType
        }
      })
      const params = {
        isCommonPrice: true,
        querySelectionProductList: querySelectionProductList,
        selectionType: 1
      }
      this.goodsVisible = false
      await this.saveSelectionProduct(params)
    },
    async queryPromotionActivityDetail() {
      const params = {
        id: this.promotionId
      }
      const { data = {}, code } = await this.promotionAPI.getPromotionDetailUrl(params)

      if (code === '0') {
        this.contentType = data.promotionMethod
        this.merchantType = data.merchantType
        this.searchParams.merchantType = data.merchantType
        this.searchParams.promType = data.frontPormotionType
      }
    },
    async saveSelectionProduct(params) {
      const { code } = await this.promotionAPI.saveSelectionProduct(params)
      if (code === '0') {
        this.goodsVisible = false
        await this.query()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-product-scope-radio {
  /deep/ {
    .el-radio {
      display: block;
      margin-bottom: 10px;
    }
  }
  .gift-limit-box {
    /deep/ {
      .el-input-group__append {
        width: 88px;
      }
    }
  }
  .gift-limit-multy {
    font-size: 14px;
    width: 80px;
    display: inline-block;
    line-height: 32px;
  }
  .product-scope-table {
    width: 700px;
  }
}
</style>
