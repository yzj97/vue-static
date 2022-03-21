<template>
  <ody-list-table-area>
    <div slot="btn">
      <AddField :main-fields="mainFields" :rel-table-data="relTableData" :field-table-data.sync="fieldTableData"/>
      <el-button name="reset" size="small" type="primary" @click="reset">重置字段</el-button>
      <el-button name="removeCommonFields" code="ui" size="small" type="primary" @click="removeCommonFields">去掉公共字段</el-button>
      <el-button name="ui_syncTableFields" code="ui" size="small" type="primary" @click="syncTableFields">同步列表字段</el-button>
      <el-switch v-model="exportAsync" name="exportAsync" code="ui" @change="$emit('update:exportAsync', exportAsync)"/>是否异步导出
    </div>
    <div slot="table">
      <ody-table
        v-loading="loading"
        :data="fieldTableData"
        :columns="tableFormColumns"
        :operates="operates"
        :can-filter="false"
        :drag="true"
        name="fieldTableData299"
        row-key="prop"
      >
        <template slot="relName" slot-scope="scope">
          <el-form-item label-width="0">
            <el-input v-model="scope.row.relName" name="scope_row_relName" />
          </el-form-item>
        </template>
        <template slot="label" slot-scope="scope">
          <el-form-item label-width="0">
            <el-input v-model="scope.row.title" name="scope_row_title" />
          </el-form-item>
        </template>
        <template slot="dataSourceKey" slot-scope="scope">
          <el-form-item label-width="0">
            <el-input v-model="scope.row.dataSourceKey" name="scope_row_dataSourceKey" />
          </el-form-item>
        </template>
      </ody-table>
    </div>
  </ody-list-table-area>
</template>

<script>
import AddField from './add-field'
export default {
  name: 'FieldList',
  components: { AddField },
  props: {
    loading: { type: Boolean, default: false },
    exportAsync: { type: Boolean, default: false },
    mainFields: { type: Array, default: function() { return [] } },
    relTableData: { type: Array, default: function() { return [] } },
    fieldTableData: { type: Array, default: function() { return [] } }
  },
  data() {
    return {
      tableFormColumns: [
        {
          label: this.$t('模型'),
          prop: 'modelName',
          show: true,
          tooltip: false,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('列名'),
          prop: 'column',
          show: true,
          tooltip: false,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('原始字段名'),
          prop: 'name',
          show: true,
          tooltip: false,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('使用字段名'),
          slot: 'relName',
          show: true,
          tooltip: false,
          align: 'center',
          minWidth: 150
        },
        {
          label: this.$t('显示名'),
          slot: 'label',
          show: true,
          tooltip: false,
          align: 'center',
          minWidth: 180
        },
        {
          label: this.$t('使用字典值'),
          slot: 'dataSourceKey',
          show: true,
          tooltip: false,
          align: 'center',
          minWidth: 180
        }
      ],
      operates: {
        'width': 120,
        'fixed': 'right',
        'list': [
          {
            'label': '同步',
            show: true,
            code: 'ui',
            'disabled': false,
            method: (index, row) => {
              this.$emit('syncFieldInfo', row)
            }
          },
          {
            'label': '删除',
            show: true,
            code: 'ui',
            'disabled': false,
            method: (index, row) => {
              this.fieldTableData.splice(index, 1)
              this.$emit('update:fieldTableData', this.fieldTableData)
            }
          }
        ]
      }
    }
  },
  async mounted() {

  },
  methods: {
    async reset() {
      const confirm = await this.$confirm(
        this.$t('是否重置字段'),
      )
      if (confirm) {
        this.$emit('reset')
      }
    },
    removeCommonFields() {
      this.fieldTableData = this.fieldTableData.filter(item => !item.common)
      this.$emit('update:fieldTableData', this.fieldTableData)
    },
    syncTableFields() {
      this.$emit('syncTableFields')
    }
  }
}
</script>
