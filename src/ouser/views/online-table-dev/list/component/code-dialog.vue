<template>
  <ody-dialog :visible.sync="visible" title="生成代码" width="600px" @open="init" @close="handleClose">
    <el-form ref="codeForm" :model="generateCodeData" lable-width="100px" class="form">
      <el-form-item
        :rules="[{required:true,message:'请选择代码生成器'}]"
        label="代码生成器"
        prop="codeGenerators"
        class="form-item"
      >
        <el-checkbox :indeterminate="isCheckAllCodeGeneratorIndeterminate" v-model="checkAllCodeGenerator" name="checkAllCodeGenerator" @change="handleCheckAllCodeGeneratorChange">全选</el-checkbox>
        <div style="margin: 15px 0;"/>
        <el-checkbox-group v-model="generateCodeData.codeGenerators" name="generateCodeData_codeGenerators" @change="handleCheckedCodeGeneratorChange">
          <el-checkbox v-for="(value, key) in allCodeGenerators" :label="key" :key="key">{{ value }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <div class="line-top" />
      <ody-button name="ui_handleClose" code="ui" size="small" @click="handleClose()">取 消</ody-button>
      <ody-button v-loading="saving" name="ui_doGenerateCode" code="ui" size="small" type="primary" @click="doGenerateCode()">确 定</ody-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  name: 'CodeDialog',
  components: {},
  props: {
    visible: { type: Boolean, default: false },
    currentModelId: { type: Number, default: null },
    reduceFieldConfig: { type: Object, default: function() { return {} } }
  },
  data() {
    return {
      saving: false,
      allCodeGenerators: {},
      checkAllCodeGenerator: false,
      isCheckAllCodeGeneratorIndeterminate: false,
      generateCodeData: { codeGenerators: [] }
    }
  },
  methods: {
    async init() {
      this.saving = true
      if (Object.keys(this.allCodeGenerators).length < 1) {
        const res = await this.$ouser.$api.codeModelService.listCodeGenerator()
        this.allCodeGenerators = res.data
      }
      this.checkAllCodeGenerator = false
      this.generateCodeData.codeGenerators = []
      this.saving = false
    },
    handleClose() {
      this.visible = false
      this.$emit('update:visible', this.visible)
    },
    handleCheckAllCodeGeneratorChange(val) {
      this.generateCodeData.codeGenerators = val ? Object.keys(this.allCodeGenerators) : []
      this.isCheckAllCodeGeneratorIndeterminate = false
    },
    handleCheckedCodeGeneratorChange(value) {
      const checkedCount = value.length
      this.checkAllCodeGenerator = checkedCount === Object.keys(this.allCodeGenerators).length
      this.isCheckAllCodeGeneratorIndeterminate = checkedCount > 0 && checkedCount < Object.keys(this.allCodeGenerators).length
    },
    async doGenerateCode() {
      if (this.generateCodeData.codeGenerators.length < 1) {
        this.$message.error('请选择代码生成器')
        return false
      }
      this.saving = true
      const params = {
        modelId: this.currentModelId,
        codeGenerators: this.generateCodeData.codeGenerators,
        reduceFieldConfig: this.reduceFieldConfig
      }
      const url = '/api' + this.$ouser.$api.codeModelService.generate.url
      await this.$portal.downloadFileByPost(url, params, null, 'ajax')
      this.visible = false
      this.$emit('update:visible', this.visible)
      this.saving = false
    }
  }
}
</script>
