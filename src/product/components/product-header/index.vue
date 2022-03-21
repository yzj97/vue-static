<template>
  <section class="section">
    <el-card>
      <!-- 餐饮商品，可选组合，显示是否勾选同一商品 -->
      <el-col :span="8">
        <el-form-item :label="$t('商品类型') + ':'" label-width="100px">
          <span>{{ typeList[mp.productInfoVO.type] }}</span>
        </el-form-item>
      </el-col>
      <el-col v-if="mp.productInfoVO.useType === 0" :span="8">
        <el-form-item :label="$t('商品类目') + ':'" label-width="100px">
          <span>{{ categoryName }}</span>
        </el-form-item>
      </el-col>
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
    const vue = this
    return {
      typeList: {
        1: vue.$t('内贸商品'),
        50: vue.$t('跨境商品'),
        31: vue.$t('称重商品'),
        32: vue.$t('餐饮商品'),
        33: vue.$t('电子礼品卡'),
        34: vue.$t('实体礼品卡'),
        35: vue.$t('电子提货卡'),
        36: vue.$t('实体提货卡')
      },
      categoryName: null,
      proValue: -1
    }
  },
  watch: {
    mp: {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        console.log('mp:' + this.mp.productInfoVO.type)
        console.log('b.c:' + val, oldVal)
        this.$emit('proType', this.mp.productInfoVO.type)
      },
      deep: true // true 深度监听
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loadFullIdPath(this.mp.productInfoVO.categoryId)
      this.loadTypes()
    },
    proType() {
      console.log(this.mp.productInfoVO.type)
    },
    async loadFullIdPath(categoryId) {
      if (categoryId) {
        const { data } = await this.$product.$api.mpApi.getCategoryDetail({
          id: categoryId
        })
        if (data && data.fullNamePath) {
          this.categoryName = data.fullNamePath
            .substring(data.fullNamePath.indexOf('>') + 1)
            .replace(/>/g, '>')
          this.$set(this.mp, 'enableAddAtt', data.enableAddAtt)
          this.$set(this.mp, 'highPrice', data.highPrice)
          this.$set(this.mp, 'lowPrice', data.lowPrice)
        }
      }
    },
    async loadTypes() {
      const vue = this
      vue.$product.$api.common.listMultiCode({
        categorys: ['PRODUCT_TYPE']
      }).then(data => {
        if (data.code === '0') {
          const productTypeList = data.data.PRODUCT_TYPE
          for (var i in productTypeList) {
            if (!this.typeList[i]) {
              this.typeList[i] = productTypeList[i]
            }
          }
        }
      })
    }

  }
}
</script>
<style scoped>
</style>
