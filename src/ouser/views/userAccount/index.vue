<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('手机号:')" prop="mobile">
            <el-input v-model="search.mobile" name="search_mobile" />
          </ody-search-item>
          <ody-search-item :label="$t('账户类型:')" prop="type">
            <el-select v-model="search.type" :placeholder="$t('全部')" name="search_type">
              <el-option
                v-for="item in accountTypes"
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
        <ody-button
          name="userAccountQuery"
          size="small"
          type="primary"
          code="userAccountQuery"
          @click.prevent="handleSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <!--<ody-button name="userAccountExport_exportExcel" code="userAccountExport" size="mini" @click="exportExcel">{{ $t('导出') }}</ody-button>-->
        <ody-export-task-button
          pool="ouser"
          task-type="userAccountInfoExport"
          name="userAccountExport_exportExcelTask"
          code="userAccountExport"
          size="small"
          class="export-task"
        >{{ $t('seeTask') }}</ody-export-task-button>
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="userAccountExport_exportExcel"
          code="userAccountExport"
          size="small"
        >{{ $t('common_export') }}</ody-batch-export-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          request-page-type="page"
          request-url="/ouser-web/userAccount/listPage.do"
        />
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
export default {
  name: 'OuserUserAccount',
  data() {
    return {
      exportModel: {
        exportApi: ['ouser-web', 'userAccount', 'export'],
        pool: 'ouser',
        taskType: 'userAccountInfoExport',
        async: true,
        getExportData: () => {
          const { type, ...params } = this.search

          if (type) {
            const arr = type.split('_')
            params.type = arr[0]
            params.subType = arr[1]
            params.entityType = arr[2]
          }
          // 只查资金账户
          params.subType = 0
          return params
        }
      },
      search: {
        mobile: '',
        type: ''
      },
      accountTypes: [],
      table: {
        columns: [
          {
            label: this.$t('账户类型'),
            prop: 'typeStr',
            show: true,
            align: 'center',
            minWidth: 88
          },
          {
            label: this.$t('手机号'),
            show: true,
            align: 'center',
            prop: 'mobile'
          },
          {
            label: this.$t('冻结'),
            prop: 'freezenAmount',
            align: 'center',
            minWidth: 88,
            show: true
          },
          {
            label: this.$t('可用'),
            prop: 'balanceAmount',
            align: 'center',
            minWidth: 88,
            show: true
          },
          {
            label: this.$t('提现中'),
            prop: 'cashingOutAmount',
            align: 'center',
            minWidth: 88,
            show: true
          },
          {
            label: this.$t('总额'),
            prop: 'totalAmount',
            align: 'center',
            minWidth: 88,
            show: true
          },
          {
            label: this.$t('累计提现'),
            prop: 'cashedOutAmount',
            align: 'center',
            minWidth: 88,
            show: true
          },
          {
            label: this.$t('累计使用'),
            prop: 'usedAmount',
            align: 'center',
            minWidth: 88,
            show: true
          }
        ],
        operates: {
          align: 'center',
          fixed: 'right',
          list: [
            {
              label: this.$t('查看明细'),
              method: (index, row) => {
                this.$router.push({
                  name: 'OuserUserAccountFlow',
                  query: {
                    type:
                      row.type.toString() +
                      '_' +
                      row.subType.toString() +
                      '_' +
                      row.entityType.toString(),
                    mobile: row.mobile
                  }
                })
              },
              code: 'userAccountDetail'
            }
          ]
        }
      }
    }
  },
  async mounted() {
    await this.$ouser.$api.userService
      .listByCategorys({ categorys: ['ACCOUNT_TYPE'] })
      .then(res => {
        this.accountTypes = []
        for (const i in res.data.ACCOUNT_TYPE) {
          this.accountTypes.push({ value: i, label: res.data.ACCOUNT_TYPE[i] })
        }
      })
    await this.query()
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
      const { type, ...params } = this.search

      if (type) {
        const arr = type.split('_')
        params.type = arr[0]
        params.subType = arr[1]
        params.entityType = arr[2]
      }
      // 只查资金账户
      params.subType = 0
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    }
    // async exportExcel() {
    //   const [err] = await this.formValidate('search')

    //   if (err) {
    //     return
    //   }

    //   const { type, ...params } = this.search

    //   if (type) {
    //     const arr = type.split('_')
    //     params.type = arr[0]
    //     params.subType = arr[1]
    //     params.entityType = arr[2]
    //   }
    //   // 只查资金账户
    //   params.subType = 0

    //   this.$portal.downloadFileByPost(
    //     'api/ouser-web/userAccount/export',
    //     params,
    //     this.$t('账户') + '.xlsx',
    //     'ajax'
    //   )
    // }
  }
}
</script>
<style scoped>
.export-task{
  margin-right:16px;
}
</style>
