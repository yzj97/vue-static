<template>
  <div class="">
    <ody-upload-image
      v-model="value"
      :show-tip="true"
      :url="url"
      :params="getParams"
      list-type="button"
      @success="handleUploaded"
    />
    <ody-upload-list :list="list" :delete="handleDelete"/>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    objectType: {
      type: String,
      default: null
    },
    objectCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [],
      fileUrl: '',
      picType: [],
      url: '/opms-web/comAttachFile/createFile.do'
    }
  },
  computed: {
    getParams() {
      return {
        file: 'file',
        jsonParams: JSON.stringify(
          {
            'objectType': this.objectType,
            'objectCode': this.objectCode
          }
        )
      }
    }
  },
  async mounted() {
    this.setList()
  },
  methods: {
    async setList() {
      this.list = await this.getList()
    },
    handleUploaded() {
      this.setList()
    },
    async getList() {
      const requestParam = {}
      if (this.objectType && this.objectCode) {
        requestParam.objectType = this.objectType
        requestParam.objectCode = this.objectCode
        const result = await this.$api.uploadAttach.selectFileList(requestParam)
        if (result && result.code === '0') {
          return result.data
        }
      }
    },
    async handleDelete(id) {
      // 重新调用接口
      const params = {
        ids: [id]
      }
      const result = await this.$api.uploadAttach.deleteFile(params)
      if (result && result.code === '0') {
        await this.setList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
