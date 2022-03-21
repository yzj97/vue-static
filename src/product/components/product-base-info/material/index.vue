<template>
  <section class="section">
    <el-card :body-style="{padding: '30px 50px'}">
      <div slot="header" class="clearfix">
        <strong>{{ $t('基本属性') }}</strong>
      </div>
      <el-form-item :label="$t('原料名称') + ':'" :rules="rules.chineseName" prop="productInfoVO.chineseName">
        <el-input v-model="mp.productInfoVO.chineseName" :placeholder="$t('请输入原料名称')" name="mp_productInfoVO_chineseName" maxlength="60" />
      </el-form-item>
      <el-form-item :label="$t('原料名称(第二语言)') + ':'" prop="productInfoVO.englishName">
        <el-input v-model="mp.productInfoVO.englishName" :placeholder="$t('请输入原料名称(第二语言)')" name="mp_productInfoVO_englishName" maxlength="100" />
      </el-form-item>
      <el-col :span="12">
        <el-form-item :label="$t('原料品牌') + ':'" prop="productInfoVO.brandId">
          <el-input
            v-model="mp.productInfoVO.brandName"
            :placeholder="$t('请选择')"
            name="mp_productInfoVO_brandName"
            suffix-icon="el-icon-arrow-down"
            readonly="true"
            @click.native="openBrandModal"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('原料型号') + ':'" prop="productInfoVO.mpModel">
          <el-select v-model="mp.productInfoVO.mpModel" :placeholder="$t('请选择')" name="mp_productInfoVO_mpModel" filterable >
            <el-option
              v-for="item in mpModelList"
              :key="item.id"
              :label="item.modelName"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('原料编码') + ':'" prop="productVO.code">
          <el-input v-model="mp.productVO.code" :disabled="isEdit" :placeholder="$t('请输入原料编码')" name="mp_productVO_code" maxlength="20" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('货号') + ':'" prop="productInfoVO.artNo">
          <el-input v-model="mp.productInfoVO.artNo" :placeholder="$t('请输入货号')" name="mp_productInfoVO_artNo" maxlength="50" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <!-- 非组合商品显示主计量单位 -->
        <el-form-item :label="$t('主计量单位') + ':'" :rules="rules.mainUnitId" prop="productInfoVO.mainUnitId">
          <el-select v-model="mp.productInfoVO.mainUnitId" :disabled="isEdit" :placeholder="$t('请选择')" :remote-method="loadUnit" name="mp_productInfoVO_mainUnitId" filterable remote @focus="loadUnit()" @change="changeUnit" >
            <el-option
              v-for="item in mainUnitNameList"
              :key="item.id"
              :label="item.calculationUnitName"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="mp.productVO.typeOfProduct !== 4" :span="12"> <!-- 组合品不显示产地 -->
        <el-form-item :label="$t('产地') + ':'" prop="productInfoVO.placeOriginName">
          <el-input v-model="mp.productInfoVO.placeOriginName" :placeholder="$t('请输入产地')" name="mp_productInfoVO_placeOriginName" maxlength="20" />
        </el-form-item>
      </el-col>
    </el-card>
    <brand-modal-component :visible.sync="brandVisible" :merchant-id="mp.dataType !== 1 ? mp.productVO.merchantId : null" :list-brand="$product.$api.mpApi.listBrand" @ok="closeBrandModal" />
  </section>
</template>

<script>
import brandModalComponent from '@/components/brandModal'
export default {
  components: {
    brandModalComponent
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
      mpModelList: [], // 型号列表
      mainUnitNameList: [], // 主计量单位
      rules: {
        chineseName: [
          { required: true, message: this.$t('商品名称不能为空'), trigger: 'change' }
        ],
        mainUnitId: [
          { required: true, message: this.$t('主计量单位不能为空'), trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.mp.productInfoVO.brandId) {
        this.loadBrandList()
      }
      this.loadUnit()
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
      const param = { currentPage: 1, itemsPerPage: 100, calculationUnitName: name }
      const promise = this.$product.$api.mpApi.queryCalculationUnitByPage
      const { data } = await promise(param)
      this.mainUnitNameList = data.listObj || []
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
    }
  }
}

</script>
<style scoped>
</style>
