<template>
  <div class="pg-free-setting-promotion">
    <!-- {{ freePromotion.conditionType }} -->
    <el-radio-group v-model="freePromotion.conditionType" name="freePromotion_conditionType" @change="handleChangeRadio">
      <el-radio :label="2">
        <span>{{ $t('商品满') }}</span>
        <component
          :is="freePromotion.conditionType === 2 ? 'el-form-item': 'div'"
          :rules="[
            { required: true, message: this.$t('请输入满件'), trigger: 'blur' }
          ]"
          prop="favourableNum"
          class="form-item"
        >
          <ody-input-number
            v-model="freePromotion.favourableNum"
            :min= "1"
            :empty-tip="false"
            :disabled="+freePromotion.conditionType !== 2"
            name="favourableList_favourableCondition"
            class="free-setting-multy"
            @change="handleChangeNum"/>
        </component>
        <span>{{ $t('件，包邮') }}</span>
      </el-radio>
      <el-radio :label="1">
        <span>{{ $t('订单满') }}</span>
        <component
          :is="freePromotion.conditionType === 1 ? 'el-form-item': 'div'"
          :rules="[
            { required: true, message: this.$t('请输入满元'), trigger: 'blur' }
          ]"
          prop="favourableMoney"
          class="form-item"
        >
          <ody-input-number
            v-model="freePromotion.favourableMoney"
            :max="99999999.99"
            :min="0.01"
            :decimal="2"
            :empty-tip="false"
            :disabled="+freePromotion.conditionType !== 1"
            name="favourableList_favourableCondition6"
            class="free-setting-multy"
            @change="handleChangeMoney"
          />
        </component>
        <span>{{ $t('元，包邮') }}</span>
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>

export default {
  props: {
    freePromotion: {
      type: Object,
      default: () => ({
        favourableNum: null,
        favourableMoney: null
      })
    }
  },
  data() {
    return {
    }
  },
  async mounted() {

  },
  methods: {

    handleChangeNum() {
      let num = this.freePromotion.favourableNum
      if (num && num > 9999) {
        num = 9999
        this.freePromotion.favourableNum = num
        this.$message.error('件数超出设置最大值')
      }
      this.$emit('change')
    },
    handleChangeMoney() {
      let money = this.freePromotion.favourableMoney
      if (money && money > 99999999.99) {
        money = 99999999.99
        this.freePromotion.favourableMoney = money
        this.$message.error('金额超出设置最大值')
      }
      this.$emit('change')
    },
    handleChangeRadio(val) {
      if (val === 1) {
        this.freePromotion.favourableNum = null
      } else if (val === 2) {
        this.freePromotion.favourableMoney = null
        this.$emit('change')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-free-setting-promotion {
  .form-item {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
