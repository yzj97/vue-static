<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="'pool:'" prop="pool">
            <el-select v-model="search.pool" :placeholder="$t('全部')" name="search_pool">
              <el-option
                v-for="item in pools"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="'category:'" prop="category">
            <el-input
              v-model="search.category"
              name="search_category"/>
          </ody-search-item>
          <ody-search-item :label="$t('是否可编辑:')" prop="canEdit">
            <el-select v-model="search.canEdit" :placeholder="$t('全部')" name="search_canEdit">
              <el-option
                key="true"
                :label="$t('可编辑')"
                value="true"
              />
              <el-option
                key="false"
                :label="$t('不可编辑')"
                value="false"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="ui_handleReset" code="ui" size="small" @click="handleReset">{{ $t('重置') }}</ody-button>
        <ody-button name="ui" code="ui" size="small" type="primary" @click.prevent="handleSubmit">
          {{ $t('查询') }}
        </ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          request-url="/ouser-web/admin/listCodeInfoPage.do"
        >
          <template slot="updateTime" slot-scope="scope">
            <span v-if="scope.row.updateTime">{{ scope.row.updateTime | parseTime }}</span>
            <span v-if="!scope.row.updateTime"/>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <ody-dialog
      :visible.sync="dialog.show"
      :title="dialog.title"
      width="1200px"
      @close="initDialog"
    >
      <el-form
        ref="form"
        :disabled="dialog.edit === false"
        :model="dialog.obj"
        label-width="80px"
      >
        <el-tabs v-model="dialog.obj.active" name="dialog_obj_active" @tab-click="handleClick">
          <el-tab-pane v-for="i in dialog.obj.typeList" :label="i" :key="i" :name="i"/>
        </el-tabs>
        <el-form v-if="dialog.edit === true" ref="addForm" :inline="true" :model="dialog.obj">
          <el-form-item :label="$t('编码')+':'" :rules="[{ required: true, message: $t('请输入编码') }]" prop="addCode">
            <el-input v-model="dialog.obj.addCode" name="dialog_obj_addCode"/>
          </el-form-item>
          <el-form-item :label="$t('描述')+':'" :rules="[{ required: true, message: $t('请输入描述') }]" prop="addName">
            <el-input v-model="dialog.obj.addName" name="dialog_obj_addName"/>
          </el-form-item>
          <el-form-item>
            <ody-button name="ui_addOne" code="ui" type="primary" size="mini" @click="addOne">{{ $t('新增') }}</ody-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="dialog.obj.list"
          name="dialog_obj_list194"
          height="600px"
          @cell-mouse-enter="onMouseEnter">
          <el-table-column :label="$t('编码')" prop="code" width="300px"/>
          <el-table-column :label="$t('描述')" prop="name">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
              <span v-if="dialog.edit === true && scope.row.id === dialog.obj.editId && dialog.obj.edit === false">
                <i name="editName" style="margin-left: 5px" class="el-icon-edit" @click="editName"/>
                <i name="deleteOne" style="margin-left: 5px" class="el-icon-close" @click="deleteOne"/>
              </span>
              <span v-if="scope.row.id === dialog.obj.editId && dialog.obj.edit === true">
                <el-input v-model="dialog.obj.editName" name="dialog_obj_editName" size="mini" style="width: 400px;margin-left: 20px"/>
                <i name="commitEdit" style="margin-left: 5px" class="el-icon-check" @click="commitEdit"/>
                <i name="cancelEditName" style="margin-left: 5px" class="el-icon-close" @click="cancelEditName"/>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer">
          <ody-button name="ui_closeDialog" code="ui" size="small" @click="closeDialog">{{ $t('取消') }}</ody-button>
          <ody-button
            v-if="dialog.edit === true"
            name="ui_commitDialog"
            code="ui"
            size="small"
            type="primary"
            @click="commitDialog">{{ $t('确定') }}</ody-button>
        </span>
      </el-form>
    </ody-dialog>

  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: {
        show: false,
        title: null,
        edit: false,
        obj: {}
      },
      search: {
        pool: null,
        key: null,
        canEdit: null,
        note: null
      },
      table: {
        columns: [
          {
            label: 'pool',
            prop: 'pool',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: 'category',
            prop: 'category',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('最后更新时间'),
            slot: 'updateTime',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: 'companyId',
            prop: 'companyId',
            show: true,
            align: 'center'
          }
        ],
        operates: {
          width: 124,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              hidden: (index, row) => {
                return row.canEdit === false
              },
              method: (index, row) => {
                this.openEditDialog(row)
              },
              code: 'ui'
            },
            {
              label: this.$t('查看'),
              hidden: (index, row) => {
                return row.canEdit === true
              },
              method: (index, row) => {
                this.openShowDialog(row)
              },
              code: 'ui'
            }
          ]
        }
      },
      pools: []
    }
  },
  async mounted() {
    await this.$ouser.$api.adminService.listCodeInfoPool().then(res => {
      this.pools = res.data
    })
    await this.query()
    await this.initDialog()
  },
  methods: {
    handleReset() {
      this.formReset('search')
    },
    async handleSubmit() {
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }
      await this.query()
    },
    query() {
      const {
        ...params
      } = this.search

      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    initDialog() {
      this.dialog.obj = {
        editId: 0,
        edit: false,
        editName: null,
        addCode: null,
        addName: null,
        row: {},
        typeList: [],
        list: [],
        active: null
      }
    },
    openShowDialog(row) {
      this.dialog.show = true
      this.dialog.title = this.$t('查询')
      this.dialog.edit = false
      this.queryDetail(row)
    },
    openEditDialog(row) {
      this.dialog.show = true
      this.dialog.title = this.$t('编辑')
      this.dialog.edit = true
      this.queryDetail(row)
    },
    queryDetail(row) {
      this.dialog.obj.row = row
      this.$ouser.$api.adminService.listCodeDetail({ pool: row.pool, category: row.category }).then(res => {
        const typeList = []
        res.data.forEach(i => {
          this.dialog.obj[i.language] = []
          if (typeList.indexOf(i.language) === -1) {
            typeList.push(i.language)
          }
        })

        res.data.forEach(i => {
          this.dialog.obj[i.language].push(i)
        })

        this.dialog.obj.typeList = typeList

        if (this.dialog.obj.typeList.length > 0) {
          if (this.dialog.obj.active === '0') {
            this.dialog.obj.active = this.dialog.obj.typeList[0]
          }
        }
        this.handleClick()
      })
    },
    closeDialog() {
      this.dialog.show = false
      this.initDialog()
    },
    async commitDialog() {
      const [err] = await this.formValidate('form')

      if (err) {
        return
      }
      await this.$ouser.$api.adminService.updatePageInfo(this.dialog.obj).then(res => {
        this.$message({
          type: 'success',
          message: this.$t('更新成功')
        })
        this.closeDialog()
        this.query()
      })
    },
    onMouseEnter(row, column, cell, event) {
      if (this.dialog.obj.edit === false) {
        this.dialog.obj.editId = row.id
      }
    },
    editName() {
      this.dialog.obj.edit = true
    },
    cancelEditName() {
      this.dialog.obj.edit = false
      this.dialog.obj.editName = null
    },
    commitEdit() {
      this.$ouser.$api.adminService.updateCodeName({
        id: this.dialog.obj.editId,
        name: this.dialog.obj.editName
      }).then(res => {
        this.dialog.obj.edit = false
        this.queryDetail(this.dialog.obj.row)
      })
    },
    handleClick(tab, event) {
      this.dialog.obj.list = this.dialog.obj[this.dialog.obj.active]
    },
    deleteOne() {
      this.$confirm(this.$t('此操作将永久删除'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$ouser.$api.adminService.deleteCode({ id: this.dialog.obj.editId }).then(res => {
          this.queryDetail(this.dialog.obj.row)
          this.$message({
            type: 'success',
            message: this.$t('删除成功')
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('已取消删除')
        })
      })
    },
    async addOne() {
      const [err] = await this.formValidate('addForm')

      if (err) {
        return
      }
      this.$ouser.$api.adminService.addOne({
        pool: this.dialog.obj.row.pool,
        category: this.dialog.obj.row.category,
        code: this.dialog.obj.addCode,
        name: this.dialog.obj.addName,
        language: this.dialog.obj.active,
        dataType: 'string'
      }).then(res => {
        this.queryDetail(this.dialog.obj.row)
        this.dialog.obj.addCode = null
        this.dialog.obj.addName = null
        this.formReset('addForm')
      })
    }
  }
}
</script>
