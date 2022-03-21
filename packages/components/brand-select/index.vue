<!--
 * @Author: your name
 * @Date: 2021-08-18 15:48:23
 * @LastEditTime: 2021-08-19 22:27:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-static/packages/components/brand-select/index.vue
-->
<template>
  <div>
    <el-select
      v-model="value"
      v-bind="$attrs"
      :remote-method="getBrandList"
      :popper-append-to-body="false"
      filterable
      remote
      v-on="$listeners"
      @focus="getBrandList()"
      @change="changeBrand"
    >
      <el-option v-for="item in brandIdList" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => []
    },
    selected: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      brandIdList: []
    }
  },
  mounted() {
    // this.getBrandList()
  },
  methods: {
    async getBrandList(name) {
      const param = { currentPage: 1, itemsPerPage: 100, name: name }
      const promise = this.$api.brand.listBrand
      const { data } = await promise(param)
      this.brandIdList = data.listObj || []
    },
    changeBrand(val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select__input {
  margin-left: 10px !important;
}
/deep/ .cp-search-item {
  overflow: unset !important;
}
/deep/ .cp-list-search-area .box{
  overflow: unset;
}
/deep/ .cp-list-search-area .inner{
  overflow: unset;
}
/deep/ .el-select-dropdown__wrap {
  max-height: 320px !important;
}
/deep/ .el-scrollbar {
  max-height: 320px !important;
}
/deep/ .el-popper {
  max-height: 320px !important;
}
/deep/ .el-select-dropdown {
  max-height: 320px !important;
  position: absolute !important;
  left: 0 !important;
  top: 32px !important;
}
</style>
