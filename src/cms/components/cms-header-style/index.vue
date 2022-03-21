<template>
  <div class="cms-header-style">
    <el-radio-group v-model="value" name="value" @change="changeVal">
      <el-radio :label="1" class="label">样式1</el-radio>
      <el-radio :label="2" class="label">样式2</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
const iconStyle = {
  1: {
    locationIcon: '//cdn.oudianyun.com/dev/cms/1590387467351_83.25100597514134_f989f65d-f494-44f5-bc4c-ec9e0c2ac10e.png', // 定位icon
    downIcon: '//cdn.oudianyun.com/dev/cms/1590387552190_94.19667470510048_56ff2e05-b9d7-4a85-9c1d-83f26f771762.png', // 下拉icon
    newsIcon: '//cdn.oudianyun.com/dev/cms/1590387572419_4.740975334912689_065bda0c-3f45-4631-82c9-e45dad3dabd6.png', // 消息icon
    searchIcon: '//cdn.oudianyun.com/dev/cms/1590387595257_26.68603087157545_a9694a26-acfd-4167-b4f3-b06e9e54a203.png', // 搜索icon
    scanIcon: '//cdn.oudianyun.com/dev/cms/1591244611988_24.94969003567199_e1cab8a9-e391-44ba-bcf2-526ad2675f2e.png' // 搜索icon
  },
  2: {
    locationIcon: '//cdn.oudianyun.com/dev/cms/1590383387804_34.31105044340627_54b59d9f-fe8b-42e2-a1d5-08fdec0643c3.png', // 定位icon
    downIcon: '//cdn.oudianyun.com/dev/cms/1590383506801_27.300444023254332_18051e32-15e8-4410-b65a-fe0900acca19.png', // 下拉icon
    newsIcon: '//cdn.oudianyun.com/dev/cms/1590383850877_6.371562221532134_20bd54fd-c872-404a-9a2d-642947fd6cf0.png', // 消息icon
    searchIcon: '//cdn.oudianyun.com/dev/cms/1590383796913_78.73430264368241_4e85528d-8d82-483c-8edb-197bdd628984.png', // 搜索icon
    scanIcon: '//cdn.oudianyun.com/dev/cms/1591242504592_70.74052966858486_357052f4-4c1e-463c-a50c-fe2f62be455a.png' // 搜索icon
  }
}
export default {
  props: {
    value: {
      type: Number,
      default: 1
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    changeVal() {
      this.$emit('input', this.value)
      this.formData.model.locationIcon = iconStyle[this.value].locationIcon
      this.formData.model.downIcon = iconStyle[this.value].downIcon
      this.formData.model.newsIcon = iconStyle[this.value].newsIcon
      this.formData.model.searchIcon = iconStyle[this.value].searchIcon
      this.formData.model.scanIcon = iconStyle[this.value].scanIcon
    }
  }
}
</script>

<style scoped lang="scss">

</style>
