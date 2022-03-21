<template>
  <section class="section">
    <el-card>
      <div slot="header" class="clearfix">
        <strong>{{ $t('商品配置') }}</strong>
      </div>
      <el-row>
        <el-form-item>
          <template slot="label">
            <span>{{ $t('原料入仓') }}</span>
            <el-tooltip placement="right">
              <template slot="content">
                <div>{{ $t('入仓指的是在系统内存在仓库管理') }}</div>
                <div>{{ $t('1.当设置不入仓时，此时需要手工设置可售库存数量') }}</div>
                <div>{{ $t('2.当设置入仓时，不需手工设置库存，有实体仓库库存按映射规则自动同步库存') }}</div>
              </template>
              <i class="el-icon-info" />
            </el-tooltip>
            <span>：</span>
          </template>
          <el-radio-group v-model="mp.productInfoVO.warehouseType" name="mp_productInfoVO_warehouseType">
            <el-radio :disabled="mp.productInfoVO.type === '37'" :label="0">{{ $t('是') }}</el-radio>
            <el-radio :label="1">{{ $t('否') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-col :span="8">
          <el-form
            v-if="mp.dataType === 3"
            ref="templateForm"
            :model="templateForm"
            label-width="140px"
            class="form"
          >
            <el-form-item :label="$t('运费模板') + '：'" prop="freightTemplateId" name="freightTemplateId">
              <div class="freightAttr">
                <el-select v-model="templateForm.freightTemplateId" :placeholder="$t('请选择')" name="templateForm_freightTemplateId">
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
                  size="mini"
                  code="StoreProductListBatchTemplate"
                  @click="handleSaveFreightTemplate"
                >{{ $t('保存运费模板') }}</ody-button>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form
            v-if="mp.dataType === 3 && mp.productInfoVO.type ===32 "
            ref="operateZoneForm"
            :model="operateZoneForm"
            label-width="140px"
            class="form"
          >
            <el-form-item :label="$t('餐饮作业区域') + '：'" prop="operationAreaCode" name="operationAreaCode">
              <div class="freightAttr">
                <el-select v-model="operateZoneForm.operationAreaCode" :placeholder="$t('请选择')" name="operateZoneForm_operationAreaCode">
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
    mp: {
      type: Object,
      required: true,
      default: null
    }
  },
  data() {
    return {
      freightTemplateList: [],
      templateForm: {
        mpIdList: [],
        freightTemplateId: ''
      },
      locationCodeList: [],
      operateZoneForm: {
        mpIdList: [],
        operationAreaCode: null
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
