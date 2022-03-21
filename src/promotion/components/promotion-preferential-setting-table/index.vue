<template>
  <div class="pg-promotion-preferential-setting-table">
    <el-form ref="dynamicValidateForm" :model="value" :rules="formRules">
      <el-form-item>
        <ody-table
          :data="value"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="value746"
        >
          <template slot="conditionValueUnit" slot-scope="scope">
            <el-form-item>{{ scope.$index + 1 }}</el-form-item>
          </template>
          <template slot="favourableCondition" slot-scope="scope">
            <el-form-item
              :prop="scope.$index + '.favourableCondition'"
              :name="scope.$index + '.favourableCondition'"
              :rules="{ required: true, message: $t('阶梯规则必须填写完整'), trigger: 'blur'}"
            >
              <template v-if="type * 1 === 2">
                <ody-input-number
                  v-if="promotionMethod == 24"
                  :empty-tip="false"
                  v-model="scope.row.favourableCondition"
                  maxlength="8"
                  name="scope_row_favourableCondition"
                  placeholder="X"
                >
                  <template slot="prepend">{{ $t('第') }}</template>
                  <template slot="append">{{ $t('件') }}</template>
                </ody-input-number>
                <ody-input-number
                  v-if="promotionMethod == 25"
                  :empty-tip="false"
                  v-model="scope.row.favourableCondition"
                  maxlength="8"
                  name="scope_row_favourableCondition7"
                  placeholder="X"
                >
                  <template slot="prepend">{{ $t('第') }}</template>
                  <template slot="append">{{ $t('件') }}</template>
                </ody-input-number>
                <ody-input-number
                  v-if="promotionMethod == 2"
                  :empty-tip="false"
                  v-model="scope.row.favourableCondition"
                  maxlength="8"
                  name="scope_row_favourableCondition1"
                  placeholder="X"
                >
                  <template slot="prepend">{{ $t('满') }}</template>
                  <template slot="append">{{ $t('件') }}</template>
                </ody-input-number>
              </template>
              <template v-else>
                <ody-input-number
                  v-if="promType === 2"
                  :empty-tip="false"
                  :decimal="2"
                  :min="0.01"
                  :max="999999999.99"
                  v-model="scope.row.favourableCondition"
                  maxlength="8"
                  name="scope_row_favourableCondition8"
                  placeholder="X"
                >
                  <template slot="prepend">{{ $t('满') }}</template>
                  <template slot="append">{{ $t('元') }}</template>
                </ody-input-number>
                <ody-input-number
                  v-else
                  :empty-tip="false"
                  v-model="scope.row.favourableCondition"
                  maxlength="8"
                  name="scope_row_favourableCondition3"
                  placeholder="X"
                >
                  <template slot="prepend">{{ $t('满') }}</template>
                  <template slot="append">{{ $t('件') }}</template>
                </ody-input-number>
              </template>
            </el-form-item>
          </template>
          <template slot="favourableContent" slot-scope="scope">
            <el-form-item
              :prop="scope.$index + '.favourableContent'"
              :name="scope.$index + '.favourableContent'"
              :rules="{ required: true, message: $t('阶梯规则必须填写完整'), trigger: 'blur'}"
            >
              <template v-if="type * 1 === 2">
                <ody-input-number
                  v-if="promotionMethod == 24"
                  :empty-tip="false"
                  :min="1.0"
                  :max="9"
                  :decimal="1"
                  v-model="scope.row.favourableContent"
                  maxlength="8"
                  name="scope_row_favourableContent"
                  placeholder="Y"
                >
                  <template slot="prepend">{{ $t('打') }}</template>
                  <template slot="append">{{ $t('折') }}</template>
                </ody-input-number>
                <ody-input-number
                  v-if="promotionMethod == 25"
                  :empty-tip="false"
                  :decimal="2"
                  :min="0.01"
                  :max="999999999.99"
                  v-model="scope.row.favourableContent"
                  maxlength="8"
                  name="scope_row_favourableContent6"
                  placeholder="Y"
                >
                  <template slot="append">{{ $t('元') }}</template>
                </ody-input-number>
                <ody-input-number
                  v-if="promotionMethod == 2"
                  :empty-tip="false"
                  :min="1.0"
                  :max="9.9"
                  :decimal="1"
                  v-model="scope.row.favourableContent"
                  maxlength="8"
                  name="scope_row_favourableContent3"
                  placeholder="Y"
                >
                  <template slot="prepend">{{ $t('打') }}</template>
                  <template slot="append">{{ $t('折') }}</template>
                </ody-input-number>
              </template>
              <template v-else>
                <ody-input-number
                  v-if="+promotionMethod === 2"
                  :empty-tip="false"
                  :min="1.0"
                  :max="9.9"
                  :decimal="1"
                  v-model="scope.row.favourableContent"
                  maxlength="8"
                  name="scope_row_favourableContent33"
                  placeholder="Y"
                >
                  <template slot="prepend">{{ $t('打') }}</template>
                  <template slot="append">{{ $t('折') }}</template>
                </ody-input-number>
                <ody-input-number
                  v-else-if="+promotionMethod === 3"
                  :empty-tip="false"
                  :decimal="2"
                  :min="0.01"
                  :max="999999999.99"
                  v-model="scope.row.favourableContent"
                  maxlength="8"
                  name="scope_row_favourableContent38"
                  placeholder="Y"
                >
                  <template slot="prepend">{{ $t('减') }}</template>
                  <template slot="append">{{ $t('元') }}</template>
                </ody-input-number>
                <ody-input-number
                  v-else
                  v-model="scope.row.favourableContent"
                  :empty-tip="false"
                  maxlength="8"
                  name="scope_row_favourableContent37"
                  placeholder="Y"
                >
                  <template slot="prepend">{{ $t('赠') }}</template>
                  <template slot="append">{{ $t('件') }}</template>
                </ody-input-number>
              </template>
            </el-form-item>
          </template>
          <template slot="favourableContentLimit" slot-scope="scope">
            <!-- <el-form-item>{{ $t('满') }},{{ scope.row.favourableCondition ? scope.row.favourableCondition : 'X' }},件,赠 ,{{ scope.row.favourableContent ? scope.row.favourableCondition : 'Y' }}, 件</el-form-item> -->
            <el-form-item>
              <span v-if="+promotionMethod === 24">
                第
                {{ scope.row.favourableCondition || 'X' }}
                件，
                打
                {{ scope.row.favourableContent || 'Y' }}
                折；
              </span>
              <span v-else-if="+promotionMethod === 25">
                第
                {{ scope.row.favourableCondition || 'X' }}
                件，
                {{ scope.row.favourableContent || 'Y' }}
                元；
              </span>
              <span v-else-if="+promotionMethod === 2 && promType !== 2">
                {{ $t('满') }}
                {{ scope.row.favourableCondition || 'X' }}
                件，打
                {{ scope.row.favourableContent || 'Y' }}
                折；
              </span>
              <span v-else-if="+promotionMethod === 2 && promType === 2">
                {{ $t('满') }}
                {{ scope.row.favourableCondition || 'X' }}
                元，打
                {{ scope.row.favourableContent || 'Y' }}
                折；
              </span>
              <span v-else-if="+promotionMethod === 3 && promType !== 2">
                {{ $t('满') }}
                {{ scope.row.favourableCondition || 'X' }}
                件，减
                {{ scope.row.favourableContent || 'Y' }}
                元；
              </span>
              <span v-else-if="+promotionMethod === 3 && promType === 2">
                {{ $t('满') }}
                {{ scope.row.favourableCondition || 'X' }}
                元，减
                {{ scope.row.favourableContent || 'Y' }}
                元；
              </span>
              <span v-else>
                {{ $t('满') }}
                {{ scope.row.favourableCondition || 'X' }}
                件，
                赠
                {{ scope.row.favourableContent || 'Y' }}
                件；
              </span>
            </el-form-item>
          </template>
        </ody-table>
      </el-form-item>
      <el-form-item>
        <el-button
          v-show="+isSuperposition === 0"
          :disabled="value.length>=5"
          name="add"
          size="small"
          type="default"
          style="margin: 5px 0;"
          @click="add"
        >{{ $t('新增优惠') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return [
          {
            favourableCondition: '',
            favourableContent: '',
            conditionValueUnit: '',
            favourableContentLimit: ''
          }
        ]
      }
    },
    // 2-单品x件优惠
    type: {
      type: Object,
      default: () => {}
    },
    promotionMethod: {
      type: Object,
      default: () => {}
    },
    isSuperposition: {
      type: String,
      default: ''
    },
    promType: {
      type: String,
      default: ''
    }
  },
  data() {
    const that = this
    return {
      columns: [
        {
          label: this.$t('优惠阶梯'),
          slot: 'conditionValueUnit',
          show: true,
          minWidth: 90
        },
        {
          label: this.$t('优惠门槛'),
          slot: 'favourableCondition',
          show: true,
          minWidth: 180
        },
        {
          label: '',
          slot: 'favourableContent',
          show: true,
          minWidth: 180
        },
        {
          label: this.$t('优惠说明'),
          slot: 'favourableContentLimit',
          show: true,
          minWidth: 280
        }
      ],
      operates: {
        width: 150,
        fixed: 'right',
        list: [
          {
            label: this.$t('删除'),
            method: (index, row) => {
              this.deleteSetting(index, row)
            },
            hidden(index, row) {
              if (that.value.length > 1) {
                return false
              } else {
                return true
              }
            },
            code: 'ui'
          }
        ]
      },
      formRules: {
        favourableCondition: [
          { validator: this.favourableCondition, trigger: 'blur' }
        ],
        favourableContent: [
          { validator: this.favourableContent, trigger: 'blur' }
        ],
        conditionValueUnit: [
          { validator: this.conditionValueUnit, trigger: 'blur' }
        ],
        favourableContentLimit: [
          { validator: this.favourableContentLimit, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {},
  methods: {
    async validateForm() {
      const [validError] = await this.formValidate('dynamicValidateForm')
      return validError
    },
    add() {
      this.value.push({
        favourableCondition: '',
        favourableContent: '',
        conditionValueUnit: '',
        favourableContentLimit: ''
      })
    },
    deleteSetting(index) {
      this.value.splice(index, 1)
    },
    favourableCondition(rule, value, callback) {
      if (this.isSuperposition === 0 || this.isSuperposition === 1) {
        if (value === '') {
          callback(new Error('阶梯规则必须填写完整'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    favourableContent(rule, value, callback) {
      if (this.isSuperposition === 0 || this.isSuperposition === 1) {
        if (value === '') {
          callback(new Error('阶梯规则必须填写完整'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    conditionValueUnit(rule, value, callback) {
      if (this.isSuperposition === 0 || this.isSuperposition === 1) {
        if (value === '') {
          callback(new Error('阶梯规则必须填写完整'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    favourableContentLimit(rule, value, callback) {
      if (this.isSuperposition === 0 || this.isSuperposition === 1) {
        if (value === '') {
          callback(new Error('阶梯规则必须填写完整'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    updatedParentData() {
      this.$emit('update:value', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-promotion-preferential-setting-table {
  /deep/ {
    .el-form .el-form-item .el-form-item {
      margin-bottom: 15px;
    }
  }
}
</style>
