<template>
  <div>
    <product-create :data-type="dataType" />
  </div>
</template>

<script>
import productCreate from '../' // 选择商品类型页
export default {
  name: 'ProductCreateMerchant',
  components: {
    productCreate
  },
  data() {
    return {
      dataType: 2
    }
  },
  mounted(d) {
  },
  methods: {
  }
}
</script>
<style scoped>

</style>
