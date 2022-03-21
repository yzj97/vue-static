<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('所属商家:')" prop="entityId">
              <ody-merchant-select v-model="searchForm.entityId" :placeholder="$t('全部')" value-key="merchantId" name="searchForm_entityId"/>
            </ody-search-item>
            <ody-search-item :label="$t('岗位名称:')" prop="positionName">
              <el-input v-model="searchForm.positionName" name="searchForm_positionName" />
            </ody-search-item>
            <ody-search-item :label="$t('创建时间:')" :space="2" class="register" prop="dateRange">
              <ody-date-range-picker
                v-model="dateRange"
                :range-separator="$t('至')"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                name="dateRange"
                type="datetimer"
              />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <ody-button name="OuserPositionListQuery_handleQuery" code="OuserPositionListQuery" size="small" type="primary" @click="handleQuery">{{ $t('查询') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn-bottom">
          <ody-button name="OuserPositionManageAdd_initEditDialog" code="OuserPositionManageAdd" size="small" type="primary" @click="initEditDialog({},false)">{{ $t('添加') }}</ody-button>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable_list529"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="searchForm.currentPage"
            :list="listTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.itemsPerPage"
            :total.sync="listTable.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="findPositionList"
            @current-change="findPositionList"
          />

        </div>
      </ody-list-table-area>
    </section>
    <ody-dialog :visible.sync="editObj.show" :title="editObj.title">
      <el-form
        ref="position"
        :label-position="left"
        :rules="rules"
        :model="editObj.obj"
        :disabled="editObj.edit === false"
        label-width="80px"
      >
        <el-form-item :label="$t('所属商家')" prop="entityId">
          <ody-merchant-select v-model="editObj.obj.entityId" :disabled="editObj.obj.id" value-key="merchantId" name="editObj_obj_entityId"/>
        </el-form-item>
        <el-form-item :label="$t('岗位编码')" prop="positionCode">
          <el-input v-model="editObj.obj.positionCode" :disabled="editObj.obj.id" :maxlength="32" name="editObj_obj_positionCode" />
        </el-form-item>
        <el-form-item :label="$t('岗位名称')" prop="positionName">
          <el-input v-model="editObj.obj.positionName" :maxlength="40" name="editObj_obj_positionName" />
        </el-form-item>
        <el-form-item :label="$t('岗位备注')">
          <el-input
            :rows="2"
            :maxlength="400"
            v-model="editObj.obj.positionDesc"
            :placeholder="$t('请输入内容')"
            name="editObj_obj_positionDesc"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ody-button name="OuserPositionManageAddSave_editDialogCommit" code="OuserPositionManageAddSave" type="primary" @click="editDialogCommit">{{ $t('保存') }}</ody-button>
        <el-button name="editDialogCancel" @click="editDialogCancel">{{ $t('取消') }}</el-button>
      </div>
    </ody-dialog>
  </div>
</template>

<script>
import util from '@/utils/util'
export default {
  name: 'OuserPositionList',
  data() {
    const self = this
    return {
      loading: false,
      dateRange: [],
      merchants: {},
      rules: {
        positionCode: [
          { required: true, message: this.$t('请输入岗位编码'), trigger: 'change' },
          {
            pattern: /^[0-9a-zA-Z_]*$/,
            message: this.$t('仅支持字母数字下划线'),
            trigger: 'change'
          }
        ],
        positionName: [
          { required: true, message: this.$t('请输入岗位名称'), trigger: 'change' }
        ]
      },
      pickerOptions: {},
      listTable: {
        list: [],
        columns: [
          {
            show: true,
            prop: 'positionCode',
            label: this.$t('岗位编码'),
            align: 'center'
          },
          {
            show: true,
            prop: 'positionName',
            label: this.$t('岗位名称'),
            align: 'center'
          },
          {
            show: true,
            prop: 'entityName',
            label: this.$t('所属商家'),
            align: 'center'
          },
          {
            show: true,
            prop: 'positionDesc',
            label: this.$t('岗位备注'),
            align: 'center',
            minWidth: 200
          },
          {
            show: true,
            prop: 'createTimeStr',
            label: this.$t('创建时间'),
            align: 'center',
            minWidth: 200
          }
        ],
        operates: {
          align: 'center',
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              show: true,
              disabled: false,
              method(index, row) {
                self.initEditDialog(row, true)
              },
              code: 'OuserPositionManageEdit'
            },
            {
              label: this.$t('删除'),
              show: true,
              disabled: false,
              method(index, row) {
                self
                  .$confirm(self.$t('确认删除该数据?'), self.$t('提示'), {
                    confirmButtonText: self.$t('确定'),
                    cancelButtonText: self.$t('取消'),
                    type: 'warning'
                  })
                  .then(() => {
                    const positionService = self.$ouser.$api.positionService
                    self.editObj.obj.id = row.id

                    positionService.delPosition(self.editObj.obj).then(() => {
                      self.$message({
                        message: self.$t('删除成功'),
                        type: 'success'
                      })
                      self.initDialog()
                      self.findPositionList()
                    })
                  })
                  .catch(() => {
                    self.$message({
                      type: 'info',
                      message: self.$t('已取消删除')
                    })
                  })
              },
              code: 'OuserPositionManageDelete'
            }
          ]
        },
        total: 0
      },
      searchForm: {
        currentPage: 1,
        itemsPerPage: 10
      },
      editObj: { show: false, obj: {}}
    }
  },
  async mounted() {
    this.loading = true
    await this.queryMerchant()
    await this.init()
    this.loading = false
  },
  methods: {
    async handleQuery() {
      this.searchForm.currentPage = 1
      await this.findPositionList()
    },
    async init() {
      await this.findPositionList()
    },
    async queryMerchant() {
      await this.$ouser.$api.merchantService.queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 9999 }).then(res => {
        this.merchants = {}
        res.data.listObj.forEach(i => {
          this.merchants[i.merchantId] = i.merchantName
        })
      })
    },
    initForm() {
      this.searchForm = {
        currentPage: 1,
        itemsPerPage: 10
      }
      this.dateRange = []
    },
    initEditDialog(obj, edit) {
      this.initDialog()
      this.editObj.show = true
      this.editObj.title = this.$t('新增员工')

      if (obj.id) {
        // 编辑
        this.editObj.obj = util.copy(obj)
        this.editObj.add = false
        this.editObj.edit = edit
        this.editObj.title = edit ? this.$t('编辑岗位') : this.$t('查看岗位')
      } else {
        // 新增
        this.editObj.add = true
        this.editObj.title = this.$t('新增岗位')
      }
    },
    initDialog() {
      this.editObj = { show: false, obj: {}}
    },
    editDialogCancel() {
      this.initDialog()
    },
    editDialogCommit() {
      this.$refs['position'].validate(valid => {
        if (valid) {
          const positionService = this.$ouser.$api.positionService
          const self = this
          this.editObj.obj.entityType = '1'

          if (this.editObj.add) {
            positionService.addPosition(this.editObj.obj).then(() => {
              self.$message({
                message: this.$t('添加岗位成功'),
                type: 'success'
              })
              self.initDialog()
              self.findPositionList()
              self.$forceUpdate()
            })
          } else {
            if (this.editObj.obj.positionDesc === null) {
              this.editObj.obj.positionDesc = ''
            }
            positionService.updatePosition(this.editObj.obj).then(() => {
              self.$message({
                message: this.$t('更新岗位成功'),
                type: 'success'
              })
              self.initDialog()
              self.findPositionList()
              self.$forceUpdate()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
      this.$forceUpdate()
    },
    async findPositionList() {
      const positionService = this.$ouser.$api.positionService
      this.searchForm.entityType = '1'
      const self = this
      if (this.dateRange && this.dateRange.length > 0) {
        this.searchForm.createTimeStart = this.dateRange[0] // + ' 00:00:00'
        this.searchForm.createTimeEnd = this.dateRange[1] // + ' 23:59:59'
      } else {
        this.searchForm.createTimeStart = null
        this.searchForm.createTimeEnd = null
      }
      this.loading = true
      try {
        const res = await positionService.findPositionListPage(this.searchForm)
        self.listTable.list = res.data.listObj
        self.listTable.total = res.data.total
        self.listTable.list.forEach(i => {
          i.entityName = this.merchants[i.entityId]
        })
        util.formatDate(self.listTable.list, 'createTime')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
