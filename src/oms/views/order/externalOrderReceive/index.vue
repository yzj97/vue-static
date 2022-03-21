<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-position="right" label-width="100px">
            <ody-search-item>
              <span slot="label">
                <el-select v-model="queryType.type" name="queryType_type" @change="onSearchKeyChange">
                  <el-option :label="$t('order_code')" value="0" />
                  <el-option :label="$t('out_order_code')" value="1" />
                  <el-option :label="$t('consignee_name')" value="2" />
                </el-select>
              </span>
              <el-input v-model="queryType.value" name="queryType_value" maxlength="25" />
            </ody-search-item>
            <ody-search-item :label="$t('cell-phone_number')+':'">
              <el-input v-model="searchForm.filters.recipientMobile" name="searchForm_filters_recipientMobile" maxlength="11" />
            </ody-search-item>
            <ody-search-item :label="$t('shop')+':'">
              <el-select v-model="searchForm.filters.storeId" :placeholder="$t('common_all')" name="searchForm_filters_storeId">
                <el-option
                  v-for="item in storeList"
                  :label="item.storeName"
                  :key="item.storeId"
                  :value="item.storeId"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('order_receipt_time')+':'">
              <ody-date-range-picker v-model="durationType.createTime" name="durationType_createTime" type="datetimer" />
            </ody-search-item>
            <ody-search-item :label="$t('processing_state')+':'">
              <el-select v-model="searchForm.filters.isHandled" :placeholder="$t('common_all')" name="searchForm_filters_isHandled">
                <el-option
                  v-for="item in handleStatusList"
                  :label="item.name"
                  :key="item.code"
                  :value="item.code"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('abnormal_time')+':'">
              <ody-date-range-picker v-model="durationType.errorTime" name="durationType_errorTime" type="datetimer" />
            </ody-search-item>
            <ody-search-item :label="$t('处理时间')+':'">
              <ody-date-range-picker v-model="durationType.handleTime" name="durationType_handleTime" type="datetimer" />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <ody-button name="OmsExternalOrderReceiveList_Reset_initForm" code="OmsExternalOrderReceiveList_Reset" size="small" @click="initForm">{{ $t('common_reset') }}</ody-button>
          <ody-button name="OmsExternalOrderReceiveList_Query_buttonQuery" code="OmsExternalOrderReceiveList_Query" size="small" type="primary" @click="buttonQuery()">{{ $t('common_select') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn">
          <ody-button name="OmsExternalOrderReceiveList_Rehandle_batchRehandle" code="OmsExternalOrderReceiveList_Rehandle" size="small" @click="batchRehandle">{{ $t('batch_rehandle') }}</ody-button>
          <!--  <ody-button name="syncOrderManually" size="small" type="primary" @click="syncOrderManually">{{ $t('sync_order_manually') }}</ody-button>-->
          <ody-button name="OmsExternalOrderReceiveList_Export_batchExport" code="OmsExternalOrderReceiveList_Export" size="small" @click="batchExport">{{ $t('export_out_order') }}</ody-button>
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
            name="listTable_list790"
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
            @size-change="buttonQuery"
            @current-change="query"
          />
        </div>
      </ody-list-table-area>
      <ody-dialog
        v-if="syncOrderData.visible"
        :title="syncOrderData.title"
        :visible.sync="syncOrderData.visible"
        width="50%"
        lock-scroll="true"
        center
        @hide-dialog="syncOrderData.visible = false"
        @confirm-dialog="syncOrderData.visible = false"
      >
        <el-form slot="content" ref="form" label-width="100px" class="form">
          <el-form-item :rules="[{ required: true, message: '店铺不能为空'}]" label="选择店铺:">
            <el-select v-model="syncOrderData.storeId" name="syncOrderData_storeId">
              <el-option :value="null" label="请选择" />
              <el-option
                v-for="item in storeList"
                :label="item.storeName"
                :key="item.storeId"
                :value="item.storeId"
              />
            </el-select>
          </el-form-item>
          <el-form-item :rules="[{ required: true, message: '同步范围不能为空'}]" label="同步范围:">
            <el-radio-group
              v-model="syncOrderData.timeType"
              name="syncOrderData_timeType"
              @change="selectTime('syncTime',syncOrderData.timeType)"
            >
              <el-radio label="today">今天</el-radio>
              <el-radio label="trid">最近3天</el-radio>
              <el-radio label="aWeek">最近1周</el-radio>
              <el-radio label="twoWeeks">最近2周</el-radio>
              <el-radio label="myself">自定义(三个月内)</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="syncOrderData.syncTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="syncOrderData_syncTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              style="width: 300px"
            />
          </el-form-item>
          <!--
          <el-form-item>
            <el-checkbox v-model="syncOrderData.isReplace" name="syncOrderData_isReplace" style="margin-bottom: 10px;">覆盖已有订单</el-checkbox>
          </el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <div class="line-top" />
          <el-button name="syncOrderConfirm" size="mini" @click="syncOrderConfirm(false)">取 消</el-button>
          <el-button name="syncOrderConfirm7" size="mini" type="primary" @click="syncOrderConfirm(true)">确 定</el-button>
        </span>
      </ody-dialog>

      <!-- 编辑外部订单 -->
      <ody-dialog
        v-if="editExternalOrder.visible"
        :title="editExternalOrder.title"
        :visible.sync="editExternalOrder.visible"
        class="external-but"
        width="70%"
        lock-scroll="true"
        @hide-dialog="editExternalOrder.visible = false"
        @confirm-dialog="editExternalOrder.visible = false"
      >
        <el-form
          slot="content"
          ref="editPreSoForm"
          :model="editPreSo"
          :rules="preSoRules"
          label-width="120px"
          class="form"
        >
          <el-col :span="12">
            <el-form-item label="店铺:">
              <span>{{ editPreSo.storeName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外部订单号:">
              <span>{{ editPreSo.outOrderCode }}</span>
            </el-form-item>
          </el-col>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('do_good_receiver_address') + ':'">
                <span>{{ editPreSo.recipientProvince }}{{ editPreSo.recipientCity }}{{ editPreSo.recipientArea }}</span>
                <el-tag v-if="editPreSo.matchArea" type="success" size="mini" effect="dark">已匹配</el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'匹配' + $t('do_good_receiver_address') + ':'">
                <!-- 收货人地址 -->
                <el-col :span="7">
                  <el-form-item :rules="preSoRules.provinceCode" prop="provinceCode">
                    <el-select
                      id="s_province"
                      v-model="editPreSo.provinceCode"
                      :disabled="editPreSo.matchArea"
                      name="s_province"
                      @change="loadCityList"
                    >
                      <el-option :label="$t('choose_the_province')" />
                      <el-option
                        v-for="item in province_list"
                        :label="item.name"
                        :key="item.code"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7" offset="1">
                  <el-form-item :rules="preSoRules.cityCode" prop="cityCode">
                    <el-select
                      id="s_city"
                      v-model="editPreSo.cityCode"
                      :disabled="!editPreSo.provinceCode || editPreSo.matchArea"
                      name="s_city"
                      @change="loadRegionList"
                    >
                      <el-option :label="$t('choose_the_city')" />
                      <el-option
                        v-for="item in city_list"
                        :label="item.name"
                        :key="item.code"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" offset="1">
                  <el-form-item :rules="preSoRules.areaCode" prop="areaCode">
                    <el-select
                      id="s_area"
                      v-model="editPreSo.areaCode"
                      :disabled="!editPreSo.cityCode || editPreSo.matchArea"
                      name="s_area"
                    >
                      <el-option :label="$t('choose_the_region')" />
                      <el-option
                        v-for="item in area_list"
                        :label="item.name"
                        :key="item.code"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <ody-list-table-area>
            <div slot="table">
              <el-table
                v-loading="externalOrderTable.loading"
                :data="editPreSo.items"
                name="editPreSo_items391"
                style="width: 100%"
              >
                <el-table-column prop="id" label="序号" min-width="80" />
                <el-table-column prop="channelItemCode" label="外部商品编码" min-width="120">
                  <template slot-scope="scope">
                    <span>{{ scope.row.channelItemCode }}</span>
                    <el-tag
                      v-if="scope.row.matchProduct"
                      type="success"
                      size="mini"
                      effect="dark"
                    >已匹配</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="productCode" label="商品编码" min-width="120" />
                <el-table-column prop="newProductCode" label="修正商品编码" min-width="120">
                  <template slot-scope="scope">
                    <el-form-item
                      v-if="!scope.row.matchProduct"
                      :rules="!scope.row.matchProduct ? preSoRules.newProductCode : {}"
                      :prop="'items.' + scope.$index + '.newProductCode'"
                      label-width="0"
                    >
                      <el-input
                        :disabled="scope.row.matchProduct"
                        v-model="scope.row.newProductCode"
                        name="scope_row_newProductCode"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </ody-list-table-area>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <ody-button
            :disabled="editPreSo.matchArea && editPreSo.matchProduct"
            name="OmsExternalOrderReceiveList_Match_externalOrderConfirm"
            code="OmsExternalOrderReceiveList_Match"
            size="mini"
            type="primary"
            @click="externalOrderConfirm(true)"
          >保 存</ody-button>
          <el-button name="externalOrderConfirm" size="mini" @click="externalOrderConfirm(false)">取 消</el-button>
        </span>
      </ody-dialog>
    </section>
  </div>
</template>
<script>
export default {
  name: 'OmsExternalOrderReceiveList',
  data() {
    const self = this
    return {
      loading: false,
      // 搜索框对象
      searchForm: {
        limit: 10,
        page: 1,
        filters: {}
      },
      timeButtons: [
        {
          label: this.$t('today'),
          type: '',
          start: 0,
          end: 0
        },
        {
          label: this.$t('yesterday'),
          type: '',
          start: -1,
          end: -1
        },
        {
          label: this.$t('nearly7Days'),
          type: '',
          start: -7,
          end: 0
        },
        {
          label: this.$t('nearly30Days'),
          type: '',
          start: -30,
          end: 0
        }
      ],
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
            prop: 'createTime',
            label: this.$t('untreated'),
            align: 'center',
            render: (idx, res) => {
              if (res.row.isHandled === 0) {
                const now = new Date()
                const create = new Date(res.row.createTime)
                const interval = Math.floor(
                  (now.getTime() - create.getTime()) / (1000 * 60)
                )
                const style = 'color: red'
                return <span style={style}> {interval + '分钟'} </span>
              }
            }
          },
          {
            show: true,
            prop: 'outOrderCode',
            label: this.$t('out_order_code'),
            align: 'center',
            minWidth: 160
          },
          {
            show: true,
            prop: 'storeName',
            label: this.$t('order_shop'),
            align: 'center',
            minWidth: 150
          },
          {
            show: true,
            prop: 'errorTime',
            label: this.$t('err_create_time'),
            align: 'center',
            minWidth: 160
          },
          {
            show: true,
            prop: 'errorRemark',
            label: this.$t('abnormal_cause'),
            align: 'center',
            minWidth: 170
            // render: function(h, params) {
            //   if (params.row.errorRemark) {
            //     return (
            //       <el-popover
            //         placement='top-start'
            //         width='auto'
            //         trigger='hover'
            //         content={params.row.errorRemark}>
            //         <el-button slot='reference'>{params.row.errorRemark}</el-button>
            //       </el-popover>
            //     )
            //   }
            // }
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
            align: 'center',
            minWidth: 160
          },
          {
            show: true,
            prop: 'createTime',
            label: this.$t('order_receipt_time'),
            align: 'center',
            minWidth: 160
          }
        ],
        operates: {
          width: 140,
          align: 'center',
          list: [
            {
              label: this.$t('rehandle'),
              disabled: false,
              method(index, row) {
                self.rehandle(index, row)
              },
              hidden: (index, row) => {
                return row.isHandled === 0 || row.isHandled === 1
              },
              code: 'OmsExternalOrderReceiveList_Rehandle'
            },
            {
              label: this.$t('edit'),
              disabled: false,
              method(index, row) {
                self.edit(index, row)
              },
              hidden: (index, row) => {
                return row.isHandled === 1
              },
              code: 'OmsExternalOrderReceiveList_Edit'
            }
          ]
        }
      },
      storeList: [],
      storeMap: {},
      handleStatusList: [],
      durationTypes: [],
      externalOrderTable: {
        loading: false
      },
      preSoRules: {
        // newProductCode: [
        //   { required: true, message: this.$t('required'), trigger: 'change' }
        // ],
        // provinceCode: [
        //   { required: true, message: this.$t('required'), trigger: 'change' }
        // ],
        // cityCode: [
        //   { required: true, message: this.$t('required'), trigger: 'change' }
        // ],
        // areaCode: [
        //   { required: true, message: this.$t('required'), trigger: 'change' }
        // ]
      },
      province_list: [],
      city_list: [],
      area_list: [],
      editExternalOrder: this.getChannelItemCode(),
      editPreSo: getEmptyEditPreSo() // 编辑的订单
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
            self.storeMap = self.storeList.reduce((result, i) => {
              result[i['storeId']] = i
              return result
            }, {})
          })
        await this.query()
      } catch (e) {
        console.log(e)
      }
    },
    onSearchKeyChange() {
      this.queryType.value = ''
      this.searchForm.filters.orderCode = ''
      this.searchForm.filters.outOrderCode = ''
      this.searchForm.filters.recipientName = ''
    },
    processSearchParam() {
      if (this.durationType.createTime) {
        this.searchForm.filters.startCreateTime = this.durationType.createTime[0]
        this.searchForm.filters.endCreateTime = this.durationType.createTime[1]
      } else {
        delete this.searchForm.filters.startCreateTime
        delete this.searchForm.filters.endCreateTime
      }
      if (this.durationType.errorTime) {
        this.searchForm.filters.startErrorTime = this.durationType.errorTime[0]
        this.searchForm.filters.endErrorTime = this.durationType.errorTime[1]
      } else {
        delete this.searchForm.filters.startErrorTime
        delete this.searchForm.filters.endErrorTime
      }
      if (this.durationType.handleTime) {
        this.searchForm.filters.startHandleTime = this.durationType.handleTime[0]
        this.searchForm.filters.endHandleTime = this.durationType.handleTime[1]
      } else {
        delete this.searchForm.filters.startHandleTime
        delete this.searchForm.filters.endHandleTime
      }
      // if (this.queryType.value) {
      switch (this.queryType.type) {
        case '0':
          this.searchForm.filters.orderCode = this.queryType.value
          break
        case '1':
          this.searchForm.filters.outOrderCode = this.queryType.value
          break
        case '2':
          this.searchForm.filters.recipientName = this.queryType.value
          break
        default:
      }
      // }
    },
    async buttonQuery() {
      this.searchForm.page = 1
      await this.query()
    },
    async query() {
      const self = this
      this.processSearchParam()
      try {
        this.loading = true
        const res = await this.$oms.$api.externalOrderReceive.preSoList(
          this.searchForm
        )
        if (res.data) {
          self.listTable.list = res.data
          self.listTable.total = res.total
          self.listTable.list.forEach(one => {
            self.storeList.forEach(s => {
              if (s.storeId.toString() === one.storeId) {
                one.storeName = s.storeName
              }
            })
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
      // this.durationType = { handleTime: [], errorTime: [], createTime: [] }
      this.setDateBetween(this.timeButtons, 'createTime', '近7天')
      this.durationType.errorTime = []
      this.durationType.handleTime = []
      this.queryType = { type: '1', value: null }
    },
    setDateBetween(btns, key, label) {
      var vm = this
      btns.forEach(function(item) {
        if (item.label === label) {
          item.type = 'primary'
          const startTime = new Date()
          startTime.setDate(startTime.getDate() + item.start)
          const endTime = new Date()
          endTime.setDate(endTime.getDate() + item.end)
          vm.durationType[key] = [
            vm.$portal.parseTime(startTime, '{y}-{m}-{d} 00:00:00'),
            vm.$portal.parseTime(endTime, '{y}-{m}-{d} 23:59:59')
          ]
        } else {
          item.type = ''
        }
      })
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
      for (var i = 0; i < this.listTable.checkedList.length; i++) {
        // isHandled
        if (this.listTable.checkedList[i].isHandled === 0 || this.listTable.checkedList[i].isHandled === 1) {
          vue.$message({
            type: 'error',
            message: this.$t('仅允许对错误的外部订单进行操作')
          })
          return
        }
      }
      vue.$oms.$api.externalOrderReceive
        .batchRehandle(JSON.stringify(this.listTable.checkedList))
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
        '/api/oms-web/preSo/batchExportPost',
        this.searchForm.filters
      )
    },
    syncOrderManually() {
      this.syncOrderData.visible = true
    },
    async edit(idx, row) {
      // 弹框编辑外部订单
      this.editExternalOrder.visible = true
      this.editPreSo = Object.assign(getEmptyEditPreSo(), row)
      this.editPreSo.outOrderCode = row.outOrderCode
      this.editPreSo.items = []
      const params = {
        filters: {
          outOrderCode: row.outOrderCode
        }
      }
      let matchInfo = {}
      if (this.editPreSo.matchInfo) {
        matchInfo = JSON.parse(this.editPreSo.matchInfo)
      }
      if (matchInfo) {
        this.editPreSo.provinceCode = matchInfo.provinceCode
        this.editPreSo.cityCode = matchInfo.cityCode
        this.editPreSo.areaCode = matchInfo.areaCode
      }
      if (matchInfo.storeName && !this.editPreSo.storeName) {
        this.editPreSo.storeName = matchInfo.storeName
      }
      this.editPreSo.matchProduct = true
      // 判断是否已经匹配了地址
      if (
        this.editPreSo.provinceCode &&
        this.editPreSo.cityCode &&
        this.editPreSo.areaCode
      ) {
        this.editPreSo.matchArea = true
      }

      const vue = this
      vue.externalOrderTable.loading = true
      await this.$oms.$api.externalOrderReceive
        .listPreSoItem(params)
        .then(res => {
          if (res.code === '0') {
            vue.$set(vue.editPreSo, 'items', res.data || [])
            for (let i = 0; i < vue.editPreSo.items.length; i++) {
              const item = vue.editPreSo.items[i]
              // 判断该商品行是否已经匹配
              if (
                matchInfo.productItems &&
                matchInfo.productItems[item.channelItemCode] &&
                matchInfo.productItems[item.channelItemCode].storeMpId
              ) {
                vue.$set(item, 'newProductCode', item.productCode)
                vue.$set(item, 'matchProduct', true)
              } else {
                vue.editPreSo.matchProduct = false
                vue.$set(item, 'newProductCode', '')
                vue.$set(item, 'matchProduct', false)
              }
            }
          }
        })
        .finally(res => {
          vue.externalOrderTable.loading = false
        })
      await this.getProvinceList()
      if (this.editPreSo.provinceCode) {
        this.editPreSo.provinceCode = this.editPreSo.provinceCode + ''
        await this.loadAreaList(this.editPreSo.provinceCode, 2)
      }
      if (this.editPreSo.cityCode) {
        this.editPreSo.cityCode = this.editPreSo.cityCode + ''
        await this.loadAreaList(this.editPreSo.cityCode, 3)
      }
      if (this.editPreSo.areaCode) {
        this.editPreSo.areaCode = this.editPreSo.areaCode + ''
      }
    },
    // 编辑外部订单
    async externalOrderConfirm(isTrue) {
      const vue = this
      if (isTrue) {
        this.$refs['editPreSoForm'].validate(valid => {
          if (valid) {
            var params = Object.assign({}, this.editPreSo)
            if (!this.editPreSo.matchProduct) {
              const confirmOrder = []
              params.items.map(item => {
                if (
                  !item.matchProduct &&
                  item.newProductCode &&
                  item.newProductCode !== item.productCode
                ) {
                  confirmOrder.push({
                    id: item.id,
                    channelItemCode: item.channelItemCode,
                    productCode: item.newProductCode
                  })
                }
              })
              params.items = confirmOrder
            } else {
              delete params.items
            }
            this.$oms.$api.externalOrderReceive
              .updatePreSoDetail(params)
              .then(res => {
                if (res.code === '0') {
                  vue.$message({
                    type: 'success',
                    message: this.$t('common_deal_success')
                  })
                  vue.editExternalOrder.visible = false
                  vue.query()
                }
              })
          }
        })
      } else {
        this.editExternalOrder.visible = false
      }
    },
    getSyncOrderInitData() {
      const today = new Date()
      const timeArray = [
        this.$portal.parseTime(today, '{y}-{m}-{d}'),
        this.$portal.parseTime(today, '{y}-{m}-{d}')
      ]
      return {
        title: '手工同步订单', // 标题
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
        this.syncOrderData.startSyncTime = parpam.syncTime[0] + ' 00:00:00'
        this.syncOrderData.endSyncTime = parpam.syncTime[1] + ' 23:59:59'
        this.syncOrderData.visible = false
        this.$message('同步请求提交成功，请稍后刷新列表查看')
        this.$oms.$api.externalOrderReceive
          .syncOrders(this.syncOrderData)
          .then(res => {
            if (res.data) {
              this.$message('同步成功')
            }
          })
      } else {
        this.syncOrderData = this.getSyncOrderInitData()
      }
    },

    getChannelItemCode() {
      return {
        title: '编辑外部订单', // 标题
        visible: false
      }
    },
    selectTime(name, type) {
      var timeArray = []
      if (type === 'today') {
        const today = new Date()
        timeArray = [
          this.$portal.parseTime(today, '{y}-{m}-{d}'),
          this.$portal.parseTime(today, '{y}-{m}-{d}')
        ]
      } else if (type === 'trid') {
        const nearly3 = new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000)
        timeArray.push(this.$portal.parseTime(nearly3, '{y}-{m}-{d}'))
        timeArray.push(this.$portal.parseTime(new Date(), '{y}-{m}-{d}'))
      } else if (type === 'aWeek') {
        const nearly7 = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        timeArray.push(this.$portal.parseTime(nearly7, '{y}-{m}-{d}'))
        timeArray.push(this.$portal.parseTime(new Date(), '{y}-{m}-{d}'))
      } else if (type === 'twoWeeks') {
        const nearly14 = new Date(
          new Date().getTime() - 14 * 24 * 60 * 60 * 1000
        )
        timeArray.push(nearly14)
        timeArray.push(this.$portal.parseTime(nearly14, '{y}-{m}-{d}'))
      }
      this.syncOrderData[name] = timeArray
    },
    rehandle(idx, row) {
      const vue = this
      vue.$oms.$api.externalOrderReceive.rehandle(row).then(res => {
        if (res.code === '0') {
          vue.$message({
            type: 'success',
            message: this.$t('common_deal_success')
          })
          vue.buttonQuery()
        }
      })
    },
    async getProvinceList() {
      this.province_list = []
      await this.loadAreaList(100000, 1)
    },
    async loadCityList() {
      this.editPreSo.cityCode = null
      this.editPreSo.areaCode = null
      this.city_list = []
      this.area_list = []
      await this.loadAreaList(this.editPreSo.provinceCode, 2)
    },
    async loadRegionList() {
      this.editPreSo.areaCode = null
      this.area_list = []
      await this.loadAreaList(this.editPreSo.cityCode, 3)
    },
    async loadAreaList(parentCode, level) {
      if (parentCode) {
        const res = await this.$oms.$api.common.getAreaListByKey({
          parentCode: parentCode
        })
        if (res.code === '0') {
          res.data.forEach(element => {
            element.code = element.code + ''
          })
          if (level === 1) {
            this.province_list = res.data
          } else if (level === 2) {
            this.city_list = res.data
          } else {
            this.area_list = res.data
          }
        }
      }
    }
  }
}

function getEmptyEditPreSo() {
  return {
    id: null,
    provinceCode: null,
    cityCode: null,
    areaCode: null,
    recipientProvince: null,
    recipientCity: null,
    recipientArea: null,
    matchProduct: false,
    matchArea: false,
    items: []
  }
}
</script>
