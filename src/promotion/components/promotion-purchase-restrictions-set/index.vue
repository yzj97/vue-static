<template>
  <div>
    <el-form ref="promotionPurchaseRestrictionsSet" :model="form" :rules="formRules">
      <el-row>
        <el-col class="limit1">
          <el-checkbox v-model="form.amountCheck" name="form_amountCheck">
            <el-form-item :rules="{ required: form.amountCheck && !form.totalAmountLimit, message: $t('请输入购买总额限制'), trigger: 'blur' }" prop="totalAmountLimit">
              <span>{{ $t('购买总额限制') }}</span>
              <ody-input-number v-model="form.totalAmountLimit" :min="0.01" :max="9999999" :empty-tip="false" :decimal="2" name="form_totalAmountLimit"/>
              <span>{{ $t('元') }}</span>
            </el-form-item >
          </el-checkbox>
        </el-col>
        <el-col class="limit2">
          <el-checkbox v-model="form.countCheck" name="form_countCheck">
            <el-form-item :rules="{ required: form.countCheck && !form.orderCountLimit, message: $t('请输入下单数量限制'), trigger: 'blur' }" prop="orderCountLimit">
              <span>{{ $t('下单数量限制') }}</span>
              <ody-input-number v-model="form.orderCountLimit" :empty-tip="false" :min="1" name="form_orderCountLimit"/>
              <span>{{ $t('单') }}</span>
            </el-form-item >
          </el-checkbox>
        </el-col>
        <el-col>
          <el-checkbox v-model="form.payCheck" name="form_payCheck">
            <span>{{ $t('购买商品数量限制') }}</span>
          </el-checkbox>
          <div v-show="form.payCheck">
            <el-row>
              <el-col :span="3">
                <span>商品范围:</span>
              </el-col>
              <el-col :span="10">
                <el-form-item :rules="{ required: form.payCheck && !form.countLimit4Skus, message: $t('请输入所有商品每个sku最多购买件数'), trigger: 'blur' }" prop="orderCountLimit">
                  <el-radio v-model="form.radio" name="form_radio" label="1" style="display: felx">
                    <span>所有商品每个sku最多买</span>
                    <ody-input-number v-model="form.countLimit4Skus" :empty-tip="false" :min="1" name="form_countLimit4Skus"/>
                    <span>{{ $t('件') }}</span>
                  </el-radio>
                </el-form-item >
                <br>
                <el-radio v-model="form.radio" name="form_radio9" label="2">
                  <span>{{ $t('部分商品') }}</span>
                  <el-button :disabled="form.radio !== '2'" name="goodsVisible" type="primary" size="small" @click="goodsVisible='true'">{{ $t('添加商品') }}</el-button>
                </el-radio>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <promotion-goods-dialog-choose
      v-if="goodsVisible"
      :visible.sync="goodsVisible"
      :multiple="true"
      :prom-type="promType"
      :params="searchParams"
      choose-key="mpId"
      @ok="ok"
    />
    <promotion-purchase-restrictions-goods
      v-show="form.radio==='2' && form.payCheck"
      :list="list"/>
  </div>
</template>

<script>
import PromotionGoodsDialogChoose from '@/components/promotion-goods-dialog-choose'
import promotionPurchaseRestrictionsGoods from '@/components/promotion-purchase-restrictions-goods'
export default {
  components: {
    PromotionGoodsDialogChoose,
    promotionPurchaseRestrictionsGoods
  },
  props: {
    promotionActivityDetail: {
      type: Object,
      default: () => {}
    },
    promType: {
      type: String,
      default: ''
    },
    promotionId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      goodsVisible: false,
      list: [],
      searchParams: {
        merchantType: '',
        promType: this.promType,
        promotionId: this.promotionId,
        searchType: 1,
        sellType: 1,
        storeIds: [],
        categoryType: '1',
        brandType: '1',
        brandIds: [],
        categoryIds: []
      },
      form: {
        totalAmountLimit: undefined, // 购买总限制额度
        orderCountLimit: undefined, // 下单总限制额度
        countLimit4Skus: undefined, // 每个sku最多够买多少
        countLimit4Partials: undefined, // 部分商品

        amountCheck: true, // 够买总额check
        countCheck: false, // 下单数量限制check
        payCheck: false, // 购买商品数量限制check
        radio: '1'
      },
      formRules: {

      }

    }
  },
  watch: {
    'form.totalAmountLimit': function(val) {
      if (val) {
        this.form.totalAmountLimit = val
      }
      this.$emit('form', this.form)
    },
    'form.orderCountLimit': function(val) {
      if (val) {
        this.form.orderCountLimit = val
      }
      this.$emit('form', this.form)
    },
    'form.countLimit4Skus': function(val) {
      if (val) {
        this.form.countLimit4Skus = val
      }
      this.$emit('form', this.form)
    },
    'form.countLimit4Partials': function(val) {
      if (val) {
        this.form.countLimit4Partials = val
      }
      this.$emit('form', this.form)
    }
  },
  mounted() {

  },
  methods: {
    ok(res) {
      res.map(item => {
        const index = this.list.findIndex(key => key.mpId === item.mpId)
        if (index === -1) {
          item.limitCount = ''
          this.list.push(item)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.limit1,.limit2{
  margin-bottom:1rem;
}
</style>
