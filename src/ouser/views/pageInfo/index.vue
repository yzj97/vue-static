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
          <ody-search-item :label="'key:'" prop="key">
            <el-input
              v-model="search.key"
              name="search_key" />
          </ody-search-item>
          <ody-search-item :label="$t('描述:')" prop="note">
            <el-input
              v-model="search.note"
              name="search_note" />
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
          request-url="/ouser-web/admin/listPageInfoPage.do"
        >
          <template slot="createTime" slot-scope="scope">
            {{ scope.row.createTime | parseTime }}
          </template>
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
      width="600px"
      @close="initDialog"
    >
      <el-form
        ref="form"
        :disabled="dialog.edit === false"
        :model="dialog.obj"
        label-width="80px"
      >
        <el-form-item prop="pool" label="pool:">
          <el-input v-model="dialog.obj.pool" name="dialog_obj_pool" disabled size="mini"/>
        </el-form-item>
        <el-form-item prop="key" label="key:">
          <el-input v-model="dialog.obj.key" name="dialog_obj_key" disabled size="mini"/>
        </el-form-item>
        <el-form-item :label="$t('描述')+':'" prop="note">
          <el-input v-model="dialog.obj.note" name="dialog_obj_note" disabled size="mini"/>
        </el-form-item>
        <el-form-item :label="$t('值类型')+':'" prop="dataType">
          <el-input v-model="dialog.obj.dataType" name="dialog_obj_dataType" disabled size="mini"/>
        </el-form-item>
        <el-form-item :label="$t('上次的值')+':'" prop="recentValue">
          <el-input
            v-model="dialog.obj.recentValue"
            name="dialog_obj_recentValue"
            autosize="true"
            disabled
            type="textarea"
            size="mini"/>
        </el-form-item>
        <el-form-item :label="$t('值')+':'" prop="value" required>
          <el-input
            v-model="dialog.obj.value"
            name="dialog_obj_value"
            autosize="true"
            type="textarea"
            size="mini"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <ody-button name="ui_closeDialog" code="ui" size="small" @click="closeDialog">{{ $t('取消') }}</ody-button>
        <ody-button v-if="dialog.edit === true" name="ui_commitDialog" code="ui" size="small" type="primary" @click="commitDialog">{{ $t('确定') }}</ody-button>
      </span>
    </ody-dialog>

  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: { show: false, title: null, edit: false, obj: {}},
      search: {
        pool: null,
        key: null,
        canEdit: null,
        note: null
      },
      table: {
        columns: [
          {
            label: this.$t('描述'),
            prop: 'note',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: 'pool',
            prop: 'pool',
            show: true,
            align: 'center',
            minWidth: 124
          },
          {
            label: 'key',
            prop: 'key',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('值'),
            prop: 'value',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: 'companyId',
            prop: 'companyId',
            show: true,
            align: 'center',
            minWidth: 124
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
    await this.$ouser.$api.adminService.listPageInfoPool().then(res => {
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
        value: null
      }
    },
    openShowDialog(row) {
      this.dialog.show = true
      this.dialog.title = this.$t('查询')
      this.dialog.edit = false
      this.dialog.obj = row
    },
    openEditDialog(row) {
      this.dialog.show = true
      this.dialog.title = this.$t('编辑')
      this.dialog.edit = true
      this.dialog.obj = row
    },
    closeDialog() {
      this.dialog.show = false
      this.initDialog()
    },
    async  commitDialog() {
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
    }
  }
}
</script>
