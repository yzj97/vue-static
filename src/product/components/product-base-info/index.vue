<template>
  <section class="section">
    <el-form
      ref="product-base-info"
      :model="mp"
      :rules="rules"
      :disabled="isView"
      class="form"
      label-width="140px"
    >
      <el-card :body-style="{padding: '30px 50px'}">
        <div slot="header" class="clearfix">
          <strong>{{ $t('基本属性') }}</strong>
        </div>
        <el-form-item
          :label="$t('商品名称') + ':'"
          :rules="rules.chineseName"
          prop="productInfoVO.chineseName"
          name="productInfoVO.chineseName"
        >
          <el-input
            v-model="mp.productInfoVO.chineseName"
            :placeholder="$t('请输入商品名称')"
            name="mp_productInfoVO_chineseName"
            maxlength="60"
          />
        </el-form-item>
        <el-form-item :label="$t('商品名称(第二语言)') + ':'" prop="productInfoVO.englishName" name="productInfoVO.englishName">
          <el-input
            v-model="mp.productInfoVO.englishName"
            :placeholder="$t('请输入商品名称(第二语言)')"
            name="mp_productInfoVO_englishName"
            maxlength="100"
          />
        </el-form-item>
        <el-col v-if="mp.productInfoVO.type === '31' || mp.productInfoVO.type === '32'" :span="12">
          <!-- 快捷码 餐饮、称重显示快捷码  -->
          <el-form-item :label="$t('快捷码') + ':'">
            <el-col :span="22">
              <el-input
                v-model="mp.productInfoVO.fastCode"
                :placeholder="$t('请输入快捷码')"
                name="mp_productInfoVO_fastCode"
                maxlength="60"
              />
            </el-col>
            <el-col :span="2">
              <el-tooltip
                :content="$t('一般使用商品名称的首字母作为快捷码，用于快速查找商品')"
                class="item"
                effect="light"
                placement="right"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col
          v-if="mp.productInfoVO.type === '1' || mp.productInfoVO.type === '50' || mp.productInfoVO.type === '31' || mp.productInfoVO.type === '32'"
          :span="12"
        >
          <el-form-item :label="$t('商品品牌') + ':'" prop="productInfoVO.brandId" name="productInfoVO.brandId">
            <el-input
              v-model="mp.productInfoVO.brandName"
              :placeholder="$t('请选择')"
              :clearable="true"
              class="readonly"
              name="mp_productInfoVO_brandName"
              @clear="clearBrand"
              @focus="openBrandModal"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="mp.productInfoVO.type === '1' || mp.productInfoVO.type === '50'" :span="12">
          <!-- 常规商品显示型号 -->
          <el-form-item :label="$t('商品型号') + ':'" prop="productInfoVO.mpModel" name="productInfoVO.mpModel">
            <el-select
              v-model="mp.productInfoVO.mpModel"
              :placeholder="$t('请选择')"
              name="mp_productInfoVO_mpModel"
              filterable
            >
              <el-option
                v-for="item in mpModelList"
                :key="item.id"
                :label="item.modelName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('SPU编码') + ':'"
            :rules="isEdit ? rules.code : []"
            prop="productVO.code"
            name="productVO.code"
          >
            <el-input
              v-model="mp.productVO.code"
              :disabled="isEdit"
              :placeholder="$t('请输入SPU编码')"
              name="mp_productVO_code"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col
          v-if="mp.productInfoVO.type === '31' || mp.productInfoVO.type === '32' || mp.productInfoVO.type === '1' || mp.productInfoVO.type === '50' "
          :span="12"
        >
          <el-form-item :label="$t('货号') + ':'" prop="productInfoVO.artNo" name="productInfoVO.artNo">
            <el-input
              v-model="mp.productInfoVO.artNo"
              :placeholder="$t('请输入货号')"
              name="mp_productInfoVO_artNo"
              maxlength="50"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="showFeild" :span="12">
          <!-- 非组合商品显示主计量单位 -->
          <el-form-item
            :label="$t('主计量单位') + ':'"
            :rules="rules.mainUnitId"
            prop="productInfoVO.mainUnitId"
            name="productInfoVO.mainUnitId"
          >
            <el-select
              v-model="mp.productInfoVO.mainUnitId"
              :placeholder="$t('请选择')"
              :disabled="isEdit"
              :remote-method="loadUnit"
              name="mp_productInfoVO_mainUnitId"
              filterable
              remote
              popper-class="mainUnitId-select"
              @focus="loadUnit()"
              @change="changeUnit"
            >
              <el-option
                v-for="item in mainUnitNameList"
                :key="item.id"
                :label="item.calculationUnitName"
                :value="item.id"
              />
            </el-select>
            <ody-input-number
              v-if="mp.productInfoVO.mainUnitId && mp.productInfoVO.type === '31'&& mp.productInfoVO.mainUnitCode!=='g'"
              v-model="mp.productInfoVO.conversionRate"
              :decimal="2"
              :min="0.01"
              name="mp_productInfoVO_conversionRate"
            >
              <template slot="prepend">1{{ mp.productInfoVO.mainUnitName }}=</template>
              <template slot="append">{{ $t('克') }}</template>
            </ody-input-number>
          </el-form-item>
        </el-col>
        <el-col v-if="showFeild" :span="12">
          <!-- 组合品不显示产地 -->
          <el-form-item :label="$t('产地') + ':'" prop="productInfoVO.placeOriginName" name="productInfoVO.placeOriginName">
            <el-input
              v-model="mp.productInfoVO.placeOriginName"
              :placeholder="$t('请输入产地')"
              name="mp_productInfoVO_placeOriginName"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('副标题') + ':'" prop="productInfoVO.subtitle" name="productInfoVO.subtitle">
            <el-input
              v-model="mp.productInfoVO.subtitle"
              :placeholder="$t('请输入副标题')"
              name="mp_productInfoVO_subtitle"
              maxlength="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('副标题(第二语言)') + ':'" prop="productInfoVO.subtitleLan2" name="productInfoVO.subtitleLan2">
            <el-input
              v-model="mp.productInfoVO.subtitleLan2"
              :placeholder="$t('请输入副标题(第二语言)')"
              name="mp_productInfoVO_subtitleLan2"
              maxlength="200"
            />
          </el-form-item>
        </el-col>
        <el-col
          v-if=" mp.productInfoVO.type === '1' || mp.productInfoVO.type === '50' || mp.productInfoVO.type ==='31' || mp.productInfoVO.type ==='32'"
          :span="12"
        >
          <el-form-item
            v-if="showSupplier"
            :label="$t('关联供应商') + ':'"
            prop="productInfoVO.supplierName"
            name="productInfoVO.supplierName"
          >
            <el-input
              v-if="showSupplier"
              v-model="mp.productInfoVO.supplierName"
              :placeholder="$t('请选择')"
              :clearable="true"
              class="readonly"
              name="mp_productInfoVO_supplierName"
              @clear="handleClearSupplier"
              @focus="openSupplierModal"
            />
          </el-form-item>
        </el-col>
        <el-col
          v-if=" mp.productInfoVO.type ==='33'|| mp.productInfoVO.type ==='34' || mp.productInfoVO.type ==='35' ||mp.productInfoVO.type ==='36'"
          :span="12"
        >
          <el-form-item
            :label="$t('购买后有效期')"
            :rules="rules.expiryDateType"
            prop="productInfoVO.expiryDateType"
            name="productInfoVO.expiryDateType"
          >
            <el-radio-group
              v-model="mp.productInfoVO.expiryDateType"
              name="mp_productInfoVO_expiryDateType"
              @change="changeExpiryDateType()"
            >
              <el-row :span="12">
                <el-radio :label="1">{{ $t('permanent_validity') }}</el-radio>
              </el-row>
              <el-row :span="12">
                <el-radio :label="2">
                  <ody-input-number
                    v-model="mp.productInfoVO.expiryDateValue"
                    :disabled="expiryDateTypeFlag"
                    :min="1"
                    :max="9999"
                    :empty-tip="false"
                    name="mp_productInfoVO_expiryDateValue"
                  >
                    <el-select
                      slot="append"
                      v-model="mp.productInfoVO.expiryDateUnit"
                      :disabled="expiryDateTypeFlag"
                      :placeholder="$t('请选择')"
                      name="mp_productInfoVO_expiryDateUnit"
                      style="width:100px"
                    >
                      <el-option v-for="(v,k) in expiryDateUnitList" :label="v" :key="k" :value="k" />
                    </el-select>
                  </ody-input-number>
                </el-radio>
              </el-row>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-card>
      <brand-modal-component
        :visible.sync="brandVisible"
        :list-brand="$product.$api.mpApi.listBrand"
        :merchant-id="mp.dataType !== 1 ? mp.productVO.merchantId : null"
        @ok="closeBrandModal"
      />
      <supplierModalComponent
        :visible.sync="supplierVisible"
        :merchant-id="mp.productVO.merchantId"
        @ok="closeSupplierModal"
      />
    </el-form>
  </section>
