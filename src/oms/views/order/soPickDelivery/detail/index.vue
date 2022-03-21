<template>
  <section class="pg-soPickDeliveryDetail-list">
    <el-form v-loading="pageLoading" ref="soPickDeliveryDetailForm" :model="soPickData" :rules="soPickDeliveryDetailFormRules" label-width="240px">
      <el-card shadow="never">
        <div style="margin-bottom: 10px">
          <ody-button
            v-if="soPickData.deliverStatus != '5030'"
            name="OmsSoPickDelivery_Confirm0"
            code="OmsSoPickDelivery_Confirm"
            size="small"
            @click="deliverConfirm"
          >{{ $t('deliver1') }}</ody-button>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('order_code')">
              <div>
                {{ soPickData.orderCode }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('order_status')">
              <div>
                {{ soPickData.orderStatusStr }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('orderCreateTime')">
              <div>
                {{ soPickData.orderCreateTime }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('outOrderCode')">
              <div>
                {{ soPickData.outOrderCode }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('do_merchant_name')">
              <div>
                {{ soPickData.merchantName }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('do_store_name')">
              <div>
                {{ soPickData.storeName }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('manual_order_order_syssource')">
              <div>
                {{ soPickData.sysSourceStr }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('so_error_create_username')">
              <div>
                {{ soPickData.userName }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('so_pick_delivery_merchant')">
              <div>
                {{ soPickData.deliveryCompanyName }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('so_pick_picker')">
              <div>
                {{ soPickData.pickUserName }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('so_pick_pick_date')">
              <div>
                {{ soPickData.pickDate }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('so_pick_pick_status')">
              <div>
                {{ soPickData.pickStatusStr }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('so_pick_complete_date')">
              <div>
                {{ soPickData.pickCompleteDate }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('so_pick_arrival_time')">
              <div>
                {{ soPickData.estimatedTimeOfArrival }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('do_good_receiver_name')">
              <el-input v-model="soPickData.goodReceiverName" name="soPickData_goodReceiverName" placeholder="" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('do_good_receiver_mobile')">
              <el-input v-model="soPickData.goodReceiverMobile" name="soPickData_goodReceiverMobile" placeholder="" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('common_zipcode')">
              <el-input v-model="soPickData.goodReceiverPostcode" name="soPickData_goodReceiverPostcode" placeholder="" maxlength="10" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('so_pick_deliver_status')">
              <label>
                {{ soPickData.deliverStatusStr }}
              </label>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item :label="$t('do_good_receiver_address')">
              <el-row>
                <el-col :span="6">
                  <el-select id="s_province" v-model="soPickData.goodReceiverProvinceCode" name="s_province" @change="queryAera(soPickData.goodReceiverProvinceCode, 2)" >
                    <el-option :label="$t('please_choose')" />
                    <el-option v-for="item in province_list" :label="item.name" :key="item.code" :value="item.code" />
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select id="s_city" v-model="soPickData.goodReceiverCityCode" :disabled="!soPickData.goodReceiverProvinceCode" name="s_city" @change="queryAera(soPickData.goodReceiverCityCode, 3)" >
                    <el-option :label="$t('please_choose')" />
                    <el-option v-for="item in city_list" :label="item.name" :key="item.code" :value="item.code" />
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select id="s_area" v-model="soPickData.goodReceiverAreaCode" :disabled="!soPickData.goodReceiverCityCode" name="s_area" >
                    <el-option :label="$t('please_choose')" />
                    <el-option v-for="item in area_list" :label="item.name" :key="item.code" :value="item.code" />
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="soPickData.goodReceiverAddress" name="soPickData_goodReceiverAddress" placeholder="" maxlength="300" />
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <ody-list-table-area>
        <div slot="table">
          <el-table :loading="loading" :data="list" name="list932">
            <el-table-column
              :label="$t('do_line_no')"
              prop="index"
              align="center"
              min-width="80"
            />
            <el-table-column
              :label="$t('do_product_name')"
              prop="productCname"
              align="center"
              min-width="100"
            />
            <el-table-column
              :label="$t('do_product_code')"
              prop="code"
              align="center"
              min-width="100"
            />
            <el-table-column
              :label="$t('manual_order_product_attr')"
              prop="extInfoStr"
              align="center"
              min-width="100"
            />
            <el-table-column
              :label="$t('do_bar_code')"
              prop="barCode"
              align="center"
              min-width="100"
            />
            <el-table-column
              :label="$t('do_art_no')"
              prop="artNo"
              align="center"
              min-width="100"
            />
            <el-table-column
              :label="$t('do_product_item_num')"
              prop="productItemNum"
              align="center"
              min-width="100"
            />
            <el-table-column
              :label="$t('do_unit')"
              prop="unit"
              align="center"
              min-width="100"
            />
            <!-- 已发货数量 -->
            <el-table-column
              :label="$t('do_delivered_num')"
              prop="productItemOutNum"
              align="center"
              min-width="100"
            />
            <!-- 未发货数量 -->
            <el-table-column
              :label="$t('do_undelivered_num')"
              prop="unOutNum"
              align="center"
              min-width="100"
            />
            <!-- 本次发货数量 -->
            <!--<el-table-column
              :label="$t('do_delivering_num')"
              prop="deliveryNum"
              align="center"
              min-width="150">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.deliveryNum"
                  :value="scope.row.deliveryNum"
                  :disabled="scope.row.unOutNum === 0"
                  name="scope_row_deliveryNum"
                  type="number"
                  @input="deliveryNumChange(scope.row)"
                />
              </template>
            </el-table-column>-->
            <el-table-column
              :label="$t('do_warehouse')"
              prop="warehouseName"
              align="center"
              min-width="100"
            />
          </el-table>
        </div>
      </ody-list-table-area>
      <!--<el-card>
        <section>
          <el-row>
            <el-col :span="20">
              &lt;!&ndash;<el-form-item :label="$t('so_pick_total_num')">
                <label>
                  {{ soPickData.totalNum }}
                </label>
              </el-form-item>
              <el-form-item :label="$t('so_pick_gross_weight')">
                <label>
                  {{ soPickData.totalWeight }}kg
                </label>
              </el-form-item>&ndash;&gt;
              <el-form-item :label="$t('manual_order_delivery_type')">
                <el-radio-group v-model="deliveryMode" name="deliveryMode">
                  <el-radio :label="1" class="label">{{ $t('express_logistics') }}</el-radio>
                  <el-radio :label="2" class="label">{{ $t('配送员直送') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="deliveryMode === 1" :label="$t('so_pick_delivery_merchant')">
                <el-select v-model="soPickData.deliveryCompanyId" name="soPickData_deliveryCompanyId">
                  <el-option :label="$t('please_choose')" />
                  <el-option v-for="item in merchantExpressConfigs" :label="item.deliveryCompanyName" :key="item.deliveryCompanyId" :value="item.deliveryCompanyId" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="deliveryMode === 1" :label="$t('orderInvoiceInfo_logistics_no')">
                <el-input v-model="soPickData.deliveryExpressNbr" name="soPickData_deliveryExpressNbr" placeholder="" maxlength="20"/>
              </el-form-item>
              <el-form-item v-if="deliveryMode === 2" :label="$t('distributor')">
                <el-select v-model="salesmanId" name="salesmanId">
                  <el-option :label="$t('please_choose')" />
                  <el-option v-for="item in salesmans" :label="item.name" :key="item.id" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </section>
      </el-card>-->
    </el-form>
    <!--<ody-fixed>
      <ody-button :disabled="submiting" name="OmsSoPickDelivery_Confirm_handleSubmit" code="OmsSoPickDelivery_Confirm" size="small" type="primary" @click="handleSubmit">{{ $t('soPickDeliver') }}</ody-button>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('common_back') }}</el-button>
    </ody-fixed>-->
    <!-- 发货确认 -->
    <ody-dialog :visible.sync="dialogTableVisible" class="detail-index-none-shadow" width="960px">
      <ody-list-table-area class="clear-padding">
        <div slot="table">
          <el-table :data="list" name="list099" style="width: 100%">
            <el-table-column
              :label="$t('do_product_name')"
              prop="productCname"
              align="center"
              min-width="100"
            />
            <el-table-column
              :label="$t('do_product_code')"
              prop="code"
              align="center"
              min-width="100"
            />
            <el-table-column
              :label="$t('do_bar_code')"
              prop="barCode"
              align="center"
              min-width="100"
            />
            <el-table-column
              :label="$t('manual_order_product_attr')"
              prop="extInfoStr"
              align="center"
              min-width="100"
            />
            <el-table-column
              :label="$t('待发货数量')"
              prop="unOutNum"
              align="center"
              min-width="100"
            />
            <el-table-column
              :label="$t('发货数量')"
              prop="deliveryNum"
              align="center"
              min-width="150">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.deliveryNum"
                  :value="scope.row.deliveryNum"
                  :disabled="scope.row.unOutNum === 0"
                  name="scope_row_deliveryNum"
                  type="number"
                  @input="deliveryNumChange(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </ody-list-table-area>
      <span slot="footer">
        <!--<el-button name="doDelivery" type="primary" size="small" @click="doDelivery">发货</el-button>-->
        <ody-button name="OmsSoPickDelivery_Confirm_handleSubmit" code="OmsSoPickDelivery_Confirm" size="small" type="primary" @click="doDelivery">{{ $t('soPickDeliver') }}</ody-button>
      </span>
    </ody-dialog>
    <!-- 发货物流 -->
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
            <el-select v-model="soPickData.deliveryCompanyId" name="soPickData_deliveryCompanyId">
              <el-option :label="$t('please_choose')" />
              <el-option v-for="item in merchantExpressConfigs" :label="item.deliveryCompanyName" :key="item.deliveryCompanyId" :value="item.deliveryCompanyId" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="deliveryMode === 1" :label="$t('orderInvoiceInfo_logistics_no')" required="true">
            <el-input v-model="soPickData.deliveryExpressNbr" name="soPickData_deliveryExpressNbr" placeholder="" maxlength="50"/>
          </el-form-item>
          <el-form-item v-if="deliveryMode === 2" :label="$t('distributor')" required="true">
            <el-select v-model="salesmanId" name="salesmanId">
              <el-option :label="$t('please_choose')" />
              <el-option v-for="item in salesmans" :label="item.name" :key="item.id" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div align="center">
          <el-button name="dialogTableDialogVisible" size="small" @click="dialogTableDialogVisible = false">{{ '取消' }}</el-button>
          <el-button
            name="submitForm"
            size="small"
            type="primary"
            @click="handleSubmit"
          >{{ '确认' }}</el-button>
        </div>
      </el-card>
    </ody-dialog>
  </section>
</template>
<script>

export default {
  name: 'OmsSoPickDeliveryDetail',
  data() {
    return {
      dialogTableVisible: false,
      dialogTableDialogVisible: false,
      soPickData: {},
      deliveryMode: 1,
      salesmanId: null,
      salesmans: [],
      merchantExpressConfigs: [],
      province_list: [],
      city_list: [],
      area_list: [],
      pageLoading: false,
      loading: false,
      submiting: false,
      list: [],
      soPickDeliveryDetailFormRules: {
        deliveryCompanyId: [
          { required: true, message: this.$t('请选择配送商'), trigger: 'blur' },
          { required: true, message: this.$t('请选择配送商'), trigger: 'change' }
        ],
        deliveryExpressNbr: [
          { required: true, message: this.$t('请填写物流单号'), trigger: 'blur' },
          { required: true, message: this.$t('请填写物流单号'), trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async queryAera(code, level) {
      const filtersForAera = {
        parentCode: code,
        level: level
      }
      const res = await this.$oms.$api.common.getAreaListNoPaging({ filters: filtersForAera })
      if (level === 1) {
        if (code) {
          this.province_list = res.data
        } else {
          this.province_list = []
          this.city_list = []
          this.area_list = []
        }
      }
      if (level === 2) {
        this.soPickData.goodReceiverCityCode = null
        this.soPickData.goodReceiverAreaCode = null
        if (code) {
          this.city_list = res.data
        } else {
          this.city_list = []
          this.area_list = []
        }
      }
      if (level === 3) {
        this.soPickData.goodReceiverAreaCode = null
        if (code) {
          this.area_list = res.data
        } else {
          this.area_list = []
        }
      }
    },
    async _getDetail() {
      this.pageLoading = true
      const id = this.$route.query.id
      const orderCode = this.$route.query.orderCode
      const params = {}
      if (id) {
        params.id = id
      }
      if (orderCode) {
        params.orderCode = orderCode
      }

      const res = await this.$oms.$api.soPick.soPickDetailGet(params)
      if (res && res.data) {
        this.pageLoading = false
        this.soPickData = res.data
        const goodReceiverProvinceCode = this.soPickData.goodReceiverProvinceCode
        const goodReceiverCityCode = this.soPickData.goodReceiverCityCode
        const goodReceiverAreaCode = this.soPickData.goodReceiverAreaCode
        if (goodReceiverProvinceCode) {
          this.soPickData.goodReceiverProvinceCode = Number(goodReceiverProvinceCode)
          await this.queryAera(this.soPickData.goodReceiverProvinceCode, 2)
        }
        if (goodReceiverCityCode) {
          this.soPickData.goodReceiverCityCode = Number(goodReceiverCityCode)
          await this.queryAera(this.soPickData.goodReceiverCityCode, 3)
        }
        if (goodReceiverAreaCode) {
          this.soPickData.goodReceiverAreaCode = Number(goodReceiverAreaCode)
        }

        const list = this.soPickData.soItemList
        if (list) {
          let index = 0
          list.forEach((item) => {
            index = index + 1
            item.index = index
            item.productItemOutNum = item.productItemOutNum ? item.productItemOutNum : 0
            item.unOutNum = item.unDoNum
            item.deliveryNum = item.unOutNum
          })
        }
        this.list = list
      } else {
        this.$message.error(this.$t('加载失败，请重试'))
        this.pageLoading = false
      }
    },
    async _initMerchantExpressConfig() {
      const vue = this
      const res = await this.$oms.$api.merchantExpressConfig.merchantExpressConfigListForSelect({ filters: { isAvailable: 1 }})
      if (res) {
        this.merchantExpressConfigs = res.data.filter(i => i.merchantId === vue.soPickData.merchantId)
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
    deliverConfirm() {
      this.dialogTableVisible = true
    },
    doDelivery() {
      let canDelivery = false
      for (const i in this.list) {
        const item = this.list[i]
        if (item.deliveryNum == null) {
          item.deliveryNum = item.unOutNum
        }
        if (item.unOutNum > 0 && item.deliveryNum > 0) {
          canDelivery = true
          break
        }
      }
      if (!canDelivery) {
        this.$message('发货数量必须大于0')
        return
      }
      this.dialogTableDialogVisible = true
    },
    handleSubmit() { // 确认发货
      const vue = this
      vue.$refs['soPickDeliveryDetailForm'].validate((valid) => {
        if (valid) {
          this.submiting = true
          const reg = /^[0-9a-zA-Z]*$/
          if (this.soPickData.deliveryExpressNbr && !reg.test(this.soPickData.deliveryExpressNbr)) {
            this.$message({
              type: 'waring',
              message: this.$t('delivery_express_number_must_be_pure_number')
            })
            this.submiting = false
            return
          }

          var param = {}
          param.orderCode = this.soPickData.orderCode
          param.id = this.soPickData.id
          param.goodReceiverName = this.soPickData.goodReceiverName
          param.goodReceiverMobile = this.soPickData.goodReceiverMobile
          param.goodReceiverPostcode = this.soPickData.goodReceiverPostcode
          param.goodReceiverProvinceCode = this.soPickData.goodReceiverProvinceCode
          param.goodReceiverCityCode = this.soPickData.goodReceiverCityCode
          param.goodReceiverAreaCode = this.soPickData.goodReceiverAreaCode
          param.goodReceiverAddress = this.soPickData.goodReceiverAddress
          param.deliveryMode = this.deliveryMode
          if (param.deliveryMode === null) {
            this.$message({ type: 'waring', message: this.$t('请选择配送类型') })
            this.submiting = false
            return
          }
          let salesman = {}
          if (param.deliveryMode === 2) {
            for (const i in this.salesmans) {
              if (this.salesmans[i].id === this.salesmanId) {
                salesman = this.salesmans[i]
                break
              }
            }
          }
          if (this.deliveryMode === 1) {
            // 快递物流
            param.deliveryCompanyId = this.soPickData.deliveryCompanyId
            param.deliveryExpressNbr = this.soPickData.deliveryExpressNbr
            if (!param.deliveryCompanyId || !param.deliveryExpressNbr) {
              this.$message({ type: 'waring', message: this.$t('物流信息不能为空') })
              this.submiting = false
              return
            }
            param.deliverName = null
            param.deliverMobile = null
            if (param.deliveryCompanyId) {
              this.merchantExpressConfigs.forEach(item => {
                if (item.deliveryCompanyId === vue.soPickData.deliveryCompanyId) {
                  param.deliveryCompanyName = item.deliveryCompanyName
                }
              })
            }
          } else if (this.deliveryMode === 2) {
            // 配送员直送
            param.deliverName = salesman.name
            param.deliverMobile = salesman.mobile
            param.deliveryCompanyId = null
            param.deliveryExpressNbr = null
            param.deliveryCompanyName = null
            if (!param.deliverName || !param.deliverMobile) {
              this.$message({ type: 'waring', message: this.$t('请选择配送员') })
              this.submiting = false
              return
            }
          }
          // 省市区 名称
          param.goodReceiverProvince = getNameByList(this.soPickData.goodReceiverProvinceCode, this.province_list)
          param.goodReceiverCity = getNameByList(this.soPickData.goodReceiverCityCode, this.city_list)
          param.goodReceiverArea = getNameByList(this.soPickData.goodReceiverAreaCode, this.area_list)

          param.itemVOList = []
          this.list.filter(o => o.deliveryNum > 0).forEach(o => {
            param.itemVOList.push({ id: o.id, deliveryNum: o.deliveryNum })
          })
          if (this.list.filter(o => o.unOutNum > 0).length > 0 && param.itemVOList.length === 0) {
            this.$message({ type: 'waring', message: this.$t('deliveryNumberZero') })
            this.submiting = false
            return
          }

          this.$confirm(this.$t('so_pick_confirm_send'), this.$t('common_tip'), {
            confirmButtonText: this.$t('ok'),
            cancelButtonText: this.$t('cancel'),
            type: 'info'
          }).then(() => {
            vue.$oms.$api.soPick.soPickConfirmSend(param).then((res) => {
              if (res.code === '0') {
                vue.$message({
                  type: 'success',
                  message: this.$t('so_pick_send_success')
                })
                // vue.returnBack()
                vue.dialogTableVisible = false
                vue.dialogTableDialogVisible = false
                vue.init()
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
          }).catch(() => {
            vue.submiting = false
          })
        }
      })
    },
    deliveryNumChange(row) {
      const value = row.deliveryNum
      if (value > row.unOutNum) {
        row.deliveryNum = row.unOutNum
      } else if (value < 0) {
        row.deliveryNum = 0
      }
    },
    returnBack() {
      this.$portal.delActiveView()
    },
    async init() {
      await this._getDetail()
      this._initMerchantExpressConfig()
      this.queryAera('100000', 1)
      await this.loadSalesmans(this.soPickData.storeId, this.soPickData.merchantId)
      for (const i in this.list) {
        const item = this.list[i]
        if (item.deliveryNum == null) {
          item.deliveryNum = item.unOutNum
        }
        if (item.unOutNum > 0) {
          this.dialogTableVisible = true
          break
        }
      }
    }
  }
}
function getNameByList(value, list) {
  var tag = ''
  if (!value || !list) {
    return tag
  }
  list.forEach(function(item) {
    if (item.code === value) {
      tag = item.name
      return tag
    }
  })
  return tag
}
</script>

<style lang="scss" scoped>

</style>
