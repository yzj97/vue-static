<template>
  <div class="cp-online-table-dev-list">
    <ody-list-search-area ref="search-container">
      <div slot="content">
        <el-form ref="searchForm" :model="searchForm" class="form">
          <ody-search-item :label="$t('项目名:')" prop="project">
            <el-input
              v-model="searchForm.project"
              :placeholder="$t('请输入项目名')"
              name="searchForm_project"
            />
          </ody-search-item>
          <ody-search-item :label="$t('表名:')" prop="tableName">
            <el-input
              v-model="searchForm.tableName"
              :placeholder="$t('请输入表名')"
              name="searchForm_name"
            />
          </ody-search-item>
          <ody-search-item :label="$t('表类型:')" prop="tableType">
            <el-select
              v-model="searchForm.tableType"
              :placeholder="$t('全部')"
              name="searchForm_type"
            >
              <el-option
                v-for="item in tableTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button code="ui" name="handleReset" size="small" @click="handleReset">{{ $t("重置") }}</ody-button>
        <ody-button
          name="OuserGuilderManageQuery_query"
          code="ui"
          size="small"
          type="primary"
          @click="handleSubmit"
        >{{ $t("查询") }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          code="ui"
          type="primary"
          name="handleReset"
          size="small"
          @click="handleAdd"
        >{{ $t("新建") }}</ody-button>
        <el-button type="text">
          <el-link name="openHelp" type="primary" @click="openHelp" >{{ $t('帮助文档') }}</el-link>
        </el-button>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          ref="table"
          :index="true"
          :data="tableData"
          :columns="columns"
          :operates="operates"
          name="tableData576"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="tableData"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
    </div></ody-list-table-area>

    <EditDrawer
      :visible.sync="editDrawerVisible"
      :edit-new="editNew"
      :row="editRow"
      :table-type-options="tableTypeOptions"
      :reduce-field-config="reduceFieldConfig"
      @ok="loadData"
    />

    <CodeDialog
      :visible.sync="codeDialogVisible"
      :current-model-id="currentModelId"
      :reduce-field-config="reduceFieldConfig"
    />
  </div>
</template>
<script>
import EditDrawer from './component/edit-drawer'
import CodeDialog from './component/code-dialog'

export default {
  components: {
    EditDrawer,
    CodeDialog
  },
  data() {
    return {
      loading: false,
      editNew: false,
      editRow: null,

      editDrawerVisible: false,
      codeDialogVisible: false,

      currentModelId: null,
      // 顶部表单
      searchForm: this.initSearchForm(),
      tableTypeOptions: [
        {
          value: 1,
          label: '单表'
        },
        {
          value: 2,
          label: '附表'
        },
        {
          value: 3,
          label: '主表一对多附表'
        },
        {
          value: 4,
          label: '附表多对一主表'
        }
      ],
      columns: [
        {
          label: this.$t('项目'),
          prop: 'project',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('库名'),
          prop: 'db',
          show: true,
          align: 'center',
          minWidth: 88
        },
        {
          label: this.$t('表名'),
          prop: 'tableName',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('中文'),
          prop: 'tableComment',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('表类型'),
          prop: 'tableType',
          show: true,
          align: 'center',
          minWidth: 88,
          formatter: (row, column) => {
            return this.tableTypeOptions.find(item => item.value === row.tableType).label
          }
        },
        {
          label: this.$t('创建时间'),
          prop: 'createTime',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            if (row.createTime) {
              return this.$portal.parseTime(
                row.createTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        }
      ],
      // table表格数据
      tableData: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      operates: {
        width: 200,
        fixed: 'right',
        list: [
          {
            label: '编辑',
            method: (index, row) => {
              this.handleEdit(index, row)
            },
            code: 'ui'
          },
          {
            label: '删除',
            method: (index, row) => {
              this.deleteTableRow(index, row)
            },
            code: 'ui'
          },
          {
            label: '生成代码',
            hidden: (index, row) => {
              return row.tableType === 2
            },
            method: (index, row) => {
              this.handleCreateCode(index, row)
            },
            code: 'ui'
          }
        ]
      },
      reduceFieldConfig: {
        searchFields: ['modelName', 'name', 'title', 'relName', 'tag', 'tagSize', 'tagAttributes', 'dataSourceType', 'dataSourceKey'],
        tableFields: ['modelName', 'name', 'title', 'relName', 'dataSourceType', 'dataSourceKey'],
        editFields: ['modelName', 'name', 'title', 'relName', 'nullable', 'tag', 'tagSize', 'tagAttributes', 'dataSourceType', 'dataSourceKey'],
        importFields: ['modelName', 'name', 'title', 'relName', 'dataSourceType', 'dataSourceKey'],
        exportFields: ['modelName', 'name', 'title', 'relName', 'dataSourceType', 'dataSourceKey']
      }
    }
  },
  async mounted() {
    try {
      this.loading = true
      await this.init()
    } finally {
      this.loading = false
    }
  },
  methods: {
    async init() {
      this.loadData()
    },
    async loadData() {
      const codeModelService = this.$ouser.$api.codeModelService
      this.loading = true
      // 初始化搜索对象
      try {
        const res = await codeModelService.listPage({
          page: this.page.current,
          limit: this.page.size,
          filters: this.searchForm
        })
        this.tableData = res.data
        this.page.total = res.total
      } finally {
        this.loading = false
      }
    },
    handleReset() {
      this.searchForm = {}
      this.loadData()
    },

    // 查询
    async handleSubmit() {
      this.page.current = 1
      await this.loadData()
    },
    handleAdd() {
      this.editNew = true
      this.editRow = null
      this.editDrawerVisible = true
    },
    // 编辑数据
    handleEdit(index, row) {
      this.editNew = false
      this.editRow = row
      this.editDrawerVisible = true
    },
    // 删除
    async deleteTableRow(index, row) {
      this.dialog = true
      const confirm = await this.$confirm(
        this.$t('是否删除当前行数据'),
        this.$t('common_prompt')
      )
      if (confirm) {
        this.$ouser.$api.codeModelService
          .delete([row.id])
          .then(res => {
            this.init()
          })
          .finally(res => {
            console.log(res)
            this.dialog = false
          })
      }
    },
    // 生成代码
    async handleCreateCode(index, row) {
      this.currentModelId = row.id
      this.codeDialogVisible = true
    },
    initSearchForm() {
      return {
        tableName: '',
        tableType: ''
      }
    },
    openHelp() {
      this.$router.push({
        name: 'OuserOnlineTableHelp'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #ffffff;
    padding: 5px;
    width: 200px;
  }
  /deep/ .input-with-select .el-input-group__append {
    padding: 5px;
    width: 50px;
  }
</style>
