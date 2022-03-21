<template>
  <div class="fitting-house-modal">
    <ody-dialog-full-right
      :visible.sync="visible"
      :title=" !!fittingId ? $t('编辑拟合仓') : $t('新增拟合仓')"
      width="65%"
      @close="handleHideDialog"
      @open="handleInit"
    >
      <div>
        <el-card class="fitting-card">
          <div slot="header">
            <span>{{ $t('仓库信息') }}</span>
          </div>
          <el-form
            ref="fittingForm"
            :model="fittingFormModel"
            :rules="fittingRules"
            label-width="180px"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('拟合仓编码')" prop="warehouseCode">
                  <el-input
                    v-model="fittingFormModel.warehouseCode"
                    :disabled="!!fittingId"
                    name="fittingFormModel_warehouseCode"
                    maxlength="10"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('拟合仓名称')" prop="warehouseName">
                  <el-input
                    v-model="fittingFormModel.warehouseName"
                    name="fittingFormModel_warehouseName"
                    maxlength="20"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('商家')" prop="merchantId">
                  <el-select
                    v-model="fittingFormModel.merchantId"
                    :disabled="!!fittingId"
                    :placeholder="$t('请选择商家')"
                    :popper-append-to-body="false"
                    name="fittingFormModel_merchantId"
                    popper-class="popperStyle"
                    class="merchant-select"
                    @change="handleMerchantChange"
                  >
                    <el-option
                      v-for="item in merchantList"
                      :key="item.merchantId"
                      :label="item.merchantName"
                      :value="item.merchantId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item>
                  <span slot="label"><ody-tip-star :content="$t('覆盖区域')"/></span>
                  <el-button
                    name="StockFittingHouseManageChooseArea_areaFocus"
                    type="primary"
                    size="small"
                    code="StockFittingHouseManageChooseArea"
                    @click="areaFocus"
                  >{{ $t('选择') }}</el-button>
                  <span>{{ $t('已选择') }}{{ fittingFormModel.area.length }}{{ $t('个') }}</span>
                  <span v-if="fittingFormModel.area.length == 0 && showAreaTips" style="color: red">{{ $t('请选择覆盖区域') }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>

        <el-card class="fitting-card">
          <div slot="header">
            <span>{{ $t('渠道店铺可售数量') }}</span>
          </div>
          <ody-list-table-area>
            <div slot="btn">
              <ody-button
                name="StockFittingHouseManageAddStoreSaleNum_addStock"
                type="primary"
                size="small"
                code="StockFittingHouseManageAddStoreSaleNum"
                @click="addStock"
              >{{ $t('新增') }}</ody-button>
            </div>
            <div slot="table">
              <ody-table :data="mappingList" :columns="columns" :can-filter="false" name="mappingList474">
                <template slot="assignType" slot-scope="scope">
                  <el-select
                    v-model="scope.row.assignType"
                    :placeholder="$t('请选择')"
                    name="scope_row_assignType"
                    @change="handleCenterMappingAssignTypeChange(scope.row)"
                  >
                    <el-option
                      v-for="item in mappingAssignTypes"
                      :key="item.assignType"
                      :label="item.assignTypeName"
                      :value="item.assignType"
                    />
                  </el-select>
                </template>

                <template slot="assignValue" slot-scope="scope">
                  <ody-input-number
                    v-model="scope.row.assignValue"
                    :min="1"
                    :max="999"
                    :empty-tip="false"
                    :disabled="scope.row.assignType == 3"
                    name="scope_row_assignValue"
                    style="width:150px"
                  >
                    <template slot="append">%</template>
                  </ody-input-number>
                </template>

                <template slot="alarmValue" slot-scope="scope">
                  <ody-input-number
                    v-model="scope.row.alarmValue"
                    :min="1"
                    :max="999"
                    :empty-tip="false"
                    name="scope_row_alarmValue"
                  />
                </template>

                <template slot="isNeedHold" slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.isNeedHold"
                    :true-label="1"
                    :false-label="0"
                    name="scope_row_isNeedHold"
                  >{{ $t('是') }}</el-checkbox>
                </template>

                <template slot="holdLevel" slot-scope="scope">
                  <ody-input-number
                    v-model="scope.row.holdLevel"
                    :disabled="!scope.row.isNeedHold"
                    :min="1"
                    :max="99"
                    :empty-tip="false"
                    name="scope_row_holdLevel"
                  />
                </template>

                <template slot="isAvailable" slot-scope="scope">
                  <el-switch
                    v-model="scope.row.isAvailable"
                    :active-value="1"
                    :inactive-value="0"
                    :active-text="$t('启用')"
                    name="scope_row_isAvailable"
                  />
                </template>
              </ody-table>
            </div>
          </ody-list-table-area>
        </el-card>
      </div>
      <span slot="footer">
        <el-row type="flex" justify="center">
          <el-button name="handleHideDialog" @click="handleHideDialog">{{ $t('返回') }}</el-button>
          <ody-button
            name="StockFittingHouseManageSaveOrUpdate_handleSave"
            type="primary"
            code="StockFittingHouseManageSaveOrUpdate"
            @click="handleSave"
          >{{ $t('保存') }}</ody-button>
        </el-row>
      </span>
    </ody-dialog-full-right>

    <add-shop-stock-modal
      v-if="shopStockVisible"
      :stock-visible.sync="shopStockVisible"
      :merchant-id="fittingFormModel.merchantId"
      :shop-ids="shopIds"
      :is-fitting="isFitting"
      @ok="handleOk"
    />

    <ody-area-choose
      v-if="areaVisible"
      :visible="areaVisible"
      :set-data="fittingFormModel.area"
      @cancel="handleCloseAreaDialog"
      @ok="getAreaData"
    />
  </div>
</template>

<script>
import addShopStockModal from '@/components/addShopStockModal'

const coveragesByWarehouseIdUrl =
  '/back-product-web/back/stock/storeWarehouse/listCoveragesByWarehouseId/'
const listChannelsUrl =
  '/back-product-web/back/stock/storeWarehouse/listChannels/'

export default {
  components: {
    addShopStockModal
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    fittingId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      oldAreaData: [],
      warehouseParams: {
        warehouseType: 1,
        isAvailable: 1,
        isVirtualWarehouse: 1
      },
      showAreaTips: false,
      areaVisible: false,
      isFitting: false,
      areaShowVal: '',
      fittingFormModel: {
        warehouseCode: '',
        warehouseName: '',
        merchantCode: '',
        merchantId: '',
        merchantName: '',
        isAvailable: 1,
        area: []
      },
      fittingRules: {
        warehouseCode: [
          {
            required: true,
            message: this.$t('请输入拟合仓编码'),
            trigger: 'change'
          }
        ],
        warehouseName: [
          {
            required: true,
            message: this.$t('请输入拟合仓名称'),
            trigger: 'change'
          }
        ],
        merchantId: [
          {
            required: true,
            message: this.$t('请选择商家'),
            trigger: 'change'
          }
        ]
      },
      mappingList: [],
      shopIds: [],
      mappingAssignTypes: [
        {
          assignType: 1,
          assignTypeName: this.$t('按比例')
        },
        {
          assignType: 3,
          assignTypeName: this.$t('共享')
        }
      ],
      columns: [
        {
          show: true,
          prop: 'storeName',
          label: this.$t('店铺'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          slot: 'assignType',
          label: this.$t('分配模式'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          slot: 'assignValue',
          label: this.$t('分配值'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          slot: 'alarmValue',
          label: this.$t('置零阈值'),
          align: 'center'
        },
        {
          show: true,
          slot: 'isNeedHold',
          label: this.$t('渠道独享'),
          align: 'center'
        },
        {
          show: true,
          slot: 'holdLevel',
          label: this.$t('独占优先级'),
          align: 'center'
        },
        {
          show: true,
          slot: 'isAvailable',
          label: this.$t('操作'),
          align: 'center',
          minWidth: 80
        }
      ],
      shopStockVisible: false
    }
  },
  mounted() {
    this.loadMerchantList()
  },
  methods: {
    handleMerchantChange(val) {
      const merchantItem = this.merchantList.filter(item => {
        return val === item.merchantId
      })[0]
      this.fittingFormModel.merchantName = merchantItem.merchantName
      this.fittingFormModel.merchantCode = merchantItem.merchantCode
      this.mappingList = []
    },
    getAreaData(data) {
      this.areaVisible = false

      this.fittingFormModel.area = data.map(item => {
        item.areaId = item.id
        delete item.id
        return item
      })
    },
    handleCloseAreaDialog() {
      this.areaVisible = false
    },
    getStoreWarehouseDetail() {
      this.$product.$api.stockApi.getStockDetail(
        JSON.stringify(this.fittingId)
      ).then(res => {
        if (+res.code === 0) {
          this.fittingFormModel.warehouseCode = res.data.warehouseCode
          this.fittingFormModel.warehouseName = res.data.warehouseName
          this.fittingFormModel.merchantCode = res.data.merchantCode
          this.fittingFormModel.merchantId = res.data.merchantId
          this.fittingFormModel.merchantName = res.data.merchantName
          this.fittingFormModel.isAvailable = res.data.isAvailable
        }
      })
    },
    getCoveragesByWarehouseList() {
      this.$portal
        .post(
          `${coveragesByWarehouseIdUrl}${this.fittingId}.do`,
          this.warehouseParams
        )
        .then(res => {
          if (+res.code === 0) {
            let data = res.data
            if (data) {
              data = data.map(item => {
                item.code = +item.districtCode
                return item
              })
              this.oldAreaData = data
              this.fittingFormModel.area = data
            }
          }
        })
    },
    getStoreChannelsList() {
      this.$portal
        .post(`${listChannelsUrl}${this.fittingId}.do`, this.warehouseParams)
        .then(res => {
          if (+res.code === 0) {
            this.mappingList = res.data.map(item => {
              if (item.assignValue !== null) {
                item.assignValue = item.assignValue * 100
              }
              return item
            })
          }
        })
    },
    handleInit() {
      if (this.fittingId) {
        this.getStoreWarehouseDetail()
        this.getCoveragesByWarehouseList()
        this.getStoreChannelsList()
      } else {
        this.fittingFormModel = {
          warehouseCode: '',
          warehouseName: '',
          merchantCode: '',
          merchantId: '',
          merchantName: '',
          isAvailable: 1,
          area: []
        }
        this.shopIds = []
      }
      this.oldAreaData = []
    },
    async loadMerchantList() {
      const merchant = await this.$product.$api.merchantApi.queryPlatformAuthMerchantPage(
        {
          currentPage: 1,
          itemsPerPage: 1000
        }
      )
      this.merchantList = merchant.data.listObj
    },
    handleOk(val) {
      this.mappingList.push(val)
    },
    addStock() {
      if (!this.fittingFormModel.merchantId) {
        this.$message({
          type: 'warning',
          message: this.$t('请先选择商家')
        })
        return
      }
      this.shopStockVisible = true

      this.shopIds = this.mappingList.map(item => {
        return item.storeId
      })
      this.isFitting = true
    },
    areaFocus() {
      this.areaVisible = true
    },
    handleHideDialog() {
      this.$emit('update:visible', false)
      this.mappingList = []
      this.$emit('update:fittingId', '')
    },
    handleCenterMappingAssignTypeChange(row) {
      if (row.assignType === 3) {
        row.assignValue = 100
      }
    },
    handleDealArea() {
      let warehouseCoverageList = JSON.parse(
        JSON.stringify(this.fittingFormModel.area)
      )

      const chooseCodes = warehouseCoverageList.map(item => {
        return item.code
      })

      this.oldAreaData = this.oldAreaData.map(item => {
        if (!chooseCodes.includes(+item.districtCode)) {
          item.isAvailable = 0
        } else {
          item.isAvailable = 1
        }

        return item
      })

      warehouseCoverageList = this.oldAreaData.concat(warehouseCoverageList)

      const hash = {}
      warehouseCoverageList = warehouseCoverageList.reduce(function(
        item,
        next
      ) {
        hash[next.districtCode || next.code]
          ? ''
          : (hash[next.districtCode || next.code] = true && item.push(next))
        return item
      },
      [])

      const areaArr = []
      warehouseCoverageList.map(item => {
        const areaObj = {}

        areaObj.countryCode = item.parentCodeList
          ? item.parentCodeList[0]
          : +item.countryCode
        areaObj.provinceCode = item.parentCodeList
          ? item.parentCodeList[1]
          : +item.provinceCode
        areaObj.cityCode = item.parentCodeList
          ? item.parentCodeList[2]
          : +item.cityCode
        areaObj.districtCode = item.code

        if (item.checked) {
          areaObj.isAvailable = 1
        } else {
          areaObj.isAvailable = item.isAvailable
        }

        areaObj.merchantId = this.fittingFormModel.merchantId
        areaObj.storeWarehouseId = this.fittingId ? this.fittingId : ''
        areaObj.id = item.id

        areaArr.push(areaObj)
      })

      return areaArr
    },
    async handleSave() {
      const [err] = await this.formValidate('fittingForm')

      if (err) {
        if (this.fittingFormModel.area.length === 0) {
          this.showAreaTips = true
        }
        return
      }

      if (this.fittingFormModel.area.length === 0) {
        this.showAreaTips = true
        return
      }

      let params = {
        channelList: this.mappingList,
        warehouseCoverageList: this.handleDealArea(),
        id: this.fittingId ? this.fittingId : ''
      }

      params = Object.assign(params, this.fittingFormModel)
      const res = await this.$product.$api.stockApi.saveStoreWarehouse(params)

      if (res.code === 0 || res.code === '0') {
        this.$emit('update:visible', false)
        this.$emit('ok')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fitting-house-modal {
  .fitting-card {
    border: none;
    box-shadow: none;

    /deep/ .el-card__header {
      padding: 13px 0px;
      font-size: 14px;
      color: #455a64;
      font-weight: bold;
    }

    .merchant-select {
      display: block;
    }
  }
}
/deep/  .popperStyle{
     top:236px !important;
  }
</style>
