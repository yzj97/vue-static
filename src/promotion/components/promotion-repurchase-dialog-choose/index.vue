<template>
  <ody-choose
    v-if="visible"
    :visible="visible"
    :search-config="choose.searchConfig"
    :search-value="choose.searchValue"
    :request-url="choose.requestUrl"
    :columns="choose.columns"
    :checked="selected"
    :choose-key="chooseKey"
    :multiple="multiple"
    :highlight-current-row="!multiple"
    :title="$t('选择商品')"
    :search-format="searchFormat"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template slot="categoryType" slot-scope="scope">
      <el-row>
        <el-col :span="6">
          <el-select v-model="scope.row.categoryType" :clearable="false" :placeholder="$t('请选择')" name="scope_row_categoryType">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="categoryIds">
            <ody-category-tree-select v-model="scope.row.categoryIds" name="scope_row_categoryIds" class="choose-tree" />
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <template slot="brandType" slot-scope="scope">
      <el-row>
        <el-col :span="6">
          <el-select v-model="scope.row.brandType" :clearable="false" :placeholder="$t('请选择')" name="scope_row_brandType">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="brandIds">
            <ody-brand-select v-model="scope.row.brandIds" :multiple="true" name="scope_row_brandIds" collapse-tags />
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <template slot="merchantIds" slot-scope="scope">
      <ody-merchant-select v-model="scope.row.merchantIds" :multiple="true" name="scope_row_merchantIds" collapse-tags value-key="merchantId" />
    </template>
    <template slot="storeIds" slot-scope="scope">
      <ody-store-select
        v-model="scope.row.storeIds"
        :multiple="true"
        name="scope_row_storeIds"
        collapse-tags
        value-key="storeId" />
    </template>
    <template slot="upgradeAmount" slot-scope="scope">
      <ody-input-number v-model="scope.row.upgradeAmount" :min="0.01" :max="999999.99" :decimal="2" name="scope_row_upgradeAmount"/>
    </template>
    <template slot="channelIndividualLimit" slot-scope="scope">
      <ody-input-number v-model="scope.row.channelIndividualLimit" :min="1" :max="1000000000" name="scope_row_channelIndividualLimit"/>
    </template>
    <template slot="channelStoreLimit" slot-scope="scope">
      <ody-input-number v-model="scope.row.channelStoreLimit" :min="1" :max="1000000000" name="scope_row_channelStoreLimit"/>
    </template>
    <template slot="channelMerchantLimit" slot-scope="scope">
      <ody-input-number v-model="scope.row.channelMerchantLimit" :min="1" :max="1000000000" name="scope_row_channelMerchantLimit"/>
    </template>
    <template slot="upgradeAmountLable">
      <div>
        <ody-tip-star :content="$t('换购价(元)')"/>
      </div>
    </template>
    <template slot="channelIndividualLimitLabel">
      <div>
        <ody-tip-star :content="$t('个人单渠道限购')"/>
      </div>
    </template>
    <template slot="channelStoreLimitLabel">
      <div>
        <ody-tip-star :content="$t('店铺单渠道限购')"/>
      </div>
    </template>
    <template slot="channelMerchantLimitLabel">
      <div>
        <ody-tip-star :content="$t('商家单渠道限购')"/>
      </div>
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
    visible: {
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
      options: [],
      brandIdsOptions: [],
      merchantIdsOptions: [],
      categoryOptions: [
        {
          value: '1',
          label: this.$t('包含')
        },
        {
          value: '0',
          label: this.$t('不包含')
        }
      ],
      merchantSelected: [],
      choose: {
        searchConfig: [
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            type: 'input'
          },
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            type: 'input'
          },
          {
            label: this.$t('商品条码'),
            prop: 'barcode',
            type: 'input'
          },
          {
            label: this.$t('类目选择'),
            slot: 'categoryType'
          },
          {
            label: this.$t('商品品牌'),
            slot: 'brandType'
          },
          {
            label: this.$t('商家名称'),
            slot: 'merchantIds'
          }
        ],
        searchValue: {
          mpName: '',
          mpCode: '',
          barcode: '',
          categoryIds: [],
          categoryType: '1',
          brandIds: [],
          brandType: '1',
          merchantIds: [],
          ...this.params
        },
        requestUrl: '/back-promotion-web/promotionChannelRead/queryOmnichannelProductList.do',
        columns: [
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('商品条码'),
            prop: 'barcode',
            show: true,
            minWidth: 100
          },
          {
            label: this.$t('计量单位'),
            prop: 'measurementUnit',
            show: true,
            minWidth: 80
          },
          {
            label: this.$t('所属商家名称'),
            prop: 'merchantName',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('原价（元）'),
            prop: 'price',
            show: true,
            minWidth: 120
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
        ]
      }
    }
  },
  mounted() {

  },
  methods: {

    searchFormat(params) {
      return {
        obj: params
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    checkData(batch) {
      const checkResult = {
        flg: true,
        errMsg: ''
      }

      if (batch.channelMerchantLimit === undefined) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('商家单渠道限购数不应该为空，请重新填写')
      }

      if (batch.channelStoreLimit === undefined) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('店铺单渠道限购数不应该为空，请重新填写')
      }

      if (batch.channelIndividualLimit === undefined) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('个人单渠道限购数不应该为空，请重新填写')
      }

      if (!batch.upgradeAmount) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('换购价不应该为空，请重新填写')
      }

      if (+batch.channelStoreLimit > +batch.channelMerchantLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('店铺单渠道限购数应小于商家单渠道限购数，请重新填写')
      }

      if (+batch.channelIndividualLimit > +batch.channelMerchantLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('个人单渠道限购数应小于商家单渠道限购数，请重新填写')
      }

      if (+batch.channelIndividualLimit > +batch.channelStoreLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('个人单渠道限购数应小于店铺单渠道限购数，请重新填写')
      }

      if (!checkResult.flg) {
        this.$message({
          type: 'error',
          message: checkResult.errMsg
        })
      }

      return checkResult.flg
    },
    handleSubmit(val) {
      if (val.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请选择赠品')
        })
        return
      }

      for (let index = 0; index < val.length; index++) {
        const flag = this.checkData(val[index])
        if (!flag) {
          return
        }
      }

      this.$emit('ok', val)
      this.$emit('update:selected', val)
      this.handleClose()
    },
    changeInput(node) {
      this.choose.searchValue.categoryIds = node
    }
  }
}
</script>
<style lang="less" scoped>
 .box{
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
