<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" class="form">
          <ody-search-item :label="$t('价目表编码')" prop="priceSheetCode">
            <el-input v-model="search.priceSheetCode" name="search_priceSheetCode" />
          </ody-search-item>
          <ody-search-item :label="$t('价目表名称')" prop="priceSheetName">
            <el-input v-model="search.priceSheetName" name="search_priceSheetName" />
          </ody-search-item>
          <ody-search-item :label="$t('有效期')" prop="validDate">
            <ody-date-range-picker v-model="search.validDate" name="search_validDate" type="date" />
          </ody-search-item>
          <ody-search-item :label="$t('商家')" prop="merchantId">
            <ody-merchant-select
              ref="merchant"
              v-model="search.merchantId"
              name="search_merchantId"
              value-key="merchantId"
              @change="handleMerchantSelect"
            />
          </ody-search-item>
          <ody-search-item :label="$t('客户编码')" prop="customerCodes">
            <el-input v-model="search.customerCodes" name="search_customerCodes" />
          </ody-search-item>
          <ody-search-item :label="$t('状态')" prop="status">
            <ody-select2 v-model="search.status" name="search_status" list-key="advancePriceStatusList" />
          </ody-search-item>
          <ody-search-item :label="$t('渠道')" prop="channelCodes">
            <ody-channel-select ref="channel" v-model="search.channelCodes" name="search_channelCodes" />
          </ody-search-item>
          <ody-search-item :label="$t('店铺')" prop="storeCodes">
            <ody-store-select v-model="search.storeCodes" name="search_storeCodes" />
          </ody-search-item>
          <ody-search-item :label="$t('销售区域')" prop="areaCodes">
            <el-select v-model="search.areaCodes" name="search_areaCodes" @focus="handleAreaCodesFocus">
              <el-option
                v-for="item in areaCodeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('定价对象编码')" prop="refCode">
            <el-input v-model="search.refCode" name="search_refCode" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="MerchantAdvancedPricingPageQuery"
          size="small"
          type="primary"
          code="MerchantAdvancedPricingPageQuery"
          @click.prevent="handleSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          name="MerchantAdvancedPricingAdd"
          size="small"
          type="primary"
          code="MerchantAdvancedPricingAdd"
          @click.prevent="handleAdd"
        >{{ $t('新增') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :can-filter="false"
          request-url="/back-product-web/back/price/merchantProductPrice/listPriceSheetByPage.do"
        >
          <template
            slot="merchantId"
            slot-scope="scope"
          >{{ scope.row.merchantId | keyVal(getMerchantMap) }}</template>
          <template slot="createTime" slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
          <template slot="status" slot-scope="scope">{{ scope.row.status | keyVal(getStatusMap) }}</template>
          <template slot="startDate" slot-scope="scope">{{ scope.row.startDate | parseTime('{y}-{m}-{d}') }}</template>
          <template slot="endDate" slot-scope="scope">{{ scope.row.endDate | parseTime('{y}-{m}-{d}') }}</template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>

<script>
import constant from 'packages/utils/constant/'
export default {
  name: 'MerchantAdvancedPricing',
  data() {
    return {
      areaCodeList: [],
      search: {
        priceSheetCode: '',
        priceSheetName: '',
        validDate: [],
        merchantId: '',
        customerCodes: '',
        status: '',
        channelCodes: '',
        storeCodes: '',
        areaCodes: '',
        refCode: ''
      },
      table: {
        columns: [
          {
            label: this.$t('价目表编码'),
            prop: 'priceSheetCode',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('价目表名称'),
            prop: 'priceSheetName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商家'),
            slot: 'merchantId',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('创建时间'),
            slot: 'createTime',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('优先级'),
            prop: 'sort',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('状态'),
            slot: 'status',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('有效期起'),
            slot: 'startDate',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('有效期止'),
            slot: 'endDate',
            minWidth: 120,
            show: true
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              method: (index, row) => {
                this.$router.push({
                  name: 'MerchantAdvancedPricingEdit',
                  params: { id: row.id }
                })
              },
              code: 'MerchantAdvancedPricingEdit'
            }
          ]
        }
      }
    }
  },
  computed: {
    getMerchantMap() {
      return this.$refs.merchant.$refs.select2.options.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getStatusMap() {
      return constant.advancePriceStatusList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  async mounted() {
    await this.query()
  },
  methods: {
    handleReset() {
      this.areaCodeList = []
      this.formReset('search')
    },
    async handleSubmit() {
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }
      await this.query()
    },
    query() {
      const {
        validDate: [startDate, endDate],
        ...params
      } = this.search

      params.startDate = startDate
      params.endDate = endDate

      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    handleMerchantSelect(merchantId) {
      console.log(merchantId)
    },
    handleAreaCodesFocus() {
      if (this.search.merchantId) {
        this.$product.$api.userApi
          .querySalesAreaByMerchantId({ merchantId: this.search.merchantId })
          .then(res => {
            this.areaCodeList = []
            if (res.data) {
              res.data.map(item => {
                this.areaCodeList.push({
                  value: item.areaCode,
                  label: item.areaName
                })
              })
            }
          })
      } else {
        this.$message.info(this.$t('请选择商家'))
      }
    },
    handleAdd() {
      this.$router.push({ name: 'MerchantAdvancedPricingEdit' })
    }
  }
}
</script>

<style scoped>
</style>
