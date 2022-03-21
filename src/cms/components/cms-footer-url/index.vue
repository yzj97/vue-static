<template>
  <div class="cms-footer-url">
    <el-select v-model="value" :placeholder="$t('请选择')" name="value" @change="changeValue">
      <el-option
        v-for="item in urlOptions"
        :clearable="false"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>

  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    pageType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      urlOptions: [
        { label: this.$t('商城首页'), value: '/index.html' },
        { label: this.$t('分类页'), value: '/category.html' },
        { label: this.$t('购物车'), value: '/cart.html' },
        { label: this.$t('个人中心'), value: '/my/home.html' }
      ]
    }
  },
  watch: {
    pageType: {
      handler(val) {
        if (val !== 1) {
          this.urlOptions.push({ label: this.$t('扫码购'), value: '/scanCode.html' })
        }
      },
      immediate: true
    }
  },
  methods: {
    changeValue() {
      this.$emit('input', this.value)
    }
  }
}
</script>

<style>

</style>
