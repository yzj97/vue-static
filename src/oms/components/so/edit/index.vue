<template>
  <div>
    <el-button name="showDialog" size="mini" type="primary" @click="showDialog">{{ $t('编辑订单') }}</el-button>
    <ody-dialog-full-right
      :visible.sync="show"
      :title="$t('编辑订单')"
      size="medium">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-row style="margin-left: 100px">
            <el-col v-for="item in labels" :span="4" :key="item.code">
              <el-checkbox v-model="item.checked" name="item_checked" >{{ $t(item.name) }}</el-checkbox>
            </el-col>
          </el-row>
          <el-divider/>
          <el-row>
            <el-form ref="form" :rules="rules" :model="form" label-width="110px" label-position="right" class="good-form">
              <el-form-item :label="$t('manual_order_receiver_name')+'：'" prop="goodReceiverName"><!--收货人姓名-->
                <el-input v-model="form.goodReceiverName" name="form_goodReceiverName" maxlength="50"/>
              </el-form-item>
              <el-form-item :label="$t('deliveryMobile')+'：'" prop="goodReceiverMobile"><!--收货人手机-->
                <el-input v-model="form.goodReceiverMobile" name="form_goodReceiverMobile"/>
              </el-form-item>
              <el-form-item :label="$t('goodReceiverAddress')+'：'" prop="goodReceiverAreaCode"><!--收货人地址-->
                <el-row>
                  <el-col :span="7">
                    <el-select v-model="form.goodReceiverProvinceCode" :placeholder="$t('请选择')" name="form_goodReceiverProvinceCode" @change="provinceCodeChange(true)">
                      <el-option
                        v-for="one in provinceCode"
                        :key="one.code"
                        :label="one.name"
                        :value="one.code"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="7" :offset="1">
                    <el-select v-model="form.goodReceiverCityCode" :placeholder="$t('请选择')" name="form_goodReceiverCityCode" @change="cityCodeChange(true)">
                      <el-option
                        v-for="one in cityCode"
                        :key="one.code"
                        :label="one.name"
                        :value="one.code"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="8" :offset="1">
                    <el-select v-model="form.goodReceiverAreaCode" :placeholder="$t('请选择')" name="form_goodReceiverAreaCode">
                      <el-option
                        v-for="one in areaCode"
                        :key="one.code"
                        :label="one.name"
                        :value="one.code"
                      />
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item :label="$t('详细地址')+'：'" prop="goodReceiverAddress">
                <el-input v-model="form.goodReceiverAddress" name="form_goodReceiverAddress" type="textarea" maxlength="400"/>
              </el-form-item>
              <el-form-item :label="$t('manual_order_customer_remark')+'：'" prop="orderRemarkUser"><!--买家备注-->
                <el-input v-model="form.orderRemarkUser" name="form_orderRemarkUser" type="textarea" maxlength="100"/>
              </el-form-item>
              <el-form-item :label="$t('sellers_notes')+'：'" prop="orderRemarkMerchant"><!--卖家备注-->
                <el-input v-model="form.orderRemarkMerchant" name="form_orderRemarkMerchant" type="textarea" maxlength="100"/>
              </el-form-item>
            </el-form>
          </el-row>
        </el-col>
      </el-row>
      <el-row slot="footer">
        <el-button name="cancel" @click="cancel">{{ $t('取消') }}</el-button>
        <el-button name="commit" type="primary" @click="commit">{{ $t('保存') }}</el-button>
      </el-row>
    </ody-dialog-full-right>
  </div>
</template>

