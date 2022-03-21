<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="titleStr"
      width="50%"
      @open="init">
      <el-form ref="labeForm" :model="labeForm" :rules="rules" label-position="right" label-width="80px">
        <el-form-item :label="$t('label_name')" prop="name">
          <el-input v-if="isEditLable" v-model="labeForm.name" :placeholder="$t('please_input_label_name')" name="labeForm_name" maxlength="16"/>
          <span v-if="!isEditLable" >{{ labeForm.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('label_remark')" prop="remark" align="center">
          <el-input
            v-if="isEditLable"
            v-model="labeForm.remark"
            :placeholder="$t('please_input_label_remark')"
            name="labeForm_remark"
            type="textarea"
            show-word-limit
            maxlength="100"/>
          <span v-if="!isEditLable" >{{ labeForm.remark }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ody-button name="handleClose" @click="handleClose()">{{ $t('common_back') }}</ody-button>
        <ody-button v-permission="'LabelSave'" v-if="isEditLable" name="submitForm" type="primary" @click="submitForm('labeForm')">{{ $t('common_save') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    titleStr: {
      type: String,
      default: null
    },
    labelObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isEditLable: false,
      labeForm: {
        id: null,
        name: null,
        labelStatus: null,
        remark: null
      },
      rules: {
        name: [
          { required: true, message: this.$t('please_input_label_name'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'functions'
    ])
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    handleClose() {
      this.$refs['labeForm'].resetFields()
      this.$emit('update:visible', !this.visible)
    },
    submitForm(labeForm) {
      this.$refs[labeForm].validate((valid) => {
        if (valid) {
          const label = this.$ouserCenter.$api.labelGroup
          if (this.labelObj.id) {
            label.updateLabel(this.labeForm).then((result) => {
              if (result && result.code === '0') {
                this.$emit('update:visible', !this.visible)
                this.$emit('ok', [])
                this.$refs[labeForm].resetFields()
                this.$message({
                  type: 'success',
                  message: this.$t('common_update_success')
                })
              }
            })
          } else {
            this.labeForm.labelStatus = 1
            label.addLabel(this.labeForm).then((result) => {
              if (result && result.code === '0') {
                this.$emit('update:visible', !this.visible)
                this.$emit('ok', [])
                this.$refs[labeForm].resetFields()
                this.$message({
                  type: 'success',
                  message: this.$t('common_save_success')
                })
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async init() {
      try {
        this.labeForm = {
          id: null,
          groupId: null,
          name: null,
          labelStatus: null,
          remark: null
        }

        if (this.labelObj.id) {
          if (this.functions.indexOf('LabelEdit') > 0) {
            this.isEditLable = true
          } else {
            this.isEditLable = false
          }
          this.labeForm = this.labelObj
          this.titleStr = this.$t('edit_labelInfo')
        } else {
          if (this.functions.indexOf('LabelAdd') > 0) {
            this.isEditLable = true
          } else {
            this.isEditLable = false
          }
          this.labeForm.groupId = this.labelObj.groupId
          this.titleStr = this.$t('add_labelInfo')
        }
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
