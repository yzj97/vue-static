<template>
  <section>
    <h3>{{ $t('申请设置') }}</h3>
    <el-form ref="form" :model="formData" :rules="rules" :inline="true">
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            <el-popover placement="bottom">
              <div>
                <div>{{ $t('注册：用户注册即可成为分销员。') }}</div>
                <span>{{ $t('购买指定商品：购买指定任一商品，仅支持选择分销商品。订单已支付') }}</span>
                <br >
                <span>{{ $t('消费金额累积：累积订单实付金额。订单已完成计入。') }}</span>
                <br >
                <span>{{ $t('满足以上任一条件即可成为分销员。') }}</span>
              </div>
              <span slot="reference" class="info_class">?</span>
            </el-popover>
            <ody-tip-star :content="$t('申请条件') + ':'"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-checkbox v-model="formData.applyConRegisterOn" :label="$t('register')" name="formData_applyConRegisterOn"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="labelColSpan">
          <el-checkbox v-model="formData.applyConProductOn" :label="$t('购买指定商品')" name="formData_applyConProductOn"/>
          <el-link v-show="formData.applyConProductOn" name="chooseProduct" class="underline" type="info" @click="chooseProduct">{{ $t('common_mp_choose') }}</el-link>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="labelColSpan">
          <ody-tip-star :content="$t('购买任一商品即可')" class="tip-text"/>
          <ody-table
            v-loading="loading"
            :data="productList"
            :columns="productColumns"
            :operates="productOperates"
            :can-filter="false"
            name="productList917"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="labelColSpan">
          <el-form-item>
            <el-checkbox v-model="formData.applyConAmountOn" :label="$t('消费金额累积')" name="formData_applyConAmountOn"/>
          </el-form-item>
          <el-form-item prop="applyConAmountAccum">
            <ody-input-number :controls="false" :decimal="2" :min="0.00" :max="maxAmount" v-model="formData.applyConAmountAccum" name="formData_applyConAmountAccum"/>
            {{ $t('元') }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            <ody-tip-star :content="$t('满足条件') + ':'"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="applyConPassType">
            <el-radio v-model="formData.applyConPassType" :label="1" name="formData_applyConPassType" required>{{ $t('满足任一条件') }}</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            {{ $t('自动成为分销员') + ':' }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-checkbox v-model="formData.applyConAutoPassOn" :label="$t('open')" name="formData_applyConAutoPassOn"/>
            <ody-tip-star :content="$t('客户满足条件后，自动成为分销员，无需申请和审核。')" class="tip-text"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="6">
          <ody-button v-loading.fullscreen.lock="saving" name="AgentRuleConfig308_save" code="AgentRuleConfig308" type="primary" @click="save()">{{ $t('保存') }}</ody-button>
        </el-col>
      </el-row>
    </el-form>

    <Product-Modal :visible.sync="showProductModal" :check-mp-ids="formData.mpIds" :list-api="productListApi" name="AgentRuleConfig308" code="AgentRuleConfig308" id-label="mpId" name-label="mpName" code-label="mpCode" @ok="onProductOk"/>
  </section>
</template>

<script>
import ProductModal from '@/components/productModal'
import util from '@/utils/util'

export default {
  name: 'RuleConfig',
  components: {
    ProductModal
  },
  data() {
    return {
      labelColSpan: 4,
      maxAmount: 99999999,
      formData: {
        applyConRegisterOn: true,
        applyConProductOn: false,
        applyConAmountOn: false,
        applyConAmountAccum: null,
        applyConPassType: 1,
        mpIds: []
      },
      rules: {
        applyConAmountAccum: [{ validator: this.validateApplyConAmountAccumPass }],
        applyConPassType: [{ required: true, message: this.$t('满足条件') + this.$t('as_required') }]
      },
      loading: false,
      saving: false,
      showProductModal: false,
      productListApi: this.$agent.$api.distributionProduct.listDistributionProductPageByParams,
      productList: [],
      productColumns: [
        {
          show: true,
          prop: 'mpCode',
          label: this.$t('product_code'),
          align: 'left'
        },
        {
          show: true,
          prop: 'mpName',
          label: this.$t('product_name'),
          align: 'left'
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('common_merchant_name'),
          align: 'left'
        },
        {
          show: true,
          prop: 'storeName',
          label: this.$t('shop_name'),
          align: 'left'
        }
      ],
      productOperates: {
        fixed: 'right',
        list: [
          {
            label: this.$t('删除'),
            disabled: false,
            code: 'ui',
            method: (index, row) => {
              try {
                util.confirm(this, this.$t('whether_to_delete_the_goods'), () => {
                  this.productList.splice(index, 1)
                  this.formData.mpIds.splice(index, 1)
                })
              } catch (e) {
                console.log(e)
              }
            }
          }
        ]
      }
    }
  },
  async mounted() {
    this.ruleApi = this.$agent.$api.rule
    this.init()
  },
  methods: {
    validateApplyConAmountAccumPass(rule, value, callback) {
      if (this.formData.applyConAmountOn && !this.formData.applyConAmountAccum && this.formData.applyConAmountAccum !== 0) {
        callback(new Error(this.$t('消费金额累积') + this.$t('内容不正确')))
      } else {
        callback()
      }
    },
    init() {
      this.load()
    },
    load() {
      this.loading = true
      this.ruleApi.config_getApplyConfig().then(res => {
        this.loading = false
        this.formData = res.data
        if (this.formData.mpIds && this.formData.mpIds.length > 0) {
          this.ruleApi.product_listApplyProducts().then(res => {
            this.productList = res.data
          })
        }
      })
    },
    save() {
      // validate data
      if (!this.formData.applyConRegisterOn && !this.formData.applyConProductOn && !this.formData.applyConAmountOn) {
        this.$message.info(this.$t('申请条件') + this.$t('至少选择一项'))
        return
      }
      if (this.formData.applyConProductOn && this.productList.length < 1) {
        this.$message.info(this.$t('购买指定商品') + this.$t('cant_be_empty'))
        return
      }

      this.formData.mpIds = []
      this.productList.forEach(item => {
        this.formData.mpIds.push(item.mpId)
      })

      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.saving = true

          this.ruleApi.config_updateApplyConfig(this.formData).then(res => {
            this.saving = false
            if (res.success) {
              this.$message.success(this.$t('plMpConfig_save_success'))
            } else {
              this.$message.error(res.message)
            }
          }, () => { this.saving = false })
        } else {
          this.$message.info(this.$t('请检查保存数据是否完整'))
          return false
        }
      })
    },
    chooseProduct() {
      this.showProductModal = true
    },
    onProductOk(productList) {
      productList.forEach(item => {
        if (!this.formData.mpIds.includes(item.mpId)) {
          this.formData.mpIds.push(item.mpId)
          this.productList.push(item)
        }
      })
      this.showProductModal = false
    }
  }
}

</script>
