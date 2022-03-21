<template>
  <section class="pg-soPackage-list">
    <el-form ref="transOrderItemDetailForm" label-width="240px">
      <el-card style="background-color: #fff;margin-bottom: 20px">
        <div>
          <div style="margin-bottom: 10px">
            <ody-button
              v-if="transOrderDetail.status < 2030 && canCancel"
              name="OmsTransOrdersList_Cancel_cancelDeliverOrder"
              code="OmsTransOrdersList_Cancel"
              size="small"
              @click="cancelDeliverOrder"
            >{{ $t('cancellationOfDeliveryOrder') }}</ody-button>
            <ody-button
              v-if="transOrderDetail.status < 2030 && transOrderDetail.wmsSwitch !== 1"
              name="OmsTransOrdersList_Dispatch_deliverConfirm"
              code="OmsTransOrdersList_Dispatch"
              size="small"
              @click="deliverConfirm"
            >{{ $t('deliver2') }}</ody-button>
          </div>
          <div>
            <el-form ref="form" class="form">
              <el-row>
                <!-- 交货单号 -->
                <el-col :span="8">
                  <el-form-item
                    :label="$t('do_do_code') + ':'"
                    class="themeColor"
                    style="margin-bottom: 0!important;"
                  >
                    <div>{{ transOrderDetail.doCode }}</div>
                  </el-form-item>
                </el-col>
                <!-- 订单编号 -->
                <el-col :span="8">
                  <el-form-item
                    :label="$t('order_code') + ':'"
                    class="themeColor"
                    style="margin-bottom: 0!important;"
                  >
                    <div>{{ transOrderDetail.orderCode }}</div>
                  </el-form-item>
                </el-col>
                <!-- 交货单创建时间 -->
                <el-col :span="8">
                  <el-form-item
                    :label="$t('do_create_time') + ':'"
                    class="themeColor"
                    style="margin-bottom: 0!important;"
                  >
                    <div>{{ transOrderDetail.createTime }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <!-- 店铺 -->
                <el-col :span="8">
                  <el-form-item
                    :label="$t('order_shop') + ':'"
                    class="themeColor"
                    style="margin-bottom: 0!important;"
                  >
                    <div>{{ transOrderDetail.storeName }}</div>
                  </el-form-item>
                </el-col>
                <!-- 发货仓库 -->
                <el-col :span="8">
                  <el-form-item
                    :label="$t('do_warehouse') + ':'"
                    class="themeColor"
                    style="margin-bottom: 0!important;"
                  >
                    <div>{{ transOrderDetail.warehouseName }}</div>
                  </el-form-item>
                </el-col>
                <!-- 交货单状态 -->
                <el-col :span="8">
                  <el-form-item
                    :label="$t('do_do_status') + ':'"
                    class="themeColor"
                    style="margin-bottom: 0!important;"
                  >
                    <div>{{ doStatusMap[transOrderDetail.status] }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <!-- 收货人 -->
                <el-col :span="8">
                  <el-form-item
                    :label="$t('do_good_receiver_name') + ':'"
                    class="themeColor"
                    style="margin-bottom: 0!important;"
                  >
                    <div>{{ transOrderDetail.goodReceiverName }}</div>
                  </el-form-item>
                </el-col>
                <!-- 收货人手机 -->
                <el-col :span="8">
                  <el-form-item
                    :label="$t('do_good_receiver_mobile') + ':'"
                    class="themeColor"
                    style="margin-bottom: 0!important;"
                  >
                    <div>{{ transOrderDetail.goodReceiverMobile }}</div>
                  </el-form-item>
                </el-col>
                <!-- 配送方式 -->
                <el-col :span="8">
                  <el-form-item
                    :label="$t('do_delivery_method') + ':'"
                    class="themeColor"
                    style="margin-bottom: 0!important;"
                  >
                    <div>{{ distributionModeMap[transOrderDetail.orderDeliveryMethodId] }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <!-- 收货人地址 -->
                <el-col :span="8">
                  <el-form-item
                    :label="$t('do_good_receiver_address') + ':'"
                    class="themeColor"
                    style="margin-bottom: 0!important;"
                  >
                    <div>{{ transOrderDetail.goodReceiverProvince }}{{ transOrderDetail.goodReceiverCity }}{{ transOrderDetail.goodReceiverArea }}{{ transOrderDetail.goodReceiverAddress }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('do_remark') + ':'" style="margin-bottom: 0!important;">
                    <el-input
                      v-show="editDoRemark"
                      :rows="{ minRows: 4, maxRows: 8}"
                      v-model="doRemark"
                      name="doRemark"
                      maxlength="200"
                      type="textarea"
                    />
                    <span v-show="!editDoRemark">
                      {{ transOrderDetail.doRemark }}
                      <ody-button
                        v-show="commonUpdate"
                        name="OmsTransOrdersList_ModifyRemark_doRemarkModify"
                        code="OmsTransOrdersList_ModifyRemark"
                        type="text"
                        class="button-color"
                        size="small"
                        @click="doRemarkModify"
                      >{{ $t('common_update') }}</ody-button>
                    </span>
                    <div class="button-wrap">
                      <el-button
                        v-show="commonSave"
                        name="doRemarkSave"
                        type="text"
                        class="button-color"
                        size="small"
                        @click="doRemarkSave"
                      >{{ $t('common_save') }}</el-button>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </el-card>
      <el-card>
        <el-tabs v-model="activeName" name="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('do_item_detail')" name="first">
            <ody-list-table-area>
              <div slot="table">
                <ody-table
                  :loading="loading"
                  :data="transOrderItemList"
                  :columns="columns"
                  :can-filter="false"
                  name="transOrderItemList389"
                />
                <!--<el-table-->
                <!--ref="singleTable"-->
                <!--:data="transOrderItemList"-->
                <!--border-->
                <!--highlight-current-row-->
                <!--style="width: 100%"-->
                <!--@current-change="handleCurrentChange">-->
                <!--<el-table-column-->
                <!--:label="$t('do_line_no')"-->
                <!--align="center"-->
                <!--type="index"-->
                <!--min-width="80"/>-->
                <!--<el-table-column-->
                <!--:label="$t('do_product_pic')"-->
                <!--prop="productPicPath"-->
                <!--align="center"-->
                <!--min-width="150">-->
                <!--<template slot-scope="scope">-->
                <!--<img v-if="scope.row.productPicPath != null" :src="scope.row.productPicPath" alt="" style="width: 50px;height: 50px">-->
                <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                <!--:label="$t('do_product_name')"-->
                <!--prop="productCname"-->
                <!--align="center"-->
                <!--min-width="150"/>-->
                <!--<el-table-column-->
                <!--:label="$t('do_product_code')"-->
                <!--prop="code"-->
                <!--align="center"-->
                <!--min-width="150"/>-->
                <!--<el-table-column-->
                <!--:label="$t('do_standard')"-->
                <!--prop="extInfoStr"-->
                <!--align="center"-->
                <!--min-width="120"/>-->
                <!--<el-table-column-->
                <!--:label="$t('do_bar_code')"-->
                <!--prop="barCode"-->
                <!--align="center"-->
                <!--min-width="150"/>-->
                <!--<el-table-column-->
                <!--:label="$t('do_art_no')"-->
                <!--prop="artNo"-->
                <!--align="center"-->
                <!--min-width="120"/>-->
                <!--<el-table-column-->
                <!--:label="$t('quantity')"-->
                <!--prop="productItemNum"-->
                <!--align="center"-->
                <!--min-width="100"/>-->
                <!--<el-table-column-->
                <!--:label="$t('amoun1')"-->
                <!--prop="productItemAmount"-->
                <!--align="center"-->
                <!--min-width="100"/>-->
                <!--<el-table-column-->
                <!--:label="$t('do_unit')"-->
                <!--prop="unit"-->
                <!--align="center"-->
                <!--min-width="100"/>-->
                <!--<el-table-column-->
                <!--:label="$t('do_delivered_num')"-->
                <!--prop="deliveredNum"-->
                <!--align="center"-->
                <!--min-width="100"/>-->
                <!--<el-table-column-->
                <!--:label="$t('do_undelivered_num')"-->
                <!--prop="undeliveredNum"-->
                <!--align="center"-->
                <!--min-width="100"/>-->
                <!--</el-table>-->
              </div>
              <div slot="page">
                <ody-pagination
                  :current-page.sync="page.current"
                  :list="transOrderItemList"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size.sync="page.size"
                  :total.sync="page.total"
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handlePageSizeChange"
                  @current-change="handlePageCurrentChange"
                />

              </div>
            </ody-list-table-area>
          </el-tab-pane>
          <el-tab-pane :label="$t('do_package_info')" name="second">
            <el-card v-if="packageList == null || packageList.length == 0" shadow="never">
              <div style="text-align: center;">{{ $t('noInformation') }}</div>
            </el-card>
            <el-tabs v-model="packageInfoTab" name="packageInfoTab" style="margin-top: 10px">
              <el-tab-pane
                v-for="(item, index) in packageList"
                :key="item.id"
                :label="$t('发货记录') + (index + 1)"
                :name="'packageInfo-' + (index + 1)"
              >
                <el-card shadow="never">
                  <div class="card_header_class">{{ $t('do_package_info') }}：</div>
                  <el-row>
                    <el-col>
                      <el-form-item :label="$t('logistics_company') + '：'">
                        <span>{{ item.deliveryCompanyName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item :label="$t('logistics_single_number') + '：'">
                        <span>{{ item.deliveryExpressNbr }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item :label="$t('merchantExpressConfig_phone') + '：'">
                        <span>{{ item.goodReceiverMobile }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item :label="$t('do_warehouse') + '：'">
                        <span>{{ item.warehouseName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item :label="$t('deliverytime') + '：'">
                        <span>{{ getDeliveryTime(item.createTime) }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-card>
                <el-card v-if="item.packageCodeList.length > 0" shadow="never">
                  <div class="card_header_class">{{ $t('parcelLogisticsDetails') }}：</div>
                  <el-row>
                    <el-form-item>
                      <div
                        v-for="(activity, index) in item.packageCodeList"
                        :key="index"
                      >{{ activity.createTime }}&nbsp;&nbsp;&nbsp;{{ activity.remark }}</div>
                    </el-form-item>
                  </el-row>
                </el-card>
                <el-card v-if="item.packageItemList.length > 0" shadow="never">
                  <div class="card_header_class">{{ $t('parcelDetails') }}：</div>
                  <el-table
                    ref="single2Table"
                    :data="item.packageItemList"
                    name="item_packageItemList565"
                    border
                    highlight-current-row
                    style="width: 100%"
                  >
                    <el-table-column
                      :label="$t('do_product_name')"
                      prop="productCname"
                      align="center"
                      min-width="120"
                    />
                    <el-table-column :label="$t('do_product_code')" prop="code" align="center" />
                    <el-table-column :label="$t('bar_code')" prop="barCode" align="center" />
                    <el-table-column
                      :label="$t('manual_order_product_attr')"
                      prop="extInfoStr"
                      align="center"
                    />
                    <el-table-column
                      :label="$t('deliveredNum')"
                      prop="productItemOutNum"
                      align="center"
                    />
                  </el-table>
                </el-card>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-form>
    <ody-fixed>
      <el-button name="returnBack" @click="returnBack">{{ $t('common_back') }}</el-button>
    </ody-fixed>
    <!-- 发货确认 -->
    <ody-dialog :title="$t('提示')" :visible.sync="dialogTableVisible" class="detail-index-none-shadow" width="960px">
      <ody-list-table-area class="clear-padding">
        <div slot="table">
          <el-table
            :data="transOrderItemList"
            name="transOrderItemList099"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55"/>
            <el-table-column
              :label="$t('行号')"
              prop="lineNo"
              align="center"
              min-width="80"
            />
            <el-table-column
              :label="$t('do_product_name')"
              prop="productCname"
              align="left"
              min-width="180"
            />
            <el-table-column
              :label="$t('do_product_code')"
              prop="code"
              align="center"
              min-width="160"
            />
            <el-table-column
              :label="$t('do_bar_code')"
              prop="barCode"
              align="center"
              min-width="150"
            />
            <el-table-column
              :label="$t('do_standard')"
              prop="extInfoStr"
              align="center"
              min-width="120"
            />
            <el-table-column
              :label="$t('do_undelivered_num')"
              prop="undeliveredNum"
              align="center"
              min-width="100"
            />
            <el-table-column
              :label="$t('do_delivering_num')"
              prop="deliveringNum"
              align="center"
              min-width="150"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.deliveringNum"
                  :value="scope.row.deliveringNum"
                  name="scope_row_deliveringNum"
                  type="number"
                  @input="deliveringNumChange(scope.row)"
                />
                <!--<input :value="scope.row.deliveringNum != null ? scope.row.deliveringNum : scope.row.undeliveredNum" type="number" style="text-align: center" @input="deliveringNumChange($event, scope.row)">-->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="page.current"
              :list="transOrderItemList"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="page.size"
              :total.sync="page.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handlePageSizeChange"
              @current-change="handlePageCurrentChange"
            />
          </div>
        </div>
      </ody-list-table-area>
      <span slot="footer">
        <el-button name="doDelivery" type="primary" size="small" @click="doDelivery">{{ $t('发货') }}</el-button>
      </span>
    </ody-dialog>
    <ody-dialog :visible.sync="dialogTableDialogVisible" :title="$t('发货信息')" width="40%">
      <el-card shadow="never">
        <el-form ref="fhOrder" :model="fhOrder" label-width="100px" class="form">
          <el-form-item :label="$t('manual_order_delivery_type')">
            <el-radio-group v-model="deliveryMode" name="deliveryMode">
              <el-radio :label="1" class="label">{{ $t('express_logistics') }}</el-radio>
              <el-radio :label="2" class="label">{{ $t('配送员直送') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="deliveryMode === 1" :label="$t('so_pick_delivery_merchant')" required="true">
            <el-select v-model="fhOrder.deliveryCompanyId" name="fhOrder_deliveryCompanyId">
              <el-option :label="$t('pleaseSelect')" />
              <el-option
                v-for="item in merchantExpressList"
                :label="item.deliveryCompanyName"
                :key="item.deliveryCompanyId"
                :value="item.deliveryCompanyId"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="deliveryMode === 1" :label="$t('orderInvoiceInfo_logistics_no')" required="true">
            <el-input v-model="fhOrder.deliveryExpressNbr" name="fhOrder_deliveryExpressNbr" maxlength="50" />
          </el-form-item>
          <el-form-item v-if="deliveryMode === 2" :label="$t('distributor')" required="true">
            <el-select v-model="salesmanId" name="salesmanId">
              <el-option :label="$t('please_choose')" />
              <el-option v-for="item in salesmans" :label="item.name" :key="item.id" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div align="center">
          <el-button name="dialogTableDialogVisible" size="small" @click="dialogTableDialogVisible = false">{{ this.$t('取消') }}</el-button>
          <el-button
            :disabled="!canDelivery"
            name="submitForm"
            size="small"
            type="primary"
            @click="submitForm"
          >{{ '确认' }}</el-button>
        </div>
      </el-card>
    </ody-dialog>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'OmsTransOrderListDetail',
  data() {
    return {
      activeName: 'first',
      packageInfoTab: 'packageInfo-1',
      editDoRemark: false,
      commonUpdate: true,
      commonSave: false,
      transOrderDetail: {},
      fhOrder: {
        deliveryCompanyId: ''
      },
      deliveryMode: 1,
      salesmanId: null,
      salesmans: [],
      transOrderItemList: [],
      packageCodePo: null,
      packageList: [],
      doStatusList: [],
      distributionModeItems: [],
      merchantExpressList: [],
      distributionModeMap: [],
      doStatusMap: [],
      list: [],
      payMethodMap: [],
      canCancel: true,
      dialogTableVisible: false,
      dialogTableDialogVisible: false,
      canDelivery: true,
      status: '',
      doRemark: '',
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'lineNo',
          label: this.$t('do_line_no'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'productPicPath',
          label: this.$t('do_product_pic'),
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            if (params.row.productPicPath) {
              return (
                <el-image
                  fit='contain'
                  style='height:50px'
                  src={params.row.productPicPath}
                ></el-image>
              )
            } else {
              return
            }
          }
        },
        {
          show: true,
          prop: 'productCname',
          label: this.$t('do_product_name'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('do_product_code'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'extInfoStr',
          label: this.$t('do_standard'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'barCode',
          label: this.$t('do_bar_code'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'artNo',
          label: this.$t('do_art_no'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'productItemNum',
          label: this.$t('quantity'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'unit',
          label: this.$t('so_promotion_unit'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'productItemAmount',
          label: this.$t('order_ports_product_amount'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'undeliveredNum',
          label: this.$t('do_undelivered_num'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'deliveredNum',
          label: this.$t('	do_delivered_num'),
          align: 'center',
          minWidth: 100
        }
      ],
      tempRoute: {},
      checked: [],
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  watch: {
    language() {
      this.setTagsViewTitle()
    }
  },
  async mounted() {
    try {
      this.init()
      this.tempRoute = Object.assign({}, this.$route)
      this.setTagsViewTitle()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    setTagsViewTitle() {
      const title = this.$t('发货任务详情')
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.$route.params.id}`
      })
      this.$store.dispatch('updateVisitedView', route)
    },
    deliverConfirm() {
      this.dialogTableVisible = true
      // this.$router.push({
      //   name: 'OmsTransOrderListEdit',
      //   params: {
      //     id: this.transOrderDetail.doCode
      //   }
      // })
    },
    cancelDeliverOrder() {
      this.$confirm(this.$t('确认取消发货任务吗') + '？', this.$t('提示'), {
        confirmButtonText: this.$t('common_confirm'),
        type: 'info',
        showCancelButton: true
      }).then(() => {
        if (
          this.transOrderDetail.wmsSwitch === 1 &&
          this.transOrderDetail.status === 2010
        ) {
          this.$oms.$api.common
            .dataexTransOrdersDetailCancel({
              doCode: this.transOrderDetail.doCode,
              warehouseCode: this.transOrderDetail.warehouseCode
            })
            .then(data => {
              if (data) {
                this._initData(this.transOrderDetail.doCode)
                this.$message(this.$t('promptOperateSuccess'))
              } else {
                this.$message(this.$t('common_request_fail') + data.message)
              }
            })
        } else {
          this.$oms.$api.do
            .transOrdersDetailCancel({
              doCode: this.transOrderDetail.doCode,
              warehouseCode: this.transOrderDetail.warehouseCode
            })
            .then(data => {
              if (data) {
                this._initData(this.transOrderDetail.doCode)
                this.$message(this.$t('promptOperateSuccess'))
              } else {
                this.$message(this.$t('common_request_fail') + data.message)
              }
            })
        }
      })
    },
    async init() {
      const id = this.$route.params.id
      this.status = this.$route.params.status
      if (this.$route.params.show) {
        this.dialogTableVisible = true
      }
      await this._initData(id)
      this._initAllChannelsData()
      await this.loadSalesmans(this.transOrderDetail.storeId, this.transOrderDetail.merchantId)
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        loadList(this)
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        loadList(this)
      } catch (ex) {
        console.log(ex)
      }
    },
    doRemarkModify() {
      this.editDoRemark = true
      this.commonUpdate = false
      this.commonSave = true
      if (this.transOrderDetail.doRemark !== null) {
        this.doRemark = this.transOrderDetail.doRemark
      }
    },
    async loadSalesmans(storeId, merchantId) {
      // 店铺配送员
      const result = await this.$oms.$api.common.salesmanPage({ filters: { orgId: [storeId, merchantId], isAvailable: 1 }, sorts: [{ 'field': 'orgType', 'asc': false }], page: 1, limit: 1000 })
      if (result.data && result.data.length > 0) {
        this.salesmans = result.data
        this.salesmans.forEach(o => {
          if (o.orgType === 2) {
            o.name = '[店铺]' + o.name
          } else if (o.orgType === 1) {
            o.name = '[商家]' + o.name
          }
        })
      }
    },
    doRemarkSave() {
      this.$oms.$api.do
        .transOrdersListUpdateDoRemark({
          id: this.transOrderDetail.id,
          doRemark: this.doRemark
        })
        .then(data => {
          if (data.code) {
            this.editDoRemark = false
            this.commonUpdate = true
            this.commonSave = false
            this._initData(this.transOrderDetail.doCode)
            this.$message(this.$t('promptOperateSuccess'))
          } else {
            this.$message(this.$t('common_request_fail') + data.message)
          }
        })
    },
    async _initData(id) {
      const res = await this.$oms.$api.do.transOrdersListGetByDoCode({
        doCode: id
      })
      if (res) {
        this.transOrderDetail = res.data
        if (this.transOrderDetail) {
          this.transOrderDetail.deliveryCompanyId = this.transOrderDetail.deliveryCompanyId || ''
          this.fhOrder.deliveryCompanyId = this.transOrderDetail.deliveryCompanyId
        }
      }
      this.$oms.$api.doItem
        .transOrdersDetailListPage({
          page: this.page.current,
          limit: this.page.size,
          filters: {
            doCode: id
          }
        })
        .then(data => {
          if (data.data) {
            let index = 0
            data.data.forEach(item => {
              index = index + 1
              item.index = index
              item.deliveredNum = item.productItemNum - item.undeliveredNum
              // if (item.doInfo.status === 9000) {
              //   item.deliveredNum = 0
              // }
              if (item.deliveredNum > 0) {
                this.canCancel = false
              }
              item.extInfoStr = getAtt(item.extInfo)
              if (item.extInfoStr == null) {
                item.extInfoStr = '无'
              }
              item.deliveringNum =
                item.deliveringNum != null
                  ? item.deliveringNum
                  : item.undeliveredNum
            })
            data.data = data.data.sort((a, b) => a.lineNo - b.lineNo)
          }
          this.transOrderItemList = data.data
          this.page.total = data.total
        })
    },
    handleClick(tab, event) {
      if (tab.name === 'second') {
        this._initAllPackageData(this.transOrderDetail.doCode)
      }
    },
    returnBack() {
      this.$portal.delActiveView()
    },
    _initAllChannelsData() {
      this.$oms.$api.common
        .listByCategorysForOrder({
          categorys: ['DO_STATUS', 'PACKAGE_STATUS', 'PAY_METHOD']
        })
        .then(data => {
          this.doStatusList = data.data.DO_STATUS
          this.doStatusMap = data.data.DO_STATUS.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
          this.payMethodMap = data.data.PAY_METHOD.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
        })

      this.$oms.$api.distributionModeItem
        .distributionModeItemListForSelect({})
        .then(data => {
          this.distributionModeItems = data.data
          this.distributionModeMap = data.data.reduce((m, i) => {
            m[i.shippingCode] = i.distributionMode
            return m
          }, {})
        })
      const vue = this
      this.$oms.$api.merchantExpressConfig
        .merchantExpressConfigListForSelect({ filters: { isAvailable: 1 }})
        .then(data => {
          this.merchantExpressList = data.data.filter(
            i => i.merchantId === vue.transOrderDetail.merchantId
          )
          this.merchantExpressListMap = data.data.reduce((m, i) => {
            m[i.shippingCode] = i.distributionMode
            return m
          }, {})
        })
    },
    async _initAllPackageData(doCode) {
      var pList = []
      await this.$oms.$api.soPackage
        .parcelListListPage({
          page: 1,
          limit: 10,
          filters: {
            doCode: doCode
          }
        })
        .then(data => {
          if (data.data.length > 0) {
            pList = data.data
          }
        })
      for (var i = 0; i < pList.length; i++) {
        const p = pList[i]
        if (p.packageCode != null) {
          // 查询包裹商品信息
          await this.$oms.$api.soPackageItem
            .parcelItemListListPage({
              page: 1,
              limit: 500,
              filters: {
                doCode: doCode,
                packageCode: p.packageCode
              }
            })
            .then(data => {
              const items = data.data
              if (items) {
                let index = 0
                items.forEach(item => {
                  index = index + 1
                  item.index = index
                  item.extInfoStr = getAtt(item.extInfo)
                  if (item.extInfoStr == null) {
                    item.extInfoStr = '无'
                  }
                })
              }
              // 包裹商品信息
              p.packageItemList = items
            })
          // 查询包裹物流信息
          await this.$oms.$api.soDelivery
            .soDeliveryGetInfoByPackageCode({ packageCode: p.packageCode })
            .then(data => {
              // 物流信息
              p.packageCodeList = data.data || []
            })
        }
      }
      this.packageList = pList
    },
    deliveringNumChange(row) {
      const value = row.deliveringNum
      if (value > row.undeliveredNum) {
        row.deliveringNum = row.undeliveredNum
      } else if (value < 0) {
        row.deliveringNum = 0
      }
    },
    // deliveringNumChange(e, row) {
    //   const value = e.target.value
    //   if (value === '' || value <= 0 || value > row.undeliveredNum) {
    //     e.target.value = row.undeliveredNum
    //   }
    //   this.transOrderItemList.forEach((item) => {
    //     if (item.id === row.id) {
    //       item.deliveringNum = e.target.value
    //     }
    //   })
    // },
    doDelivery() {
      let flag = true
      if (this.checked.length > 0) {
        flag = this.checked.some((item) => {
          return item.deliveringNum > 0
        })
        if (!flag) {
          this.$confirm('暂无代发货商品', '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          return
        }
        this.canDelivery = true
        this.dialogTableDialogVisible = true
      } else {
        for (var i in this.transOrderItemList) {
          var item = this.transOrderItemList[i]
          if (item.deliveringNum == null) {
            item.deliveringNum = item.undeliveredNum
          }
          if (
            item.undeliveredNum > 0 &&
          (!item.deliveringNum || item.deliveringNum <= 0)
          ) {
            this.$message('发货数量必须大于0')
            return
          }
        }
        this.canDelivery = true
        this.dialogTableDialogVisible = true
      }
    },
    async submitForm() {
      if (this.deliveryMode === null) {
        this.$message({ type: 'waring', message: this.$t('请选择配送类型') })
        return
      }
      let salesman = {}
      if (this.deliveryMode === 2) {
        for (const i in this.salesmans) {
          if (this.salesmans[i].id === this.salesmanId) {
            salesman = this.salesmans[i]
            break
          }
        }
      }
      const deliveryCompanyId = this.fhOrder.deliveryCompanyId
      const deliveryExpressNbr = this.fhOrder.deliveryExpressNbr
      this.fhOrder = { ...this.fhOrder, ...this.transOrderDetail }
      this.fhOrder.deliveryMode = this.deliveryMode
      if (this.deliveryMode === 1) {
        // 快递物流
        if (!deliveryCompanyId || !deliveryExpressNbr) {
          this.$message({ type: 'waring', message: this.$t('物流信息不能为空') })
          return
        }
        // 快递单号字符或字母4到23位
        const reg = /^[0-9a-zA-Z]{4,50}$/
        if (!reg.test(deliveryExpressNbr)) {
          this.$message({
            type: 'waring',
            message: this.$t('delivery_express_number_must_be_pure_number')
          })
          this.fhOrder.deliveryExpressNbr = ''
          return
        }
        this.fhOrder.deliverName = null
        this.fhOrder.deliverMobile = null
        this.fhOrder.deliveryCompanyId = deliveryCompanyId
        this.merchantExpressList.forEach(item => {
          if (item.deliveryCompanyId === this.fhOrder.deliveryCompanyId) {
            this.fhOrder.deliveryCompanyName = item.deliveryCompanyName
            // this.fhOrder.deliveryMode = item.type
          }
        })
        this.fhOrder.deliveryExpressNbr = deliveryExpressNbr
      } else if (this.deliveryMode === 2) {
        // 配送员直送
        if (!salesman.name || !salesman.mobile) {
          this.$message({ type: 'waring', message: this.$t('请选择配送员') })
          return
        }
        this.fhOrder.deliveryCompanyId = null
        this.fhOrder.deliveryExpressNbr = null
        this.fhOrder.deliveryCompanyName = null
        this.fhOrder.deliverName = salesman.name
        this.fhOrder.deliverMobile = salesman.mobile
      }
      if (this.checked.length > 0) {
        this.fhOrder.itemList = this.checked.filter(
          item => item.deliveringNum > 0
        )
      } else {
        this.fhOrder.itemList = this.transOrderItemList.filter(
          item => item.deliveringNum > 0
        )
      }

      this.canDelivery = false
      const vue = this
      try {
        await this.$oms.$api.do
          .transOrdersListConfirmDelivery(this.fhOrder)
          .then(data => {
            if (data) {
              this.$message(this.$t('promptOperateSuccess'))
              vue.dialogTableDialogVisible = false
              vue.dialogTableVisible = false
              this.$router.push({ name: 'OmsTransOrdersList' })
              this.$portal.delViewByName(this.$route.name)
            } else {
              this.$message(
                this.$t('common_request_fail') + '：' + data.message
              )
            }
            vue.canDelivery = true
          })
      } catch (e) {
        this.canDelivery = true
      }
    },
    getDeliveryTime(deliveryTime) {
      if (deliveryTime == null) {
        deliveryTime = this.transOrderDetail.doLogisticsTime
      }
      try {
        return this.$portal.parseTime(deliveryTime, '{y}-{m}-{d} {h}:{i}:{s}')
      } catch (e) {
        console.error(e)
        return deliveryTime
      }
    },
    handleSelectionChange(val) {
      this.checked = val
    }
  }
}
async function loadList(vue) {
  const param = {
    filters: {
      doCode: vue.transOrderDetail.doCode,
      dontShowZero: 1
    },
    limit: vue.page.size,
    page: vue.page.current
  }
  const orderList = vue.$oms.$api.doItem
  const res = await orderList.transOrdersDetailListPage(param)
  if (res) {
    if (res.data) {
      let index = 0
      res.data.forEach(item => {
        index = index + 1
        item.index = index
        item.deliveredNum = item.productItemNum - item.undeliveredNum
        // if (item.doInfo.status === 9000) {
        //   item.deliveredNum = 0
        // }
        if (item.deliveredNum > 0) {
          item.canCancel = false
        }
        item.extInfoStr = getAtt(item.extInfo)
        if (item.extInfoStr == null) {
          item.extInfoStr = '无'
        }
        item.deliveringNum =
          item.deliveringNum != null ? item.deliveringNum : item.undeliveredNum
      })
      res.data = res.data.sort((a, b) => a.lineNo - b.lineNo)
    }
    vue.transOrderItemList = res.data
    vue.page.total = res.total
  }
}
const getAtt = function(val) {
  var value = ''
  if (val == null || val === '' || val.length === 0) {
    return ''
  }
  var json = JSON.parse(val)
  json = json.attributeList || json
  for (var i = 0; i < json.length; i++) {
    value = value + json[i].name + ':' + json[i].value + ';'
  }
  return value
}
</script>

<style lang="scss" scoped>
.el-form-item__label {
  color: #9eafb8 !important;
}
.card_header_class {
  font-size: 14px;
  color: #6666;
  margin-bottom: 20px;
}
.detail-index-none-shadow .cp-box {
  box-shadow: none;
}
.button-wrap {
  display: flex;
  justify-content: flex-end;
}
.button-color span {
  color: #409eff;
}
.clear-padding {
  padding: 0 !important;
}
</style>
