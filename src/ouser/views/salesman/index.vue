<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('所属商家')+ ':'" prop="merchantId">
            <ody-merchant-select
              v-model="merchantId"
              :placeholder="$t('全部')"
              name="searchForm_entityId"
              value-key="merchantId"
              @change="()=>storeId=null"/>
          </ody-search-item>
          <ody-search-item :label="$t('店铺')+ ':'" prop="storeId">
            <ody-store-select
              :key="merchantId"
              v-model="storeId"
              :params="{merchantId: merchantId}"
              :placeholder="$t('全部')"
              :item-filter="itemFilter"
              name="searchForm_storeId"
              value-key="storeId"/>
          </ody-search-item>
          <ody-search-item :label="$t('业务员类型')+ ':'" prop="type">
            <ody-dict-select v-model="searchForm.type" pool="ouser" category="SALESMAN_TYPE" name="searchForm_type"/>
          </ody-search-item>
          <ody-search-item :label="$t('业务员') + ':'" prop="name">
            <el-input v-model="searchForm.name" name="searchForm_storeId" maxlength="10" show-word-limit/>
          </ody-search-item>
          <ody-search-item :label="$t('业务员手机') + ':'" prop="mobile">
            <el-input v-model="searchForm.mobile" name="searchForm_mobile" maxlength="11" show-word-limit/>
          </ody-search-item>
          <ody-search-item :label="$t('状态')+ ':'" prop="isAvailable">
            <ody-dict-select
              v-model="searchForm.isAvailable"
              pool="ouser"
              category="IS_AVLIABLE"
              name="searchForm_isAvailable"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
        <ody-button
          name="salesman_query"
          code="SalesmanQuery"
          size="small"
          type="primary"
          @click="handleQuery">
          {{ $t('查询') }}
        </ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="salesman_add"
          code="SalesmanAdd"
          size="small"
          type="primary"
          @click="add()">
          {{ $t('新增') }}
        </ody-button>

        <ody-batch-import-button
          :async="true"
          :download-local-file="importModel.downloadLocalFile"
          :import-api="importModel.importApi"
          :import-label="importModel.importLabel"
          name="SalesmanImport"
          code="SalesmanImport"
          size="mini"
          type="default"
          style="margin-left:16px">
          {{ $t('导入') }}
        </ody-batch-import-button>
        <ody-button
          name="SalesmanImport_downloadTaskVisible"
          size="small"
          code="SalesmanImport"
          style="margin-left: 16px"
          @click="downloadTaskVisible=true">
          {{ $t('查看任务') }}
        </ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="listTable.list"
          :columns="listTable.columns"
          :operates="listTable.operates"
          name="listTable_salesman">
          <template slot="available" slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              :active-text="scope.row.isAvailable === 1 ? $t('启用') : $t('停用')"
              v-model="scope.row.isAvailable"
              name="scope_row_updateType"
              @change="update(scope.row, scope.row.isAvailable)"
            />
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="currentPage"
          :list="listTable.list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="itemsPerPage"
          :total.sync="listTable.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="queryList"
          @current-change="queryList"/>
      </div>
    </ody-list-table-area>

    <detail :visible.sync="showDetails" :page-type="operateType" :salesman="salesman" @ok="handleQuery"/>
    <ody-import-task
      :append-to-body="true"
      :visible.sync="downloadTaskVisible"
      :pool="'ouser'"
      :task-type="'salesmanImport'"
      :is-data-task="true"/>
  </section>
</template>

<script>

import Detail from './detail.vue'
import DownloadTask from '@/components/downloadTask'
import SalesmanTemplate from '@/excelfile/salesmanTemplate.xlsx'

export default {
  name: 'SalesmanManage',
  components: { Detail, DownloadTask },
  data() {
    const vue = this
    return {
      showTask: true,
      downloadTaskVisible: false,
      importModel: {
        importApi: ['ouser-web', 'salesman', 'importData.do', {}],
        importLabel: vue.$t('导入'),
        downloadLocalFile: [SalesmanTemplate]
      },
      salesman: {},
      showDetails: false,
      operateType: '',
      currentPage: 1,
      itemsPerPage: 10,
      loading: false,
      storeId: null,
      merchantId: null,
      searchForm: {},
      listTable: {
        total: 0,
        list: [],
        columns: [
          {
            show: true,
            prop: 'name',
            label: vue.$t('业务员'),
            align: 'center'
          },
          {
            show: true,
            prop: 'mobile',
            label: vue.$t('业务员手机'),
            align: 'center'
          },
          {
            show: true,
            prop: 'typeStr',
            label: vue.$t('业务员类型'),
            align: 'center'
          },
          {
            show: true,
            prop: 'orgTypeStr',
            label: vue.$t('归属组织类型'),
            align: 'center'
          },
          {
            show: true,
            prop: 'orgNameStr',
            label: vue.$t('归属组织'),
            align: 'center'
          },
          {
            show: true,
            slot: 'available',
            prop: 'isAvailable',
            label: vue.$t('状态'),
            align: 'center'
          },
          {
            show: true,
            prop: 'createUsername',
            label: vue.$t('创建人'),
            align: 'center'
          },
          {
            show: true,
            prop: 'createTime',
            label: vue.$t('创建时间'),
            align: 'center',
            minWidth: 200,
            formatter: (row, column, cellValue) => {
              return row.createTime ? vue.$portal.parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') : ''
            }
          },
          {
            show: true,
            prop: 'updateUsername',
            label: vue.$t('修改人'),
            align: 'center'
          },
          {
            show: true,
            prop: 'updateTime',
            label: vue.$t('修改时间'),
            align: 'center',
            minWidth: 200,
            formatter: (row, column, cellValue) => {
              return row.updateTime ? vue.$portal.parseTime(row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') : ''
            }
          }
        ],
        operates: {
          align: 'center',
          fixed: 'right',
          list: [
            {
              align: 'center',
              label: vue.$t('编辑'),
              show: true,
              disabled: false,
              method(index, row) {
                vue.operateType = 'edit'
                vue.salesman = row
                vue.showDetails = true
              },
              code: 'ui'
            }
          ]
        }
      }
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    add() {
      this.operateType = 'add'
      this.salesman = {}
      this.showDetails = true
    },
    async update(row) {
      return this.$ouser.$api.salesmanService.update(row).then(() => {
        this.loadData()
      })
    },
    queryList() {
      this.loadData()
      // 新增，编辑
    },
    async handleQuery() {
      this.currentPage = 1
      await this.loadData()
    },
    async loadData() {
      const orgId = this.storeId || this.merchantId
      let orgType = null
      if (this.storeId) {
        orgType = 2
      } else if (this.merchantId) {
        orgType = 1
      }

      const data = await this.$ouser.$api.salesmanService.listPage({
        page: this.currentPage,
        limit: this.itemsPerPage,
        filters: { orgId, orgType, ...this.searchForm }
      })
      this.listTable.total = data.total
      this.listTable.list = data.data
    },
    itemFilter(row, index) {
      if (this.merchantId) {
        if (row.merchantId === this.merchantId) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    initForm() {
      this.searchForm = {}
      this.storeId = null
      this.merchantId = null
    }
  }
}
</script>

<style scoped>

</style>