</template>

<script>
import brandModalComponent from '@/components/brandModal'

const giftCardProductTypes = ['33', '34', '35', '36'] // 礼品卡商品类型,
function isGiftCard(typeCode) {
  return giftCardProductTypes.indexOf(typeCode) > -1
}

import supplierModalComponent from '@/components/supplierModal'
export default {
  components: {
    brandModalComponent,
    supplierModalComponent
  },
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
      brandVisible: false,
      supplierVisible: false,
      expiryDateTypeFlag: true,
      showFeild: true,
      showSupplier: true,
      mpModelList: [], // 型号列表
      mainUnitNameList: [], // 主计量单位
      unitList: [], // 购买时间段单位
      expiryDateUnitList: [],
      rules: {
        chineseName: [
          {
            required: true,
            message: this.$t('商品名称不能为空'),
            trigger: 'change'
          }
        ],
        code: [
          {
            required: true,
            message: this.$t('SPU编码不可为空'),
            trigger: 'change'
          }
        ],
        mainUnitId: [
          {
            required: true,
            message: this.$t('主计量单位不能为空'),
            trigger: 'change'
          },
          { validator: this.checkRate, trigger: 'change' }
        ],
        expiryDateType: [
          {
            required: true,
            message: this.$t('请选择有效期类型'),
            trigger: 'change'
          },
          { validator: this.checkExpiryDateTypeAndValue, trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    checkRate(rule, value, callback) {
      if (
        this.mp.productInfoVO.mainUnitId &&
        this.mp.productInfoVO.type === '31' &&
        this.mp.productInfoVO.mainUnitCode !== 'g'
      ) {
        if (!this.mp.productInfoVO.conversionRate) {
          callback(new Error('转换率必填'))
        }
      }
      callback()
    },
    checkExpiryDateTypeAndValue(rule, value, callback) {
      if (isGiftCard(this.mp.productInfoVO.type)) {
        if (this.mp.productInfoVO.expiryDateType === 2) {
          if (!this.mp.productInfoVO.expiryDateValue) {
            callback(new Error('购买后有效期时间必填'))
          }
          if (!this.mp.productInfoVO.expiryDateUnit) {
            callback(new Error('购买后有效期时间单位必填'))
          }
        }
      }
      callback()
    },
    async init() {
      if (this.mp.productInfoVO.brandId) {
        this.loadBrandList()
      }
      await this.loadUnit()
      if (this.mp.productVO.typeOfProduct === 4 || isGiftCard(this.mp.productInfoVO.type)) {
        this.setDefaultUnit('Pcs')
      }
      if (isGiftCard(this.mp.productInfoVO.type)) {
        this.loadExpiryDateUnit()
      }

      if (this.mp.productVO.typeOfProduct === 4) {
        this.showFeild = false
        this.showSupplier = false
      } else {
        if (isGiftCard(this.mp.productInfoVO.type)) {
          if (!this.mp.productVO.id) {
            this.mp.productInfoVO.expiryDateType = 1
          } else {
            if (this.mp.productInfoVO.expiryDateType === 2) {
              this.expiryDateTypeFlag = false
            }
          }
          this.showFeild = false
        }
        this.showSupplier = true
      }
      // 利率转换, 如果有实际值，则用实际值替换掉试试计算出的原本值（因为原本值实时计算可能会有精度问题）
      if (this.mp.productInfoVO.conversionValue && this.mp.productInfoVO.conversionRate) {
        this.mp.productInfoVO.conversionRate = this.mp.productInfoVO.conversionValue
      }
    },
    async loadBrandList() {
      const promise = this.$product.$api.mpApi.viewBrandInfoById
      const { data } = await promise({ id: this.mp.productInfoVO.brandId })
      this.changeBrand(true, data)
    },
    changeBrand(keepModel, brand) {
      this.mpModelList = []
      if (brand) {
        this.$set(this.mp.productInfoVO, 'brandName', brand.name)
        this.mpModelList = brand.brandModel || []
      }
      if (keepModel !== true) {
        this.mp.productInfoVO.mpModel = null
      }
    },
    changeUnit() {
      if (this.mp.productInfoVO.mainUnitId) {
        for (var i = 0; i < this.mainUnitNameList.length; i++) {
          const item = this.mainUnitNameList[i]
          if (item.id === this.mp.productInfoVO.mainUnitId) {
            this.mp.productInfoVO.mainUnitCode = item.calculationUnitCode
            this.mp.productInfoVO.mainUnitName = item.calculationUnitName
            return
          }
        }
      }
      this.mp.productInfoVO.mainUnitCode = null
      this.mp.productInfoVO.mainUnitName = null
    },
    async loadUnit(name) {
      const param = {
        currentPage: 1,
        itemsPerPage: 500,
        calculationUnitName: name
      }
      const promise = this.$product.$api.mpApi.queryCalculationUnitByPage
      const { data } = await promise(param)
      this.mainUnitNameList = data.listObj || []
    },
    setDefaultUnit(key) {
      this.mainUnitNameList.forEach((element) => {
        if (element.calculationUnitCode === key) {
          this.mp.productInfoVO.mainUnitId = element.id
          this.mp.productInfoVO.mainUnitCode = element.calculationUnitCode
          this.mp.productInfoVO.mainUnitName = element.calculationUnitName
        }
      })
    },
    // 打开品牌模态框
    openBrandModal() {
      if (this.isView) {
        return
      }
      this.brandVisible = !this.brandVisible
    },
    // 关闭品牌模态框
    closeBrandModal(selectVal) {
      // 返回模态框返回的对象
      if (selectVal) {
        if (this.mp.productInfoVO.brandId !== selectVal.id) {
          this.mp.productInfoVO.mpModel = null
        }
        this.mp.productInfoVO.brandId = selectVal.id
        this.$set(this.mp.productInfoVO, 'brandName', selectVal.name)
        this.mpModelList = selectVal.brandModel || []
      }
    },
    clearBrand() {
      this.$set(this.mp.productInfoVO, 'mpModel', null)
      this.$set(this.mp.productInfoVO, 'brandId', null)
      this.$set(this.mp.productInfoVO, 'brandName', null)
      this.mpModelList = []
    },
    // 打开供应商选择框
    openSupplierModal() {
      if (this.isView) {
        return
      }
      this.supplierVisible = !this.supplierVisible
    },
    // 关闭供应商模态框
    closeSupplierModal(selectVal) {
      // 返回模态框返回的对象
      if (selectVal) {
        this.mp.productInfoVO.supplierId = selectVal.orgId
        this.mp.productInfoVO.supplierCode = selectVal.orgCode
        this.mp.productInfoVO.supplierName = selectVal.orgName
        this.mp.productInfoVO.isInnerSupplier = selectVal.isInnerMerchant
        this.$set(this.mp.productInfoVO, 'supplierName', selectVal.orgName)
      }
    },
    handleClearSupplier() {
      this.$set(this.mp.productInfoVO, 'supplierId', null)
      this.$set(this.mp.productInfoVO, 'supplierCode', null)
      this.$set(this.mp.productInfoVO, 'supplierName', null)
      this.$set(this.mp.productInfoVO, 'isInnerSupplier', null)
      this.$emit('clear')
    },
    async loadExpiryDateUnit() {
      this.$product.$api.common
        .listMultiCode({ categorys: ['EXPIRY_DATE_UNIT'] })
        .then((data) => {
          if (data.code === '0') {
            this.expiryDateUnitList = data.data.EXPIRY_DATE_UNIT
          }
        })
    },
    changeExpiryDateType() {
      if (this.mp.productInfoVO.expiryDateType === 1) {
        this.expiryDateTypeFlag = true
        if (this.mp.productInfoVO.expiryDateValue) {
          this.mp.productInfoVO.expiryDateValue = ''
        }
        if (this.mp.productInfoVO.expiryDateUnit) {
          this.mp.productInfoVO.expiryDateUnit = ''
        }
      } else {
        this.expiryDateTypeFlag = false
      }
    },
    preSubmit() {
      this.$refs['product-base-info'].validate((valid) => {})
    }
  }
}
</script>
<style lang="scss">
.readonly {
  /deep/ {
    input {
      background-color: #fff !important;
    }
  }
}
.mainUnitId-select{
  max-height: 300px !important;
  .el-scrollbar{
    height: 280px !important;
  }
}
</style>
