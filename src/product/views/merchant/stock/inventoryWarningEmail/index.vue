<template>
  <div>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          size="small"
          type="primary"
          code="InventoryWarningEmailAdd"
          @click="Add">
          <i class="el-icon-plus" />{{ $t('新增') }}
        </ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :can-filter="false"
          request-url="/back-product-web/stockWarningEmail/query"
          request-page-type="page"
        >
          <template slot="isNoEnable" slot-scope="scope">
            <el-switch
              :disabled="!$portal.hasPermission('InventoryWarningEmailEdit')"
              :value="scope.row.isNoEnable === 1"
              :active-text="scope.row.isNoEnable === 1 ? $t('是') : $t('否')"
              @change="changeEnable($event, scope.row)"
            />
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <el-dialog :visible.sync="dialogFormVisible" :title="$t(`${form.id ? '编辑' : '新增'}接收邮箱地址`)" width="400px">
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="邮箱" label-width="60px" prop="email">
          <el-input v-model="form.email" :placeholder="$t('请填写邮箱地址')" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('取消') }}</el-button>
        <el-button :loading="saveLoading" type="primary" @click="Save">{{ $t(form.id ? '保存' : '确定添加') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'InventoryWarningEmail',
  data() {
    const self = this
    return {
      saveLoading: false,
      dialogFormVisible: false,
      form: { id: null, email: '' },
      rules: {
        email: [
          { required: true, message: this.$t('请输入邮箱地址') },
          { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: this.$t('请输入正确的邮箱地址') }
        ]
      },
      table: {
        columns: [
          { show: true, prop: 'email', label: this.$t('邮箱地址'), align: 'left', minWidth: 200 },
          {
            show: true,
            prop: 'createTime',
            label: this.$t('创建时间'),
            align: 'center',
            minWidth: 200,
            formatter: (row, column) => {
              if (row.createTime) {
                return self.$portal.parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
              }
              return ''
            }
          },
          { show: true, slot: 'isNoEnable', label: this.$t('是否启用'), align: 'center', minWidth: 200 }
        ],
        operates: {
          width: 200,
          fixed: 'right',
          list: [
            {
              label: this.$t('修改'),
              method: (index, row) => {
                self.Edit(row)
              },
              code: 'InventoryWarningEmailEdit'
            },
            {
              label: this.$t('删除'),
              method: (index, row) => {
                self.Del(row)
              },
              code: 'InventoryWarningEmailDel'
            }
          ]
        }
      }
    }
  },
  async mounted() {
    try {
      this.mpApi = this.$product.$api.mpApi
      this.stockApi = this.$product.$api.stockApi
      await this.queryList()
    } catch (e) {
      console.log(e)
    }
  },
  async activated() {
    await this.queryList()
  },
  methods: {
    // 商家商品列表查询
    async queryList() {
      return this.$refs.table.getList()
    },
    Add() {
      this.ShowDialog({ id: null, email: '' })
    },
    Edit(row) {
      this.ShowDialog({ id: row.id, email: row.email })
    },
    async Del(row) {
      const res = await this.$confirm('确定删除吗?', this.$t('提示'), {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      if (!res) {
        return
      }
      const result = await this.stockApi.inventoryWarningEmailDel({ id: row.id })
      if (result && result.code === '0') {
        this.$message.success(this.$t(`删除成功`))
        this.queryList()
      }
    },
    ShowDialog(form) {
      this.form = form
      this.dialogFormVisible = true
      if (!this.form.id) {
        this.$refs.ruleForm.resetFields()
      }
    },
    async Save() {
      if (this.saveLoading === true) {
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.AddAndEdit()
        }
      })
    },
    AddAndEdit() {
      this.saveLoading = true
      /*      const result = (this.form.id)
        ? await this.stockApi.inventoryWarningEmailEdit({ id: this.form.id, email: this.form.email })
        : await this.stockApi.inventoryWarningEmailAdd({ email: this.form.email })
      if (result && result.code === '0') {
        this.queryList()
        this.$message.success(this.$t(`${this.form.id ? '编辑' : '添加'}成功`))
      }*/

      if (this.form.id) {
        this.stockApi.inventoryWarningEmailEdit({ id: this.form.id, email: this.form.email }).then(res => {
          if (res && res.code === '0') {
            this.queryList()
            this.$message.success(this.$t(`${this.form.id ? '编辑' : '添加'}成功`))
          }
          this.saveLoading = false
          this.dialogFormVisible = false
        })
      } else {
        this.stockApi.inventoryWarningEmailAdd({ email: this.form.email }).then(res => {
          if (res && res.code === '0') {
            this.queryList()
            this.$message.success(this.$t(`${this.form.id ? '编辑' : '添加'}成功`))
          }
          this.saveLoading = false
          this.dialogFormVisible = false
        })
      }
    },
    async changeEnable(e, row) {
      const result = await this.stockApi.inventoryWarningEmailEnable({ id: row.id, isNoEnable: row.isNoEnable === 0 ? 1 : 0 })
      if (result && result.code === '0') {
        this.queryList()
      }
    }
  }
}
</script>
