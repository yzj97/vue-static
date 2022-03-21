<template>
  <div class="bg-promotion-single-set-product">
    <el-tabs v-model="promotionSelectFlag" name="promotionSelectFlag">
      <el-tab-pane v-if="couponDeductionType ===11" :label="$t('商品限制')" name="0">
        <div class="activity-merchant">
          <div>
            <el-button
              name="goodsVisible"
              size="small"
              type="primary"
              @click="goodsVisible = true"
            >{{ $t('添加') }}</el-button>
            <el-button
              name="deleteSelectionProduct"
              size="small"
              class="batch-delete"
              @click="deleteSelectionProduct(checkedProductList, 5)"
            >{{ $t('批量删除') }}</el-button>
            <el-button
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
        <ody-list-search-area v-if="searchShow">
          <div slot="content">
            <el-form ref="mpSearch" :model="mpSearch" label-width="100px" class="form">
              <ody-search-item :label="$t('商品编码')" prop="extendRef">
                <el-input v-model="mpSearch.extendRef" name="mpSearch_limitRef" />
              </ody-search-item>
              <ody-search-item :label="$t('商品名称')" prop="refDescription">
                <el-input v-model="mpSearch.refDescription" name="mpSearch_refDescription" />
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
            <ody-table
              ref="mpTable"
              :columns="mpTable.columns"
              :operates="mpTable.operates"
              :multiple="true"
              :request-url="mpTable.requestUrl"
              :response="handleMpTableResponse"
              :can-filter="false"
              type="selection"
              @selection-change="handleSelectionChange"
            />
          </div>
        </ody-list-table-area>
      </el-tab-pane>
      <el-tab-pane :label="$t('类目限制')" name="1">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="cateSearch" :model="cateSearch" label-width="100px" class="form" @submit.native.prevent>
              <ody-search-item :label="$t('类目名称')" prop="refDescription">
                <el-input v-model="cateSearch.refDescription" name="cateSearch_refDescription" />
              </ody-search-item>
              <ody-search-item prop="refDescription">
                <el-button size="small" type="primary" @click.prevent="queryCate()">{{ $t('查询') }}</el-button>
              </ody-search-item>
            </el-form>
          </div>
        </ody-list-search-area>
        <div class="activity-merchant">
          <div>
            <ody-category-transfer
              :show-checked-count="false"
              :category-type="8"
              :params="{merchantId: merchantId}"
              :label="$t('添加')"
              :value-check="true"
              button-type="primary"
              @ok="handleCateChoose"
            >
              <el-button size="small" type="primary">{{ $t('添加') }}</el-button>
            </ody-category-transfer>
            <el-button
              name="deleteSelectionProduct1"
              size="small"
              class="batch-delete"
              @click="deleteSelectionProduct(checkedCateList, 2)"
            >{{ $t('批量删除') }}</el-button>
          </div>
        </div>
        <ody-list-table-area>
          <div slot="tabs">
            <ody-table
              ref="cateTable"
              :columns="cateTable.columns"
              :operates="cateTable.operates"
              :multiple="true"
              :request-url="cateTable.requestUrl"
              :can-filter="false"
              @selection-change="handleSelectionChangeCate"
            />
          </div>
        </ody-list-table-area>
      </el-tab-pane>
      <el-tab-pane :label="$t('品牌限制')" name="2">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="brandSearch" :model="brandSearch" label-width="100px" class="form" @submit.native.prevent>
              <ody-search-item :label="$t('品牌名称')" prop="refDescription">
                <el-input v-model="brandSearch.refDescription" name="brandSearch_refDescription" />
              </ody-search-item>
              <ody-search-item>
                <el-button size="small" type="primary" @click.prevent="queryBrand()">{{ $t('查询') }}</el-button>
              </ody-search-item>
            </el-form>
          </div>
        </ody-list-search-area>
        <div class="activity-merchant">
          <div>
            <ody-brand-choose
              :selected.sync="storeSelected"
              :multiple="true"
              :search-format="searchFormat"
              :params="{ merchantId: merchantId, promType: promType}"
              :placeholder="$t('请选择')"
              re-url="/back-promotion-web/couponSelectionRead/queryBrandList.do"
              style="display:inline-block"
              @ok="handleBrandChoose"
            >
              <el-button size="small" type="primary">{{ $t('添加') }}</el-button>
            </ody-brand-choose>
            <el-button
              name="deleteSelectionProduct0"
              size="small"
              class="batch-delete"
              @click="deleteSelectionProduct(checkedBrandList, 3)"
            >{{ $t('批量删除') }}</el-button>
          </div>
        </div>
        <ody-list-table-area>
          <div slot="tabs">
            <ody-table
              ref="brandTable"
              :columns="brandTable.columns"
              :operates="brandTable.operates"
              :multiple="true"
              :request-url="brandTable.requestUrl"
              :can-filter="false"
              @selection-change="handleSelectionChangeBrand"
            />
          </div>
        </ody-list-table-area>
      </el-tab-pane>
    </el-tabs>
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
      @ok="goodsOk"
    />
  </div>
</template>

<script>
import PromotionBatchImportProductModel from '@/components/promotion-batch-import-product-model'
import PromotionGoodsDialogChoose from '@/components/promotion-goods-dialog-choose'

