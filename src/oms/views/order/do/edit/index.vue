<template>
  <section class="pg-soPackage-list">
    <el-form
      ref="transOrderDetail"
      :model="transOrderDetail"
      :inline="true"
      :rules="rules"
      label-width="100px"
      class="form"
    >
      <el-card>
        <el-form-item :label="$t('manual_order_receiver_name')">
          <el-input v-model="transOrderDetail.goodReceiverName" name="transOrderDetail_goodReceiverName" type="text" />
        </el-form-item>
        <el-form-item :label="$t('do_good_receiver_mobile')">
          <el-input v-model="transOrderDetail.goodReceiverMobile" name="transOrderDetail_goodReceiverMobile" type="text" />
        </el-form-item>
        <el-form-item :label="$t('common_zipcode')">
          <el-input v-model="transOrderDetail.goodReceiverPostcode" name="transOrderDetail_goodReceiverPostcode" type="text" />
        </el-form-item>
        <el-form-item :space="4" :label="$t('order_ports_deliveryAddress')">
          <el-select
            id="s_province"
            v-model="transOrderDetail.goodReceiverProvince"
            name="s_province"
            @change="queryAera(transOrderDetail.goodReceiverProvince, 2)"
          >
            <el-option :label="$t('please_choose')" />
            <el-option
              v-for="item in provinceList"
              :label="item.name"
              :key="item.code"
              :value="item.code"
            />
          </el-select>
          <el-select
            id="s_city"
            v-model="transOrderDetail.goodReceiverCity"
            name="s_city"
            @change="queryAera(transOrderDetail.goodReceiverCity, 3)"
          >
            <el-option :label="$t('please_choose')" />
            <el-option
              v-for="item in cityList"
              :label="item.name"
              :key="item.code"
              :value="item.code"
            />
          </el-select>
          <el-select id="s_area" v-model="transOrderDetail.goodReceiverArea" name="s_area">
            <el-option :label="$t('please_choose')" />
            <el-option
              v-for="item in areaList"
              :label="item.name"
              :key="item.code"
              :value="item.code"
            />
          </el-select>
          <el-input v-model="transOrderDetail.goodReceiverAddress" name="transOrderDetail_goodReceiverAddress" maxlength="25" />
        </el-form-item>
      </el-card>
      <el-card>
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="transOrderItemList"
              :columns="columns"
              :multiple="multiple"
              :checked.sync="checked"
              :can-filter="false"
              :selectable="handleSelectable"
              name="transOrderItemList036"
              @selection-change="handleSelectionChange"
            />
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
      </el-card>
      <el-card>
        <div>
          <el-row>
            <el-col>
              <el-form-item :label="$t('so_pick_total_num') + ':'">
                <div>{{ totalNum }}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card>
        <el-form-item :label="$t('so_pick_delivery_merchant')" prop="deliveryCompanyId">
          <el-select v-model="transOrderDetail.deliveryCompanyId" :placeholder="$t('common_all')" name="transOrderDetail_deliveryCompanyId">
            <el-option
              v-for="item in merchantExpressList"
              :label="item.deliveryCompanyName"
              :key="item.deliveryCompanyId"
              :value="item.deliveryCompanyId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('manual_order_delivery_type')" prop="orderDeliveryMethodId">
          <el-select
            v-model="transOrderDetail.orderDeliveryMethodId"
            :placeholder="$t('common_all')"
            name="transOrderDetail_orderDeliveryMethodId"
          >
            <el-option
              v-for="item in distributionModeItems"
              :label="item.distributionMode"
              :key="item.shippingCode"
              :value="item.shippingCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('orderInvoiceInfo_logistics_no')" prop="deliveryExpressNbr">
          <el-input v-model="transOrderDetail.deliveryExpressNbr" name="transOrderDetail_deliveryExpressNbr" maxlength="25" />
        </el-form-item>
      </el-card>
    </el-form>
    <el-card align="center">
      <el-button
        name="submitForm"
        size="small"
        @click="submitForm('transOrderDetail')"
      >{{ $t('transOrdersListManagementEdit') }}</el-button>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('common_back') }}</el-button>
    </el-card>
  </section>
</template>

