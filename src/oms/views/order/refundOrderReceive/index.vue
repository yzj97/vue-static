<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-position="right" label-width="100px">
            <ody-search-item prop="type">
              <span slot="label">
                <el-select v-model="queryType.type" name="queryType_type" @change="onSearchKeyChange">
                  <el-option :label="$t('out_refund_code')" value="0" />
                  <el-option :label="$t('out_order_code')" value="1" />
                </el-select>
              </span>
              <el-input v-model="queryType.value" name="queryType_value" maxlength="25" />
            </ody-search-item>
            <ody-search-item :label="$t('order_receipt_time')+':'" prop="createTime">
              <ody-date-range-picker v-model="durationType.createTime" name="durationType_createTime" type="datetimer" />
            </ody-search-item>
            <ody-search-item :label="$t('processing_state')+':'" prop="filters.isHandled">
              <el-select v-model="searchForm.filters.isHandled" :placeholder="$t('common_all')" name="searchForm_filters_isHandled">
                <el-option
                  v-for="item in handleStatusList"
                  :label="item.name"
                  :key="item.code"
                  :value="item.code"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('abnormal_time')+':'" prop="errorTime">
              <ody-date-range-picker v-model="durationType.errorTime" name="durationType_errorTime" type="datetimer" />
            </ody-search-item>
            <ody-search-item :label="$t('处理时间')+':'" prop="handleTime">
              <ody-date-range-picker v-model="durationType.handleTime" name="durationType_handleTime" type="datetimer" />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <ody-button name="OmsRefundOrderReceiveList_Reset_initForm" code="OmsRefundOrderReceiveList_Reset" size="small" @click="initForm">{{ $t('common_reset') }}</ody-button>
          <ody-button name="OmsRefundOrderReceiveList_Query_querySearch" code="OmsRefundOrderReceiveList_Query" size="small" type="primary" @click="querySearch">{{ $t('common_select') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn-bottom">
          <ody-button name="OmsRefundOrderReceiveList_Rehandle_batchRehandle" code="OmsRefundOrderReceiveList_Rehandle" size="small" @click="batchRehandle">{{ $t('batch_rehandle') }}</ody-button>
          <!--          <ody-button name="syncOrderManually" size="small" type="primary" @click="syncOrderManually">{{ $t('sync_order_manually') }}</ody-button>-->
          <!-- <ody-button name="OmsRefundOrderReceiveList_Export_batchExport" code="OmsRefundOrderReceiveList_Export" size="small" @click="batchExport">{{ $t('export_out_order') }}</ody-button>-->
          <ody-batch-export-button
            :get-export-data="exportModel.getExportData"
            :export-api="exportModel.exportApi"
            :async="exportModel.async"
            :pool="exportModel.pool"
            :task-type="exportModel.taskType"
            name="OmsRefundOrderReceiveList_Export_batchExport"
            code="OmsRefundOrderReceiveList_Export"
            size="small"
            class="btn-right"
          >{{ $t('export_out_order') }}</ody-batch-export-button>
          <ody-export-task-button
            pool="oms"
            task-type="preSoReturnExport"
            name="OmsRefundOrderReceiveList_Task"
            code="OmsRefundOrderReceiveList_Task"
            size="small"
            class="btn-right"
          >{{ $t('seeExportTask') }}</ody-export-task-button>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            :checked.sync="listTable.checkedList"
            :data-key="listTable.dataKey"
            :multiple="true"
            name="listTable_list236"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="searchForm.page"
            :list="listTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.limit"
            :total.sync="listTable.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="querySearch"
            @current-change="query"
          />
        </div>
      </ody-list-table-area>
      <!--      <ody-dialog-->
      <!--        v-if="syncOrderData.visible"-->
      <!--        :title="syncOrderData.title"-->
      <!--        :visible.sync="syncOrderData.visible"-->
      <!--        width="50%"-->
      <!--        lock-scroll="true"-->
      <!--        center-->
      <!--        @hide-dialog="syncOrderData.visible = false"-->
      <!--        @confirm-dialog="syncOrderData.visible = false">-->

      <!--        <el-form slot="content" ref="form" label-width="100px" class="form">-->

      <!--          <el-form-item :rules="[{ required: true, message: '店铺不能为空'}]" :label="$t('选择店铺:')">-->
      <!--            <el-select v-model="syncOrderData.storeId" name="syncOrderData_storeId">-->
      <!--              <el-option :value="null" :label="$t('请选择')"/>-->
      <!--              <el-option v-for="item in storeList" :label="item.storeName" :key="item.storeId" :value="item.storeId"/>-->
      <!--            </el-select>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item :rules="[{ required: true, message: '同步范围不能为空'}]" :label="$t('同步范围:')">-->
      <!--            <el-radio-group v-model="syncOrderData.timeType" name="syncOrderData_timeType" @change="selectTime('syncTime',syncOrderData.timeType)">-->
      <!--              <el-radio label="today">{{$t('今天')}}</el-radio>-->
      <!--              <el-radio label="trid">最近3天</el-radio>-->
      <!--              <el-radio label="aWeek">最近1周</el-radio>-->
      <!--              <el-radio label="twoWeeks">最近2周</el-radio>-->
      <!--              <el-radio label="myself">自定义(三个月内)</el-radio>-->
      <!--            </el-radio-group>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item>-->
      <!--            <el-date-picker-->
      <!--              v-model="syncOrderData.syncTime"-->
      <!--              :start-placeholder="$t('startDate')"-->
      <!--              :end-placeholder="$t('endDate')"-->
      <!--              value-format="yyyy-MM-dd"-->
      <!--              type="daterange"-->
      <!--              range-separator="-"-->
      <!--              style="width: 300px"-->
      <!--            />-->
      <!--          </el-form-item>-->

      <!--        </el-form>-->
      <!--        <span slot="footer" class="dialog-footer">-->
      <!--          <div class="line-top"/>-->
      <!--          <el-button name="syncOrderConfirm" size="mini" @click="syncOrderConfirm(false)">取 消</el-button>-->
      <!--          <el-button name="syncOrderConfirm4" size="mini" type="primary" @click="syncOrderConfirm(true)">确 定</el-button>-->
      <!--        </span>-->
      <!--      </ody-dialog>-->
    </section>
  </div>
</template>
<script>
export default {
  name: 'OmsRefundOrderReceiveList',
  data() {
    const self = this
    return {
      exportModel: {
        exportApi: ['oms-web', 'preSoReturn', 'exportData'],
        pool: 'oms',
        taskType: 'preSoReturnExport',
        async: true,
        getExportData: () => {
          self.processSearchParam()
          return { filters: self.searchForm.filters }
        }
      },
      loading: false,
      // 搜索框对象
      searchForm: {
        limit: 10,
        page: 1,
        filters: {}
      },
      durationType: { handleTime: [], errorTime: [], createTime: [] },
      queryType: { type: '1', value: null },
      syncOrderData: this.getSyncOrderInitData(),
      // 列表框对象
      listTable: {
        dataKey: 'id',
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'outTid',
            label: this.$t('out_order_code'),
            align: 'center'
          },
          {
            show: true,
            prop: 'outRefundId',
            label: this.$t('out_refund_code'),
            align: 'center'
          },
          {
            show: true,
            prop: 'created',
            label: this.$t('application_for_refund_time'),
            align: 'center'
          },
          {
            show: true,
            prop: 'errorTime',
            label: this.$t('err_create_time'),
            align: 'center'
          },
          {
            show: true,
            prop: 'errorRemark',
            label: this.$t('abnormal_cause'),
            align: 'center'
          },
          {
            show: true,
            prop: 'isHandledStr',
            label: this.$t('processing_state'),
            align: 'center'
          },
          {
            show: true,
            prop: 'handleTime',
            label: this.$t('processing_time'),
            align: 'center'
          },
          {
            show: true,
            prop: 'createTime',
            label: this.$t('order_receipt_time'),
            align: 'center'
          }
        ],
        operates: {
          fixed: 'right',
          list: [
            {
              label: this.$t('rehandle'),
              disabled: false,
              method(index, row) {
                self.rehandle(index, row)
              },
              hidden: (index, row) => {
                return row.isHandled === 0 || row.isHandled === 1
              }
            }
          ]
        }
      },
      storeList: [],
      handleStatusList: [],
      durationTypes: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.initForm()
      try {
        const self = this
        await this.$oms.$api.common
          .listByCategorysForOrder({
            categorys: ['DURATION_TYPE', 'HANDLE_STATUS']
          })
          .then(res => {
            if (res.data) {
              self.durationTypes = res.data.DURATION_TYPE
              self.handleStatusList = res.data.HANDLE_STATUS
            }
          })
        await this.$oms.$api.merchantApi
          .queryPlatformAuthStorePage({
            currentPage: 1,
            itemsPerPage: 99999
          })
          .then(res => {
            self.storeList = res.data.listObj
          })
        await this.query()
      } catch (e) {
        console.log(e)
      }
    },
    onSearchKeyChange() {
      this.queryType.value = ''
      this.searchForm.filters.outRefundId = ''
      this.searchForm.filters.outTid = ''
      this.searchForm.filters.recipientName = ''
    },
    processSearchParam() {
      if (this.durationType.createTime && this.durationType.createTime.length > 0) {
        this.searchForm.filters.startCreateTime =
          this.durationType.createTime[0] + ' 00:00:00'
        this.searchForm.filters.endCreateTime =
          this.durationType.createTime[1] + ' 23:59:59'
      }
      if (this.durationType.errorTime && this.durationType.errorTime.length > 0) {
        this.searchForm.filters.startErrorTime =
          this.durationType.errorTime[0] + ' 00:00:00'
        this.searchForm.filters.endErrorTime =
          this.durationType.errorTime[1] + ' 23:59:59'
      }
      if (this.durationType.handleTime && this.durationType.handleTime.length > 0) {
        this.searchForm.filters.startHandleTime =
          this.durationType.handleTime[0] + ' 00:00:00'
        this.searchForm.filters.endHandleTime =
          this.durationType.handleTime[1] + ' 23:59:59'
      }
      // if (this.queryType.value) {
      switch (this.queryType.type) {
        case '0':
          this.searchForm.filters.outRefundId = this.queryType.value
          break
        case '1':
          this.searchForm.filters.outTid = this.queryType.value
          break
        case '2':
          this.searchForm.filters.recipientName = this.queryType.value
          break
        default:
      }
      // }
    },
    async querySearch() {
      this.searchForm.page = 1
      await this.query()
    },
    async query() {
      const self = this
      this.processSearchParam()
      try {
        this.loading = true
        const res = await this.$oms.$api.externalRefundReceive.preSoReturnList(
          this.searchForm
        )
        if (res.data) {
          self.listTable.list = res.data
          self.listTable.total = res.total
          self.listTable.list.forEach(one => {
            self.handleStatusList.forEach(h => {
              if (h.code === one.isHandled.toString()) {
                one.isHandledStr = h.name
              }
            })
          })
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 初始化搜索对象
    initForm() {
      this.searchForm = {
        limit: 10,
        page: 1,
        filters: {}
      }
      this.durationType = { handleTime: [], errorTime: [], createTime: [] }
      this.queryType = { type: '1', value: null }
    },
    batchRehandle() {
      const vue = this
      if (this.listTable.checkedList.length === 0) {
        vue.$message({
          type: 'error',
          message: this.$t('selected_list_is_null')
        })
        return
      }
      vue.$oms.$api.externalRefundReceive
        .batchReHandlePreSoReturn(JSON.stringify(this.listTable.checkedList))
        .then(res => {
          if (res.code === '0') {
            vue.$message({
              type: 'success',
              message: this.$t('common_deal_success')
            })
            vue.query()
          }
        })
    },
    batchExport() {
      this.processSearchParam()
      this.$portal.downloadFileByPost(
        '/api/oms-web/preSoReturn/batchExportPost',
        this.searchForm.filters
      )
    },
    syncOrderManually() {
      this.syncOrderData.visible = true
    },
    getSyncOrderInitData() {
      const today = new Date()
      const timeArray = [today, today]
      return {
        title: '手工同步售后单', // 标题
        visible: false,
        storeId: null,
        timeType: 'today',
        syncTime: timeArray
      }
    },
    async syncOrderConfirm(isTrue) {
      if (isTrue) {
        const parpam = this.syncOrderData
        if (!parpam.storeId) {
          this.$message('店铺不能为空')
          return
        }
        if (!parpam.syncTime || parpam.syncTime.length === 0) {
          this.$message('同步范围不能为空')
          return
        }
        this.syncOrderData.startSyncTime =
          this.$portal.parseTime(parpam.syncTime[0], '{y}-{m}-{d}') +
          ' 00:00:00'
        this.syncOrderData.endSyncTime =
          this.$portal.parseTime(parpam.syncTime[1], '{y}-{m}-{d}') +
          ' 23:59:59'
        this.syncOrderData.visible = false
        this.$message('同步请求提交成功，请稍后刷新列表查看')
        this.$oms.$api.externalRefundReceive
          .syncRefundOrders(this.syncOrderData)
          .then(res => {
            if (res.data) {
              this.$message('同步成功')
            }
          })
      } else {
        this.syncOrderData = this.getSyncOrderInitData()
      }
    },

    selectTime(name, type) {
      var timeArray = []
      if (type === 'today') {
        const today = new Date()
        timeArray = [today, today]
      } else if (type === 'trid') {
        const nearly3 = new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000)
        timeArray.push(nearly3)
        timeArray.push(new Date())
      } else if (type === 'aWeek') {
        const nearly7 = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        timeArray.push(nearly7)
        timeArray.push(new Date())
      } else if (type === 'twoWeeks') {
        const nearly14 = new Date(
          new Date().getTime() - 14 * 24 * 60 * 60 * 1000
        )
        timeArray.push(nearly14)
        timeArray.push(new Date())
      }
      this.syncOrderData[name] = timeArray
    },
    rehandle(idx, row) {
      const vue = this
      vue.$oms.$api.externalRefundReceive.reHandlePreSoReturn(row).then(res => {
        if (res.code === '0') {
          vue.$message({
            type: 'success',
            message: this.$t('common_deal_success')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .btn-right{
    margin-left: 16px;
  }
</style>
