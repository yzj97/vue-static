<template>
  <ody-choose
    :visible.sync="goodsVisible"
    :search-config="choose.searchConfig"
    :search-value="choose.searchValue"
    :request-url="choose.requestUrl"
    :columns="choose.columns"
    :checked="selected"
    :choose-key="chooseKey"
    :multiple="true"
    :highlight-current-row="!multiple"
    :title="$t('添加报名商品')"
    :search-format="searchFormat"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template slot="settlementPrice" slot-scope="scope">
      <ody-input-number
        v-if="settlementPriceShowConfig"
        v-model="scope.row.settlementPrice"
        :decimal="2"
        :min="0.01"
        :max="999999"
        name="scope_row_contentValue"
        @blur="checkPrice(scope.row)"/>
    </template>
    <template slot="storeIds" slot-scope="scope">
      <el-form-item prop="storeIds">
        <ody-store-select
          v-model="scope.row.storeIds"
          :multiple="false"
          :placeholder="$t('请输入查询')"
          name="scope_row_storeIds"
          collapse-tags
          value-key="storeId"
        />
      </el-form-item>
    </template>
  </ody-choose>
</template>

<script>
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    goodsVisible: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => []
    },
    chooseKey: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      settlementPriceShowConfig: false,
      mpAddRequest: {},
      options: [],
      choose: {
        searchConfig: [
          {
            label: this.$t('商品名称'),
            prop: 'merchantProductName',
            type: 'input'
          },
          {
            label: this.$t('商品编码'),
            prop: 'code',
            type: 'input'
          }
        ],
        searchValue: {
          name: null, // 商品名称
          code: null, // 商品编码
          ...this.params
        },
        requestUrl:
          '/back-promotion-web/supplierEnrollRead/queryMerchantProductList.do',
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'code',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商品名称'),
            prop: 'name',
            show: true,
            minWidth: 260
          },
          {
            label: this.$t('是否已选'),
            prop: 'chooseFlag',
            show: true,
            minWidth: 120,
            formatter: (row, column, cellValue) => {
              return row.chooseFlag === true ? '已选' : '未选'
            }
          },
          {
            label: this.$t('原结算价'),
            prop: 'originalSettlePrice',
            show: () => {
              return this.settlementPriceShowConfig
            },
            minWidth: 120
          },
          {
            label: this.$t('添加结算价'),
            slot: 'settlementPrice',
            show: () => {
              return this.settlementPriceShowConfig
            },
            minWidth: 120
          },
          {
            label: this.$t('原价(元)'),
            prop: 'salesPrice',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商品起订量'),
            prop: 'orderStartNum',
            show: () => {
              return this.canOrderStartNumShow === 1
            },
            minWidth: 120
          },
          {
            label: this.$t('商品起订倍数'),
            prop: 'orderMultiple',
            show: () => {
              return this.canOrderMultipleShow === 1
            },
            minWidth: 120
          }
        ],
        searchs: [
          'code',
          'name'
        ]
      }
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  methods: {
    selectable(row, index) {
      return !row.markChoosed
    },
    handleClose() {
      this.$emit('update:goodsVisible', false)
      this.$emit('cancel')
    },
    handleSubmit(val) {
      this.$emit('ok', val)
      this.$emit('update:addSelectedMP', val)
      this.handleClose()
    },
    changeInput(node) {
      this.choose.searchValue.categoryIds = node
    },
    searchFormat(params) {
      return {
        obj: params
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
</style>
