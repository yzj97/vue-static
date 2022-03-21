<template>
  <div class="bg-promotion-participation-goods">
    <!-- <div slot="btn"> -->
    <el-button
      name="addGiftLevel"
      size="small"
      type="primary"
      icon="el-icon-plus"
      @click="addGiftLevel=true"
    >{{ $t('添加促销商品') }}</el-button>
    <!-- </div> -->
    <div class="mar20">
      <ody-table
        ref="groupTable"
        :columns="groupTable.columns"
        :operates="groupTable.operates"
        :request-url="groupTable.requestUrl"
        :response="groupTableResponse"
        :can-filter="true"
        :is-tree="true"
        :default-expand-all="false"
        :multiple="true"
        :tree-props="{ rootVal: '0', parentKey: 'parentId', hasChildren: 'hasChildren', children: 'childMpList' }"
        :load="loadChildren"
        row-key="id"
        name="groupTableResponse137"
      >
        <template slot="groupnonPriceSlot">
          <ody-tip-star :content="$t('拼团价（元）')" />
        </template>
        <template slot="individualLimitSlot">
          <ody-tip-star :content="$t('个人单渠道限购')" />
        </template>
        <template slot="stockLimitSlot">
          <ody-tip-star :content="$t('店铺单渠道限购')" />
        </template>
        <template slot="groupnonPrice" slot-scope="scope">
          <ody-input-number
            v-model="scope.row.groupnonPrice"
            :disabled="append && scope.row.isAvailable === 1"
            :empty-tip="false"
            :decimal="2"
            :min="0.01"
            :max="scope.row.merchantProductPrice - 0.01"
            name="scope_row_groupnonPrice"
          />
        </template>
        <template slot="individualLimit" slot-scope="scope">
          <ody-input-number
            v-if="!scope.row.isLast"
            v-model="scope.row.individualLimit"
            :disabled="append && scope.row.isAvailable === 1"
            :empty-tip="false"
            :min="1"
            name="scope_row_individualLimit"
          />
        </template>
        <template slot="stockLimit" slot-scope="scope">
          <ody-input-number
            v-if="!scope.row.isLast"
            v-model="scope.row.stockLimit"
            :disabled="append && scope.row.isAvailable === 1"
            :empty-tip="false"
            :min="1"
            name="scope_row_stockLimit"
          />
        </template>
      </ody-table>
    </div>
    <promotion-goods-dialog-choose
      v-if="addGiftLevel"
      :visible.sync="addGiftLevel"
      :multiple="false"
      :prom-type="promType"
      :params="searchParams"
      choose-key="mpId"
      @cancel="goodsCancel"
      @ok="goodsOk"
    />
  </div>
</template>

<script>
import PromotionGoodsDialogChoose from '@/components/promotion-goods-dialog-choose'

