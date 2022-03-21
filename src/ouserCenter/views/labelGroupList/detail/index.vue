<template>
  <section>
    <el-form ref="form" :rules="rules" :model="dataForm" label-width="100px" class="form">
      <el-form-item :label="$t('label_group_name')" :rules="isEdit ? rules['name'] : {}" prop="name">
        <el-input v-if="isEdit" v-model="dataForm.name" :placeholder="$t('please_input_label_group_name')" name="dataForm_name" maxlength="20" />
        <span v-if="!isEdit" >{{ dataForm.name }}</span>
      </el-form-item>
      <el-form-item :label="$t('label_group_remark')" prop="remark">
        <el-input
          v-if="isEdit"
          v-model="dataForm.remark"
          :placeholder="$t('please_input_label_group_remark')"
          name="dataForm_remark"
          maxlength="100"
          type="textarea"
          show-word-limit/>
        <span v-if="!isEdit" >{{ dataForm.remark }}</span>
      </el-form-item>
      <ody-list-table-area>
        <div slot="tabs">
          <div slot="btn mgB12">
            <el-button v-permission="'LabelAdd'" v-if="dataForm.id&&isEdit" name="addLabel" size="small" type="primary" @click="addLabel">{{ $t('add_label') }}</el-button>
          </div>
        </div>
        <div slot="table">
          <ody-table
            :data="labelList"
            :columns="columns"
            :operates="operates"
            name="labelList119"/>
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="page.current"
              :list="labelList"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="page.size"
              :total.sync="page.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handlePageSizeChange"
              @current-change="handlePageCurrentChange"/>
          </div>
        </div>
      </ody-list-table-area>
    </el-form>
    <ody-fixed>
      <el-button name="handleBack" size="small" @click="handleBack('form')">{{ $t('common_back') }}</el-button>
      <ody-button v-permission="'LabelGroupListSave'" v-if="isEdit" name="handleSubmit" size="small" type="primary" @click="handleSubmit('form')">{{ $t('common_save') }}</ody-button>
    </ody-fixed>
    <AddOrEditLabelModal :visible.sync="addOrEditLabelModalVisible" :label-obj.sync="labelObj" @ok="updateLabelTable" />
  </section>
</template>

