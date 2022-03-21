<template>
  <div class="cp-batch-export-button">
    <el-button name="add" code="ui" size="small" type="primary" @click="addField">添加字段</el-button>

    <ody-dialog :visible.sync="visible" :append-to-body="true" title="添加字段" width="550px">
      <el-row>
        <el-form-item label-width="0px">
          <el-checkbox v-model="customized" name="customized">自定义字段</el-checkbox>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item v-show="!onlyMainFields" label="表" label-width="50px">
            <el-select v-model="relId" :placeholder="$t('主表')" :clearable="false" name="relId" @change="handleTableChange">
              <el-option v-for="item in relTableData" :key="item.id" :label="item.relTable" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="!customized" :span="12">
          <el-form-item label="字段" label-width="50px">
            <el-select v-model="fieldName" :clearable="false" name="fieldName">
              <el-option v-for="item in fields" :key="item.name" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-else :span="12">
          <el-form-item label="自定义" label-width="55px">
            <el-input v-model="column" name="column" placeholder="列名" style="width:80px"/>
            <el-input v-model="fieldName" name="fieldName9" placeholder="字段名" style="width:80px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <span slot="footer">
        <div class="line-top" />
        <ody-button name="ui_handleClose" code="ui" size="small" @click="handleClose">取 消</ody-button>
        <ody-button name="ui_handleOk" code="ui" size="small" type="primary" @click="handleOk">确 定</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddField',
  components: {},
  props: {
    mainFields: { type: Array, default: function() { return [] } },
    relTableData: { type: Array, default: function() { return [] } },
    fieldTableData: { type: Array, default: function() { return [] } },
    onlyMainFields: { type: Boolean, default: false }
  },
  data() {
    return {
      visible: false,
      customized: false,
      column: null,
      fieldName: null,
      relId: null,
      fields: []
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init() {

    },
    addField() {
      this.relId = null
      this.fields = this.mainFields
      this.fieldName = null
      this.column = null
      this.customized = false
      this.visible = true
    },
    handleTableChange() {
      if (this.relId) {
        this.$ouser.$api.codeModelService
          .getById({ id: this.relId })
          .then(res => {
            const relModelJson = JSON.parse(res.data.modelJson)
            this.fields = relModelJson.fields
          })
      }
    },
    handleClose() {
      this.visible = false
    },
    handleOk() {
      if (this.fieldName) {
        let field = {}
        if (this.customized) {
          field = Object.assign({}, this.fields[0], {
            column: this.column,
            name: this.fieldName,
            typeFullName: 'java.lang.String',
            typeName: 'String',
            relName: this.fieldName,
            title: this.fieldName,
            tag: null,
            tagSize: null,
            tagAttributes: null,
            dataSourceType: null,
            dataSourceKey: null
          })
        } else {
          field = this.fields.find(item => item.name === this.fieldName)
        }
        const found = this.fieldTableData.find(item => item.modelName === field.modelName && item.name === field.name)
        if (found) {
          this.$message.error('字段' + field.name + '已经存在')
          return
        } else {
          this.fieldTableData.push(field)
          this.$emit('update:fieldTableData', this.fieldTableData)
        }
      }
      this.visible = false
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
      margin: 0 15px;
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
