<template>
  <div class="">
    <ody-dialog
      :visible.sync="visible"
      :title="$t('新增静态分组')"
      :append-to-body="true"
      width="600px"
      @close="handleClose"
      @open="init">
      <el-form ref="form" :model="formInline" :rules="rules" label-width="100px" class="form">
        <el-form-item :label="$t('分组名称')" prop="groupName">
          <el-input v-model="formInline.groupName" :placeholder="$t('请输入分组名称')" name="formInline_groupName" maxlength="20"/>
        </el-form-item>
        <el-form-item :label="$t('所属分类')" prop="userClassifyId">
          <crm-user-classify-select v-model="formInline.userClassifyId" :placeholder="$t('请选择分类')" name="formInline_userClassifyId" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <div class="line-top"/>
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('tinymce_cancel') }}</el-button>
        <ody-button name="handleSubmit" size="small" type="primary" @click="handleSubmit">{{ $t('tinymce_confirm') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import CrmUserClassifySelect from '@/components/user-classify-select'

export default {
  components: {
    CrmUserClassifySelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: String,
      default: null
    },
    pageNodeId: {
      type: String,
      default: null
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formInline: {
        groupName: null,
        userClassifyId: null
      },
      rules: {
        groupName: [
          { required: true, message: this.$t('请输入分组名称'), trigger: 'change' }
        ],
        userClassifyId: [
          { required: true, message: this.$t('请选择分类'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    sleep(timer) {
      return new Promise(resolve => {
        setTimeout(resolve, timer)
      })
    },
    async handleSubmit() {
      const [err] = await this.formValidate('form')
      const { taskId: mktId, pageNodeId: mktPageNodeId, params } = this

      if (err) {
        return false
      }

      try {
        await this.$crm.$api.userGroup.saveMkt({
          mktId,
          mktPageNodeId,
          ...params,
          ...this.formInline
        })
        this.$message({
          message: this.$t('common.saveSuccess'),
          type: 'success'
        })
        this.handleClose()
        this.$emit('ok')
        // 延迟600ms关闭弹窗，弹窗关闭有个渐变时间，这段时间如果同样点击，按钮有效
        await this.sleep(600)
      } catch (ex) {
        console.error(ex)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
