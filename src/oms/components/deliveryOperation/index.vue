<template>
  <section>
    <div>
      <el-row :gutter="30">
        <el-col :span="6"><span>{{ $t('订单号') }}：</span><span>{{ soInfo.orderCode }}</span></el-col>
        <el-col :span="6"><span>{{ $t('店铺') }}：</span><span>{{ soInfo.storeName }}</span></el-col>
        <el-col :span="6"><span >{{ $t('下单时间') }}：</span><span>{{ soInfo.orderCreateTime }}</span></el-col>
      </el-row>
    </div>
    <br>
    <ody-list-table-area>
      <div slot="tabs">
        <!--仓库自发-->
        <ody-table
          v-if="showWareHouseTable"
          :loading="loading"
          :data="deliverySoItemList"
          :columns="columnsForWarehouse"
          :checked.sync="checked"
          :multiple="true"
          name="deliverySoItemList319"
        />
        <!--无仓自发-->
        <ody-table
          v-if="showNoWareHouseTable"
          :loading="loading"
          :data="deliveryNoWarehouseSoItemList"
          :checked.sync="checked"
          :multiple="true"
          :columns="columnsForNoWarehouse"
          name="deliverySoItemList319"
        />
      </div>
      <br>
    </ody-list-table-area>
    <span slot="footer" class="dialog-footer">
      <el-button name="okToDo" type="primary" @click="confirmDelivery">{{ $t('Shipping_confirmation') }}</el-button>
    </span>
    <br><br>
    <ody-dialog
      :visible="dialogDeliveryVisible"
      :title="$t('shipping_information')"
      :model="false"
      :before-close="hideDialog"
      width="500px"
      append-to-body>
      <el-form ref="deliveryOperationForm" :model="soDeliveryInfo" label-width="100px" class="form">
        <el-form-item v-if="soInfo.orderType === 101">
          <label>
            {{ $t('手工生成发货任务，确认继续') + '?' }}
          </label>
        </el-form-item>
        <el-form-item v-if="soInfo.orderType === 103">
          <label>
            {{ $t('Shipping_confirmation') + '?' }}
          </label>
        </el-form-item>
        <el-form-item v-if="soInfo.orderType === 101 || soInfo.orderType === 106">
          <el-row>
            <el-checkbox v-model="setDistributor" :label="$t('指定配送商')" name="formData_crmRelRegisterOn"/>
            <el-tooltip class="item" effect="light" placement="bottom-end">
              <i class="el-icon-info"/>
              <div slot="content">
                {{ $t('指定本次发货任务的配送商') }}
              </div>
            </el-tooltip>
            <el-select v-if="setDistributor" v-model="soDeliveryInfo.deliveryCompanyId" name="soDeliveryInfo_deliveryCompanyId" placeholder="请选择">
              <el-option
                v-for="item in merchantExpress"
                :key="item.deliveryCompanyId"
                :label="item.deliveryCompanyName"
                :value="item.deliveryCompanyId"/>
            </el-select>
          </el-row>
        </el-form-item>
        <el-form-item v-if="soInfo.orderType === 102 || soInfo.orderType === 107" :label="$t('物流发货方式')">
          <el-radio-group v-model="deliveryMode" name="deliveryMode" @change="changeDeliveryMode()">
            <el-radio :label="1" class="label">{{ $t('物流发货') }}</el-radio>
            <el-radio :label="2" class="label">{{ $t('配送员直送') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="(soInfo.orderType === 102 || soInfo.orderType === 107) && deliveryMode ===1" :label="$t('so_pick_delivery_merchant')" required="true">
          <el-select v-model="soDeliveryInfo.deliveryCompanyId" name="soDeliveryInfo_deliveryCompanyId" placeholder="请选择">
            <el-option
              v-for="item in merchantExpress"
              :key="item.deliveryCompanyId"
              :label="item.deliveryCompanyName"
              :value="item.deliveryCompanyId"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="(soInfo.orderType === 102 || soInfo.orderType === 107) && deliveryMode === 1" :label="$t('orderInvoiceInfo_logistics_no')" required="true">
          <el-input v-model="soDeliveryInfo.deliveryExpressNbr" name="soDeliveryInfo_deliveryExpressNbr" placeholder="" maxlength="20" />
        </el-form-item>
        <el-form-item v-if="(soInfo.orderType === 102 || soInfo.orderType === 107) && deliveryMode === 2" :label="$t('distributor')" required="true">
          <el-select v-model="salesmanId" name="salesmanId">
            <el-option :label="$t('please_choose')" />
            <el-option v-for="item in salesmans" :label="item.name" :key="item.id" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('备注')">
          <el-input v-model="deliveryRemark" :autosize="{ minRows: 2, maxRows: 4}" name="deliveryOperation_remark" type="textarea" maxlength="100" show-word-limit/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <div class="line-top"/>
        <el-button :loading="submiting" name="hideDialog" size="small" @click="hideDialog">{{ $t('cancel') }}</el-button>
        <el-button :loading="submiting" name="deliverySubmit" size="small" type="primary" @click="deliverySubmit">{{ $t('ok') }}</el-button>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  props: {
    soInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    const self = this
    return {
      deliveryRemark: null, // 发货备注信息
      setDistributor: false,
      totalNum: 0,
      orderCode: '',
      showWareHouseTable: false,
      showNoWareHouseTable: false,
      deliveryMode: 1, // 物流发货方式
      salesmanId: null, // 配送员信息
      salesmans: [],
      deliveryType: '', // 发货类型 1有仓 2无仓 用于控制点击发货按钮要进行的操作
      warehouses: [],
      submiting: false,
      soDeliveryInfo: {
        deliveryCompanyId: self.soInfo.deliveryCompanyId ? self.soInfo.deliveryCompanyId : '',
        deliveryExpressNbr: ''
      },
      merchantExpress: [], // 配送商信息
      deliveryCompanyId: self.soInfo.deliveryCompanyId ? self.soInfo.deliveryCompanyId : '', // 选择的配送商
      deliveryExpressNbr: '', // 运单号
      wareHouseSoItemList: [], // 有仓商品
      noWareHouseSoItemList: [], // 无仓商品
      deliverySoItemList: [], // 仓库直发商品
      deliveryNoWarehouseSoItemList: [], // 无仓直发商品
      codeFilter: '',
      dialogDeliveryVisible: false,
      visible: false,
      limit: 10,
      page: 1,
      total: 0,
      soItems: [],
      loading: false,
      columnsForWarehouse: [
        {
          show: true,
          prop: 'lineNum',
          label: this.$t('行号'), // 商品名称
          align: 'center',
          minWidth: 80
        },
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
          label: this.$t('product_bar_code'), // 条码
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('SKU编码'),
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
          prop: 'extInfoStr',
          label: this.$t('manual_order_product_attr'), // 规格属性
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'unit',
          label: this.$t('Measurementunit'), // 计量单位
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'sendNum',
          label: this.$t('待发货数量'), // 待交货单数量
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
                size: 'small',
                disabled: params.row.sendNum === 0
              }, on: {
                change: (event) => {
                  if (!event) {
                    params.row.warehouseName = null
                    params.row.warehouseId = null
                    params.row.warehouseNum = null
                    params.row.warehouseCode = null
                    return
                  }
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
          label: this.$t('do_delivering_num'), // 本次发货数量
          align: 'center',
          minWidth: 250,
          render: (h, params) => {
            return (
              <el-input-number size='small' step='1' value={params.row.num} min={0} max={params.row.sendNum} on-change={
                (event) => {
                  params.row.num = Math.floor(event)
                }
              }></el-input-number>
            )
          }
        }
      ],
      columnsForNoWarehouse: [
        {
          show: true,
          prop: 'lineNum',
          label: this.$t('行号'), // 商品名称
          align: 'center',
          minWidth: 80
        },
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
          label: this.$t('product_bar_code'), // 条码
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('SPU编码'),
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
          prop: 'extInfoStr',
          label: this.$t('manual_order_product_attr'), // 规格属性
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'unit',
          label: this.$t('Measurementunit'), // 计量单位
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'sendNum',
          label: this.$t('待发货数量'), // 待交货单数量
          align: 'center',
          minWidth: 150
        }, {
          show: true,
          prop: 'deliveryNum',
          label: this.$t('do_delivering_num'), // 发货数量
          align: 'center',
          minWidth: 250,
          render: (h, params) => {
            return (
              <el-input-number size='small' step='1' value={params.row.deliveryNum} min={0} max={params.row.sendNum} on-change={
                (event) => {
                  params.row.deliveryNum = Math.floor(event)
                }
              }></el-input-number>
            )
          }
        }
      ],
      checked: []
    }
  },
  async mounted() {
    // await this.init()
  },
  methods: {
    async batchManualDelivery(vue) { // 批量手动转交货单
      vue.deliverySoItemList = []
      vue.deliveryNoWarehouseSoItemList = []
      if (vue.wareHouseSoItemList.length > 0) {
        vue.wareHouseSoItemList.forEach(si => {
          var siObj = { lineNum: si.lineNum, id: si.id, warehouseCode: '', warehouseName: '', warehouseNum: 0, artNo: si.artNo, unit: si.unit, warehouseId: '', num: si.waitUnDoNum, productCname: si.productCname, code: si.code, barCode: si.barCode, extInfoStr: si.extInfoStr, sendNum: si.waitUnDoNum }
          vue.deliverySoItemList.push(siObj)
        })
        vue.showWareHouseTable = true
        vue.showNoWareHouseTable = false
      }
      if (vue.noWareHouseSoItemList.length > 0) {
        vue.noWareHouseSoItemList.forEach(si => {
          var siObj = { lineNum: si.lineNum, id: si.id, warehouseCode: '', warehouseName: '', warehouseNum: 0, artNo: si.artNo, unit: si.unit, warehouseId: '', deliveryNum: si.waitUnDoNum, productCname: si.productCname, code: si.code, barCode: si.barCode, extInfoStr: si.extInfoStr, sendNum: si.waitUnDoNum }
          vue.deliveryNoWarehouseSoItemList.push(siObj)
        })
        vue.showWareHouseTable = false
        vue.showNoWareHouseTable = true
      }
      const merchantExpress = await vue.$oms.$api.merchantExpressConfig.merchantExpressConfigListForSelect({ 'filters': { 'isAvailable': 1 }})
      vue.merchantExpress = merchantExpress.data.filter(i => i.merchantId === vue.soInfo.merchantId)
      if (vue.deliverySoItemList.length > 0) {
        const result = await vue.$oms.$api.soItem.siBatchListItemRealWarehouse(JSON.stringify(vue.deliverySoItemList))
        vue.warehouses = result.data
      }
    },
    reset() {
      this.showWareHouseTable = false
      this.showNoWareHouseTable = false
      this.deliverySoItemList = []
      this.deliveryNoWarehouseSoItemList = []
    },
    async hideDialog() { // 取消
      this.dialogDeliveryVisible = false
    },
    // 202010 点击确认发货
    async confirmDelivery() {
      let flag = true
      if (this.checked.length > 0) {
        flag = this.checked.some((item) => {
          if (this.showWareHouseTable) {
            return item.num > 0
          } else {
            return item.deliveryNum > 0
          }
        })
      }
      console.log('flag', flag, this.checked)
      if (!flag) {
        this.$confirm('暂无代发货商品', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        return
      }
      this.setDistributor = false
      this.dialogDeliveryVisible = true
      this.soDeliveryInfo.deliveryCompanyId = null
      this.soDeliveryInfo.deliveryExpressNbr = null
      this.deliveryRemark = ''
    },
    // 提交发货确认
    async deliverySubmit() {
      const vue = this
      // 订单类型为实物-仓库自发-需物流调用updateItemsConvertD生成do单
      if (vue.soInfo.orderType === 101 || vue.soInfo.orderType === 106) {
        vue.dialogDeliveryVisible = false
        if (vue.deliverySoItemList.length === 0) {
          vue.$alert(this.$t('暂无待发货的商品'), vue.$t('promptSystemTips'))
          return
        }
        if (vue.setDistributor && vue.soDeliveryInfo.deliveryCompanyId === '') {
          vue.$alert(this.$t('distributorsCanNotEmpty'), this.$t('promptSystemTips'))
          return
        }
        // 需要转交货单的商品
        let convertSoItems = []
        if (vue.checked.length > 0) {
          convertSoItems = vue.deliverySoItemList.concat()
        } else {
          convertSoItems = vue.checked.concat()
        }

        for (var i = 0; i < convertSoItems.length; i++) {
          const info = convertSoItems[i]
          if (info.warehouseId === '' || info.warehouseId === null) {
            convertSoItems.remove(info)
            continue
          }
          if (info.num > info.sendNum) {
            vue.$alert(this.$t('goodsOverShipment'), vue.$t('promptSystemTips'))
            return
          }
          if (info.num <= 0) {
            vue.$alert(this.$t('deliveryNumberZero'), vue.$t('promptSystemTips'))
            return
          }
          if (info.num > info.warehouseNum) {
            vue.$alert(this.$t('insufficient_stock'), vue.$t('promptSystemTips'))
            return
          }
        }
        if (convertSoItems.length === 0) {
          vue.$alert(this.$t('promptNoWarehouseSelection'), vue.$t('promptSystemTips'))
          return
        }
        // 转交货单
        const result = await vue.$oms.$api.soItem.updateItemsConvertDo({ items: convertSoItems, deliveryCompanyId: vue.soDeliveryInfo.deliveryCompanyId, remark: vue.deliveryRemark })
        if (result.code === '0') {
          let msg = ''
          result.data.forEach(r => {
            if (r.success) {
              msg = msg + vue.$t('do_line_no') + r.lineNum + this.$t('lineCreateDeliverySuccess') + r.doCode + '\n'
            } else {
              msg = msg + vue.$t('do_line_no') + r.lineNum + this.$t('lineCreateDeliveryError') + r.message + '\n'
            }
          })
          vue.$alert(msg, vue.$t('promptSystemTips'))
          vue.init()
          vue.$emit('onSuccess')
        }
      }
      // 订单类型为实物-无仓自发-需物流、实物-直接发货-无需物流时调用oms-web/soPick/confirmSend生成发货记录
      if (vue.soInfo.orderType === 102 || vue.soInfo.orderType === 103 || vue.soInfo.orderType === 107) {
        vue.submiting = false
        // 当有勾选的时候只考虑勾选的数据
        if (vue.checked.length > 0) {
          vue.checked.forEach(item => {
            vue.totalNum += item.deliveryNum
          })
        } else {
          vue.deliveryNoWarehouseSoItemList.forEach(item => {
            vue.totalNum += item.deliveryNum
          })
        }

        if (vue.totalNum === 0) {
          vue.$alert(this.$t('暂无待发货的商品'), this.$t('promptSystemTips'))
        }
        vue.$refs['deliveryOperationForm'].validate((valid) => {
          if (valid) {
            var param = {}
            param.orderCode = this.soInfo.orderCode
            param.goodReceiverName = this.soInfo.goodReceiverName
            param.goodReceiverMobile = this.soInfo.goodReceiverMobile
            param.goodReceiverPostcode = this.soInfo.goodReceiverPostcode
            param.goodReceiverProvinceCode = this.soInfo.goodReceiverProvinceCode
            param.goodReceiverCityCode = this.soInfo.goodReceiverCityCode
            param.goodReceiverAreaCode = this.soInfo.goodReceiverAreaCode
            param.goodReceiverAddress = this.soInfo.goodReceiverAddress
            param.remark = this.deliveryRemark
            if (vue.soInfo.orderType === 102 || vue.soInfo.orderType === 107) {
              if (vue.deliveryMode === 1) {
                if (vue.soDeliveryInfo.deliveryExpressNbr === '') {
                  vue.$alert(this.$t('logisticsNumberNotEmpty'), this.$t('promptSystemTips'))
                  return
                }
                // if (isNaN(this.soDeliveryInfo.deliveryExpressNbr)) {
                //   this.$alert(this.$t('logisticsNumberIsPureNum'), this.$t('promptSystemTips'))
                //   return
                // }
                // 快递单号字符或字母4到23位
                const reg = /^[0-9a-zA-Z]{4,50}$/
                if (vue.soDeliveryInfo.deliveryExpressNbr && !reg.test(vue.soDeliveryInfo.deliveryExpressNbr)) {
                  vue.$message({
                    type: 'waring',
                    message: vue.$t('delivery_express_number_must_be_pure_number')
                  })
                  return
                }
              }
              param.deliveryMode = this.deliveryMode
              if (param.deliveryMode === null) {
                vue.$message({ type: 'waring', message: this.$t('请选择配送类型') })
                vue.submiting = false
                return
              }
              let salesman = {}
              if (param.deliveryMode === 2) {
                for (const i in this.salesmans) {
                  if (vue.salesmans[i].id === vue.salesmanId) {
                    salesman = this.salesmans[i]
                    break
                  }
                }
              }
              if (vue.deliveryMode === 1) {
                // 快递物流
                param.deliveryCompanyId = vue.soDeliveryInfo.deliveryCompanyId
                param.deliveryExpressNbr = vue.soDeliveryInfo.deliveryExpressNbr
                if (!param.deliveryCompanyId || !param.deliveryExpressNbr) {
                  vue.$message({ type: 'waring', message: this.$t('物流信息不能为空') })
                  vue.submiting = false
                  return
                }
                param.deliverName = null
                param.deliverMobile = null
                if (param.deliveryCompanyId) {
                  this.merchantExpress.forEach(item => {
                    if (item.deliveryCompanyId === param.deliveryCompanyId) {
                      param.deliveryCompanyName = item.deliveryCompanyName
                    }
                  })
                }
              } else if (vue.deliveryMode === 2) {
                // 配送员直送
                param.deliverName = salesman.name
                param.deliverMobile = salesman.mobile
                param.deliveryCompanyId = null
                param.deliveryExpressNbr = null
                param.deliveryCompanyName = null
                if (!param.deliverName || !param.deliverMobile) {
                  vue.$message({ type: 'waring', message: this.$t('请选择配送员') })
                  vue.submiting = false
                  return
                }
              }
            }
            // 排除发货数量为0的商品
            const sendItemList = []
            // 当有勾选的时候只考虑勾选的数据
            if (vue.checked.length > 0) {
              if (vue.showWareHouseTable) {
                vue.checked.forEach(item => {
                  if (item.num > 0) {
                    this.$set(item, 'deliveryNum', item.num)
                    sendItemList.push(item)
                  }
                })
              } else {
                vue.checked.forEach(item => {
                  if (item.deliveryNum > 0) {
                    sendItemList.push(item)
                  }
                })
              }
            } else {
              if (vue.showWareHouseTable) {
                vue.deliverySoItemList.forEach(item => {
                  if (item.num > 0) {
                    this.$set(item, 'deliveryNum', item.num)
                    sendItemList.push(item)
                  }
                })
              } else {
                vue.deliveryNoWarehouseSoItemList.forEach(item => {
                  if (item.deliveryNum > 0) {
                    sendItemList.push(item)
                  }
                })
              }
            }
            if (sendItemList.length === 0) {
              vue.$alert(this.$t('deliveryNumberZero'), this.$t('promptSystemTips'))
              return
            }
            // 省市区 名称
            param.goodReceiverProvince = this.soInfo.goodReceiverProvince
            param.goodReceiverCity = this.soInfo.goodReceiverCity
            param.goodReceiverArea = this.soInfo.goodReceiverArea
            param.itemVOList = sendItemList
            // console.log(JSON.stringify(param))
            vue.$confirm(this.$t('so_pick_confirm_send'), this.$t('common_tip'), {
              confirmButtonText: vue.$t('ok'),
              cancelButtonText: vue.$t('cancel'),
              type: 'info'
            }).then(() => {
              if (vue.showWareHouseTable) {
                vue.submiting = true
                vue.$oms.$api.soPick.warehouseConfirmSend(param).then((res) => {
                  if (res.code === '0') {
                    vue.$message({
                      type: 'success',
                      message: this.$t('so_pick_send_success')
                    })
                    vue.dialogDeliveryVisible = false
                    vue.init()
                    vue.$emit('onSuccess')
                  } else {
                    vue.$message({
                      type: 'error',
                      message: res.message
                    })
                  }
                }).catch((ex) => {
                }).finally(() => {
                  vue.submiting = false
                })
              } else {
                vue.submiting = true
                vue.$oms.$api.soPick.noWarehouseConfirmSend(param).then((res) => {
                  if (res.code === '0') {
                    vue.$message({
                      type: 'success',
                      message: this.$t('so_pick_send_success')
                    })
                    vue.dialogDeliveryVisible = false
                    vue.init()
                    vue.$emit('onSuccess')
                  } else {
                    vue.$message({
                      type: 'error',
                      message: res.message
                    })
                  }
                }).catch((ex) => {
                }).finally(() => {
                  vue.submiting = false
                })
              }
            }).catch(() => {
              vue.submiting = false
            })
          }
        })
      }
    },
    async loadSalesmans(storeId, merchantId) {
      this.salesmans = []
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
    reload() {
      this.$emit('reload')
      this.updateList()
    },
    async init() {
      // console.log(JSON.stringify(this.soInfo))
      this.showNoWareHouseTable = false
      this.showWareHouseTable = false
      this.soItems = []
      this.wareHouseSoItemList = []
      this.noWareHouseSoItemList = []
      this.deliverySoItemList = []
      this.deliveryNoWarehouseSoItemList = []
      this.orderCode = this.soInfo.orderCode
      this.deliveryRemark = ''
      this.soDeliveryInfo.deliveryCompanyId = this.soInfo.deliveryCompanyId ? this.soInfo.deliveryCompanyId : ''
      if (this.soInfo.orderType === 102 && this.deliveryMode === 1) {
        this.soDeliveryInfo.deliveryExpressNbr = ''
      }
      await this.updateList()
      this.loadSalesmans(this.soInfo.storeId, this.soInfo.merchantId)
    }
  }
}
async function loadList(vue) {
  const param = {
    limit: 100,
    page: vue.page,
    joinFields: ['productItemOutNum'],
    filters: {
      orderCode: vue.orderCode
    }
  }
  const soItemService = vue.$oms.$api.soItem
  const result = await soItemService.orderSoItemListPage(param)
  if (result.code === '0') {
    vue.soItems = result.data
    vue.total = result.total
    vue.soItems.forEach(soItem => {
      // 可用库存默认为0
      soItem.warehouseNum = 0
      // 未转do数量
      soItem.waitUnDoNum = soItem.unDoNum
      if (soItem.warehouseType === 0) {
        vue.wareHouseSoItemList.push(soItem)
      } else if (soItem.warehouseType === 1 && soItem.waitUnDoNum > 0) {
        vue.noWareHouseSoItemList.push(soItem)
      }
    })
    await vue.batchManualDelivery(vue)
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
</script>

<style scoped>
  .remove-shadows{
    box-shadow: none;
  }
</style>
