<template>
  <div class="cp-batch-export-button">
    <ody-button
      v-bind="$attrs"
      :code="code"
      size="small"
      v-on="$listeners"
      @click="handleExport"
    >
      <slot />
    </ody-button>
    <ody-export-task
      v-if="async"
      :append-to-body="true"
      :visible.sync="exportResultVisible"
      :pool="pool"
      :task-type="taskType"
      :is-data-task="isDataTask"
      :filter-data-auth="filterDataAuth"
      :task-id="taskId"
      :search="search"
      :handle-filter-data="handleFilterData"
    />
  </div>
</template>

<script>

export default {
  components: {

  },
  props: {
    getExportData: { type: Function, default: null, required: true },
    async: { type: Boolean, default: false },
    pool: { type: String, default: null, required: false },
    code: { type: String, default: 'ui', required: false },
    taskType: { type: String, default: null, required: false },
    isDataTask: { type: Boolean, required: false, default: true },
    filterDataAuth: { type: Boolean, required: false, default: false },
    search: { type: Function, required: false, default: null }, // 接受入参{taskType:"",limitStart:0,limitCount:10},返回Promise
    handleFilterData: { type: Function, required: false, default: null },
    exportApi: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      doing: false,
      importFileList: [],
      exportResultVisible: false,
      importResult: {},
      taskId: null
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    async handleExport() {
      if (this.doing) {
        return false
      }
      this.doing = true
      const [poolName, fileName, methodName] = this.exportApi
      const url = this.getUrl(poolName, fileName, methodName)
      const data = this.getExportData()
      try {
        if (this.async) {
          const res = await this.$portal.post(url, data)
          this.taskId = res.data.id
          this.$alert(this.$t('exportPromptInfoSuccess') + this.taskId, this.$t('system_hints'), {
            confirmButtonText: this.$t('common_confirm_search'),
            callback: action => {
              if (action === 'confirm') {
                this.exportResultVisible = true
              }
              this.doing = false
            }
          })
        } else {
          await this.$portal.downloadFileByPost('/api/' + url, data, null, 'ajax')
          this.doing = false
          this.$message({
            message: this.$t('common_export') + this.$t('common_success'),
            type: 'success'
          })
        }
      } catch (ex) {
        console.error(ex)
        this.doing = false
      }
    },
    handleExportResultClose() {
      this.exportResultVisible = false
      this.handleClose()
    },
    handleClose() {
      this.visible = false
    },
    getUrl(poolName, fileName, methodName) {
      return '/' + poolName + '/' + fileName + '/' + methodName
    }
  }
}
</script>
<style lang="scss">
.cp-batch-export-button {
  &__content {
    text-align: center;
    &__btn {
      display: inline-block;
      margin: 0 5px;
    }
  }
  &__down-parsed{
    color: #1890FF !important;
  }
}
</style>
<style lang="less" scoped>
  .cp-batch-export-button {
    display: inline-block;
    .download-btn {
      width: 50%;
    }
  }
</style>
