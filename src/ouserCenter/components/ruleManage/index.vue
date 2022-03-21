<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item
            :label="$t('规则ID')"
            :rules="[
              { pattern: /^[0-9]*$/, message: this.$t('仅支持数字'), trigger: 'change' },
              { min: 0, max: 20, message: this.$t('长度在') + ' 0 ' + this.$t('到') + ' 20 ' + this.$t('个字符'), trigger: 'change' }
            ]"
            prop="id">
            <el-input v-model="search.id" name="search_id" />
          </ody-search-item>
          <ody-search-item :label="$t('规则名称')" prop="name">
            <el-input v-model="search.name" name="search_name" />
          </ody-search-item>
          <ody-search-item :label="$t('规则类别')" prop="type">
            <el-select v-model="search.type" :placeholder="$t('全部')" name="search_type" >
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('规则类型')" prop="subType">
            <el-select v-model="search.subType" :placeholder="$t('全部')+'('+$t('覆盖规则类别选项')+')'" name="search_subType">
              <el-option
                v-for="item in subTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('状态')" prop="status">
            <el-select v-model="search.status" :placeholder="$t('全部')" name="search_status">
              <el-option
                v-for="item in statuses"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="OuserCenterPointsManagementQuery" code="OuserCenterPointsManagementQuery" size="small" type="primary" @click.prevent="handleSubmit">
          {{ $t('查询') }}
        </ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="OuserCenterPointsManagementAdd_addRule" code="OuserCenterPointsManagementAdd" size="small" type="primary" @click="addRule">
          {{ $t('新增规则') }}
        </ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          request-page-type="page"
          request-url="/crm-web/api/rule/listRulePage.do"
        >
          <template slot="type" slot-scope="scope">
            {{ scope.row.type | keyVal(getTypeMap) }}
          </template>
          <template slot="subType" slot-scope="scope">
            {{ (scope.row.type.toString() + '_'+ scope.row.subType.toString()) | keyVal(getSubTypesMap) }}
          </template>
          <template slot="createTime" slot-scope="scope">
            {{ scope.row.createTime | parseTime }}
          </template>
          <template slot="status" slot-scope="scope">
            {{ scope.row.status | keyVal(getStatusMap) }}
          </template>
        </ody-table>
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
        status: null
      },
      table: {
        columns: [
          {
            label: this.$t('规则ID'),
            prop: 'id',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('规则名称'),
            show: true,
            minWidth: 120,
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
            minWidth: 150,
            show: true
          },
          {
            label: this.$t('状态'),
            slot: 'status',
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
              code: 'OuserCenterPointsManagementSee'
            },
            {
              label: this.$t('编辑'),
              hidden: (index, row) => {
                return row.status === 1
              },
              method: (index, row) => {
                this.editRule(row.id, 1)
              },
              code: 'OuserCenterPointsManagementEdit'
            },
            {
              label: this.$t('启用'),
              hidden: (index, row) => {
                return row.status === 1
              },
              method: (index, row) => {
                this.updateStatus(row.id, 1)
              },
              code: 'OuserCenterPointsManagementEnable'
            },
            {
              label: this.$t('停用'),
              hidden: (index, row) => {
                return row.status !== 1
              },
              method: (index, row) => {
                this.updateStatus(row.id, 0)
              },
              code: 'OuserCenterPointsManagementDisable'
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
    await this.$ouserCenter.$api.userService.configListMulti({ categorys: ['POINT_RULE_TYPE_NEW'], pool: 'crm' }).then(resp => {
      if (resp.data['POINT_RULE_TYPE_NEW']) {
        const subTypes = []
        for (const i in resp.data['POINT_RULE_TYPE_NEW']) {
          subTypes.push({
            value: i,
            label: resp.data['POINT_RULE_TYPE_NEW'][i]
          })
        }
        this.subTypes = subTypes
      }
    })
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
        subType,
        ...params
      } = this.search

      if (subType) {
        const sp = subType.split('_')
        params.type = sp[0]
        params.subType = sp[1]
      }
      params.excludeBasicConfig = true
      params.entityType = this.type
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    updateStatus(id, status) {
      this.$confirm(this.$t('确认启用') + '/' + this.$t('停用该条数据') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$ouserCenter.$api.crmService.updateRuleStatus({ id: id, status: status }).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('操作成功')
          })
          this.query()
        })
      })
    },
    addRule() {
      this.$router.push({
        path: '/ouser-center/pointsManagement/editPointsRule',
        query: {
          add: 1,
          edit: 0
        }
      })
    },
    editRule(id, edit) {
      this.$router.push({
        path: '/ouser-center/pointsManagement/editPointsRule',
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
