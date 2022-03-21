<template>
  <el-tabs v-model="uploadType">
    <el-tab-pane :label="$t('快速上传')" name="fastUpload">
      <FastUpload/>
    </el-tab-pane>
    <el-tab-pane :label="$t('精细化上传')" name="upload">
      <Upload/>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import FastUpload from './fast-upload'
import Upload from './upload'

export default {
  name: 'ProductBatch',
  components: {
    FastUpload,
    Upload
  },
  data() {
    return {
      uploadType: 'fastUpload'
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    init() {

    }
  }
}
</script>

<style lang="less" scoped>
</style>
