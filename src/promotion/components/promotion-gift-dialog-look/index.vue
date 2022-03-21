<template>
  <div>
    <ody-dialog
      v-if="visible"
      :visible.sync="visible"
      :title="$t('赠品')"
      width="960px"
      @close="handleClose"
    >
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('前台选品方式')" prop="giftShowType">
              <ody-select2
                :disabled="editFlag"
                v-model="search.giftShowType"
                name="search_giftShowType"
                list-key="getGiftShowTypeList"
              />
            </ody-search-item>
            <ody-search-item :label="$t('单次赠送选品数')" prop="contentValue">
              <ody-input-number
                :disabled="editFlag"
                v-model="search.contentValue"
                :empty-tip="false"
                name="search_contentValue"
              />
            </ody-search-item>
          </el-form>
        </div>
      </ody-list-search-area>

      <ody-table
        :data="mpTable.data"
        :columns="mpTable.columns"
        :is-tree="true"
        :can-filter="false"
        :operates="!editFlag ? mpTable.operates : ''"
        :multiple="true"
        :tree-props="treeProps"
        name="mpTable_data690"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <template slot="giftNum" slot-scope="scope">
          <ody-input-number
            :empty-tip="false"
            :min="1"
            :max="1000000000"
            :disabled="editFlag"
            v-model="scope.row.giftNum"
            name="scope_row_giftNum"
            @blur.self="updatePriceAndLimit(scope.row, 'giftNum')"
          />
        </template>
        <template slot="channelMerchantLimit" slot-scope="scope">
          <ody-input-number
            :empty-tip="false"
            :min="1"
            :max="1000000000"
            :disabled="editFlag"
            v-model="scope.row.channelMerchantLimit"
            name="scope_row_channelMerchantLimit"
            @blur.self="updatePriceAndLimit(scope.row, 'channelMerchantLimit')"
          />
        </template>
        <template slot="channelStoreLimit" slot-scope="scope">
          <ody-input-number
            :empty-tip="false"
            :min="1"
            :max="1000000000"
            :disabled="editFlag"
            v-model="scope.row.channelStoreLimit"
            name="scope_row_channelStoreLimit"
            @blur.self="updatePriceAndLimit(scope.row, 'channelStoreLimit')"
          />
        </template>
        <template slot="channelIndividualLimit" slot-scope="scope">
          <ody-input-number
            :empty-tip="false"
            :min="1"
            :max="999999"
            :disabled="editFlag"
            v-model="scope.row.channelIndividualLimit"
            name="scope_row_channelIndividualLimit"
            @blur.self="updatePriceAndLimit(scope.row, 'channelIndividualLimit')"
          />
        </template>
        <template slot="giftNumLabel" slot-scope="scope">
          <ody-tip-star :content="$t('单次赠送数量')" />
        </template>
        <template slot="channelIndividualLimitLabel" slot-scope="scope">
          <ody-tip-star :content="$t('个人单渠道限购')" />
        </template>
        <template slot="channelStoreLimitLabel" slot-scope="scope">
          <ody-tip-star :content="$t('店铺单渠道限购')" />
        </template>
        <template slot="channelMerchantLimitLabel" slot-scope="scope">
          <ody-tip-star :content="$t('商家单渠道限购')" />
        </template>
      </ody-table>
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
            labelSlot: 'giftNumLabel',
            // label: this.$t('单次赠送数量'),
            slot: 'giftNum',
            minWidth: 120, show: true
          },
          {
            labelSlot: 'channelIndividualLimitLabel',
            // label: this.$t('个人单渠道限购'),
            slot: 'channelIndividualLimit',
            minWidth: 120, show: true
          },
          {
            labelSlot: 'channelStoreLimitLabel',
            // label: this.$t('店铺单渠道限购'),
            slot: 'channelStoreLimit',
            minWidth: 120, show: true
          },
          {
            labelSlot: 'channelMerchantLimitLabel',
            // label: this.$t('商家单渠道限购'),
            slot: 'channelMerchantLimit',
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

      // giftNumLabel channelIndividualLimitLabel channelStoreLimitLabel channelMerchantLimitLabel
      const hasValue = params.gifts.every(x => x.giftNum && x.channelIndividualLimit && x.channelStoreLimit && x.channelMerchantLimit)

      if (!hasValue) {
        this.$message.error(this.$t('存在必填项没有填写'))
        return false
      }

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
            x.channelIndividualLimit = y.channelIndividualLimit
            x.channelMerchantLimit = y.channelMerchantLimit
            x.channelStoreLimit = y.channelStoreLimit
            x.giftNum = y.giftNum
            x.salePrice = y.salePrice
            x.merchantName = y.merchantName
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
      if (row[type] && !/^[1-9][0-9]{0,5}$/.test(row[type])) {
        return false
      }
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