export default {
  components: {
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
      searchParams: {
        merchantType: 1,
        merchantIds: [],
        promType: this.promType,
        promotionId: this.promotionId,
        // promotionId: '2001170011175066',
        searchType: 1,
        storeIds: [],
        categoryType: '1',
        brandType: '1',
        brandIds: [],
        categoryIds: []
      },
      search: {
        obj: {
          patchGrouponThemeId: this.promotionId
        }
      },
      goodsSelected: [],
      addGiftLevel: false,
      groupTable: {
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            show: true,
            minWidth: 160
          },
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('计量单位'),
            // prop: 'measurementUnit',
            prop: 'mainUnitName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('店铺名称'),
            prop: 'storeName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('零售价（元）'),
            prop: 'merchantProductPrice',
            show: true,
            minWidth: 120
          },
          {
            // label: this.$t('拼团价（元）'),
            labelSlot: 'groupnonPriceSlot',
            slot: 'groupnonPrice',
            show: true,
            minWidth: 160
          },
          {
            // label: this.$t('个人单渠道限购'),
            labelSlot: 'individualLimitSlot',
            slot: 'individualLimit',
            show: true,
            minWidth: 160
          },
          {
            // label: this.$t('店铺单渠道限购'),
            labelSlot: 'stockLimitSlot',
            slot: 'stockLimit',
            show: true,
            minWidth: 160
          }
        ],
        operates: {
          width: 80,
          fixed: 'right',
          list: [
            {
              label: this.$t('保存'),
              method: (index, row) => {
                this.editProduct([row])
              },
              code: 'button008'
            },
            {
              label: this.$t('删除'),
              method: (index, row) => {
                this.deleteSelectionProduct([row])
              },
              code: 'button009'
            }
          ]
        },
        requestUrl:
          '/back-promotion-web/patchGrouponThemeRead/querySelectedMpListBatch.do'
      }
    }
  },
  watch: {},
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    // await this.queryBrandList()
    // await this.queryAuthMerchant()
    await this.queryAuthStore()
    // await this.saveAttendImages()
    this.$nextTick(async() => {
      await this.query()
      await this.init()
    })
  },
  methods: {
    async loadChildren(tree, treeNode, resolve) {
      const params = {
        mpId: treeNode.mpId,
        patchGrouponThemeId: this.promotionId
      }
      const res = await this.promotionAPI.queryPatchGrouponMpChildList(
        params
      )
      res.data && res.data.forEach(item => {
        item.disable = true
        item.isLast = true
      })
      resolve(res.data)
    },
    addGiftLevelClick() {
      this.addGiftLevel = true
    },
    groupTableResponse(res) {
      const {
        data: { listObj }
      } = res
      const listData = listObj || []

      listData.forEach(item => {
        item.updateFlag = 1
        item.hasChildren = item.typeOfProduct === 3
      })

      return res
    },
    async init() {
      const params = {
        id: this.promotionId
      }
      this.promotionAPI
        .getLoadPageConfigCommonOscUrl('PAGE_CONFIG_NOT_SAME')
        .then(response => {
          // 活动类型
          this.activityType = response.data.promotionCreateType
          this.merchantType = response.data.merchantType
          this.patchGroupModel = response.data.patchGroupModel
        })
      this.promotionAPI.queryPatchGrouponThemeDetail(params).then(response => {
        // 第一步创建的商品详情
      })
    },
    // 获取品牌类目queryAuthMerchantPageUrl
    async queryAuthMerchant() {
      const params = {
        currentPage: 1,
        itemsPerPage: 1000
      }
      this.promotionAPI.queryAuthMerchantPageUrl(params).then(response => {
        // 商家类目
      })
    },
    async queryAuthStore() {
      const params = {
        currentPage: 1,
        itemsPerPage: 1000
      }
      this.promotionAPI.queryAuthStorePageUrl(params).then(response => {
        // 渠道类目
      })
    },

    async queryBrandList() {
      const params = {
        obj: {}
      }
      this.promotionAPI.queryBrandListUrl(params).then(response => {
        // 渠道类目
      })
    }, // saveAttendImages
    async saveAttendImages() {
      this.promotionAPI.saveAttendImages([]).then(response => {
        // 渠道类目
      })
    },
    async goodsOk(val) {
      const valDate = val[0]
      const querySelectionProductList = {}
      querySelectionProductList.id = this.promotionId
      querySelectionProductList.channelCode = valDate.channelCode
      querySelectionProductList.merchantId = valDate.merchantId
      querySelectionProductList.mpId = valDate.mpId
      querySelectionProductList.merchantName = valDate.merchantName
      querySelectionProductList.mpCode = valDate.mpCode
      querySelectionProductList.mpName = valDate.mpName
      querySelectionProductList.storeName = valDate.storeName
      querySelectionProductList.storeId = valDate.storeId
      querySelectionProductList.thirdCode = valDate.thirdCode
      querySelectionProductList.typeOfProduct = valDate.typeOfProduct
      console.log(querySelectionProductList)
      await this.savePatchGrouponStockLmt(querySelectionProductList)
    },
    cancel() {
      this.goodsVisible = false
    },
    async savePatchGrouponStockLmt(params) {
      const { code } = await this.promotionAPI.savePatchGrouponStockLmt(params)
      if (code === '0') {
        this.goodsVisible = false
        await this.query()
      }
    },
    async querySelectedMpListBatchUrl() {
      this.$refs.groupTable.getList(this.search)
    },
    async query() {
      await this.querySelectedMpListBatchUrl()
    },
    async delPatchGrouponStockLmt(params) {
      const { code } = await this.promotionAPI.delPatchGrouponStockLmt(params)
      if (code === '0') {
        this.goodsVisible = false
      }
    },
    // 保存
    async editProduct(e) {
      const params = {
        ids: []
      }
      params.groupnonPrice = e[0].groupnonPrice
      params.ids.push(e[0].id)
      params.updateFlag = 1
      params.individualLimit = e[0].individualLimit
      params.stockLimit = e[0].stockLimit
      params.themeId = this.promotionId
      if (!params.groupnonPrice) {
        this.$message({
          type: 'error',
          message: this.$t('请输入拼团价')
        })
        return
      }
      if (params.groupnonPrice >= e[0].merchantProductPrice) {
        this.$message({
          type: 'error',
          message: this.$t('拼团价应小于零售价')
        })
        return
      }

      if (!params.individualLimit && e[0].typeOfProduct !== 2) {
        this.$message({
          type: 'error',
          message: this.$t('个人单渠道限购必填')
        })
        return
      } else if (e[0].typeOfProduct !== 2) {
        if (!params.individualLimit) {
          this.$message({
            type: 'error',
            message: this.$t('个人单渠道限购必填')
          })
          return
        }
        if (+params.individualLimit > +params.stockLimit) {
          this.$message({
            type: 'error',
            message: this.$t('个人单渠道限购应小于店铺单渠道限购')
          })
          return
        }
      }

      await this.delPatchGrouponStockLmt(params)
    },
    // 删除
    async deleteSelectionProduct(e) {
      const params = { ids: [] }
      params.ids.push(e[0].id)
      params.themeId = this.promotionId
      params.updateFlag = 0
      await this.delPatchGrouponStockLmt(params)
      this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
.mar20 {
  margin-top: 20px;
}
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
</style>

