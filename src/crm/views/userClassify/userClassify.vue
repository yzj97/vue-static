<!--suppress ALL -->
<template>
  <section>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <!--新增-->
        <ody-button name="userClassifyAdd_add" code="userClassifyAdd" size="small" type="primary" @click="add">{{ $t('newly_added') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          :operates="operates"
          name="list760"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />

      </div>
    </ody-list-table-area>

    <ody-dialog :visible.sync="addOperation.showDialog" :title="$t('新建分类')" width="600px" height="212px">
      <el-form ref="addOperationForm" :model="addOperation.form" :rules="addOperation.rules" label-width="150px">
        <el-form-item :label="$t('分组分类名称')" :rules="[{ required: true, message: $t('请输入分组分类名称') }]" class="register" required prop="classifyName">
          <el-input v-model="addOperation.form.classifyName" name="addOperation_form_classifyName" maxlength="10"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <ody-button name="userClassifyCancel_cancelForm" code="userClassifyCancel" size="small" @click="cancelForm">{{ $t('cancel') }}</ody-button>
        <ody-button name="userClassifyAdd_submitForm" code="userClassifyAdd" size="small" type="primary" @click="submitForm">{{ $t('confirm') }}</ody-button>
      </div>
    </ody-dialog>

  </section>
</template>

<script>

export default {
  name: 'CrmUserClassify',
  list: [],
  components: {
  },
  data() {
    const self = this
    return {
      loading: false,
      addOperation: getDefaultOperation(),
      searchForm: getDefaultSearchForm(),
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'classifyName',
          label: this.$t('分组分类名称'),
          align: 'center',
          minWidth: 124,
          render: (h, params) => {
            const edit = self.edit
            return (
              <el-link underline='true' type='primary' on-click={(e) => edit(params.row)}>{params.row.classifyName}</el-link>
            )
          }
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('创建时间'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            return this.$portal.parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          }
        }
      ],
      operates: {
        fixed: 'right',
        width: 124,
        align: 'center',
        list: [
          {
            label: this.$t('删除'),
            code: 'userClassifyDelete',
            method: async(index, row) => {
              if (await this.validDeleted(row)) {
                this.$confirm(this.$t('无法删除当前分组分类, 需将分类下分组转移至其它分类中即可删除当前分组分类'), this.$t('提示'), {
                  showConfirmButton: false,
                  cancelButtonText: this.$t('知道了'),
                  type: 'warning'
                })
              } else {
                this.$confirm(this.$t('do_you_confirm_the_deletion') + '？', this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                  cancelButtonText: this.$t('取消'),
                  type: 'warning'
                }).then(() => {
                  this.deleted(row)
                })
              }
            }
          }
        ]
      }
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async validDeleted(row) {
      const res = await this.$crm.$api.userGroup.list({ 'filters': { 'userClassifyId': row.id }})
      if (res.data !== null && res.data.length > 0) {
        return true
      }
      return false
    },
    async deleted(row) {
      await this.$crm.$api.userClassify.delete([row.id])
      await this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async updateList() {
      try {
        this.loading = true
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    edit(row) {
      if (row) {
        this.addOperation = {
          showDialog: true,
          form: {
            classifyName: row.classifyName,
            id: row.id
          }
        }
      }
    },
    add() {
      this.cancelForm()
      this.addOperation.showDialog = true
    },
    cancelForm() {
      this.addOperation = getDefaultOperation()
    },
    async submitForm() {
      const vue = this
      const [err] = await this.formValidate('addOperationForm')

      if (err) {
        return
      }

      try {
        if (vue.addOperation.form.id) {
          const updateRes = await this.$crm.$api.userClassify.update(vue.addOperation.form)
          if (updateRes.code === '0') {
            this.cancelForm()
            this.updateList()
            this.$message({
              message: this.$t('成功'),
              type: 'success'
            })
          } else {
            this.$message({
              message: updateRes.message,
              type: 'error'
            })
          }
        } else {
          const addRes = await this.$crm.$api.userClassify.add(vue.addOperation.form)
          if (addRes.code === '0') {
            this.cancelForm()
            this.updateList()
            this.$message({
              message: this.$t('成功'),
              type: 'success'
            })
          } else {
            this.$message({
              message: addRes.message,
              type: 'error'
            })
          }
        }
      } catch (ex) {
        console.error(ex)
      }
    },
    init() {
      this.updateList()
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign(
    {
      page: 1,
      limit: 10,
      filters: {}
    }
  )
}
function getDefaultOperation() {
  return Object.assign(
    {
      showDialog: false,
      form: {
        classifyName: null,
        id: null
      }
    }
  )
}

async function loadList(vue) {
  const userClassify = vue.$crm.$api.userClassify
  vue.searchForm.page = vue.page.current
  vue.searchForm.limit = vue.page.size
  const res = await userClassify.listPage(vue.searchForm)
  if (res) {
    const data = res.data
    vue.list = data
    vue.page.total = res.total
  }
}
</script>
