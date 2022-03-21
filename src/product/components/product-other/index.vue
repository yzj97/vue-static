<template>
  <section class="section">
    <el-card>
      <div slot="header" class="clearfix">
        <strong>{{ $t('商品配置') }}</strong>
      </div>
      <el-row>
        <el-form-item v-if="mp.productVO.typeOfProduct !== 4">
          <template slot="label">
            <span>{{ $t('商品履约方式') }}</span>
            <el-tooltip placement="right">
              <template slot="content">
                <div>{{ $t('仓库自发：将商品存入仓库，订单通过仓库作业发货') }}</div>
                <div>{{ $t('无仓自发：订单不通过仓库发货，直接线下手工发货') }}</div>
              </template>
              <i class="el-icon-info" />
            </el-tooltip>
            <span>：</span>
          </template>
          <el-radio-group
            v-model="mp.productInfoVO.warehouseType"
            name="mp_productInfoVO_warehouseType"
            @change="handleChangeWarehouseType"
          >
            <el-radio
              :disabled="mp.productInfoVO.type === '33' || mp.productInfoVO.type === '35' || mp.productInfoVO.type === '37'"
              :label="0"
            >{{ $t('仓库自发') }}</el-radio>
            <el-radio :label="1">{{ $t('无仓自发') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 启用追溯码 -->
        <el-form-item v-if="mp.productVO.typeOfProduct !== 4">
          <template slot="label">
            <span>{{ $t('启用追溯码') }}</span>
            <span>：</span>
          </template>
          <el-radio-group
            v-model="mp.productVO.canTrace"
            name="mp_productVO_canTrace"
          >
            <el-radio
              :disabled="mp.productInfoVO.type === '33' || mp.productInfoVO.type === '35'"
              :label="1"
            >{{ $t('是') }}</el-radio>
            <el-radio :label="0">{{ $t('否') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 批次管理 -->
        <el-form-item v-if="mp.productInfoVO.warehouseType === 0" :label="$t('批次管理') + '：'">
          <el-radio-group v-model="mp.productInfoVO.isSupportedBatchStrategy" name="mp_productInfoVO_isSupportedBatchStrategy" @change="handleChangeBatchStrategy">
            <el-radio :label="1">{{ $t('是') }}</el-radio>
            <el-radio :label="0">{{ $t('否') }}</el-radio>
          </el-radio-group><span style="color: #AAAAAA">&emsp;{{ $t('批次策略修改时请谨慎处理（已入库的批次记录不会同步更新）') }}</span>
          <el-row v-if="mp.productInfoVO.isSupportedBatchStrategy === 1">
            <el-col :span="10">
              <el-form-item :label="$t('批次策略') + '：'" :rules="rules.batchStrategyId" prop="productInfoVO.batchStrategyId" name="productInfoVO.batchStrategyId">
                <el-col :span="12">
                  <el-select v-model="mp.productInfoVO.batchStrategyId" name="mp_productInfoVO_batchStrategyId">
                    <el-option
                      v-for="item in batchStrategyList"
                      :key="item.id"
                      :label="item.batchStrategyName"
                      :value="item.id"/>
                  </el-select>
                </el-col>
                <el-col :span="1">
                  <ody-button code="ui" size="small" type="text" @click="loadBatchStrategyList">刷新</ody-button>
                </el-col>
              </el-form-item>
              <el-form-item :label="$t('前往设置')" style="margin-top: 10px;margin-left: 70px;">
                <ody-button code="ui" size="small" type="text" @click="handleSetBatchStrategy">批次策略</ody-button>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('出库策略') + '：'" :rules="rules.outboundStrategy" prop="productInfoVO.outboundStrategy" name="productInfoVO.outboundStrategy">
                <el-select v-model="mp.productInfoVO.outboundStrategy" name="mp_productInfoVO_outboundStrategy">
                  <el-option
                    v-for="item in outboundStrategyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 支付发票 -->
        <el-form-item v-if="mp.productVO.typeOfProduct !== 4" :label="$t('支持发票') + '：'">
          <el-radio-group v-model="mp.productInfoVO.isInvoice" name="mp_productInfoVO_isInvoice">
            <el-radio :label="1">{{ $t('是') }}</el-radio>
            <el-radio :label="0">{{ $t('否') }}</el-radio>
          </el-radio-group>
          <div v-if="mp.productInfoVO.isInvoice === 1">
            <el-col :span="10">
              <el-form-item :label="$t('支持增票') + '：'">
                <el-radio-group
                  v-model="mp.productInfoVO.isVatInvoice"
                  name="mp_productInfoVO_isVatInvoice"
                >
                  <el-radio :label="1">{{ $t('是') }}</el-radio>
                  <el-radio :label="0">{{ $t('否') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('强制发票') + '：'">
                <el-radio-group
                  v-model="mp.productInfoVO.isForceInvoice"
                  name="mp_productInfoVO_isForceInvoice"
                >
                  <el-radio :label="1">{{ $t('是') }}</el-radio>
                  <el-radio :label="0">{{ $t('否') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </div>
        </el-form-item>
        <!-- 餐饮才有后加工 -->
        <el-form-item v-if="mp.productInfoVO.type === '32' &&mp.productVO.typeOfProduct !== 4">
          <template slot="label">
            <span>{{ $t('启用后加工') }}</span>
            <el-tooltip placement="right">
              <template slot="content">
                <div>{{ $t('启用后加工的商品，先由商家预估可售的数量再进行销售。前端只检查商品库存，不检查原料库存，下单后系统根据BOM（物料清单）更新商品和原料的库存。') }}</div>
              </template>
              <i class="el-icon-info" />
            </el-tooltip>
            <span>：</span>
          </template>
          <el-radio-group
            v-model="mp.productInfoVO.machiningType"
            name="mp_productInfoVO_machiningType"
          >
            <el-radio :label="2">{{ $t('是') }}</el-radio>
            <el-radio :label="0">{{ $t('否') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-col :span="18">
          <el-form
            v-if="mp.dataType === 3 && mp.productVO.typeOfProduct !== 4"
            ref="templateForm"
            :model="templateForm"
            label-width="140px"
            class="form"
          >
            <el-form-item :label="$t('运费模板') + '：'" prop="freightTemplateId" name="freightTemplateId">
              <div class="freightAttr">
                <el-select
                  v-model="templateForm.freightTemplateId"
                  :placeholder="$t('请选择')"
                  name="templateForm_freightTemplateId"
                >
                  <el-option
                    v-for="item in freightTemplateList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <ody-button
                  name="handleSaveFreightTemplate"
                  type="primary"
                  size="small"
                  code="StoreProductListBatchTemplate"
                  @click="handleSaveFreightTemplate"
                >{{ $t('保存运费模板') }}</ody-button>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form
            v-if="mp.dataType === 3 && mp.productInfoVO.type ==='32' "
            ref="operateZoneForm"
            :model="operateZoneForm"
            label-width="140px"
            class="form"
          >
            <el-form-item :label="$t('餐饮作业区域') + '：'" prop="operationAreaCode" name="operationAreaCode">
              <div class="freightAttr">
                <el-select
                  v-model="operateZoneForm.operationAreaCode"
                  :placeholder="$t('请选择')"
                  name="operateZoneForm_operationAreaCode"
                >
                  <el-option
                    v-for="item in locationCodeList"
                    :key="item.code"
                    :label="item.locationName"
                    :value="item.code"
                  />
                </el-select>
                <ody-button
                  name="handleSaveOperateZone"
                  type="primary"
                  size="mini"
                  code="StoreProductListBatchZone"
                  @click="handleSaveOperateZone"
                >{{ $t('保存餐饮区域') }}</ody-button>
              </div>
            </el-form-item>
            <el-form-item v-if="mp.productVO.typeOfProduct !== 4" :label="$t('支持发票') + '：'">
              <el-radio-group v-model="mp.productInfoVO.isInvoice" name="mp_productInfoVO_isInvoice">
                <el-radio :label="1">{{ $t('是') }}</el-radio>
                <el-radio :label="0">{{ $t('否') }}</el-radio>
              </el-radio-group>
              <div v-if="mp.productInfoVO.isInvoice === 1">
                <el-col :span="6">
                  <el-form-item :label="$t('支持增票') + '：'">
                    <el-radio-group
                      v-model="mp.productInfoVO.isVatInvoice"
                      name="mp_productInfoVO_isVatInvoice"
                    >
                      <el-radio :label="1">{{ $t('是') }}</el-radio>
                      <el-radio :label="0">{{ $t('否') }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="$t('强制发票') + '：'">
                    <el-radio-group
                      v-model="mp.productInfoVO.isForceInvoice"
                      name="mp_productInfoVO_isForceInvoice"
                    >
                      <el-radio :label="1">{{ $t('是') }}</el-radio>
                      <el-radio :label="0">{{ $t('否') }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>

<script>
export default {
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      required: false,
      default: false
    },
    mp: {
      type: Object,
      required: true,
      default: null
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      batchStrategyList: [],
      outboundStrategyList: [],
      freightTemplateList: [],
      templateForm: {
        mpIdList: [],
        freightTemplateId: ''
      },
      locationCodeList: [],
      operateZoneForm: {
        mpIdList: [],
        operationAreaCode: null
      },
      rules: {
        batchStrategyId: [
          {
            required: true,
            message: this.$t('请选择批次策略'),
            trigger: 'change'
          }
        ],
        outboundStrategy: [
          {
            required: true,
            message: this.$t('请选择出库策略'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.templateForm.freightTemplateId = this.mp.productVO.freightTemplateId
      this.templateForm.mpIdList.push(this.mp.productVO.id)
      this.operateZoneForm.operationAreaCode = this.mp.productVO.operationAreaCode
      this.operateZoneForm.mpIdList.push(this.mp.productVO.id)
      this.loadFreightTemplateList()
      this.loadOperateZoneList()
      this.loadBatchStrategyList()
      this.loadOutboundStrategyList()
    },
    loadFreightTemplateList() {
      if (this.mp.dataType === 3) {
        this.$product.$api.mpApi
          .queryFreightTemplateListByMerchantId({
            merchantId: this.mp.productVO.merchantId
          })
          .then(res => {
            this.freightTemplateList = res.data
          })
      }
    },
    loadOperateZoneList() {
      if (this.mp.dataType === 3 && this.mp.productInfoVO.type === 32) {
        this.$product.$api.common
          .queryStoreLocation({
            storeId: this.mp.productVO.storeId
          })
          .then(res => {
            this.locationCodeList = res.data
          })
      }
    },
    loadBatchStrategyList() {
      if (this.mp.productVO.merchantId) {
        const filters = {}
        if (this.isView) {
          filters.batchStrategyId = this.mp.productVO.batchStrategyId
          filters.q = 'all'
        } else {
          filters.merchantId = this.mp.productVO.merchantId
        }
        this.$product.$api.batchStrategyApi.listPage({ filters: filters, page: 1, limit: 1000 }).then(res => {
          this.batchStrategyList = res && res.data ? res.data : []
        })
      }
    },
    loadOutboundStrategyList() {
      this.$product.$api.productApi.listCategories({}).then(res => {
        this.outboundStrategyList = []
        if (res && res.data && res.data['OUTBOUND_STRATEGY']) {
          for (const key in res.data['OUTBOUND_STRATEGY']) {
            this.outboundStrategyList.push({ label: res.data['OUTBOUND_STRATEGY'][key], value: parseInt(key) })
          }
        }
      })
    },
    handleSaveFreightTemplate() {
      if (this.templateForm.freightTemplateId) {
        this.$product.$api.mpApi
          .updateStoreMpFreightTemplate(this.templateForm)
          .then(res => {
            this.$message.success(this.$t('保存运费模板成功'))
          })
      } else {
        this.$message.info(this.$t('please_choose_the_shipping_template'))
      }
    },
    handleSaveOperateZone() {
      if (this.operateZoneForm.operationAreaCode) {
        this.$product.$api.mpApi
          .updateStoreMpOperateZone(this.operateZoneForm)
          .then(res => {
            this.$message.success(this.$t('保存操作区域成功'))
          })
      } else {
        this.$message.info(this.$t('请选择餐饮区域'))
      }
    },
    handleSetBatchStrategy() {
      this.$router.push({
        name: 'BatchStrategyList'
      })
    },
    handleChangeWarehouseType(v) {
      if (v === 1) {
        this.resetBatchStrategy()
      }
    },
    handleChangeBatchStrategy(v) {
      if (v === 0) {
        this.resetBatchStrategy()
      }
    },
    resetBatchStrategy() {
      this.mp.productInfoVO.isSupportedBatchStrategy = 0
      this.mp.productInfoVO.batchStrategyId = null
      this.mp.productInfoVO.outboundStrategy = null
    }
  }
}
</script>
<style scoped>
.freightAttr {
  display: flex;
}
.freightAttr > button {
  margin-left: 10px;
}
</style>
