<template>
  <section id="order-product-info">

    <ody-list-table-area class="remove-shadows">
      <div slot="btn">
        <el-row>
          <el-col :span="18">
            <!--<el-button :disabled="soInfo.orderStatus != 1050 || noWarehouse" name="manualDelivery" size="small" type="primary" @click="manualDelivery">{{ $t('manual_to_do') }}</el-button>-->
            <el-button v-show="!noWarehouse" :disabled="soInfo.orderStatus != 1050 || noWarehouse" name="batchManualDelivery" size="small" type="primary" @click="batchManualDelivery()">{{ $t('manual_to_do') }}</el-button>
            <el-button v-show="noWarehouse && soInfo.orderStatus == 1050" name="batchManualDeliveryNoWarehouse" size="small" type="primary" @click="batchManualDeliveryNoWarehouse()">{{ $t('soPickDeliver') }}</el-button>
          </el-col>

          <!--<el-col :span="4">
            <el-input v-model="codeFilter" :placeholder="$t('manual_order_product_code')" name="codeFilter" />
          </el-col>-->
          <el-col :span="4">
            <el-input v-model="searchForm.itemProductCode" :placeholder="$t('manual_order_product_code')" name="searchForm_itemProductCode" />
          </el-col>
          <el-col :span="2">
            <el-button name="updateList" size="small" type="primary" @click="updateList" > {{ $t('common_select') }} </el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="soItems"
          :columns="columns"
          :multiple="true"
          :selectable="handleSelectable"
          :checked.sync="checked"
          :can-filter="false"
          name="soItems717"
        />
      </div>
      <div slot="page">
        <div class="block">
          <ody-pagination
            :current-page.sync="page"
            :list="soItems"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="limit"
            :total.sync="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"/>
        </div>
      </div>
    </ody-list-table-area>
    <el-card v-if="promotions && promotions.length > 0">
      <el-collapse v-model="promotionActiveName" name="promotionActiveName" accordion>
        <el-collapse-item :title="$t('so_promotion')" name="promotion">
          <ody-table
            :data="promotions"
            :columns="promotionColumns"
            :can-filter="false"
            name="promotions861"
          />
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-card v-if="coupons && coupons.length > 0">
      <el-collapse v-model="couponActiveName" name="couponActiveName" accordion>
        <el-collapse-item :title="$t('so_coupon')" name="coupon">
          <ody-table
            :data="coupons"
            :columns="couponColumns"
            :can-filter="false"
            name="coupons684"
          />
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <EditPrice v-show="modifyItem" :visible.sync="visiblePrice" :item.sync="modifyItem" @ok="reload" />
    <EditWarehouse v-show="modifyItem" :visible.sync="visibleWarehouse" :item.sync="modifyItem" @ok="updateList" />
    <!--有仓转交货单-->

    <ody-dialog-full-right :visible.sync="dialogTableVisible" :title="$t('manual_to_do')" width="80%">
      <div class="demo-input-suffix">
        {{ $t('so_pick_delivery_merchant') }}：
        <el-select v-model="deliveryCompanyId" :placeholder="$t('请选择')" name="deliveryCompanyId">
          <el-option
            v-for="item in merchantExpress"
            :key="item.deliveryCompanyId"
            :label="item.deliveryCompanyName"
            :value="item.deliveryCompanyId"/>
        </el-select>
      </div>
      <ody-table
        :loading="loading"
        :data="checkedSoItems"
        :columns="columnsForWarehouse"
        :can-filter="false"
        name="checkedSoItems792"
      />
      <span slot="footer" class="dialog-footer">
        <el-button name="cancelToDo" @click="cancelToDo">{{ $t('cancel') }}</el-button>
        <el-button name="okToDo" type="primary" @click="okToDo">{{ $t('ok') }}</el-button>
      </span>
    </ody-dialog-full-right>
    <!--无仓发货商品显示弹框-->
    <ody-dialog :visible.sync="dialogTableVisibleNoWarehouse" :title="$t('do_confirm_delivery')" width="20%">
      <div style="margin-bottom:20px">
        <el-tag>{{ $t('order_total_volume_of_commodities') }}：{{ soPickInfo.itemsNum }}</el-tag>
      </div>
      <div class="demo-input-suffix">
        {{ $t('so_pick_delivery_merchant') }}：
        <el-select v-model="deliveryCompanyId" :placeholder="$t('请选择')" name="deliveryCompanyId6">
          <el-option
            v-for="item in merchantExpress"
            :key="item.id"
            :label="item.deliveryCompanyName"
            :value="item.deliveryCompanyId"/>
        </el-select>
      </div>
      <div class="demo-input-suffix">
        {{ $t('deliveryExpressNo') }}：
        <el-input v-model="deliveryExpressNbr" name="deliveryExpressNbr" clearable="true" style="margin-top:20px;width:80%" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="cancelItemNoWarehouse" @click="cancelItemNoWarehouse">{{ $t('cancel') }}</el-button>
        <el-button name="sendItemNoWarehouse" type="primary" @click="sendItemNoWarehouse">{{ $t('ok') }}</el-button>
      </span>
    </ody-dialog>

  </section>
