<template>
  <section>
    <ody-dialog-full-right
      :visible="visible"
      class="edit"
      title="编辑表格"
      @close="closeDialog"
      @open="init"
    >
      <DbInfo
        :edit-new="editNew"
        :is-connected.sync="isConnected"
        :table-form="tableForm"
        @ok="handleDbInfoOk"
      />
      <el-form
        ref="tableForm"
        :model="tableForm"
        :rules="tableRules"
        :disabled="!canEdit"
        label-width="120px"
        class="demo-ruleForm"
      >
        <div class="form-item-list">
          <el-row>
            <el-col :span="6">
              <el-form-item label="库名" prop="db" class="form-item">
                <el-select
                  v-model="tableForm.db"
                  :clearable="false"
                  :disabled="!editNew"
                  name="tableForm_db"
                  @change="handleDbNameChange"
                >
                  <el-option v-for="item in dbNameOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="表名" prop="table" class="form-item">
                <el-select
                  v-model="tableForm.tableName"
                  :clearable="false"
                  :disabled="!editNew"
                  name="tableForm_tableName"
                  @change="handleTableNameChange"
                >
                  <el-option v-for="item in tableNameOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="中文名" prop="tableComment" class="form-item">
                <el-input v-model="tableForm.tableComment" :disabled="tableForm.tableName == null" name="tableForm_tableComment" placeholder="请输入主表名" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="表类型" prop="tableType" class="form-item">
                <el-select v-model="tableForm.tableType" :disabled="tableForm.tableName == null" :clearable="false" name="tableForm_tableType" placeholder="请选择" @change="handleTableTypeChange">
                  <el-option
                    v-for="item in tableTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="项目名" prop="tableType" class="form-item">
                <el-input
                  v-model="tableForm.project"
                  :placeholder="$t('请输入项目名')"
                  name="tableForm_project"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-tabs v-show="tableForm.tableName != null" v-model="activeTab" tab-position="top" name="activeTab">
          <el-tab-pane v-if="tableForm.tableType !== 2" label="基本配置" name="基本配置">
            <TableInfo
              :edit-new="editNew"
              :table-form="tableForm"
            />
          </el-tab-pane>
          <el-tab-pane v-if="tableForm.tableType !== 2" :disabled="!tableForm.modelJson.searchable" name="查询">
            <span slot="label">查询 <el-checkbox v-model="tableForm.modelJson.searchable" name="tableForm_modelJson_searchable" @change="onDisableFields('searchable')"/></span>
            <FieldSearch
              :loading="loading"
              :pool="tableForm.configPool"
              :main-fields="tableForm.modelJson.fields"
              :rel-table-data="relTableData"
              :field-table-data.sync="copiedFields.searchFields"
              @reset="initVariousFields('searchFields')"
              @syncFieldInfo="syncFieldInfo('searchFields', $event)" />
          </el-tab-pane>
          <el-tab-pane v-if="tableForm.tableType !== 2" label="列表" name="列表">
            <FieldTable
              :loading="loading"
              :show-checkbox.sync="tableForm.showCheckbox"
              :is-pagination.sync="tableForm.isPagination"
              :main-fields="tableForm.modelJson.fields"
              :rel-table-data="relTableData"
              :field-table-data.sync="copiedFields.tableFields"
              @reset="initVariousFields('tableFields')"
              @syncFieldInfo="syncFieldInfo('tableFields', $event)" />
          </el-tab-pane>
          <el-tab-pane :disabled="!tableForm.modelJson.editable" name="编辑">
            <span slot="label">编辑 <el-checkbox v-model="tableForm.modelJson.editable" name="tableForm_modelJson_editable" @change="onDisableFields('editable')"/></span>
            <FieldEdit
              :loading="loading"
              :pool="tableForm.configPool"
              :main-fields="tableForm.modelJson.fields"
              :rel-table-data="relTableData"
              :field-table-data.sync="copiedFields.editFields"
              @reset="initVariousFields('editFields')"
              @syncFieldInfo="syncFieldInfo('editFields', $event)" />
          </el-tab-pane>
          <el-tab-pane v-if="tableForm.tableType !== 2" :disabled="!tableForm.modelJson.importable" name="导入">
            <span slot="label">导入 <el-checkbox v-model="tableForm.modelJson.importable" name="tableForm_modelJson_importable" @change="onDisableFields('importable')"/></span>
            <FieldImport
              :loading="loading"
              :import-async.sync="tableForm.importAsync"
              :main-fields="tableForm.modelJson.fields"
              :rel-table-data="relTableData"
              :field-table-data.sync="copiedFields.importFields"
              @reset="initVariousFields('importFields')"
              @syncFieldInfo="syncFieldInfo('importFields', $event)"
              @syncEditFields="syncEditFields"/>
          </el-tab-pane>
          <el-tab-pane v-if="tableForm.tableType !== 2" :disabled="!tableForm.modelJson.exportable" name="导出">
            <span slot="label">导出 <el-checkbox v-model="tableForm.modelJson.exportable" name="tableForm_modelJson_exportable" @change="onDisableFields('exportable')"/></span>
            <FieldExport
              :loading="loading"
              :export-async.sync="tableForm.exportAsync"
              :main-fields="tableForm.modelJson.fields"
              :rel-table-data="relTableData"
              :field-table-data.sync="copiedFields.exportFields"
              @reset="initVariousFields('exportFields', )"
              @syncFieldInfo="syncFieldInfo('exportFields', $event)"
              @syncTableFields="syncTableFields" />
          </el-tab-pane>
          <el-tab-pane v-if="tableForm.tableType > 2" label="关联表" name="关联表">
            <RelTable
              :rel-tables="relTables"
              :join="relTableJoin"
              :rel-table-data="copiedRelTableData"
              :main-table="tableForm.tableName"
              :main-fields="tableForm.modelJson.fields"
              :table-name-options="tableNameOptions"
              @add="addRelTable"
              @del="delRelTable" />
          </el-tab-pane>
        </el-tabs>

      </el-form>
      <template slot="footer">
        <el-button name="handleTableFormReset" @click="handleTableFormReset">重置</el-button>
        <el-button v-loading="saving" name="handleTableFormSubmit" type="primary" @click="handleTableFormSubmit">保存</el-button>
      </template>
    </ody-dialog-full-right>
  </section>
