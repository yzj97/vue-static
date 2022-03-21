<template>
  <div>
    <el-select v-model="value" :placeholder="$t('请选择')" name="value">
      <el-option
        v-for="item in list"
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
    }
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods: {
    getCategoryList() {
      const params = {
        'filters': {
          'platform': 2,
          'isAvailable': 1
        }
      }

      this.$cms.$api.cmsEdit.getCmsCategory(params).then(res => {
        const arr = []
        const loopFun = (res) => {
          res.map(item => {
            if (item.children && item.children.length > 0) {
              loopFun(item.children)
            } else {
              arr.push({
                value: item.id,
                label: item.categoryName
              })
            }
          })
        }
        if (res.data && res.data[0] && res.data[0].children) {
          loopFun(res.data[0].children)
          this.list = arr
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