<script>
import AddOrEditLabelModal from '@/components/addOrEditLabel'
import { mapGetters } from 'vuex'
export default {
  name: 'OuserCenterAddOrEditLabelGroup',
  components: {
    AddOrEditLabelModal
  },
  data() {
    const self = this
    return {
      isEdit: false, // 是否是新开
      isShowAdd: false, // 是否是新开
      isShowSave: false, // 是否是新开
      searchForm: getDefaultSearchForm(),
      addOrEditLabelModalVisible: false,
      dataForm: getDefaultInvoiceDataForm(),
      loading: false,
      labelList: [],
      labelObj: {},
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      rules: {
        name: [
          { required: true, message: this.$t('please_input_label_group_name'), trigger: 'blur' }
        ]
      },
      columns: [
        {
          show: true,
          prop: 'name',
          label: this.$t('label_group_name'),
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return (
              <el-button size='mini' on-click={() => {
                self.editLabelDialog(params.row)
              }}>{params.row.name}</el-button>
            )
          }
        },
        {
          show: true,
          prop: 'bindingNum',
          label: this.$t('binding_num'),
          align: 'center',
          minWidth: 160
        },
        {
          show: true,
          prop: 'remark',
          label: this.$t('label_remark'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('common_createTime'),
          align: 'center',
          minWidth: 160,
          formatter(row, column) {
            if (row.createTime) {
              return self.$portal.parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('common_create_username'),
          align: 'center',
          minWidth: 160
        }, {
          show: true,
          prop: 'labelStatus',
          label: this.$t('label_status'),
          align: 'center',
          minWidth: 160,
          render: function(h, params) {
            const changeStatus = self.changeStatus
            return (
              <div on-click={(e) => changeStatus(e, params.row)}><el-switch value={params.row.labelStatus === 1 } active-text={ params.row.labelStatus === 1 ? '启用' : '停用' }></el-switch></div>
            )
          }
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        minWidth: 150,
        list: [
          {
            label: this.$t('common_delete'),
            method(index, row) {
              self.deleteRow(row)
            },
            hidden(index, row) {
              if (self.functions.indexOf('LabelDelete') > 0 && self.isEdit) {
                return false
              } else {
                return true
              }
            }
          }
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
      await this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    getLabelGroup(id) {
      const vue = this
      const labelGroup = vue.$ouserCenter.$api.labelGroup
      labelGroup.getLabelGroup({ id: id }).then((result) => {
        if (result && result.code === '0') {
          vue.dataForm = result.data
        }
      })
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
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    addLabel() {
      this.labelObj = {}
      this.labelObj.groupId = this.dataForm.id
      this.addOrEditLabelModalVisible = true
    },
    editLabelDialog(params) {
      if (!this.isEdit) {
        this.$message({
          type: 'warn',
          message: this.$t('unauthorized_operation')
        })
        return
      }
      this.labelObj = { ...params }
      this.addOrEditLabelModalVisible = true
    },
    // 行操作开始
    deleteRow(row) {
      const vue = this
      vue.$confirm(vue.$t('confirm_delete_label'), vue.$t('whether_delete_label'), {
        confirmButtonText: vue.$t('common_delete'),
        cancelButtonText: vue.$t('common_cancel')
      }).then(() => {
        const labelGroup = vue.$ouserCenter.$api.labelGroup
        labelGroup.deleteLabel({ id: row.id, groupId: row.groupId }).then((result) => {
          vue.getLabelGroup(row.groupId)
          vue.$message({
            type: 'success',
            message: vue.$t('common_delete_success')
          })
          vue.updateList()
        }).catch(() => {
          vue.updateList()
        })
      }, () => {})
    },
    changeStatus(e, row) {
      const vue = this
      if (!this.isEdit) {
        vue.$message({
          type: 'warn',
          message: vue.$t('unauthorized_operation')
        })
        return
      }
      e.preventDefault()
      var updatePara = {}
      updatePara.id = row.id
      updatePara.labelStatus = row.labelStatus === 0 ? 1 : 0
      const label = this.$ouserCenter.$api.labelGroup
      label.updateLabelStatus(updatePara).then(res => {
        vue.$message({
          type: 'success',
          message: vue.$t('common_update_status_success')
        })
        vue.updateList()
      })
    },
    handleSubmit(form) {
      const vue = this
      vue.$refs['form'].validate((valid) => {
        if (valid) {
          const labelGroup = vue.$ouserCenter.$api.labelGroup
          if (vue.dataForm.id) {
            labelGroup.updateLabelGroup(vue.dataForm).then((result) => {
              if (result && result.code === '0') {
                vue.$message({
                  type: 'success',
                  message: this.$t('common_update_success')
                })
              }
            })
          } else {
            vue.dataForm.groupStatus = 1
            labelGroup.addLabelGroup(vue.dataForm).then((result) => {
              if (result && result.code === '0') {
                vue.dataForm.id = result.data
                vue.$message({
                  type: 'success',
                  message: this.$t('common_save_success')
                })
              }
            })
          }
        }
      })
    },
    handleBack(form) {
      this.$router.push({ name: 'OuserCenterLabelGroupList' })
      // this.$portal.delActiveViewAndRefresh()
    },
    async init() {
      this.dataForm = {
        id: null,
        name: null,
        groupStatus: null,
        remark: null
      }
      if (this.$route.params.id) {
        this.dataForm.id = this.$route.params.id
      }

      if (this.dataForm.id) {
        if (this.functions.indexOf('LabelGroupListEdit') > 0) {
          this.isEdit = true
        } else {
          this.isEdit = false
        }
        const labelGroup = this.$ouserCenter.$api.labelGroup
        labelGroup.getLabelGroup({ id: this.dataForm.id }).then((result) => {
          if (result && result.code === '0') {
            this.dataForm = result.data
          }
        })
        this.updateList()
      } else {
        if (this.functions.indexOf('LabelGroupListAdd') > 0) {
          this.isEdit = true
        } else {
          this.isEdit = false
        }
      }
    },
    async updateLabelTable() {
      try {
        this.getLabelGroup(this.dataForm.id)
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}
function loadList(vue) {
  if (vue.dataForm.id) {
    vue.searchForm.groupId = vue.dataForm.id
    const filters = JSON.parse(JSON.stringify(vue.searchForm))
    const param = {
      filters: filters,
      limit: vue.page.size,
      page: vue.page.current
    }
    vue.$ouserCenter.$api.labelGroup.queryLabelPage(param).then((res) => {
      if (res.code === '0') {
        vue.page.total = res.total
        vue.labelList = res.data
      }
    })
  }
}
function getDefaultInvoiceDataForm(vue) {
  return Object.assign({}, {
    id: null,
    name: null,
    groupStatus: null,
    remark: null
  })
}
function getDefaultSearchForm() {
  return Object.assign({}, {
    groupId: null
  })
}
</script>

<style lang="scss" scoped>

</style>
