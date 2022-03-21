<template>
  <div>
    <ody-dialog
      v-show="!importVisible"
      :visible.sync="visible"
      :title="$t('批量导入赠品')"
      class="batch-import-product-model"
      width="420px"
      @close="handleClose">

      <div class="content">
        <ody-button
          name="ui_exportMPTemplate"
          code="ui"
          size="small"
          type="primary"
          @click="exportMPTemplate"
        >
          {{ $t('下载模板') }}
        </ody-button>
        <el-upload
          :file-list="fileList"
          :name="name"
          :show-file-list="false"
          :data="{
            merchantType: 1,
            promotionId: promotionId,
            promotionRuleId: giftPromotionRuleId
          }"
          :with-credentials="true"
          :on-success="handleOnSuccess"
          :before-upload="beforeUpload"
          accept=".xls,.xlsx"
          class="import-product-upload"
          action="/api/back-promotion-web/giftWrite/importLevelGifts.do"
        >
          <ody-button
            name="ui"
            code="ui"
            size="small"
          >
            {{ $t('赠品导入') }}
          </ody-button>
        </el-upload>

      </div>

      <span slot="footer" class="dialog-footer">
        <ody-button
          name="ui_handleClose"
          code="ui"
          size="small"
          @click="handleClose"
        >
          {{ $t('关闭') }}
        </ody-button>
      </span>

    </ody-dialog>

    <ody-dialog
      :visible.sync="importVisible"
      :title="$t('提示')"
      width="420px"
      @close="handleImportClose">
      <div>
        <div>总记录数: {{ importResult.totalSize }}</div>
        <div>
          导入成功: {{ importResult.successSize }}, 导入失败: {{ importResult.totalSize - importResult.successSize }}
          <ody-button v-if="!!importResult.failMpUrl" name="handleDownParsed" type="text" size="small" class="down-parsed" @click="handleDownParsed">{{ $t('下载失败记录') }}</ody-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleImportClose" size="small" type="primary" @click="handleImportClose">确 定</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>

export default {
  components: {

  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    promotionId: {
      type: String,
      default: null
    },
    giftPromotionRuleId: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: 'file'
    }
  },
  data() {
    return {
      fileList: [],
      importVisible: false,
      importResult: {}
    }
  },
  mounted() {

  },
  methods: {
    beforeUpload(file) {
      const checkType = {
        isXls: file.type === 'application/vnd.ms-excel',
        isXlsx: file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
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
    async exportMPTemplate() {
      await this.$portal.downloadFileByGet('/api/back-promotion-web/applyActivityUpload/exportGiftMPTemplate.do', {
      })
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleOnSuccess(res) {
      if (res.code === '0') {
        this.importResult = res.data || {}
        this.importVisible = true
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .batch-import-product-model{
    .content{
      text-align: center;
    }

    .import-product-upload{
      display: inline-block;
    }
  }

  .down-parsed{
    color: #1890FF !important;
  }
</style>
