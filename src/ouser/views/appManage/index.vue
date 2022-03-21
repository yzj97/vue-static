<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('app名称')" prop="appName">
            <el-input v-model="search.appName" name="search_appName" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button size="small" type="primary" @click.prevent="handleSubmit">
          查询
        </ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <el-button name="addDialog_show" size="mini" type="primary" @click="addDialog.show = true">{{ $t('新增') }}</el-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          request-url="/social-back-web/appDict/queryAllAppDict"
        >
          <template slot="platformId" slot-scope="scope">
            {{ scope.row.platformId | keyVal(getPlatformMap) }}
          </template>
          <template slot="createTime" slot-scope="scope">
            {{ scope.row.createTime | parseTime }}
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <ody-dialog
      :visible.sync="addDialog.show"
      :title="$t('新增app版本')"
      width="600px"
      @open="initAddDialog">
      <el-form ref="form" :model="addDialog.obj" label-width="100px" class="form">
        <el-form-item
          :rules="[{ required: true, message: 'app名称不能为空'}]"
          :label="$t('app名称:')">
          <el-input v-model="addDialog.obj.appName" name="addDialog_obj_appName"/>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '平台类型不能为空'}]"
          :label="$t('平台类型:')">
          <ody-dict-select v-model="addDialog.obj.platformType" name="addDialog_obj_platformType" category="PLATFORM_TYPE" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <div class="line-top"/>
        <el-button name="hideDialog1" size="small" @click="hideDialog1">取 消</el-button>
        <el-button name="confirmDialog1" size="small" type="primary" @click="confirmDialog1">确 定</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addDialog: this.$portal.deepClone(addDialog),
      search: {
        appName: null,
        pageNo: 1,
        pageSize: 10
      },
      table: {
        columns: [
          {
            label: 'APP名称',
            show: true
          },
          {
            label: '平台类型',
            show: true
          },
          {
            label: '渠道类型',
            show: true
          },
          {
            label: '版本号',
            show: true
          },
          {
            label: '更新时间',
            show: true
          }
        ],
        operates: {
          fixed: 'right',
          list: [
            {
              label: '编辑',
              method: (index, row) => {
              }
            },
            {
              label: '删除',
              method: (index, row) => {
              }
            }
          ]
        }
      }
    }
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
    initAddDialog() {
      this.addDialog.obj = this.$portal.deepClone(addDialog.obj)
    },
    query() {
      const {
        ...params
      } = this.search

      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    }
  }
}
const addDialog = {
  show: false,
  obj: {
    appName: null,
    platformType: null,
    appVersion: null
  }
}

</script>

<style scoped>

</style>
