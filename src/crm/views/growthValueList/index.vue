<template>
  <div>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          name="OuserCenterGrowthValueListAdd_addNewRule"
          code="OuserCenterGrowthValueListAdd"
          size="small"
          type="primary"
          @click="addNewRule"
        >{{ $t("新增规则") }}</ody-button
        >
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :data="table.data"
          name="table_data752"
        >
          <template slot="type" slot-scope="scope">{{
            scope.row.type | keyVal(getTypeMap)
          }}</template>
          <template slot="subType" slot-scope="scope">{{
            (scope.row.type.toString() + "_" + scope.row.subType.toString())
              | keyVal(getSubTypesMap)
          }}</template>
          <template slot="createTime" slot-scope="scope">{{
            scope.row.createTime | parseTime
          }}</template>
          <template slot="status" slot-scope="scope">{{
            scope.row.status | keyVal(getStatusMap)
          }}</template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page="search.page"
          :list="table.data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="search.limit"
          :total="table.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      types: [
        { value: 1, label: this.$t('赠送') },
        { value: 2, label: this.$t('消耗') }
      ],
      subTypes: [],
      statuses: [
        { value: 1, label: this.$t('启用') },
        { value: 0, label: this.$t('停用') }
      ],
      search: {
        name: null,
        id: null,
        type: null,
        subType: null,
        status: null,
        page: 1,
        limit: 10
      },
      table: {
        total: 0,
        data: [],
        columns: [
          {
            label: this.$t('规则ID'),
            prop: 'id',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('规则名称'),
            show: true,
            prop: 'name'
          },
          {
            label: this.$t('规则类别'),
            slot: 'type',
            show: true
          },
          {
            label: this.$t('规则类型'),
            slot: 'subType',
            show: true
          },
          {
            label: this.$t('创建时间'),
            slot: 'createTime',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('状态'),
            slot: 'status',
            minWidth: 88,
            show: true
          }
        ],
        operates: {
          width: 200,
          fixed: 'right',
          list: [
            {
              label: this.$t('查看'),
              hidden: (index, row) => {
                return row.status !== 1
              },
              method: (index, row) => {
                this.editRule(row.id, 0)
              },
              code: 'OuserCenterGrowthValueListSee'
            },
            {
              label: this.$t('编辑'),
              hidden: (index, row) => {
                return row.status === 1
              },
              method: (index, row) => {
                this.editRule(row.id, 1)
              },
              code: 'BalenceManualOperationList200'
            },
            {
              label: this.$t('启用'),
              hidden: (index, row) => {
                return row.status === 1
              },
              method: (index, row) => {
                this.updateStatus(row.id, 1)
              },
              code: 'OuserCenterGrowthValueListEnable'
            },
            {
              label: this.$t('停用'),
              hidden: (index, row) => {
                return row.status !== 1
              },
              method: (index, row) => {
                this.updateStatus(row.id, 0)
              },
              code: 'OuserCenterGrowthValueListDisable'
            }
          ]
        }
      }
    }
  },
  computed: {
    getTypeMap() {
      return this.types.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getStatusMap() {
      return this.statuses.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getSubTypesMap() {
      return this.subTypes.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  async mounted() {
    await this.query()
    await this.$crm.$api.userService
      .configListMulti({ categorys: ['GROWTH_RULE_TYPE'], pool: 'crm' })
      .then(resp => {
        if (resp.data['GROWTH_RULE_TYPE']) {
          const subTypes = []
          for (const i in resp.data['GROWTH_RULE_TYPE']) {
            subTypes.push({
              value: i,
              label: resp.data['GROWTH_RULE_TYPE'][i]
            })
          }
          this.subTypes = subTypes
        }
      })
  },
  methods: {
    async handleSubmit() {
      await this.query()
    },
    query() {
      const { ...params } = this.search

      params.excludeBasicConfig = true
      params.entityType = 2
      this.$crm.$api.crmService.listRulePage(params).then(res => {
        this.table.total = res.total
        this.table.data = res.data
      })
    },
    handleSizeChange(size) {
      this.search.limit = size
      this.handleSubmit()
    },
    handleCurrentChange(page) {
      this.search.page = page
      this.handleSubmit()
    },
    updateStatus(id, status) {
      this.$confirm(
        this.$t('确认启用') + '/' + this.$t('停用该条数据') + '?',
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(() => {
        this.$crm.$api.crmService
          .updateRuleStatus({ id: id, status: status })
          .then(res => {
            this.$message({
              type: 'success',
              message: this.$t('操作成功')
            })
            this.query()
          })
      })
    },
    addNewRule() {
      this.$router.push({
        path: '/crm/growthValueOperation',
        query: {
          add: 1,
          edit: 1
        }
      })
    },
    editRule(id, edit) {
      this.$router.push({
        path: '/crm/growthValueOperation',
        query: {
          add: 0,
          edit: edit,
          id: id
        }
      })
    }
  }
}
</script>