export default {
  components: {
    PromotionBatchImportProductModel,
    PromotionGoodsDialogChoose
  },
  props: {
    merchantId: {
      type: String,
      default: ''
    },
    couponDeductionType: {
      type: Number,
      default: 0
    },
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
      storeSelected: [],
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

      promotionSelectFlag: this.couponDeductionType === 11 ? '0' : '1',

      goodsVisible: false,

      importVisible: false,
      searchShow: false,

      mpSearch: {
        limitRef: '',
        extendRef: '',
        refDescription: '',
        refType: 0,
        themeRef: this.promotionId,
        ruleType: 5
      },
      mpTable: {
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'extendRef',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商品名称'),
            prop: 'refDescription',
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
            // label: this.$t('原价（元）'),
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
                this.deleteSelectionProduct([row], 5)
              },
              code: 'ui'
            }
          ]
        },
        requestUrl:
          '/back-promotion-web/couponSelectionRead/querySelectedSelectionList.do'
      },

      promotionAPI: null,

      merchantType: '',
      checkedProductList: [],
      checkedBrandList: [],
      checkedCateList: [],
      brandSearch: {
        refDescription: '',
        refType: 0,
        themeRef: this.promotionId,
        ruleType: 3
      },
      brandTable: {
        columns: [
          {
            label: this.$t('品牌名称'),
            prop: 'refDescription',
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
                this.deleteSelectionProduct([row], 3)
              },
              code: 'ui'
            }
          ]
        },
        requestUrl:
          '/back-promotion-web/couponSelectionRead/querySelectedSelectionList.do'
      },
      cateSearch: {
        refDescription: '',
        refType: 0,
        themeRef: this.promotionId,
        ruleType: 2
      },
      cateTable: {
        columns: [
          {
            label: this.$t('类目名称'),
            prop: 'refDescription',
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
                this.deleteSelectionProduct([row], 2)
              },
              code: 'ui'
            }
          ]
        },
        requestUrl:
          '/back-promotion-web/couponSelectionRead/querySelectedSelectionList.do'
      }
    }
  },

  watch: {},
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    this.$nextTick(async() => {
      this.query()
      this.queryBrand()
      this.queryCate()
    })
  },
  methods: {
    searchFormat(params) {
      return {
        obj: { ...params }
      }
    },
    async handleCateChoose(val) {
      const arr = this.$portal.tree2arr(val).filter(x => !x.children)
      const selectionList = arr.map(item => {
        return {
          refDescription: item.name,
          limitRef: item.id
        }
      })
      const params = {
        merchantType: 2,
        refType: 0,
        ruleType: 2,
        selectionList: selectionList,
        themeRef: this.promotionId
      }
      const { code } = await this.promotionAPI.saveSelectionLimit(params)
      if (code === '0') {
        await this.queryCate()
      }
    },
    async handleBrandChoose(val) {
      const selectionList = val.map(item => {
        return {
          refDescription: item.name,
          limitRef: item.id
        }
      })
      const params = {
        merchantType: 2,
        refType: 0,
        ruleType: 3,
        selectionList: selectionList,
        themeRef: this.promotionId
      }
      const { code } = await this.promotionAPI.saveSelectionLimit(params)
      if (code === '0') {
        await this.queryBrand()
      }
    },
    async goodsOk(val) {
      const selectionList = val.map(item => {
        return {
          refDescription: item.mpName,
          productId: item.productId,
          limitRef: item.mpId,
          extendRef: item.mpCode
        }
      })
      const params = {
        merchantType: 2,
        refType: 0,
        ruleType: 5,
        selectionList: selectionList,
        themeRef: this.promotionId
      }
      await this.saveSelectionProduct(params)
    },
    async saveSelectionProduct(params) {
      const { code } = await this.promotionAPI.saveSelectionLimit(params)
      if (code === '0') {
        await this.query()
      }
    },
    async handleImportClose(val) {
      await this.query()
    },
    async handleReset() {
      this.formReset('mpSearch')
      await this.query()
    },
    async query() {
      await this.$refs.mpTable.getList(this.mpSearch)
    },
    async handleMpTableResponse(res) {
      res.data.listObj.forEach(item => {
        item.limitRef = item.mpId
        item.extendRef = item.mpCode
      })
      return res
    },
    async queryBrand() {
      await this.$refs.brandTable.getList(this.brandSearch)
    },
    async queryCate() {
      await this.$refs.cateTable.getList(this.cateSearch)
    },
    handleSelectionChange(val) {
      this.checkedProductList = val
    },
    handleSelectionChangeBrand(val) {
      this.checkedBrandList = val
    },
    handleSelectionChangeCate(val) {
      this.checkedCateList = val
    },
    async deleteSelectionProduct(row, ruleType) {
      if (row.length === 0) {
        if (ruleType === 5) {
          this.$message({
            type: 'error',
            message: this.$t('请选择需要删除的商品')
          })
        } else if (ruleType === 3) {
          this.$message({
            type: 'error',
            message: this.$t('请选择需要删除的品牌')
          })
        } else if (ruleType === 2) {
          this.$message({
            type: 'error',
            message: this.$t('请选择需要删除的类目')
          })
        }
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

      const ids = []
      row.forEach(x => {
        ids.push({ id: x.id })
      })
      await this.promotionAPI.delSelectionLimit({
        refType: 0,
        ruleType,
        selectionList: ids,
        themeRef: this.promotionId
      })
      if (ruleType === 5) {
        await this.query()
      } else if (ruleType === 3) {
        this.queryBrand()
      } else if (ruleType === 2) {
        this.queryCate()
      }
    },
    handleShowSearch() {
      this.searchShow = !this.searchShow
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

  .condition-value {
    width: 200px;
  }
}
</style>
