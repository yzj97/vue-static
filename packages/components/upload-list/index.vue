<template>
  <div class="cp-upload-list">
    <ody-left-right v-for="(item, index) in list" :key="index">
      <div slot="left">
        <i class="el-icon-document"/>
        <span :title="item.name + '.' + item.extName" class="text">
          {{ item.name }}.{{ item.extName }}
        </span>

      </div>
      <div slot="right">
        <i v-if="item.isDeleting" class="el-icon-loading"/>
        <i v-else class="el-icon-close" @click="handleClear(item)" />
      </div>
    </ody-left-right>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [
      ]
    },
    delete: {
      type: Function,
      default: async() => {}
    }
  },
  data() {
    return {
    }
  },
  methods: {
    async handleClear(item) {
      const confirm = await this.$confirm('确认删除？', '提示')
      if (!confirm) {
        return
      }
      item.isDeleting = true
      this.$forceUpdate()
      // item.$set('isDelete', true)
      await this.delete(item.id)
      item.isDeleting = false
      this.$forceUpdate()
      // item.$set('isDelete', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-upload-list {
  width: 300px;
  .text {
    display: inline-block;
    vertical-align: middle;
    width: 260px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .el-icon-close:hover {
    color: red;
  }
}
</style>