<script>
export default {
  props: {
    soDetail: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      provinceCode: [],
      cityCode: [],
      areaCode: [],
      form: {
        goodReceiverName: null,
        goodReceiverMobile: null,
        goodReceiverAddress: null,
        orderRemarkUser: null,
        orderRemarkMerchant: null,
        oldOrderRemarkUser: null,
        oldOrderRemarkMerchant: null,
        goodReceiverProvinceCode: null,
        goodReceiverCityCode: null,
        goodReceiverAreaCode: null
      },
      rules: {
        goodReceiverName: [
          { required: true, message: this.$t('请输入收货人姓名'), trigger: 'change' }
        ],
        goodReceiverAddress: [
          { required: true, message: this.$t('请输入详细地址'), trigger: 'change' }
        ],
        goodReceiverMobile: [
          { required: true, message: this.$t('请输入收货人手机号'), trigger: 'change' },
          { pattern: /^1[0-9]{10}$/, message: this.$t('请输入正确的手机号'), trigger: 'change' }
        ],
        goodReceiverAreaCode: [
          { required: true, message: this.$t('请选择收货人地址'), trigger: 'change' }
        ]
      },
      show: false,
      labels: [{ checked: false }],
      oldLabels: [{ checked: false }]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    eventQueryOrderRemark() {
      this.$emit('queryOrderRemark')
    },
    init() {
      const self = this
      this.form.goodReceiverName = this.soDetail.goodReceiverName
      this.form.goodReceiverMobile = this.soDetail.goodReceiverMobile
      this.form.goodReceiverProvinceCode = parseInt(this.soDetail.goodReceiverProvinceCode)
      this.form.goodReceiverCityCode = parseInt(this.soDetail.goodReceiverCityCode)
      this.form.goodReceiverAreaCode = parseInt(this.soDetail.goodReceiverAreaCode)
      this.form.goodReceiverAddress = this.soDetail.goodReceiverAddress

      this.$oms.$api.common.getAreaListNoPaging({ filters: { parentCode: 100000 }}).then(res => {
        self.provinceCode = res.data
      })
      this.provinceCodeChange()
      this.cityCodeChange()
      this.$oms.$api.so.soAnnexAndRemarksGet({ orderCode: this.soDetail.orderCode }).then(res => {
        if (res.data.orderRemarkMerchant) {
          self.form.orderRemarkMerchant = res.data.orderRemarkMerchant
          self.form.oldOrderRemarkMerchant = res.data.orderRemarkMerchant
        }
        if (res.data.orderRemarkUser) {
          self.form.orderRemarkUser = res.data.orderRemarkUser
          self.form.oldOrderRemarkUser = res.data.orderRemarkUser
        }
      })
      this.$oms.$api.common.listByCategorysForOrder({ categorys: ['ORDER_LABLE'] }).then(res => {
        self.labels = []
        self.oldLabels = []
        res.data.ORDER_LABLE.forEach(l => {
          if (self.soDetail.orderLabel) {
            self.labels.push({
              code: l.code,
              checked: self.soDetail.orderLabel.indexOf(l.code) >= 0,
              name: l.name
            })
            self.oldLabels.push({
              code: l.code,
              checked: self.soDetail.orderLabel.indexOf(l.code) >= 0,
              name: l.name
            })
          } else {
            self.labels.push({
              code: l.code,
              checked: false,
              name: l.name
            })
            self.oldLabels.push({
              code: l.code,
              checked: false,
              name: l.name
            })
          }
        })
      })
    },
    provinceCodeChange(clear) {
      const self = this
      this.$oms.$api.common.getAreaListNoPaging({ filters: { parentCode: this.form.goodReceiverProvinceCode }}).then(res => {
        self.cityCode = res.data
      })
      if (clear) {
        this.form.goodReceiverCityCode = null
        this.form.goodReceiverAreaCode = null
      }
    },
    cityCodeChange(clear) {
      const self = this
      this.$oms.$api.common.getAreaListNoPaging({ filters: { parentCode: this.form.goodReceiverCityCode }}).then(res => {
        self.areaCode = res.data
      })
      if (clear) {
        this.form.goodReceiverAreaCode = null
      }
    },
    commit() {
      const self = this
      let orderLabel = ''
      let oldOrderLabel = ''
      this.labels.forEach(l => {
        if (l.checked) {
          orderLabel += l.code
          orderLabel += ','
        }
      })
      this.oldLabels.forEach(l => {
        if (l.checked) {
          oldOrderLabel += l.code
          oldOrderLabel += ','
        }
      })
      orderLabel = orderLabel.substr(0, orderLabel.length - 1)
      oldOrderLabel = oldOrderLabel.substr(0, oldOrderLabel.length - 1)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log(self.form.orderRemarkMerchant)
          const param = {
            orderCode: self.soDetail.orderCode,
            id: self.soDetail.id,
            goodReceiverName: self.form.goodReceiverName,
            goodReceiverMobile: self.form.goodReceiverMobile,
            goodReceiverProvinceCode: self.form.goodReceiverProvinceCode,
            goodReceiverCityCode: self.form.goodReceiverCityCode,
            goodReceiverAreaCode: self.form.goodReceiverAreaCode,
            goodReceiverAddress: self.form.goodReceiverAddress
          }
          const oldParam = {
            orderCode: self.soDetail.orderCode,
            id: self.soDetail.id,
            goodReceiverName: self.soDetail.goodReceiverName,
            goodReceiverMobile: self.soDetail.goodReceiverMobile,
            goodReceiverProvinceCode: parseInt(self.soDetail.goodReceiverProvinceCode),
            goodReceiverCityCode: parseInt(self.soDetail.goodReceiverCityCode),
            goodReceiverAreaCode: parseInt(self.soDetail.goodReceiverAreaCode),
            goodReceiverAddress: self.soDetail.goodReceiverAddress
          }
          this.provinceCode.forEach(i => {
            if (i.code === param.goodReceiverProvinceCode) {
              param.goodReceiverProvince = i.name
            }
            if (i.code === oldParam.goodReceiverProvinceCode) {
              oldParam.goodReceiverProvince = i.name
            }
          })
          this.cityCode.forEach(i => {
            if (i.code === param.goodReceiverCityCode) {
              param.goodReceiverCity = i.name
            }
            if (i.code === oldParam.goodReceiverCityCode) {
              oldParam.goodReceiverCity = i.name
            }
          })
          this.areaCode.forEach(i => {
            if (i.code === param.goodReceiverAreaCode) {
              param.goodReceiverArea = i.name
            }
            if (i.code === oldParam.goodReceiverAreaCode) {
              oldParam.goodReceiverArea = i.name
            }
          })
          if (JSON.stringify(param) !== JSON.stringify(oldParam)) {
            // 字段没有更新，则不传给后端
            if (param.goodReceiverName === oldParam.goodReceiverName) {
              delete param.goodReceiverName
            }
            if (param.goodReceiverMobile === oldParam.goodReceiverMobile) {
              delete param.goodReceiverMobile
            }
            if (param.goodReceiverAddress === oldParam.goodReceiverAddress) {
              delete param.goodReceiverAddress
            }
            self.$oms.$api.so.soUpdate(param)
          }
          if (oldOrderLabel !== orderLabel) {
            self.$oms.$api.so.updateLabel({ orderLabel: orderLabel, id: this.soDetail.id })
          }
          if ((self.form.orderRemarkMerchant !== self.form.oldOrderRemarkMerchant || self.form.orderRemarkUser !== self.form.oldOrderRemarkUser)) {
            self.$oms.$api.so.soAnnexAndRemarksUpdate({
              orderRemarkMerchant: self.form.orderRemarkMerchant,
              orderRemarkUser: self.form.orderRemarkUser,
              orderCode: self.soDetail.orderCode
            })
          }
          self.$message({
            message: self.$t('提交成功'),
            type: 'success'
          })
          self.onSuccess()
          self.cancel()
          self.queryOrderRemark()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showDialog() {
      this.init()
      this.show = true
    },
    cancel() {
      this.$refs['form'].resetFields()
      this.show = false
    },
    onSuccess() {
      this.$emit('onSuccess')
    },
    queryOrderRemark() {
      this.eventQueryOrderRemark()
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/ .good-form{
    .el-form-item.is-success{
      .el-input__inner, .el-textarea__inner{
        border-color: #409EFF;
      }
    }
  }
</style>
