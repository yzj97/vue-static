<template>
  <section class="section">
    <el-card :body-style="{padding: '30px 50px'}">
      <div slot="header" class="clearfix">
        <strong>{{ $t('组合明细') }}</strong>
      </div>
      <el-form-item :label="$t('类型') + ':'" required>
        <el-radio-group
          :disabled="isEdit"
          v-model="mp.productInfoVO.combineType"
          name="mp_productInfoVO_combineType"
          @change="changeCombineType"
        >
          <el-radio :label="0">
            {{ $t('固定组合') }}
            <el-popover placement="bottom-start" width="800" trigger="hover">
              <div>
                <img :src="require('./images/combine_1.png')" fit="cover" width="780" >
              </div>
              <el-button slot="reference" type="text">{{ $t('示例') }}</el-button>
            </el-popover>
          </el-radio>
          <el-radio :label="1">
            {{ $t('可选组合') }}
            <el-popover placement="bottom-start" width="800" trigger="hover">
              <div>
                <img :src="require('./images/combine_2.png')" fit="cover" width="780" >
              </div>
              <el-button slot="reference" type="text">{{ $t('示例') }}</el-button>
            </el-popover>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item
            :label="$t('组合商品总价') + ':'"
            :rules="rules.salePrice"
            prop="barcodePriceVOS.0.salePrice"
            name="barcodePriceVOS.0.salePrice"
          >
            <ody-input-number
              :disabled="mp.barcodePriceVOS[0].priceEditable === 0"
              v-model="mp.barcodePriceVOS[0].salePrice"
              :min="0.01"
              :max="99999999"
              :decimal="2"
              name="mp_barcodePriceVOS[0]_salePrice"
            />
            <el-popover
              v-if="mp.barcodePriceVOS[0].priceEditable === 0"
              placement="right"
              width="100"
              trigger="hover"
            >
              <div>{{ $t('价格正在审核中......') }}</div>
              <ody-svg-icon slot="reference" icon-class="question" />
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            v-if="mp.productInfoVO.combineType===0"
            :label="$t('市场价') + ':'"
            prop="barcodePriceVOS.0.salePrice"
            name="barcodePriceVOS.0.salePrice"
          >
            <el-input
              v-model="mp.barcodePriceVOS[0].marketPrice"
              :disabled="true"
              name="mp_barcodePriceVOS[0]_marketPrice"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div :style="{ padding: '0px 30px'}">
        <div>
          <el-row
            v-for="(combineGroup, index) in mp.combineGroupVOS"
            :key="index"
            style="padding: 10px 0px"
          >
            <group
              ref="combineGroup"
              :index="index"
              :combine-group="combineGroup"
              :combine-group-list.sync="mp.combineGroupVOS"
              :type.sync="mp.productInfoVO.type"
              :combine-type.sync="mp.productInfoVO.combineType"
              :merchant-id.sync="mp.productVO.merchantId"
              :data-type.sync="mp.dataType"
              :is-view="isView"
              @removeGroup="removeGroup"
              @calculateAmount="calculateAmount"
            />
          </el-row>
        </div>
        <el-row v-if="!isView">
          <el-button
            v-if="mp.productInfoVO.combineType === 1 || mp.productInfoVO.type !== '1'"
            name="addGroup"
            type="primary"
            size="mini"
            @click="addGroup"
          >
            <i class="el-icon-plus" />
            {{ $t('添加分组') }}
          </el-button>
        </el-row>
      </div>
    </el-card>
  </section>
</template>

