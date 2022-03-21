<template>
  <div>
    <el-col :span="20" :offset="2">
      <el-card>
        <el-table
          :data="data"
          name="data1938">
          <el-table-column label="key" prop="key" align="center"/>
          <el-table-column :label="$t('描述')" prop="note" align="center"/>
          <el-table-column :label="$t('状态')" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.on" name="scope_row_on" active-value="1" inactive-value="0" @change="change(scope.row)"/>
            </template>
          </el-table-column>
        </el-table>

      </el-card>
    </el-col>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.query()
    },
    query() {
      this.$ouser.$api.switcherService.listFunctionSwitcher({}).then(res => {
        this.data = []
        res.data.forEach(i => {
          i.on = i.on.toString()
          this.data.push(i)
        })
      })
    },
    change(row) {
      const self = this
      this.$confirm('确认变更状态为' + (row.on === '1' ? '开' : '关') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$ouser.$api.switcherService.updateByDto([{ key: row.key, on: row.on, note: row.note }]).then(() => {
          self.$message({
            type: 'success',
            message: '变更成功!'
          })
          self.query()
        })
      }).catch(() => {
        row.on = row.on === '1' ? '0' : '1'
        this.$message({
          type: 'info',
          message: '已取消变更'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
