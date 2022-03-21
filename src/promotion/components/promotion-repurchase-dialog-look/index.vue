<template>
  <div>
    <ody-dialog
      v-if="visible"
      :visible.sync="visible"
      :title="$t('查看换购商品')"
      width="960px"
      @close="handleClose"
    >
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :data="mpTable.data"
            :columns="mpTable.columns"
            :is-tree="true"
            :can-filter="false"
            :operates="!editFlag ? mpTable.operates : ''"
            :multiple="true"
            :tree-props="treeProps"
            name="mpTable_data630"
            row-key="id"
            @selection-change="handleSelectionChange"
          >
            <template slot="upgradeAmount" slot-scope="scope">
              <ody-input-number
                :disabled="editFlag"
                v-model="scope.row.upgradeAmount"
                :min="0.01"
                :max="999999.99"
                :decimal="2"
                name="scope_row_upgradeAmount"
                @blur="updatePriceAndLimit(scope.row, 'upgradeAmount')"
              />
            </template>
            <template slot="channelMerchantLimit" slot-scope="scope">
              <ody-input-number
                :disabled="editFlag"
                :min="1"
                :max="1000000000"
                v-model="scope.row.channelMerchantLimit"
                name="scope_row_channelMerchantLimit"
                @blur="updatePriceAndLimit(scope.row, 'channelMerchantLimit')"
              />
            </template>
            <template slot="channelStoreLimit" slot-scope="scope">
              <ody-input-number
                :disabled="editFlag"
                :min="1"
                :max="1000000000"
                v-model="scope.row.channelStoreLimit"
                name="scope_row_channelStoreLimit"
                @blur="updatePriceAndLimit(scope.row, 'channelStoreLimit')"
              />
            </template>
            <template slot="channelIndividualLimit" slot-scope="scope">
              <ody-input-number
                :disabled="editFlag"
                :min="1"
                :max="1000000000"
                v-model="scope.row.channelIndividualLimit"
                name="scope_row_channelIndividualLimit"
                @blur="updatePriceAndLimit(scope.row, 'channelIndividualLimit')"
              />
            </template>
            <template slot="upgradeAmountLable">
              <div>
                <ody-tip-star :content="$t('换购价(元)')" />
              </div>
            </template>
            <template slot="channelIndividualLimitLabel">
              <div>
                <ody-tip-star :content="$t('个人单渠道限购')" />
              </div>
            </template>
            <template slot="channelStoreLimitLabel">
              <div>
                <ody-tip-star :content="$t('店铺单渠道限购')" />
              </div>
            </template>
            <template slot="channelMerchantLimitLabel">
              <div>
                <ody-tip-star :content="$t('商家单渠道限购')" />
              </div>
            </template>
          </ody-table>
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="mpSearch.currentPage"
            :list="mpTable.data"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="mpSearch.itemsPerPage"
            :total.sync="mpTable.page.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange()"
            @current-change="handleCurrentChange()"
          />
        </div>
      </ody-list-table-area>
      <span slot="footer">
        <el-button name="handleClose" size="small" @click="handleClose">取 消</el-button>
        <el-button
          v-if="!editFlag"
          name="handleSubmit"
          size="small"
          type="primary"
          @click="handleSubmit"
        >确 定</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    contentType: {
      type: String,
      default: ''
    },
    contentValue: {
      type: String,
      default: ''
    },
    giftShowType: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {}
    },
    editFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: {
        giftShowType: this.giftShowType ? this.giftShowType : 1,
        contentValue: this.contentValue ? this.contentValue : 1,
        contentType: this.contentType
      },
      treeProps: {
        rootVal: '0',
        parentKey: 'parentId',
        hasChildren: 'hasChildren',
        children: 'childMpList'
      },
      mpSearch: {
        currentPage: 1,
        itemsPerPage: 10,
        ...this.params
      },
      mpTable: {
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'giftCode',
            minWidth: 250, show: true
          },
          {
            label: this.$t('商品名称'),
            prop: 'giftName',
            minWidth: 250, show: true
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
            label: this.$t('原价（元）'),
            prop: 'salePrice',
            minWidth: 120, show: true
          },
          {
            // labelSlot: this.$t('换购价(元)'),
            labelSlot: 'upgradeAmountLable',
            slot: 'upgradeAmount',
            show: true,
            minWidth: 180
          },
          {
            // label: this.$t('个人单渠道限购'),
            labelSlot: 'channelIndividualLimitLabel',
            slot: 'channelIndividualLimit',
            show: true,
            minWidth: 180
          },
          {
            // label: this.$t('店铺单渠道限购'),
            labelSlot: 'channelStoreLimitLabel',
            slot: 'channelStoreLimit',
            show: true,
            minWidth: 180
          },
          {
            // label: this.$t('商家单渠道限购'),
            labelSlot: 'channelMerchantLimitLabel',
            slot: 'channelMerchantLimit',
            show: true,
            minWidth: 180
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
              code: 'ui'
            }
          ]
        },
        data: [],
        page: {
          total: 0
        }
      }
    }
  },
  mounted() {
    this.querySelectedGiftList()
  },
  methods: {
    async handleSubmit() {
      const params = Object.assign({}, this.search, this.params)
      params.gifts = this.mpTable.data
        .map(item => {
          return item.childMpList
        })
        .flat()
      const { code } = await this.$promotion.$api.promotion.updateLevelGifts(
        params
      )
      if (code === '0') {
        this.$emit('cancel')
      }
    },
    handleClose() {
      this.$emit('cancel')
    },
    async handleCurrentChange() {
      await this.querySelectedGiftList()
    },
    async handleSizeChange() {
      this.mpSearch.currentPage = 1
      await this.querySelectedGiftList()
    },
    async querySelectedGiftList() {
      const params = this.mpSearch
      const {
        data: { listObj = [], total = 10 } = {}
      } = await this.$promotion.$api.promotion.querySelectedGiftList(params)
      this.mpTable.page.total = total
      const selectedProductList = listObj || []
      selectedProductList.forEach(x => {
        x.id = x.mpId
        const merchantProductList = x.childMpList
        merchantProductList &&
          merchantProductList.forEach(y => {
            x.salePrice = y.salePrice
            x.barcode = y.barcode
            x.merchantName = y.merchantName
            x.channelIndividualLimit = y.channelIndividualLimit
            x.channelMerchantLimit = y.channelMerchantLimit
            x.channelStoreLimit = y.channelStoreLimit
            x.upgradeAmount = y.upgradeAmount
          })
      })

      this.mpTable.data = selectedProductList
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

      const ids = [row[0].mpId]
      await this.$promotion.$api.promotion.delLevelGift({
        ids: ids,
        promotionRuleId: this.params.promotionRuleId
      })
      await this.querySelectedGiftList()
    },
    async updatePriceAndLimit(row, type) {
      if (row.childMpList) {
        row.childMpList.forEach(x => {
          x[type] = row[type]
        })
      } else {
        let parent = []
        parent = this.mpTable.data.find(item => {
          return item.id === row.parentId
        })
        parent[type] = row[type]
      }
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  max-height: none !important;
}
.cp-tree-select {
  width: 200px;
  display: inline-block;
}
.el-select {
  display: inline-block !important;
  vertical-align: inherit !important;
}
</style>
