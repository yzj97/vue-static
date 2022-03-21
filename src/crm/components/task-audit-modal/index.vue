<template>
  <div class>
    <ody-dialog :visible.sync="visible" :title="$t('审核')" width="400px">
      <el-form ref="form" :model="form" label-width="100px" class="form">
        <el-form-item :label="$t('审核结果:')">
          <el-radio v-model="form.isApprove" :label="1" name="form_isApprove">{{ $t('审核通过') }}</el-radio>
          <br >
          <el-radio v-model="form.isApprove" :label="0" name="form_isApprove3">{{ $t('审核拒绝') }}</el-radio>
        </el-form-item>
        <el-form-item>
          <el-input
            v-if="form.isApprove === 0"
            :rows="2"
            v-model="form.auditRemark"
            :placeholder="$t('请输入内容')"
            name="form_auditRemark"
            type="textarea"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button name="handleCloseModal" size="small" @click="handleCloseModal">{{ $t('取消') }}</el-button>
        <el-button
          name="handleSubmit"
          size="small"
          type="primary"
          @click="handleSubmit"
        >{{ $t('确定') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: {
        isApprove: 1,
        auditRemark: ''
      }
    }
  },
  methods: {
    handleCloseModal() {
      this.$emit('update:visible', false)
    },
    async handleSubmit() {
      const { id } = this
      const { ...params } = this.form

      try {
        await this.$crm.$api.mktTask.audit({
          id,
          ...params
        })
        this.$message({
          message: this.$t('已审核完毕'),
          type: 'success'
        })
        this.handleCloseModal()
        this.$emit('ok')
      } catch (ex) {
        console.error(ex)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