<script>
import group from './group'
export default {
  components: {
    group
  },
  props: {
    isEdit: {
      type: Boolean,
      required: false,
      default: false
    },
    mp: {
      type: Object,
      required: true,
      default: null
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // combineGroupVOS // 分组列表
      // combineType // 组合商品类型:0-固定组合;1-可选组合
      // type // 商品类型
      // merchantId // 商家id
      // merchantProductPrice 价格
      rules: {
        salePrice: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { validator: this.salePricePass, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 如果是新增，增加一个分组
      this.addDefaultCombineGroup()
      console.log(this.mp)
    },
    salePricePass(rule, value, callback) {
      if (!this.mp.barcodePriceVOS[0].marketPrice) {
        this.mp.barcodePriceVOS[0].marketPrice = 0
      }
      if (parseFloat(value) > parseFloat(this.mp.barcodePriceVOS[0].marketPrice)) {
        callback(
          new Error(
            this.$t(
              '组合商品总价不能大于市场价' +
                this.mp.barcodePriceVOS[0].marketPrice
            )
          )
        )
      } else {
        callback()
      }
    },
    removeGroup(index) {
      this.mp.combineGroupVOS.splice(index, 1)
      this.calculateAmount()
    },
    calculateAmount() {
      var price = 0
      if (this.mp.combineGroupVOS) {
        for (var i = 0; i < this.mp.combineGroupVOS.length; i++) {
          if (this.$refs['combineGroup'][i]) {
            price += this.$refs['combineGroup'][i].calculateAmount()
          }
        }
      }
      this.mp.barcodePriceVOS[0].marketPrice = price.toFixed(6)
    },
    addDefaultCombineGroup() {
      if (!this.mp.combineGroupVOS || this.mp.combineGroupVOS.length === 0) {
        this.mp.combineGroupVOS.splice(
          0,
          this.mp.combineGroupVOS.length,
          getDefaultGroup()
        )
      }
    },
    changeCombineType(value) {
      // 切换分组类型，清空分组
      this.mp.combineGroupVOS.splice(0, this.mp.combineGroupVOS.length)
      this.addDefaultCombineGroup()
      this.mp.barcodePriceVOS[0].marketPrice = 0
    },
    addGroup() {
      if (this.mp.combineGroupVOS.length >= 10) {
        this.$message.info(this.$t('分组不能超过10个'))
        return
      }
      this.mp.combineGroupVOS.push(getDefaultGroup())
    },
    validate() {
      if (this.mp.combineGroupVOS) {
        let allValidate = true
        for (var i = 0; i < this.$refs['combineGroup'].length; i++) {
          if (this.$refs['combineGroup'][i]) {
            var validate = this.$refs['combineGroup'][i].validate()
            if (!validate) {
              allValidate = false
            }
          }
        }
        if (!allValidate) {
          return false
        }
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('分组商品不能为空')
        })
        return false
      }
      if (!this.mp.barcodePriceVOS[0].marketPrice) {
        this.mp.barcodePriceVOS[0].marketPrice = 0
      }

      if (
        this.mp.barcodePriceVOS[0].salePrice >
        this.mp.barcodePriceVOS[0].marketPrice
      ) {
        this.$message({
          type: 'warning',
          message:
            this.$t('组合商品总价不能大于') +
            ': ' +
            this.mp.barcodePriceVOS[0].marketPrice
        })
        return false
      }
      return true
    },
    preSubmit() {
      if (this.mp.combineGroupVOS) {
        var supplierObj = {}
        for (var i = 0; i < this.$refs['combineGroup'].length; i++) {
          this.$refs['combineGroup'][i].preSubmit()
          supplierObj = this.$refs['combineGroup'][i].toParentSupplier()
        }
        console.log(supplierObj)
        if (supplierObj) {
          this.mp.productInfoVO.supplierId = supplierObj.supplierId
          this.mp.productInfoVO.supplierCode = supplierObj.supplierCode
          this.mp.productInfoVO.supplierName = supplierObj.supplierName
          this.mp.productInfoVO.isInnerSupplier = supplierObj.isInnerSupplier
        }
      }
    }
  }
}

function getDefaultGroup() {
  return Object.assign(
    {},
    {
      groupName: '',
      isRepeatSame: 0,
      selectNum: null,
      products: []
    }
  )
}
</script>
<style scoped>
.el-button--primary {
  margin-top: 10px;
  background: rgba(255, 255, 255, 1) !important;
  border: 1px dashed rgba(24, 144, 255, 1);
  color: rgba(24, 144, 255, 1);
  font-size: 14px;
  height: 32px !important;
}
</style>