<script>
export default {
  name: 'OmsTransOrderListEdit',
  data() {
    const vue = this
    return {
      activeName: 'first',
      transOrderDetail: {
        deliveryCompanyId: '',
        orderDeliveryMethodId: '',
        deliveryExpressNbr: '',
        goodReceiverArea: '',
        goodReceiverName: '',
        goodReceiverMobile: '',
        goodReceiverPostcode: '',
        goodReceiverProvince: '',
        goodReceiverCity: '',
        totalNum: 0,
        itemList: []
      },
      multiple: true,
      loading: false,
      checked: [],
      checkAll: false,
      provinceList: [],
      cityList: [],
      areaList: [],
      transOrderItemList: [],
      packageCodePo: null,
      packageList: [],
      packageItemList: [],
      packageCodeList: [], // 配送信息
      doStatusList: [],
      distributionModeItems: [],
      merchantExpressList: [],
      distributionModeMap: [],
      doStatusMap: [],
      payMethodMap: [],
      multipleSelection: [],
      dataNumMap: [],
      totalNum: 0,
      status: '',
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      rules: {
        deliveryCompanyId: [
          {
            required: true,
            message: vue.$t('distributorsCanNotEmpty'),
            trigger: 'blur'
          }
        ],
        orderDeliveryMethodId: [
          {
            required: true,
            message: vue.$t('please_choose_delivery_method'),
            trigger: 'blur'
          }
        ],
        deliveryExpressNbr: [
          { required: true, trigger: 'blur' },
          { pattern: /[0-9a-zA-Z]+/, message: this.$t('请输入字母或数字') }
        ]
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
          minWidth: 120
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
          label: this.$t('do_product_item_num'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'productItemAmount',
          label: this.$t('do_product_item_amount'),
          align: 'center',
          minWidth: 100
        },
        // {
        //   show: true,
        //   prop: 'productItemCurrency',
        //   label: this.$t('product_item_currency'),
        //   align: 'center',
        //   minWidth: 100
        // },
        // {
        //   show: true,
        //   prop: 'productItemCurrencyName',
        //   label: this.$t('product_item_currency_name'),
        //   align: 'center',
        //   minWidth: 100
        // },
        {
          show: true,
          prop: 'deliveredNum',
          label: this.$t('do_delivered_num'),
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
          prop: 'deliveringNum',
          label: this.$t('do_delivering_num'),
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            const item = params.row
            return (
              <input
                class='el-input__inner'
                name={'deliveringNum' + item.id}
                value={item.deliveringNum}
                on-blur={event => {
                  this.calcApplyReturnAmount(item)
                }}
              ></input>
            )
          }
        },
        {
          show: true,
          prop: 'storeName',
          label: this.$t('do_store_name'),
          align: 'center',
          minWidth: 200
        }
      ]
    }
  },
  computed: {
    checkedMap() {
      return this.checked.reduce((rtv, item) => {
        rtv[item.id] = true
        return rtv
      }, {})
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
    async init() {
      const id = this.$route.params.id
      await this._initData(id)
      this._initAllChannelsData()
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
    checkNum(val, scope) {
      if (
        val.deliveringNum === '' ||
        val.deliveringNum == null ||
        val.deliveringNum === undefined
      ) {
        val.deliveringNum = 0
      }
      if (parseInt(scope.row.deliveringNum) > val.undeliveredNum) {
        this.$message(this.$t('goodsOverShipment'))
        val.deliveringNum = val.undeliveredNum
        const index = this.transOrderItemList.indexOf(val)
        // 刷新视图
        this.$set(this.transOrderItemList, index, val)
      } else {
        const index = this.transOrderItemList.indexOf(val)
        this.$set(this.transOrderItemList, index, val)
      }
      let num = 0
      this.transOrderItemList.forEach(item => {
        if (!item.isDisabled) {
          num += parseInt(item.deliveringNum)
        }
      })
      this.totalNum = num
    },
    calcApplyReturnAmount: function(item) {
      const value = event.target.value
      this.subBut = 0
      if (
        !/^\d{1,9}$/.test(value) ||
        Number(value) <= 0 ||
        value > item.undeliveredNum
      ) {
        this.$message({
          type: 'warn',
          message: this.$t('goodsOverShipment')
        })
        event.target.value = item.undeliveredNum
        item.deliveringNum = item.undeliveredNum
      } else {
        item.deliveringNum = value
      }
      let num = 0
      this.transOrderItemList.forEach(item => {
        if (!item.isDisabled) {
          num += parseInt(item.deliveringNum)
        }
      })
      this.totalNum = num
    },
    handleSelectionChange(val) {
      if (event === undefined || event.type === 'change') {
        // 取消勾选
        if (this.checked.length > 0) {
          this.checked.forEach(item => {
            item.isDisabled = true
            this.totalNum -= item.deliveringNum
          })
        }
        console.log(this.transOrderItemList)
        if (val.length > 0) {
          this.multipleSelection = val
          let num = 0
          this.multipleSelection.forEach(item => {
            num += parseInt(item.deliveringNum)
            item.isDisabled = false
          })
          this.totalNum = num
        }
      }
    },
    queryAera(code, level) {
      const filtersForAera = {
        parentCode: code,
        level: level
      }
      const vue = this
      this.$oms.$api.common
        .getAreaListNoPaging({ filters: filtersForAera })
        .then(data => {
          if (level === 1) {
            if (code) {
              vue.provinceList = data.data
            } else {
              vue.provinceList = []
              vue.cityList = []
              vue.areaList = []
            }
          }
          if (level === 2) {
            vue.transOrderDetail.goodReceiverCity = null
            vue.transOrderDetail.goodReceiverArea = null
            if (code) {
              vue.cityList = data.data
            } else {
              vue.cityList = []
              vue.areaList = []
            }
          }
          if (level === 3) {
            vue.transOrderDetail.goodReceiverArea = null
            if (code) {
              vue.areaList = data.data
            } else {
              vue.areaList = []
            }
          }
        })
    },
    async _initData(id) {
      const res = await this.$oms.$api.do.transOrdersListGetByDoCode({
        doCode: id
      })
      if (res) {
        this.transOrderDetail = res.data
      }
      this.$oms.$api.doItem
        .transOrdersDetailListPage({
          page: this.page.current,
          limit: this.page.size,
          filters: {
            doCode: id,
            dontShowZero: 1
          }
        })
        .then(data => {
          if (data.data) {
            let index = 0
            data.data.forEach(item => {
              index = index + 1
              item.index = index
              item.deliveredNum = item.productItemNum - item.undeliveredNum
              item.deliveringNum = item.undeliveredNum
              if (item.extInfoStr == null) {
                item.extInfoStr = '无'
              } else {
                item.extInfoStr = this.getAttributes(item.extInfo)
              }
              if (item.artNo == null) {
                item.artNo = '无'
              }
              if (item.barCode == null) {
                item.barCode = '无'
              }
              item.isDisabled = true
              data.data = data.data.sort((a, b) => a.lineNo - b.lineNo)
            })
            this.transOrderItemList = data.data
            this.page.total = data.total
          }
        })
    },
    getAttributes(val) {
      var value = ''
      if (val === null || val === undefined || val === '' || val.length === 0) {
        return this.$message(this.$('no_exist'))
      }
      var json = JSON.parse(val)
      for (var i = 0; i < json.length; i++) {
        value = value + json[i].name + ':' + json[i].value + ';'
      }
      return value
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const itemList = []
          this.multipleSelection.forEach(item => {
            if (item.deliveringNum > 0) {
              itemList.push(item)
            }
          })
          if (itemList.length === 0) {
            if (this.multipleSelection.length > 0) {
              this.$message(this.$t('deliveryNumberZero'))
              return false
            } else {
              this.$message(this.$t('goodsLineNotEmpty'))
              return false
            }
          }
          this.merchantExpressList.forEach(item => {
            if (
              item.deliveryCompanyId === this.transOrderDetail.deliveryCompanyId
            ) {
              this.transOrderDetail.deliveryCompanyName =
                item.deliveryCompanyName
              this.transOrderDetail.deliveryMode = item.type
            }
          })

          this.transOrderDetail.itemList = itemList
          this.$oms.$api.do
            .transOrdersListConfirmDelivery(this.transOrderDetail)
            .then(data => {
              if (data) {
                this.$message(this.$t('promptOperateSuccess'))
                this.$router.push({ name: 'OmsTransOrdersList' })
                this.$portal.delViewByName(this.$route.name)
              } else {
                this.$message(
                  this.$t('common_request_fail') + '：' + data.message
                )
              }
            })
        } else {
          return false
        }
      })
    },
    returnBack() {
      this.$portal.delActiveView()
    },
    async _initAllChannelsData() {
      const vue = this
      this.$oms.$api.distributionModeItem
        .distributionModeItemListForSelect({ filters: { isAvailable: 1 }})
        .then(data => {
          this.distributionModeItems = data.data
        })

      this.$oms.$api.merchantExpressConfig
        .merchantExpressConfigListForSelect({ filters: { isAvailable: 1 }})
        .then(data => {
          this.merchantExpressList = data.data.filter(
            i => i.merchantId === vue.transOrderDetail.merchantId
          )
        })

      this.$oms.$api.common
        .getAreaListNoPaging({ filters: { parentCode: '100000', level: 1 }})
        .then(data => {
          this.provinceList = data.data
        })

      this.$oms.$api.common
        .getAreaListNoPaging({ filters: { parentCode: '310000', level: 2 }})
        .then(data => {
          this.cityList = data.data
        })

      this.$oms.$api.common
        .getAreaListNoPaging({ filters: { parentCode: '310100', level: 3 }})
        .then(data => {
          this.areaList = data.data
        })
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
        item.deliveringNum = item.undeliveredNum
        if (item.doInfo.status === 9000) {
          item.deliveredNum = 0
        }
        if (item.extInfoStr == null) {
          item.extInfoStr = '无'
        }
        if (item.artNo == null) {
          item.artNo = '无'
        }
        if (item.barCode == null) {
          item.barCode = '无'
        }
        item.isDisabled = true
      })
      vue.transOrderItemList = res.data
      vue.page.total = res.total
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
