<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('手机号:')" prop="mobile">
            <el-input v-model="search.mobile" name="search_mobile"/>
          </ody-search-item>
          <ody-search-item :label="$t('账户类型:')" prop="type">
            <el-select v-model="search.type" :placeholder="$t('全部')" name="search_type" @change="processChange">
              <el-option
                v-for="item in accountTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('操作类型:')" prop="processType">
            <el-select v-model="search.processType" :placeholder="$t('全部')" name="search_processType">
              <el-option
                v-for="item in processTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('创建时间:')" :space="2" prop="createTime">
            <ody-date-range-picker
              :default="0"
              v-model="search.createTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="search_createTime"
              type="datetimer"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="userAccountFlowQuery" size="small" type="primary" code="userAccountFlowQuery" @click.prevent="handleSubmit">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <!--<ody-button name="userAccountFlowExport_exportExcel" code="userAccountFlowExport" size="mini" @click="exportExcel">{{ $t('导出') }}</ody-button>-->
        <ody-export-task-button
          pool="ouser"
          task-type="userAccountFlowInfoExport"
          name="userAccountFlowExport_exportExcelTask"
          code="userAccountFlowExport"
          size="small"
          class="export-task"
        >{{ $t('seeTask') }}</ody-export-task-button>
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="userAccountFlowExport_exportExcel"
          code="userAccountFlowExport"
          size="small"
        >{{ $t('common_export') }}</ody-batch-export-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          request-page-type="page"
          request-url="/ouser-web/userAccount/listFlowPage.do"
        >
          <template slot="createTime" slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
          <template slot="processDesc" slot-scope="scope">
            {{ Object.entries(JSON.parse(scope.row.changeDetail || '{}'))
              .filter(e => accountFlowDesc[e[0]]).map(function(e) {
                var key = e[0];
                var value = e[1];
                if (key !== null && key !== "undefined") {
                  if (scope.row.type === 4 && key === "status") {
                    value = giftCardDesc[value]
                  }
                }
                return accountFlowDesc[e[0]] + ':' + value;
            }).join('\n|') }}
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
export default {
  name: 'OuserUserAccountFlow',
  data() {
    return {
      exportModel: {
        exportApi: ['ouser-web', 'userAccount', 'exportFlow'],
        pool: 'ouser',
        taskType: 'userAccountFlowInfoExport',
        async: true,
        getExportData: () => {
          const { type, ...params } = this.search
          if (type) {
            const arr = type.split('_')
            params.type = arr[0]
            params.subType = arr[1]
            params.entityType = arr[2]
          }

          if (params.createTime) {
            params.createTimeStart = params.createTime[0]
              ? params.createTime[0]
              : null

            params.createTimeEnd = params.createTime[1]
              ? params.createTime[1]
              : null
          }

          // 只查资金账户
          params.subType = 0
          return params
        }
      },
      search: {
        mobile: '',
        createTime: [],
        type: '',
        processType: ''
      },
      accountTypes: [],
      processTypes: [],
      processTypeMap: {},
      table: {
        columns: [
          {
            label: this.$t('id字段'),
            prop: 'id',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('手机号'),
            show: true,
            align: 'center',
            prop: 'mobile'
          },
          {
            label: this.$t('创建时间'),
            slot: 'createTime',
            align: 'center',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('账户类型'),
            prop: 'typeStr',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('变更金额'),
            prop: 'changeAmount',
            align: 'center',
            minWidth: 88,
            show: true
          },
          {
            label: this.$t('备注'),
            slot: 'processDesc',
            align: 'center',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('操作类型'),
            prop: 'processTypeStr',
            align: 'center',
            minWidth: 200,
            show: true
          }
        ]
      }
    }
  },
  async mounted() {
    this.search.type = this.$route.query.type || this.$route.params.type || null
    this.search.mobile =
        this.$route.query.mobile || this.$route.params.mobile || null
    await this.$ouser.$api.userService
      .listByCategorys({
        categorys: [
          'CASH_ACCOUNT_TYPE',
          'ACCOUNT_FLOW_DESC',
          'GIFT_CARD_STATUS'
        ]
      })
      .then(res => {
        this.accountTypes = []
        for (const i in res.data.CASH_ACCOUNT_TYPE) {
          this.accountTypes.push({
            value: i,
            label: res.data.CASH_ACCOUNT_TYPE[i]
          })
        }
        this.accountFlowDesc = res.data.ACCOUNT_FLOW_DESC
        this.giftCardDesc = res.data.GIFT_CARD_STATUS
      })
    await this.$ouser.$api.userService
      .listCodeByCategorys({
        categories: [
          'PROCESS_TYPE'
        ]
      }).then(res => {
        this.processTypes = []

        this.processTypeMap = {}

        for (const i in res.data.PROCESS_TYPE) {
          const one = res.data.PROCESS_TYPE[i]
          const list = this.processTypeMap[one.parentCode]
          if (!list) {
            this.processTypeMap[one.parentCode] = []
          }

          this.processTypeMap[one.parentCode].push({
            value: one.code,
            label: one.name
          })
        }

        if (this.search.type) {
          this.processChange()
        }
      })
    await this.$ouser.$api.userService
      .listByCategorys({
        categorys: [
          'GIFT_CARD_STATUS'
        ], 'pool': 'crm'
      })
      .then(res => {
        this.giftCardDesc = res.data.GIFT_CARD_STATUS
      })

    await this.query()
  },
  methods: {
    handleReset() {
      this.formReset('search')
      this.processTypes = []
    },
    processChange() {
      this.processTypes = []
      this.search.processType = null
      this.processTypes = this.processTypeMap[this.search.type]
    },
    async handleSubmit() {
      await this.query()
    },
    query() {
      try {
        const { type, ...params } = this.search
        if (type) {
          const arr = type.split('_')
          params.type = arr[0]
          params.subType = arr[1]
          params.entityType = arr[2]
        }
        if (params.createTime) {
          params.createTimeStart = params.createTime[0]
            ? params.createTime[0]
            : null

          params.createTimeEnd = params.createTime[1]
            ? params.createTime[1]
            : null
        }

        // 只查资金账户
        params.subType = 0
        // 有值才传递
        return this.$refs.table.getList(this.formHasValue(params))
      } catch (e) {
        console.log(e)
      }
    }
    // async exportExcel() {
    //   // const [err] = await this.formValidate('search')

    //   // if (err) {
    //   //   return
    //   // }

    //   const { type, ...params } = this.search
    //   if (type) {
    //     const arr = type.split('_')
    //     params.type = arr[0]
    //     params.subType = arr[1]
    //     params.entityType = arr[2]
    //   }

    //   if (params.createTime) {
    //     params.createTimeStart = params.createTime[0]
    //       ? params.createTime[0]
    //       : null

    //     params.createTimeEnd = params.createTime[1]
    //       ? params.createTime[1]
    //       : null
    //   }

    //   // 只查资金账户
    //   params.subType = 0
    //   this.$portal.downloadFileByPost(
    //     'api/ouser-web/userAccount/exportFlow',
    //     params,
    //     this.$t('账户明细') + '.xlsx',
    //     'ajax'
    //   )
    // }
  }
}
</script>
<style scoped>
.export-task{
  margin-right: 16px;
}
</style>
