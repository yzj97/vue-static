<template>
  <div>
    <ody-dialog
      v-show="!importVisible"
      :visible.sync="visible"
      :title="$t('批量导入')"
      class="batch-import-product-model"
      width="420px"
      @close="handleClose"
    >
      <div class="content">
        <el-button
          name="exportMPTemplate"
          size="small"
          type="primary"
          @click="exportMPTemplate"
        >{{ $t('下载模板') }}</el-button>
        <el-upload
          :file-list="fileList"
          :show-file-list="false"
          :data="getParams"
          :with-credentials="true"
          :on-success="handleOnSuccess"
          :before-upload="beforeUpload"
          name="file"
          accept=".xls, .xlsx"
          class="import-product-upload"
          action="/api/back-promotion-web/applyActivityUpload/importAppendMps.do"
        >
          <el-button size="small">{{ $t('商品导入') }}</el-button>
        </el-upload>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('关闭') }}</el-button>
      </span>
    </ody-dialog>

    <ody-dialog
      :visible.sync="importVisible"
      :title="$t('提示')"
      width="420px"
      @close="handleImportClose"
    >
      <div>
        <div>总记录数: {{ importResult.totalSize }}</div>
        <div>
          导入成功: {{ importResult.successSize }}, 导入失败: {{ importResult.totalSize - importResult.successSize }}
          <el-button
            v-if="importResult.failMpUrl"
            name="handleDownParsed"
            type="text"
            size="small"
            class="down-parsed"
            @click="handleDownParsed"
          >{{ $t('下载失败记录') }}</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          name="handleImportClose"
          size="small"
          type="primary"
          @click="handleImportClose"
        >确 定</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    activityId: {
      type: String,
      default: ''
    },
    promType: {
      type: String,
      default: ''
    },
    activityScheduleId: {
      type: String,
      default: null
    },
    refType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      fileList: [],
      importVisible: false,
      importResult: {}
    }
  },
  computed: {
    getParams() {
      const { activityId, promType, activityScheduleId, refType } = this
      return this.formHasValue({
        activityId,
        promType,
        activityScheduleId,
        refType
      })
    }
  },

  mounted() {},
  methods: {
    beforeUpload(file) {
      var isMac =
        navigator.platform === 'Mac68K' ||
        navigator.platform === 'MacPPC' ||
        navigator.platform === 'Macintosh' ||
        navigator.platform === 'MacIntel'
      if (isMac) {
        return true
      }
      const checkType = {
        isXls: file.type === 'application/vnd.ms-excel',
        isXlsx:
          file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
      this.picType = ['xls', 'xlsx']

      const isType = this.picType.some(key => {
        return checkType[this.$portal.changeCase('is-' + key)]
      })

      if (!isType) {
        this.$message.error(`上传附件只能是 ${this.picType.join(',')} 格式!`)
        return isType
      }

      return isType
    },
    handleImportClose() {
      this.importVisible = false
      this.handleClose()
    },
    async handleDownParsed() {
      await this.$portal.downloadFileByGet(this.importResult.failMpUrl)
    },
    exportMPTemplate() {
      this.$portal.downloadFileByGet(
        '/api/back-promotion-web/applyActivityUpload/exportMPTemplate.do',
        {
          activityId: this.activityId,
          promType: this.promType,
          productOrGoods: 0
        }
      )
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleOnSuccess(res) {
      if (res.code === '0') {
        this.importResult = res.data || {}
        this.importVisible = true
        this.$emit('close')
        // this.handleClose()
      } else {
        this.$message.error(this.$t('导入模板不正确'))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.batch-import-product-model {
  .content {
    text-align: center;
  }

  .import-product-upload {
    display: inline-block;
  }
}

.down-parsed {
  color: #1890ff !important;
}
</style>
