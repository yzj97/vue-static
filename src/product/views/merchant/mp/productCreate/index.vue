<template>
  <div>
    <div v-if="step === 1">
      <product-step1 :create-mp.sync="createMp" @next="next" />
    </div>
    <!-- 创建商品 -->
    <div v-if="createMp.displayView === 1">
      <!-- 保存商品成功记录历史 -->
      <div v-if="step === 2 || step === 3" v-show="step === 2">
        <product-step2 ref="productStep2" :create-mp.sync="createMp" @cancel="backCreate" @next="next" />
      </div>
      <div v-if="step === 3 && createMp.productInfoVO.useType === 0">
        <product :create-mp.sync="createMp" @ok="saveCategoryHistory" @back="backCreate" />
      </div>
      <div v-if="step === 3 && createMp.productInfoVO.useType === 1">
        <product-material :create-mp.sync="createMp" @back="backCreate" />
      </div>
    </div>

    <div v-if="createMp.displayView === 2">
      <div v-if="step === 2">
        <div>{{ $t('导入图片页面') }}</div>
        <el-button name="step" type="primary" @click="step = 1">
          {{ $t('返回') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import productStep1 from '../productStep1' // 选择商品类型页
import productStep2 from '../productStep2' // 选择类目
import product from '../product' // 创建商品页面
import productMaterial from '../product/material/detail' // 创建商品页面
export default {
  components: {
    productStep1,
    productStep2,
    product,
    productMaterial
  },
  props: {
    dataType: {
      type: Number,
      required: true,
      default: null
    }
  },
  data() {
    return {
      step: 1,
      createMp: getDefaultFrom()
    }
  },
  mounted(d) {
    // 根据dataType区分是商家商品还是运营商品
    this.createMp.dataType = this.dataType
  },
  methods: {
    initData() {
      const dataType = this.createMp.dataType
      this.createMp = getDefaultFrom()
      this.createMp.dataType = dataType
    },
    next() { // 下一步
      this.step = this.step + 1
    },
    backCreate() { // 取消
      this.initData()
      this.step = 1
    },
    saveCategoryHistory() {
      this.$refs['productStep2'].storeCategoryHistory()
    }
  }
}
function getDefaultFrom() {
  return Object.assign({}, {
    displayView: 1, // 1: 创建商品，2：导入图片，3：批量创建，4：批量修改
    dataType: 1,
    productVO: {
      merchantId: null,
      typeOfProduct: null
    },
    productInfoVO: {
      categoryId: null,
      type: 1,
      useType: 0, // 默认成品
      categoryFullIdPath: null
    }
  })
}
</script>
<style scoped>

</style>
