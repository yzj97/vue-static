<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t(''+ modalType)"
      width="600px"
      @open="init" >
      <section class="pg-expressConfigSet-list">
        <el-form ref="ruleForm2" :model="ruleForm2" :rules="rules2" label-width="120px">
          <el-form-item align="center">
            <el-radio v-model="ruleForm2.type" :label="1" name="ruleForm2_type" @change="chooseConfigSet(1)">{{ $t('merchantExpressConfig_systemExpressCompany') }}</el-radio>
            <el-radio v-model="ruleForm2.type" :label="2" name="ruleForm2_type3" @change="chooseConfigSet(2)">{{ $t('merchantExpressConfig_userExpressCompany') }}</el-radio>
          </el-form-item>
          <el-form-item :label="$t('do_merchant_name')" prop="merchantId"> <!-- 销售商家 -->
            <el-select v-model="ruleForm2.merchantId" :disabled="!!ruleForm2.id" name="ruleForm2_merchantId" popper-class="ruleForm2_merchantId-select">
              <el-option v-for="item in merchantList" :label="item.merchantName" :key="item.merchantId" :value="item.merchantId" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('merchantExpressConfig_deliveryCompanyName')" prop="deliveryCompanyName">
            <el-input v-show="showCustomConfig" v-model="ruleForm2.deliveryCompanyName" name="ruleForm2_deliveryCompanyName" type="text"/>
            <el-select v-show="!showCustomConfig" :popper-append-to-body="false" v-model="ruleForm2.deliveryCompanyName" :placeholder="$t('请选择')" name="ruleForm2_deliveryCompanyName8" popper-class="limitHeight" @change="chooseCompanyName">
              <el-option
                v-for="item in defaultExpressConfigList"
                :key="item.code"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('merchantExpressConfig_deliveryCompanyId')" prop="deliveryCompanyId">
            <el-input v-model="ruleForm2.deliveryCompanyId" :disabled="!showCustomConfig" name="ruleForm2_deliveryCompanyId" type="text"/>
          </el-form-item>

          <el-form-item :label="$t('merchantExpressConfig_phone')" prop="phone">
            <el-input v-model="ruleForm2.phone" name="ruleForm2_phone" type="text" />
          </el-form-item>
          <el-form-item :label="$t('isDisable')" prop="status">
            <el-radio-group v-model="ruleForm2.isAvailable" name="ruleForm2_isAvailable">
              <el-radio v-for="item in isDisableList" :key="item.code" :label="item.code" :value="item.code">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <ody-button :disabled="submiting" name="OmsMerchantExpressConfig_Save_handleOk" code="OmsMerchantExpressConfig_Save" type="primary" @click="handleOk('ruleForm2')">{{ $t('common_save') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectedItem: {
      type: Object,
      default: null
    },
    type: {
      type: Number,
      default: null
    },
    typeName: {
      type: String,
      default: ''
    },
    modalType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      // const pattern = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$|^0\d{2,3}-?\d{7,8}$/
      const pattern = /^1[0-9]{10}$/
      if (!pattern.test(value) && value !== '') {
        return callback(new Error(this.$t('invalid_telephone_tip')))
      } else {
        return callback()
      }
    }
    return {
      ruleForm2: {
        deliveryCompanyName: '',
        deliveryCompanyId: '',
        phone: '',
        isAvailable: '1',
        type: 2,
        merchantId: null
      },
      rules2: {
        deliveryCompanyName: [
          { required: true, message: this.$t('请输入公司名称'), trigger: 'blur' }
        ],
        deliveryCompanyId: [
          { required: true, message: this.$t('请输入公司编号'), trigger: 'blur' }
        ],
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        merchantId: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ]
      },
      isDisableList: [],
      defaultExpressConfigList: [],
      showCustomConfig: true,
      isAvailable: '1',
      merchantList: []
    }
  },
  async mounted() {
    try {
      await this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async init() {
      this.ruleForm2 = {
        deliveryCompanyName: '',
        deliveryCompanyId: '',
        phone: '',
        isAvailable: '1',
        type: 2,
        merchantId: null
      }
      if (this.selectedItem && this.selectedItem.id) {
        this.ruleForm2 = Object.assign(this.ruleForm2, this.selectedItem)
        this.ruleForm2.isAvailable = this.selectedItem.isAvailable + ''
      }
      this.initVariable(this)
      this._initMerchants()
    },
    initVariable(vue) {
      const params = { 'categorys': ['EXPRESS_CONFIG', 'IS_AVLIABLE'] }
      const listWithCategorys = vue.$oms.$api.common
      listWithCategorys.listByCategorysForOrder(params).then(function(data) {
        vue.codes = data.data
        vue.isDisableList = vue.codes.IS_AVLIABLE
        if (vue.codes.EXPRESS_CONFIG) {
          vue.defaultExpressConfigList = vue.codes.EXPRESS_CONFIG
        }
        if (vue.codes.IS_AVLIABLE) {
          vue.isAvailableMap = vue.codes.IS_AVLIABLE.reduce((m, i) => { m[i['code']] = i['name']; return m }, {})
        }
      })
    },
    async handleOk(formName) {
      const vue = this
      const valid = await this.$refs[formName].validate()
      if (valid) {
        vue.submiting = true
        let promise = vue.$oms.$api.merchantExpressConfig.merchantExpressConfigUpdate
        if (vue.modalType === 'add') {
          promise = vue.$oms.$api.merchantExpressConfig.merchantExpressConfigAdd
        }
        const form = Object.assign({}, vue.ruleForm2)
        return promise(form).then((res) => {
          vue.$message({
            type: 'success',
            message: this.$t('common_save_success')
          })
          vue.$emit('update:visible', !this.visible)
          this.$refs[formName].resetFields()
          vue.$emit('ok')
        }).finally(() => {
          vue.submiting = false
        })
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.$refs['ruleForm2'].resetFields()
    },
    chooseConfigSet(num) {
      this.ruleForm2.deliveryCompanyName = ''
      this.ruleForm2.phone = ''
      this.ruleForm2.deliveryCompanyId = ''
      if (num === 2) {
        this.showCustomConfig = true
      } else {
        this.showCustomConfig = false
      }
      // this.$refs['ruleForm2'].resetFields()
    },
    chooseCompanyName(code) {
      const vue = this
      vue.ruleForm2.deliveryCompanyId = code
      let obj = {}
      obj = vue.defaultExpressConfigList.find(function(i) {
        return i.code === code
      })
      vue.ruleForm2.deliveryCompanyName = obj.name
    },
    _initMerchants() { // 初始化商家
      const vue = this
      this.$oms.$api.common.merchantList({ 'currentPage': 1, 'itemsPerPage': 1000 }).then((data) => {
        vue.merchantList = data.data.listObj || []
        if (vue.merchantList.length === 1) {
          vue.ruleForm2.merchantId = vue.merchantList[0].merchantId
        }
      })
    }
  }
}
</script>

<style lang="scss" >
.ruleForm2_merchantId-select{
  max-height: 300px !important;
  .el-scrollbar{
    height: 280px !important;
  }
}

</style>
<style scoped lang="scss">
  /deep/ .limitHeight{
    position: absolute !important;
    top:32px !important;
    left:0px !important;
    max-height: 150px;
    .el-scrollbar{
      max-height: 145px !important;
    }
  }
</style>
