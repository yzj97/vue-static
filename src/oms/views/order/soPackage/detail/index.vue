<template>
  <section class="pg-soPackage-list baoguo-detail-box">
    <el-form ref="soPackageDetailForm" style="background-color: #fff;" label-width="100px">
      <!-- 订单信息 -->
      <div style="padding-top: 20px;padding-left: 20px;">
        <div style="margin-bottom: 10px;font-size: 14px;font-weight: bold">{{ $t('发货记录详情') }}</div>
        <div
          class="baoguo-detail"
          style="border: 1px solid #EEF5F9;padding-top: 20px;padding-bottom: 20px;"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('orderCode') + ':'">
                <div>{{ packageDetail.orderCode }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="'销售店铺' + ':'">
                <div>{{ packageDetail.storeName }}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('do_good_receiver_name') + ':'">
                <div>{{ packageDetail.goodReceiverName }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('order_ports_delivery_all_address') + ':'">
                <div>{{ packageDetail.goodReceiverProvince }}{{ packageDetail.goodReceiverCity }}{{ packageDetail.goodReceiverArea }}{{ packageDetail.goodReceiverAddress }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="'手机号' + ':'">
                <div>{{ packageDetail.goodReceiverMobile }}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('发货记录备注') + ':'">
                <div>{{ packageDetail.remark }}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 包裹信息 -->
      <div style="padding-top: 20px;padding-left: 20px;">
        <div style="margin-bottom: 10px;font-size: 14px;font-weight: bold">{{ $t('发货记录明细') }}</div>
        <div class="wuliu-detail" style="border: 1px solid #EEF5F9;">
          <el-container>
            <el-aside
              width="400px"
              style="padding-top: 20px;padding-bottom: 20px;border-right: 1px solid #EEF5F9;"
            >
              <div v-if="packageDetail.deliveryMode == null || packageDetail.deliveryMode === 1">
                <el-form-item :label="'物流公司' + ':'">
                  <div>{{ packageDetail.deliveryCompanyName }}</div>
                </el-form-item>
              </div>
              <div v-if="packageDetail.deliveryMode == null || packageDetail.deliveryMode === 1">
                <el-form-item :label="'物流单号' + ':'">
                  <div>
                    {{ packageDetail.deliveryExpressNbr }}
                    <i
                      v-if="$portal.hasPermission('OmsParcelList_Modify_Express')"
                      v-show="showEdit"
                      :title="$t('修改配送信息')"
                      name="showDeliveryEdit"
                      class="el-icon-edit"
                      style="margin-left: 15px;cursor: pointer"
                      @click="showDeliveryEdit = true"
                    />
                  </div>
                </el-form-item>
              </div>
              <div v-if="packageDetail.deliveryMode === 2">
                <el-form-item :label="'配送员' + ':'">
                  <div>{{ packageDetail.deliverName }}</div>
                </el-form-item>
              </div>
              <div v-if="packageDetail.deliveryMode === 2">
                <el-form-item :label="'配送员电话' + ':'">
                  <div>{{ packageDetail.deliverMobile }}</div>
                </el-form-item>
              </div>
              <div>
                <el-form-item :label="'发货时间' + ':'">
                  <div>{{ getDeliveryTime(packageDetail.createTime) }}</div>
                </el-form-item>
              </div>
              <div>
                <el-form-item :label="'发货仓库' + ':'">
                  <div>{{ packageDetail.warehouseName }}</div>
                </el-form-item>
              </div>
              <div>
                <el-form-item :label="'联系电话' + ':'">
                  <div>{{ packageDetail.goodReceiverMobile }}</div>
                </el-form-item>
              </div>
            </el-aside>
            <el-main>
              <!-- 包裹物流详情 -->
              <div>
                <div>
                  <div>
                    {{ packageCodeList == null || packageCodeList.length == 0 ? '无物流信息' : '' }}
                    <el-timeline v-if="packageCodeList">
                      <el-timeline-item v-for="item in packageCodeList" :key="item.id">
                        <div>{{ item.logisticsTime }}&nbsp;&nbsp;&nbsp;{{ item.remark }}</div>
                      </el-timeline-item>
                    </el-timeline>
                  </div>
                </div>
              </div>
            </el-main>
          </el-container>
        </div>
      </div>
      <!-- 发货记录商品详情 -->
      <ody-list-table-area>
        <div slot="table">
          <div style="font-size: 14px;font-weight: bold;margin-bottom: 10px">{{ $t('发货记录商品详情') }}</div>
          <ody-table
            :loading="loading"
            :data="packageItemList"
            :columns="columns"
            :can-filter="false"
            name="packageItemList397"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="page.current"
            :list="packageItemList"
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
    </el-form>
    <ody-fixed>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('common_back') }}</el-button>
    </ody-fixed>
    <ody-dialog :visible.sync="showDeliveryEdit" :title="$t('修改配送信息')" width="40%">
      <el-card shadow="never">
        <el-form :model="fhOrder" label-width="100px" class="form">
          <el-form-item :label="$t('so_pick_delivery_merchant')">
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
          <el-form-item :label="$t('orderInvoiceInfo_logistics_no')">
            <el-input
              v-model="fhOrder.deliveryExpressNbr"
              name="fhOrder_deliveryExpressNbr"
              maxlength="50"
            />
          </el-form-item>
        </el-form>
        <div align="center">
          <el-button
            name="showDeliveryEdit8"
            size="small"
            @click="showDeliveryEdit = false"
          >{{ $t('取消') }}</el-button>
          <el-button
            :disabled="!canUpdateDelivery"
            name="modifyDelivery"
            size="small"
            type="primary"
            @click="modifyDelivery"
          >{{ '确认' }}</el-button>
        </div>
      </el-card>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  name: 'OmsParcelListDetail',
  data() {
    return {
      showEdit: true,
      showDeliveryEdit: false,
      canUpdateDelivery: true,
      fhOrder: {
        deliveryCompanyId: null,
        deliveryCompanyName: null,
        deliveryExpressNbr: null
      },
      packageDetail: {},
      packageItemList: [],
      packageCodeList: [], // 配送信息
      merchantExpressList: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'index',
          label: this.$t('common_serial_number'),
          align: 'center',
          minWidth: 60
        },
        {
          show: true,
          prop: 'productPicPath',
          label: this.$t('manual_order_product_pic'),
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            if (params.row.productPicPath) {
              return h('img', {
                attrs: {
                  src: params.row.productPicPath
                },
                style: {
                  width: '50px',
                  height: '50px'
                }
              })
            } else {
              return <span>无</span>
            }
          }
        },
        {
          show: true,
          prop: 'productCname',
          label: this.$t('do_product_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('do_product_code'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'barCode',
          label: '条形码',
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'productItemAmount',
          label: this.$t('manual_order_purchase_amount'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'productItemOutNum',
          label: this.$t('deliveredNum'),
          align: 'center',
          minWidth: 80
        }
      ]
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    init() {
      const id = this.$route.params.id
      console.log(id)
      const packageCode = this.$route.params.packageCode
      if (packageCode != null) {
        this._initData(id, packageCode)
      }
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async _initData(id, packageCode) {
      const res = await this.$oms.$api.soPackage.parcelListGetDetail({ id: id })
      if (res) {
        this.packageDetail = res.data
        this.fhOrder.deliveryCompanyId = this.packageDetail.deliveryCompanyId
        this.fhOrder.deliveryCompanyName = this.packageDetail.deliveryCompanyName
        this.fhOrder.deliveryExpressNbr = this.packageDetail.deliveryExpressNbr
      }
      this.$oms.$api.soPackageItem
        .parcelItemListListPage({
          page: 1,
          limit: 10,
          filters: {
            packageCode: packageCode
          }
        })
        .then(data => {
          this.packageItemList = data.data
          this.page.total = data.total
          if (this.packageItemList) {
            let index = 0
            this.packageItemList.forEach(item => {
              index = index + 1
              item.index = index
            })
          }
        })
      const result = await this.$oms.$api.soDelivery.soDeliveryGetInfoByPackageCode(
        { packageCode: packageCode }
      )
      if (result) {
        this.packageCodeList = result.data
        if (this.packageCodeList && this.packageCodeList.length > 0) {
          // 有包裹信息是不允许修改物流信息
          this.showEdit = false
        }
      }
      const vue = this
      this.$oms.$api.merchantExpressConfig
        .merchantExpressConfigListForSelect({ filters: { isAvailable: 1 }})
        .then(data => {
          this.merchantExpressList = data.data.filter(
            i => i.merchantId === vue.packageDetail.merchantId
          )
        })
    },
    getDeliveryTime(deliveryTime) {
      if (deliveryTime == null) {
        deliveryTime = this.packageDetail.orderLogisticsTime
      }
      if (deliveryTime != null) {
        try {
          return this.$portal.parseTime(deliveryTime, '{y}-{m}-{d} {h}:{i}:{s}')
        } catch (e) {
          console.error(e)
          return deliveryTime
        }
      }
    },
    async modifyDelivery() {
      if (!this.fhOrder.deliveryCompanyId) {
        this.$message('配送商不能为空')
        return
      }
      if (!this.fhOrder.deliveryExpressNbr) {
        this.$message('物流单号不能为空')
        return
      }
      this.merchantExpressList.forEach(item => {
        if (item.deliveryCompanyId === this.fhOrder.deliveryCompanyId) {
          this.fhOrder.deliveryCompanyName = item.deliveryCompanyName
        }
      })
      if (!this.fhOrder.deliveryCompanyName) {
        this.$message('物流公司编码不能为空')
        return
      }
      this.fhOrder.id = this.packageDetail.id
      this.fhOrder.orderCode = this.packageDetail.orderCode
      this.canUpdateDelivery = false
      const vue = this
      try {
        await this.$oms.$api.soPackage
          .parcelListUpdateExpressComAndNbr(this.fhOrder)
          .then(data => {
            this.init()
            vue.canUpdateDelivery = true
            vue.showDeliveryEdit = false
            this.$message('修改成功')
          })
      } catch (e) {
        this.canUpdateDelivery = true
      }
    },
    returnBack() {
      this.$portal.delActiveView()
    }
  }
}
</script>

<style lang="scss" scoped>
.baoguo-detail-box .baoguo-detail .el-form-item__label {
  font-weight: bold;
  color: #99abb4;
}
.baoguo-detail-box .wuliu-detail .el-form-item__label {
  font-weight: bold;
  color: #99abb4;
}
.baoguo-detail-box .el-form-item.el-form-item--medium {
  margin-bottom: 0px !important;
}
.card_header_class {
  font-size: 14px;
  color: #6666;
  margin-bottom: 20px;
}
.baoguo-detail-box .cp-box {
  box-shadow: none;
}
</style>