</template>

<script>
import DbInfo from './db-info'
import TableInfo from './table-info'
import FieldSearch from './field-search'
import FieldEdit from './field-edit'
import FieldTable from './field-table'
import FieldImport from './field-import'
import FieldExport from './field-export'
import RelTable from './rel-table'

export default {
  name: 'EditDrawer',
  components: {
    DbInfo,
    TableInfo,
    FieldSearch,
    FieldEdit,
    FieldTable,
    FieldImport,
    FieldExport,
    RelTable
  },
  props: {
    visible: { type: Boolean, default: false },
    editNew: { type: Boolean, default: false },
    row: { type: Object, default: function() { return {} } },
    tableTypeOptions: { type: Array, default: function() { return [] } },
    reduceFieldConfig: { type: Object, default: function() { return {} } }
  },
  data() {
    return {
      loading: false,
      saving: false,
      canEdit: false,
      defaultDb: null,
      tableNameMap: {},
      dbNameOptions: [],
      tableNameOptions: [],
      isConnected: false,
      tableForm: this.initTableForm(),
      tableRules: [],
      activeTab: '基本配置',
      relTables: [],
      relTableData: [],
      copiedRelTableData: [],
      copiedFields: {},
      relTableJoin: '||'
    }
  },
  methods: {
    init() {
      let loading = null
      this.saving = true
      setTimeout(() => {
        if (this.saving) {
          loading = this.$loading({
            lock: true,
            text: '正在加载...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
        }
      }, 2000)

      this.initData(true)
      if (this.editNew) {
        const codeModelService = this.$ouser.$api.codeModelService
        codeModelService.getDefaultDatabase().then(res => {
          ({
            host: this.tableForm.host,
            port: this.tableForm.port,
            username: this.tableForm.username,
            password: this.tableForm.password,
            db: this.defaultDb
          } = res.data)
        }).finally(res => {
          this.initTab()
          this.saving = false
          if (loading) {
            loading.close()
          }
        })
      } else {
        this.$ouser.$api.codeModelService
          .getById({ id: this.row.id })
          .then(res => {
            this.afterModelData(res.data)
            if (this.tableForm.tableType > 2) {
              this.initRelTables()
            }
          })
          .finally(res => {
            this.canEdit = true
            this.saving = false
            if (loading) {
              loading.close()
            }
          })
      }
    },
    initData(resetModel) {
      const dbInfo = {
        host: this.tableForm.host,
        port: this.tableForm.port,
        username: this.tableForm.username,
        password: this.tableForm.password,
        db: resetModel ? null : this.tableForm.db,
        tableName: resetModel ? null : this.tableForm.tableName
      }
      this.tableForm = Object.assign(this.initTableForm(), dbInfo)
      this.copiedFields = {}
      this.relTableData = []
    },
    initTab() {
      if (this.tableForm.tableType === 1) {
        this.activeTab = '基本配置'
      } else if (this.tableForm.tableType === 2) {
        this.activeTab = '编辑'
      }
    },
    initVariousFields(fieldName) {
      this.$set(this.copiedFields, fieldName, this.copy(this.tableForm.modelJson[fieldName]))
    },
    syncFieldInfo(fieldGroup, field) {
      Object.keys(this.reduceFieldConfig).filter(item => item !== fieldGroup).forEach(item => {
        const found = this.copiedFields[item].find(f => f.name === field.name && f.modelName === field.modelName)
        if (found) {
          this.$set(found, 'title', field.title)
          this.$set(found, 'dataSourceType', field.dataSourceType)
          this.$set(found, 'dataSourceKey', field.dataSourceKey)
        }
      })
    },
    syncEditFields() {
      this.copiedFields.importFields = this.copy(this.copiedFields.editFields)
    },
    syncTableFields() {
      this.copiedFields.exportFields = this.copy(this.copiedFields.tableFields)
    },
    async initRelTables() {
      const codeModelService = this.$ouser.$api.codeModelService
      const res = await codeModelService.listPage({
        page: 1,
        limit: 500,
        filters: {
          host: this.tableForm.host,
          port: this.tableForm.port,
          db: this.tableForm.db,
          tableType: this.tableForm.tableType === 3 ? 2 : [1, 3],
          excludeTable: this.tableForm.tableName
        },
        selectFields: ['id', 'tableName', 'tableComment', 'modelJson']
      })
      this.relTables = res.data
      this.relTables.forEach(relTable => {
        this.fillJsonField(JSON.parse(relTable.modelJson))
      })
    },
    closeDialog() {
      this.visible = false
      this.$emit('update:visible', this.visible)
    },
    initRelTableData() {
      const po = this.tableForm.modelJson
      this.relTableData = []
      if (po.relOneList) {
        po.relOneList.forEach(item => {
          this.relTableData.push({
            join: '|',
            id: Number(item.name),
            mainTable: po.table,
            mainColumn: item.mainField.column,
            relTable: item.table,
            relColumn: item.relField.column,
            ok: true
          })
        })
      }
      if (po.relManyList) {
        po.relManyList.forEach(item => {
          this.relTableData.push({
            join: '||',
            id: Number(item.name),
            mainTable: po.table,
            mainColumn: item.mainField.column,
            relTable: item.table,
            relColumn: item.relField.column,
            ok: true
          })
        })
      }
      this.copiedRelTableData = this.copy(this.relTableData)
    },
    afterModelData(data) {
      this.tableForm = data
      this.tableForm.isPagination = Boolean(data.isPagination)
      this.tableForm.showCheckbox = Boolean(data.showCheckbox)
      this.tableForm.importAsync = Boolean(data.importAsync)
      this.tableForm.exportAsync = Boolean(data.exportAsync)
      this.tableForm.modelJson = JSON.parse(data.modelJson)
      if (this.tableForm.modelJson) {
        this.fillJsonField(this.tableForm.modelJson)
        this.initRelTableData()
      }
      this.initTab()
    },
    handleTableTypeChange() {
      this.relTableJoin = this.tableForm.tableType === 3 ? '||' : '|'
      this.initTab()
      if (this.tableForm.tableType > 2) {
        this.initRelTables()
      }
      if (this.tableForm.tableType === 2) {
        this.tableForm.modelJson.searchable = false
        this.tableForm.modelJson.importable = false
        this.tableForm.modelJson.exportable = false
      } else {
        this.tableForm.modelJson.searchable = true
        this.tableForm.modelJson.importable = true
        this.tableForm.modelJson.exportable = true
      }
    },
    async addRelTable(row) {
      this.relTableData.push(row)
      const table = this.tableForm.tableName
      const tablePattern = table + ':' + row.mainColumn + row.join + row.relTable + ':' + row.relColumn

      const data = await this._doGetModel(tablePattern)
      const modelJson = JSON.parse(data.modelJson)

      this.doAddFields(modelJson, 'searchFields', row.relTable)
      this.doAddFields(modelJson, 'tableFields', row.relTable)
      this.doAddFields(modelJson, 'importFields', row.relTable)
      this.doAddFields(modelJson, 'exportFields', row.relTable)
    },
    async delRelTable(row) {
      const index = this.relTableData.findIndex(item => {
        return item.mainColumn === row.mainColumn &&
          item.relTable === row.relTable &&
          item.relColumn === row.relColumn
      })
      if (index !== -1) {
        this.relTableData.splice(index, 1)
      }
      this.doDelFields('searchFields', row.relTable)
      this.doDelFields('tableFields', row.relTable)
      this.doDelFields('importFields', row.relTable)
      this.doDelFields('exportFields', row.relTable)
    },
    // 整理关联信息
    doAddFields(modelJson, fieldName, relTable) {
      let newFields = []
      if (modelJson.relOneList) {
        modelJson.relOneList.filter(rel => rel.table === relTable).forEach(rel => {
          newFields = newFields.concat(rel[fieldName])
        })
      }
      if (modelJson.relManyList) {
        modelJson.relManyList.filter(rel => rel.table === relTable).forEach(rel => {
          newFields = newFields.concat(rel[fieldName])
        })
      }
      const oldFields = this.copiedFields[fieldName]
      this.$set(this.copiedFields, fieldName, oldFields.concat(newFields))
    },
    doDelFields(fieldName, relTable) {
      const newFields = []
      const oldFields = this.copiedFields[fieldName]
      oldFields.forEach(item => {
        if (item.table !== relTable) {
          newFields.push(item)
        }
      })
      this.copiedFields[fieldName] = newFields
    },
    // 切换数据库
    async handleDbNameChange(e) {
      this.initData()
      await this.getTableList()
    },
    // 切换表
    async handleTableNameChange(e) {
      this.tableForm.tableComment = this.tableNameMap[this.tableForm.tableName]
      this.tableForm.menuName = this.tableForm.tableComment
      this.tableForm.menuCode = this.tableForm.tableName
      await this.getModel()
    },
    // 连接按钮
    async handleDbInfoOk(dbNameOptions) {
      this.dbNameOptions = dbNameOptions
      const preferDb = this.dbNameOptions.find(item => item === this.defaultDb)
      this.tableForm.db = preferDb || this.dbNameOptions[0]
      if (this.isConnected) {
        this.canEdit = true
      }
      this.initData()
      await this.getTableList()
    },
    // 提交按钮
    async handleTableFormSubmit() {
      const codeModelService = this.$ouser.$api.codeModelService
      try {
        if (!this.tableForm.tableName) {
          this.$message.error('请填写表单数据')
          return
        }
        this.saving = true
        const params = JSON.parse(JSON.stringify(this.tableForm))
        params.isPagination = this.tableForm.isPagination ? 1 : 0
        params.showCheckbox = this.tableForm.showCheckbox ? 1 : 0
        params.importAsync = this.tableForm.importAsync ? 1 : 0
        params.exportAsync = this.tableForm.exportAsync ? 1 : 0
        delete params.modelJson.tableComment
        delete params.modelJson.commonFields
        delete params.modelJson.nonCommonFields

        params.modelJson.title = this.tableForm.tableComment
        params.modelJson['relOneList'] = []
        params.modelJson['relManyList'] = []
        for (const p in this.copiedFields) {
          params.modelJson[p] = this.copiedFields[p]
        }
        const relModels = []
        this.relTableData.forEach(item => {
          const relName = item.join === '||' ? 'relManyList' : 'relOneList'
          let rels = params.modelJson[relName]
          if (!rels) {
            rels = params.modelJson[relName] = []
          }
          rels.push({
            mainField: {
              column: item.mainColumn
            },
            relField: {
              column: item.relColumn
            },
            table: item.relTable,
            name: item.id + ''
          })
          relModels.push(item.id)
        })
        if (relModels.length > 0) {
          params.relModel = JSON.stringify(relModels)
        } else {
          params.relModel = null
        }

        this.handleFieldDataSources(params.modelJson, 'tableFields')
        this.handleFieldDataSources(params.modelJson, 'exportFields')
        this.handleFieldDataSources(params.modelJson, 'importFields')
        // 精简fields
        this.reduceJsonFields(params.modelJson)

        params.modelJson = JSON.stringify(params.modelJson)
        const req = this.editNew ? codeModelService.add : codeModelService.update
        const res = await req(params)
        if (res.code === '0') {
          this.visible = false
          this.$emit('update:visible', this.visible)
          this.$emit('ok')
        }
        this.saving = false
      } catch (e) {
        console.log(e)
      }
    },
    handleFieldDataSources(modelJson, fieldName) {
      if (!modelJson[fieldName]) {
        return
      }
      modelJson[fieldName].forEach(item => {
        if (item.dataSourceKey) {
          item.dataSourceType = 'code'
        } else {
          item.dataSourceType = null
        }
      })
    },
    // 补齐字段
    fillJsonField(json) {
      Object.keys(this.reduceFieldConfig).forEach(fieldName => {
        const fields = this.tableForm.modelJson[fieldName] || []
        fields.forEach(item => {
          const found = json['fields'].find(f => f.modelName === item.modelName && f.name === item.name)
          if (found) {
            Object.keys(found).filter(key => this.reduceFieldConfig[fieldName].indexOf(key) === -1).forEach(key => {
              item[key] = found[key]
            })
          }
        })
      })

      this.initVariousFields('searchFields')
      this.initVariousFields('tableFields')
      this.initVariousFields('editFields')
      this.initVariousFields('importFields')
      this.initVariousFields('exportFields')
    },
    // 精简字段
    reduceJsonFields(json) {
      const fieldEnableMapping = {
        searchFields: 'searchable',
        editFields: 'editable',
        importFields: 'importable',
        exportFields: 'exportable'
      }
      for (const fields in this.reduceFieldConfig) {
        const fieldEnable = fieldEnableMapping[fields]
        if (fieldEnable && !json[fieldEnable]) {
          json[fields] = []
          continue
        }
        const reservedFields = this.reduceFieldConfig[fields]
        const bizFields = json[fields] || []
        bizFields.filter(item => {
          const allRelFields = this.relTables.flatMap(relTable => JSON.parse(relTable.modelJson).fields)
          return json.fields.concat(allRelFields).some(f => f.modelName === item.modelName && f.name === item.name)
        }).forEach(item => {
          Object.keys(item).filter(key => reservedFields.indexOf(key) === -1).forEach(key => {
            delete item[key]
          })
        })
      }
    },
    onDisableFields(fields) {
      if (!this.tableForm.modelJson[fields]) {
        this.initTab()
      }
    },
    // 获取数据下拉表数据
    async getTableList() {
      const codeModelService = this.$ouser.$api.codeModelService
      try {
        const params = {}
        params.host = this.tableForm.host
        params.port = this.tableForm.port
        params.username = this.tableForm.username
        params.password = this.tableForm.password
        params.db = this.tableForm.db
        const table = await codeModelService.listTable(params)
        this.tableNameOptions = table.data
        this.tableNameMap = table.extraData
        this.tableForm.poolName = this.tableForm.db
        this.tableForm.configPool = this.tableForm.db
        this.tableForm.contextPath = this.tableForm.db + '-web'
        this.tableForm.basePackage = 'com.odianyun.' + this.tableForm.db
        this.tableForm.tableName = this.tableNameOptions[0]
        this.tableForm.tableComment = this.tableNameMap[this.tableForm.tableName]
        this.tableForm.menuName = this.tableForm.tableComment
        this.tableForm.menuCode = this.tableForm.tableName
        if (table.data.length === 0) {
          return false
        } else {
          await this.getModel()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 模型数据接口
    async getModel(table) {
      const data = await this._doGetModel(table || this.tableForm.tableName)

      this.afterModelData(data)
    },

    async _doGetModel(table) {
      const codeModelService = this.$ouser.$api.codeModelService
      try {
        const params = {}
        params.host = this.tableForm.host
        params.port = this.tableForm.port
        params.username = this.tableForm.username
        params.password = this.tableForm.password
        params.db = this.tableForm.db
        params.table = table
        this.loading = true
        const res = await codeModelService.getModel(params)
        this.loading = false
        for (var p in res.data) {
          if (res.data[p] === null) {
            res.data[p] = this.tableForm[p]
          }
        }
        return res.data
      } catch (e) {
        console.log(e)
      }
    },
    async handleTableFormReset() {
      this.init()
    },
    initTableForm() {
      return {
        id: null,
        host: '',
        port: 3306,
        username: '',
        password: '',
        createTime: null,
        tableName: null,
        parentMenuCode: 'center_01',
        menuCode: null,
        menuName: null,
        poolName: null,
        configPool: null,
        contextPath: null,
        basePackage: 'com.odianyun.',
        multiple: false,
        isPagination: true,
        showCheckbox: true,
        importAsync: true,
        exportAsync: true,
        isDeleted: null,
        tableType: 1,
        formStyle: 1,
        editFormStyle: 1,
        tableComment: null, // 表注释
        modelJson: {},
        fields: []
      }
    },
    copy(obj) {
      if (obj === null || typeof (obj) === 'undefined') {
        return obj
      }
      return JSON.parse(JSON.stringify(obj))
    }
  }
}
</script>