</template>

<script>
import EditPrice from './editPrice'
import EditWarehouse from './editWarehouse'
export default {
  components: {
    EditPrice,
    EditWarehouse
  },
  props: {
    soInfo: {
      type: Object,
      required: true
    },
    promotions: {
      type: Object,
      required: true
    },
    coupons: {
      type: Object,
      required: true
    },
    noWarehouse: {
      type: Boolean,
      default: false
    },
    codeMap: {
      type: Object,
      default: () => {
        return {
          ITEM_STATUS: {}
        }
      }
    }
  },
  data() {
    return {
      warehouses: [],
      soPickInfo: {},
      merchantExpress: [], // 配送商信息
      deliveryCompanyId: '', // 选择的配送商
      deliveryExpressNbr: '', // 运单号
      checkedSoItems: [],
      codeFilter: '',
      dialogTableVisible: false,
      dialogTableVisibleNoWarehouse: false,
      visible: false,
      editDeliveryFee: false,
      visibleWarehouse: false,
      visiblePrice: false,
      limit: 10,
      page: 1,
      total: 0,
      searchForm: {},
      soItems: [],
      loading: false,
      checked: [],
      modifyItem: null,
      promotionActiveName: 'promotion',
      couponActiveName: 'coupon', // id: si.id, num: si.waitUnDoNum, productCname: si.productCname, code: si.code, barCode: si.barCode, extInfoStr: si.extInfoStr
      columnsForWarehouse: [
        {
          show: true,
          prop: 'productCname',
          label: this.$t('manual_order_product_name'), // 商品名称
          align: 'center',
          minWidth: 200
        }, {
          show: true,
          prop: 'code',
          label: this.$t('manual_order_product_code'), // 商品编码
          align: 'center',
          minWidth: 150
        }, {
          show: true,
          prop: 'barCode',
          label: this.$t('product_bar_code'), // 产品条码
          align: 'center',
          minWidth: 100
        }, {
          show: true,
          prop: 'extInfoStr',
          label: this.$t('manual_order_product_attr'), // 规格属性
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            let attr
            if (params.row.extInfoStr) {
              attr = params.row.extInfoStr.split('\n').map(item => {
                return <div><span>{item}</span><br/></div>
              })
            }
            return (
              { attr }
            )
          }
        }, {
          show: true,
          prop: 'sendNum',
          label: this.$t('un_to_do_num'), // 待交货单数量
          align: 'center',
          minWidth: 150
        }, {
          show: true,
          prop: 'warehouseName',
          label: this.$t('do_warehouse'), // 发货仓库
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return h('el-select', {
              props: {
                value: params.row.warehouseName,
                size: 'small'
              }, on: {
                change: (event) => {
                  for (var i = 0; i < this.warehouses.length; i++) {
                    if (this.warehouses[i].warehouseId === event && params.row.id === this.warehouses[i].soItemId) {
                      params.row.warehouseName = this.warehouses[i].warehouseName
                      params.row.warehouseId = this.warehouses[i].warehouseId
                      params.row.warehouseNum = this.warehouses[i].availableNum
                      params.row.warehouseCode = this.warehouses[i].warehouseCode
                    }
                  }
                }
              }
            }, [
              this.warehouses.map((val) => { // 下拉框里的内容,optionList下拉框数据
                if (val.soItemId !== params.row.id) {
                  return
                }
                return h('el-option', {
                  props: {
                    value: val.warehouseId,
                    label: val.warehouseName
                  }
                })
              })
            ])
          }
        }, {
          show: true,
          prop: 'warehouseNum',
          label: this.$t('manual_product_stock'), // 可用库存
          align: 'center',
          minWidth: 80
        }, {
          show: true,
          prop: 'num',
          label: this.$t('deliveredNum'), // 发货数量
          align: 'center',
          minWidth: 250,
          render: (h, params) => {
            return (
              <el-input-number size='small' step='1' value={params.row.num} min={0} max={params.row.sendNum} on-change={
                (event) => {
                  params.row.num = event
                }
              }></el-input-number>
            )
          }
        }
      ],
      columns: [
        {
          show: true,
          prop: 'lineNum',
          label: this.$t('manual_order_line_no'), // 行号
          align: 'center',
          minWidth: 60
        },
        {
          show: true,
          prop: 'productCname',
          label: this.$t('manual_order_product_name'), // 商品名称
          align: 'center',
          minWidth: 300
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('manual_order_product_code'), // 商品编码
          align: 'center',
          minWidth: 200
          // render: (h, params) => {
          //   const soItem = params.row
          //   return (
          //     <a on-click={() => {
          //       // const soItem = params.row
          //       // var url = '/back-product-static/app/default/product2/index.html#/selfProductEdit/' + soItem.mpId + '/true/' + soItem.merchantId + '/' + soItem.categoryId
          //       // window.open(url, this.$t('goodsDetail'))
          //       this.$message({
          //         type: 'info',
          //         message: '跳转到商品页'
          //       })
          //     }} href='#' class='link-type'>{soItem.code}</a>
          //   )
          // }
        },
        {
          show: true,
          prop: 'setmealCode',
          label: this.$t('setmeal_code'), // 套餐编号
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'setmealName',
          label: this.$t('setmeal_name'), // 套餐名称
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'extInfoStr',
          label: this.$t('manual_order_product_attr'), // 规格属性
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'artNo',
          label: this.$t('do_art_no'), // 货号
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'barCode',
          label: this.$t('product_bar_code'), // 产品条码
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'unit',
          label: this.$t('so_promotion_unit'), // 订购单位
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'productItemNum',
          label: this.$t('manual_order_quantity'), // 订购数量
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          label: this.$t('to_do_num'), // 已转交货单数量
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            return row.alreadyDeliveryNum
          }
        },
        {
          show: true,
          prop: 'waitUnDoNum',
          label: this.$t('un_to_do_num'), // 待交货单数量
          align: 'center',
          minWidth: 150
          /** render: (h, params) => {
            const disabled = this.soInfo.orderStatus !== 1050 || this.noWarehouse || params.row.unDoNum === 0
            return (
              <el-input disabled={disabled} value={params.row.unDoNum} on-blur={ (event) => {
                const value = event.target.value
                if (!/^\d{1,9}$/.test(value) || Number(value) <= 0 || value > params.row.unDoNum) {
                  this.$message({
                    type: 'warn',
                    message: this.$t('LessOrEqualUnToDoNum')
                  })
                  event.target.value = params.row.unDoNum
                } else {
                  params.row.waitUnDoNum = value
                }
              }} />
            )
          } */
        },
        {
          show: true,
          prop: 'productItemOutNum',
          label: this.$t('do_delivered_num'), // 已发货数量
          align: 'center',
          minWidth: 100,
          formatter(row, column) {
            return row.productItemOutNum ? row.productItemOutNum : 0
          }
        },
        /** {
          show: true,
          prop: 'warehouseName',
          label: this.$t('do_warehouse'), // 发货仓库
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            const exist = this.soInfo.orderStatus === 1050 && !this.noWarehouse
            let modifyBtn
            if (exist) {
              modifyBtn = <i class='el-icon-edit' on-click={() => {
                this.showWarehouseModal(params.row)
              }} />
            }
            return (
              <span>
                {params.row.warehouseName}
                {modifyBtn}
              </span>
            )
          }
        },*/
        {
          show: true,
          prop: 'productPriceOriginal',
          label: this.$t('manual_order_sales_unit_price'), // 销售单价
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'productPriceSale',
          label: this.$t('manual_order_purchase_price'), // 购买单价
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            const exist = this.soInfo.orderPaymentStatus === 0 && this.soInfo.orderStatus !== 9000 && this.soInfo.orderStatus < 1050
            let modifyBtn
            if (exist) {
              modifyBtn = <i class='el-icon-edit' on-click={() => {
                this.showPriceModal(params.row)
              }} />
            }
            return (
              <span>
                {params.row.productPriceSale}
                {modifyBtn}
              </span>
            )
          }
        },
        {
          show: true,
          prop: 'productItemAmount',
          label: this.$t('manual_order_purchase_amount'), // 购买金额
          align: 'center',
          minWidth: 100,
          formatter(row, column) {
            return Number(row.productItemAmount).toFixed(2)
          }
        },
        {
          show: true,
          prop: 'itemAdjustDiscountAmount',
          label: this.$t('adjust_discount_amount'), // 改价优惠金额
          align: 'center',
          minWidth: 100,
          formatter(row, column) {
            return Number(row.itemAdjustDiscountAmount).toFixed(2)
          }
        },
        {
          show: true,
          prop: 'excipientRemarks',
          label: this.$t('excipient_remarks'), // 辅料备注
          align: 'center',
          minWidth: 160,
          render: (h, params) => {
            const maxLength = 10
            let displayInfo = params.row.excipientRemarks
            const displayTooltip = displayInfo && displayInfo.length > maxLength
            const tooltipInfo = params.row.excipientRemarks
            let display
            if (displayTooltip) {
              displayInfo = displayInfo.substring(0, maxLength) + '...'
              display = <el-popover
                placement='top-start'
                width='200'
                trigger='hover'
                content={tooltipInfo}>
                <span slot='reference'>{ displayInfo }</span>
              </el-popover>
            } else {
              display = <span>{ displayInfo }</span>
            }

            return (
              <div>{ display }</div>
            )
          }
        },
        {
          show: true,
          prop: 'itemStatusStr',
          label: this.$t('item_status'), // 行状态
          align: 'center',
          minWidth: 100
        }
      ],
      promotionColumns: [
        {
          show: true,
          prop: 'promotionId',
          label: this.$t('so_promotion_ID'), // 促销活动ID
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            const promotion = params.row
            return (
              <a on-click={() => {
                this.$message({
                  type: 'info',
                  message: '跳转到促销'
                })
              }} href='#' class='link-type'>{promotion.promotionId}</a>
            )
          }
        },
        {
          show: true,
          prop: 'promotionName',
          label: this.$t('so_promotion_name'), // 促销活动名称
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'productCname',
          label: this.$t('manual_order_product_name'), // 商品名称
          align: 'center',
          minWidth: 400
        },
        {
          show: true,
          prop: 'productCode',
          label: this.$t('manual_order_product_code'), // 商品编码
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'productUnit',
          label: this.$t('so_promotion_unit'), // 订购单位
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'productItemNum',
          label: this.$t('so_promotion_num'), // 参与数量
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'amountSharePromotion',
          label: this.$t('so_promotion_price'), // 优惠金额
          align: 'center',
          minWidth: 100
        }
      ],
      couponColumns: [
        {
          show: true,
          prop: 'couponName',
          label: this.$t('so_coupon_name'), // 优惠券名称
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'couponCode',
          label: this.$t('so_coupon_code'), // 劵码
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'productCname',
          label: this.$t('manual_order_product_name'), // 商品名称
          align: 'center',
          minWidth: 400
        },
        {
          show: true,
          prop: 'productCode',
          label: this.$t('manual_order_product_code'), // 商品编码
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'productUnit',
          label: this.$t('so_promotion_unit'), // 优惠金额
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'productItemNum',
          label: this.$t('so_promotion_num'), // 参与数量
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'couponAmount',
          label: this.$t('so_promotion_price'), // 优惠金额
          align: 'center',
          minWidth: 100
        }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    showWarehouseModal(item) {
      this.modifyItem = item
      this.visibleWarehouse = true
    },
    showPriceModal(item) {
      this.modifyItem = item
      this.visiblePrice = true
    },
    fixedDigist(number, digist) {
      if (isNaN(Number(number))) {
        number = 0
      }
      return Number(number).toFixed(digist)
    },
    showModifyDeliveryFee() {
      this.editDeliveryFee = true
    },
    async saveDeliveryFee() {
      const num = Number(this.soInfo.orderDeliveryFee).toFixed(2)
      if (isNaN(num) || num < 0) {
        this.$message({
          type: 'warn',
          message: this.$t('errorFreightPrice')
        })
      } else {
        const result = await this.$oms.$api.so.modifyFreightPrice({ id: this.soInfo.id, orderDeliveryFee: this.soInfo.orderDeliveryFee })
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('promptOperateSuccess')
          })
          calculate(this)
        } else {
          this.$message({
            type: 'error',
            message: result.message
          })
        }
        this.editDeliveryFee = false
      }
    },
    handleSelectable(row, index) {
      return !(this.soInfo.orderStatus !== 1050 || this.noWarehouse || row.unDoNum === 0)
    },
    async batchManualDeliveryNoWarehouse() { // 无仓订单商品全部发货
      const vue = this
      const soPick = await this.$oms.$api.soPick.soPickListPage({
        'filters': {
          'orderCode': this.soInfo.orderCode
        },
        'limit': 10,
        'page': 1
      })
      if (soPick.success && soPick.data[0].orderStatus === '1050') { // 可以发货的情况下，查明细
        // 查询soPick信息
        const result = await this.$oms.$api.soPick.soPickDetailGet({ id: soPick.data[0].id })
        this.soPickInfo = result.data
        this.soPickInfo.itemsNum = result.data.soItemList.length
        // 查配送商信息
        const merchantExpress = await this.$oms.$api.merchantExpressConfig.merchantExpressConfigListForSelect({ 'filters': { 'isAvailable': 1 }})
        this.merchantExpress = merchantExpress.data.filter(i => i.merchantId === vue.soPickInfo.merchantId)
      }

      this.dialogTableVisibleNoWarehouse = true
    },
    async sendItemNoWarehouse() { // 无仓发货确认
      if (this.deliveryCompanyId === '') {
        this.$alert(this.$t('distributorsCanNotEmpty'), this.$t('promptSystemTips'))
        return
      }

      if (this.deliveryExpressNbr === '') {
        this.$alert(this.$t('logisticsNumberNotEmpty'), this.$t('promptSystemTips'))
        return
      }

      // if (isNaN(this.deliveryExpressNbr)) {
      //   this.$alert(this.$t('logisticsNumberIsPureNum'), this.$t('promptSystemTips'))
      //   return
      // }

      var param = {}
      param.id = this.soPickInfo.id
      param.goodReceiverName = this.soPickInfo.goodReceiverName
      param.goodReceiverMobile = this.soPickInfo.goodReceiverMobile
      param.goodReceiverPostcode = this.soPickInfo.goodReceiverPostcode
      param.goodReceiverProvinceCode = this.soPickInfo.goodReceiverProvinceCode
      param.goodReceiverCityCode = this.soPickInfo.goodReceiverCityCode
      param.goodReceiverAreaCode = this.soPickInfo.goodReceiverAreaCode
      param.goodReceiverAddress = this.soPickInfo.goodReceiverAddress
      param.deliveryCompanyId = this.deliveryCompanyId
      param.deliveryExpressNbr = this.deliveryExpressNbr
      // 省市区 名称
      param.goodReceiverProvince = this.soPickInfo.goodReceiverProvince
      param.goodReceiverCity = this.soPickInfo.goodReceiverCity
      param.goodReceiverArea = this.soPickInfo.goodReceiverArea
      const vue = this
      if (this.deliveryCompanyId) {
        this.merchantExpress.forEach(item => {
          if (item.deliveryCompanyId === vue.deliveryCompanyId) {
            param.deliveryCompanyName = item.deliveryCompanyName
          }
        })
      }

      const result = await this.$oms.$api.soPick.soPickConfirmSend(param)
      if (result.success) {
        this.dialogTableVisibleNoWarehouse = false
      }
    },
    async cancelItemNoWarehouse() { // 无仓发货取消
      this.dialogTableVisibleNoWarehouse = false
    },
    async batchManualDelivery() { // 批量手动转交货单
      this.checkedSoItems = []
      if (this.checked) {
        this.checked.forEach(si => {
          var siObj = { id: si.id, warehouseCode: '', warehouseName: '', warehouseNum: 0, warehouseId: '', num: si.waitUnDoNum, productCname: si.productCname, code: si.code, barCode: si.barCode, extInfoStr: si.extInfoStr, sendNum: si.waitUnDoNum }
          this.checkedSoItems.push(siObj)
        })
      }
      if (this.checkedSoItems.length === 0) {
        this.$alert(this.$t('promptSelectInventoryDetail'), this.$t('promptSystemTips'))
        return
      }
      this.dialogTableVisible = true
      const vue = this
      const merchantExpress = await this.$oms.$api.merchantExpressConfig.merchantExpressConfigListForSelect({ 'filters': { 'isAvailable': 1 }})
      this.merchantExpress = merchantExpress.data.filter(i => i.merchantId === vue.soInfo.merchantId)
      const result = await this.$oms.$api.soItem.siBatchListItemRealWarehouse(JSON.stringify(this.checkedSoItems))
      this.warehouses = result.data
    },
    async cancelToDo() { // 取消
      this.dialogTableVisible = false
    },
    async okToDo() { // 确认
      if (this.deliveryCompanyId === '') {
        this.$alert(this.$t('distributorsCanNotEmpty'), this.$t('promptSystemTips'))
        return
      }
      // 需要转交货单的商品
      const convertSoItems = this.checkedSoItems.concat()
      for (var i = 0; i < this.checkedSoItems.length; i++) {
        const info = this.checkedSoItems[i]
        if (info.warehouseId === '' || info.warehouseId === null) {
          convertSoItems.remove(info)
          continue
        }
        if (info.num > info.sendNum) {
          this.$alert(this.$t('goodsOverShipment'), this.$t('promptSystemTips'))
          return
        }
        if (info.num <= 0) {
          this.$alert(this.$t('deliveryNumberZero'), this.$t('promptSystemTips'))
          return
        }
        if (info.num > info.warehouseNum) {
          this.$alert(this.$t('insufficient_stock'), this.$t('promptSystemTips'))
          return
        }
      }
      if (convertSoItems.length === 0) {
        this.$alert(this.$t('promptNoWarehouseSelection'), this.$t('promptSystemTips'))
        return
      }
      // 转交货单
      const result = await this.$oms.$api.soItem.updateItemsConvertDo({ items: convertSoItems, deliveryCompanyId: this.deliveryCompanyId })
      if (result.code === '0') {
        let msg = ''
        result.data.forEach(r => {
          if (r.success) {
            msg = msg + this.$t('do_line_no') + r.lineNum + this.$t('lineCreateDeliverySuccess') + r.doCode + '\n'
          } else {
            msg = msg + this.$t('do_line_no') + r.lineNum + this.$t('lineCreateDeliveryError') + r.message + '\n'
          }
        })
        this.$alert(msg, this.$t('promptSystemTips'))
        this.reload()
        this.dialogTableVisible = false
      }
    },
    async manualDelivery() { // 手动转交货单
      const checkedSoItems = []
      const noWarehouseLines = []
      if (this.checked) {
        this.checked.forEach(si => {
          if (si.warehouseId) {
            var siObj = { id: si.id, num: si.waitUnDoNum }
            checkedSoItems.push(siObj)
          } else {
            noWarehouseLines.push(si.lineNum)
          }
        })
      }
      if (noWarehouseLines.length > 0) {
        this.$alert(this.$t('promptNoWarehouseSelection'), this.$t('promptSystemTips'))
        return
      }
      if (checkedSoItems.length === 0) {
        this.$alert(this.$t('promptSelectInventoryDetail'), this.$t('promptSystemTips'))
        return
      }

      const result = await this.$oms.$api.soItem.updateItemsConvertDo({ items: checkedSoItems, deliveryCompanyId: this.deliveryCompanyId })
      if (result.code === '0') {
        let msg = ''
        result.data.forEach(r => {
          if (r.success) {
            msg = msg + this.$t('do_line_no') + r.lineNum + this.$t('lineCreateDeliverySuccess') + r.doCode + '\n'
          } else {
            msg = msg + this.$t('do_line_no') + r.lineNum + this.$t('lineCreateDeliveryError') + r.message + '\n'
          }
        })
        this.$alert(msg, this.$t('promptSystemTips'))
        this.reload()
      }
    },
    async updateList() {
      try {
        this.loading = true
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async handleSearchSubmit() {
      try {
        this.page = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = {}
    },
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.updateList()
        })
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
    reload() {
      this.$emit('reload')
      this.updateList()
    },
    init() {
      this.orderCode = this.soInfo.orderCode
      this.updateList()
    }
  }
}
async function loadList(vue) {
  const param = {
    limit: vue.limit,
    page: vue.page,
    joinFields: ['productItemOutNum'],
    filters: {
      orderCode: vue.orderCode,
      code: vue.searchForm.itemProductCode
    }
  }
  const soItem = vue.$oms.$api.soItem

  const result = await soItem.orderSoItemListPage(param)
  if (result.code === '0') {
    vue.soItems = result.data
    vue.checked = []
    vue.total = result.total
    calculate(vue)
  }
}
// eslint-disable-next-line no-extend-native
Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === val) return i
  }
  return -1
}
// eslint-disable-next-line no-extend-native
Array.prototype.remove = function(val) {
  var index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}
function calculate(vue) {
  vue.totalItemBuyAmount = Number(0)
  vue.totalItemOriginalAmount = Number(0)
  vue.totalItemAdjustDiscountAmount = Number(0)
  if (vue.soItems) {
    vue.soItems.forEach(soItem => {
      soItem.waitUnDoNum = soItem.unDoNum
      vue.totalItemBuyAmount += soItem.productItemAmount
      const productPriceOriginalAmount = soItem.productPriceOriginal * soItem.productItemNum
      vue.totalItemOriginalAmount += productPriceOriginalAmount
      soItem.itemAdjustDiscountAmount = soItem.productItemBeforeAmount - soItem.productItemAmount
      vue.totalItemAdjustDiscountAmount += soItem.itemAdjustDiscountAmount
    })
  }
  vue.soTotalAmount = Number(vue.totalItemBuyAmount) + Number(vue.soInfo.orderDeliveryFee) + Number(vue.soInfo.taxAmount)
}
</script>

<style scoped>
  .remove-shadows{
    box-shadow: none;
  }
</style>
