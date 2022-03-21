<template>
  <ody-dialog
    :title="$t('查看')"
    :visible.sync="visible"
    :before-close="handleBack"
    width="960px">
    <el-form ref="form" :model="comment" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('咨询时间')">
            {{ comment.consultTime | parseTime }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('商品编码')">
            {{ comment.code }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('咨询人账号')">
            {{ comment.userTelephone }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('商品类目')">
            {{ comment.categoryName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('显示状态')">
            {{ comment.showStatusStr }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('商品名称')">
            {{ comment.chineseName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('回复状态')">
            {{ comment.answerStatusStr }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('回复时间')">
            {{ comment.answerTime }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('回复人账号')">
            {{ comment.answerUsername }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('咨询类型')">
            {{ comment.consultTypeName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('来源渠道')">
            {{ comment.channelName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('咨询内容')">
        {{ comment.content }}
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button name="handleBack" size="small" type="primary" @click="handleBack">{{ $t('关闭') }}</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    handleBack() {
      this.$emit('update:visible', !this.visible)
    }
  }
}
</script>

<style scoped>

</style>
