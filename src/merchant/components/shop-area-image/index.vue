<template>
  <ody-dialog
    :visible="visible"
    :before-close="handleClose"
    :title="$t('小程序码')"
    width="960px">
    <div class="center">
      <img :src="`/api/ouser-web/api/store/pos/getQrImg?code=${itemData.code}`" alt="">
    </div>
    <div class="center T20">
      <el-button name="downloadQr" size="small" @click="downloadQr">下载png图片</el-button>
    </div>
    <span slot="footer">
      <el-button name="handleClose" size="small" @click="handleClose">关 闭</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    downloadQr() {
      var fileName = this.$t('就餐区') + '-' + this.itemData.parentName + '-' + this.itemData.tableName
      const a = document.createElement('a')
      const event = new MouseEvent('click')
      a.download = fileName
      a.href = `/api/ouser-web/api/store/pos/getQrImg?code=${this.itemData.code}`
      a.dispatchEvent(event)
      // this.$portal.downloadFileByGet(`/api/ouser-web/api/store/pos/getQrImg?code=${this.itemData.code}`, {}, fileName)
    }
  }
}
</script>

<style lang="less" scoped>
.center {
  display: flex;
  justify-content: center;
}
.T20 {
  margin-top: 20px;
}
</style>
