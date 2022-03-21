<template>
  <ody-list-table-area>
    <div slot="btn">
      <el-button name="ui_addRelTable" code="ui" size="small" type="primary" @click="addRelTable">添加</el-button>
    </div>
    <div slot="table">
      <el-table :data="relTableData" name="relTableData471">
        <el-table-column width="180">
          <template slot="header">
            <ody-tip-star content="主表字段"/>
          </template>
          <template slot-scope="scope">
            <el-select v-model="scope.row.mainColumn" :disabled="scope.row.ok" :clearable="false" name="scope_row_mainColumn">
              <el-option v-for="item in mainFields" :key="item.column" :label="item.column" :value="item.column" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column width="180">
          <template slot="header">
            <ody-tip-star :content="tableType === 4 ? '主表' : '附表'"/>
          </template>
          <template slot-scope="scope">
            <el-select v-model="scope.row.relTable" :disabled="scope.row.ok" :clearable="false" name="scope_row_relTable" @change="handleRelTableChange(scope.row)">
              <el-option v-for="item in relTables" :key="item.tableName" :label="item.tableComment" :value="item.tableName" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column width="180">
          <template slot="header">
            <ody-tip-star :content="tableType === 4 ? '主表字段' : '附表字段'"/>
          </template>
          <template slot-scope="scope">
            <el-select v-model="scope.row.relColumn" :disabled="scope.row.ok" :clearable="false" name="scope_row_relColumn">
              <el-option v-for="item in (relTableColMap[scope.row.relTable] || [])" :key="item.column" :label="item.column" :value="item.column" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.ok"
              name="confirmRelTable"
              size="mini"
              type="danger"
              @click="confirmRelTable(scope.$index, scope.row)">确定</el-button>
            <el-button
              name="delRelTable"
              size="mini"
              type="danger"
              @click="delRelTable(scope.$index, scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </ody-list-table-area>
</template>

<script>
export default {
  name: 'RelTable',
  components: {},
  props: {
    tableType: { type: Number, default: null },
    mainTable: { type: String, default: null },
    mainFields: { type: Array, default: function() { return [] } },
    join: { type: String, default: null },
    relTables: { type: Array, default: function() { return [] } },
    relTableData: { type: Array, default: function() { return [] } },
    tableNameOptions: { type: Array, default: function() { return [] } }
  },
  data() {
    return {
      relTableColMap: {}
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init() {

    },
    addRelTable() {
      this.relTableData.push({
        join: this.join,
        mainTable: this.mainTable,
        mainColumn: null,
        relTable: null,
        relColumn: null,
        ok: false
      })
    },
    confirmRelTable(index, row) {
      if (row.mainColumn && row.relTable && row.relColumn) {
        if (this.relTableData.filter((item, i) => {
          return item.ok && index !== i
        }).some(item => item.relTable === row.relTable)) {
          this.$message.error('当前表已经关联了，请选择其他表')
          return
        }
        row.ok = true
        this.$emit('add', row)
        this.$message.success('关联成功，请转到其他Tab页查看')
      } else {
        this.$message.error('表单还有必填项没有填写')
      }
    },
    delRelTable(index, row) {
      this.relTableData.splice(index, 1)
      if (row.ok) {
        this.$emit('del', row)
      }
    },
    handleRelTableChange(row) {
      const found = this.relTables.find(item => item.tableName === row.relTable)
      if (found) {
        row.id = found.id
        this.$ouser.$api.codeModelService
          .getById({ id: found.id })
          .then(res => {
            const relModelJson = JSON.parse(res.data.modelJson)
            this.$set(this.relTableColMap, row.relTable, relModelJson.fields)
          })
      }
    }
  }
}
</script>
