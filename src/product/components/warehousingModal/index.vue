<template>
  <div>
    <!-- 单一规格商品 -->
    <div v-if="!typeOfProduct">
      <el-popover v-model="showModel" name="showModel" placement="top-start" trigger="click">
        <div class="popover-container">
          <el-form ref="ruleForm" :model="warehousingSku">
            <el-form-item
              :rules="{ required: true, message: this.$t('请填入库存'), trigger: 'blur' }"
              prop="realStockNum"
              class="warehousingSku-el-input"
              label="$t('当前库存')"
            >
              <el-input v-model="warehousingSku.realStockNum" name="warehousingSku_realStockNum" style="width:100px" />
              <span>{{ $t('已冻结') }}1{{ $t('件') }}</span>
            </el-form-item>
            <el-form-item :label="$t('自动更新库存')">
              <el-switch v-model="warehousingSku.updalrealStokNum" name="warehousingSku_updalrealStokNum" class="warehousingSku-switch" />
            </el-form-item>
            <el-form-item label="$t('每日自动更新到(件)')" class="warehousingSku-el-input">
              <el-input v-if="warehousingSku.updalrealStokNum" v-model="warehousingSku.updateNum" name="warehousingSku_updateNum" />
            </el-form-item>
            <el-form-item label="$t('活动时间')">
              <ody-date-range-picker v-if="warehousingSku.updalrealStokNum" v-model="useDateTime" name="useDateTime" />
            </el-form-item>
            <el-form-item class="botton-form">
              <el-button name="resetForm" @click="resetForm('ruleForm')">{{ $t('取消') }}</el-button>
              <el-button name="submitForm" type="primary" @click="submitForm('ruleForm')">{{ $t('保存') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <i slot="reference" class="el-icon-edit" />
      </el-popover>
    </div>
    <!-- 多规格商品 -->
    <div v-if="typeOfProduct">
      <el-popover v-model="showModel" name="showModel0" placement="top-start" trigger="click">
        <div class="popover-container">
          <el-form ref="dynamicValidateForm" :model="dynamicValidateForm">
            <ody-table :data="dynamicValidateForm.warehousingList" :columns="columns" name="dynamicValidateForm_warehousingList436">
              <template slot="realStockNum" slot-scope="scope">
                <el-form-item
                  :prop="'warehousingList.' + scope.$index + '.realStockNum'"
                  :rules="{ required: true, message: $t('请填入库存'), trigger: 'blur' }"
                >
                  <el-input v-model="scope.row.realStockNum" name="scope_row_realStockNum" style="width:80px" />
                  <span>{{ $t('已冻结') }}X{{ $t('件') }}</span>
                </el-form-item>
              </template>
              <template slot="updalrealStokNum" slot-scope="scope">
                <el-switch v-model="scope.row.updalrealStokNum" :active-text="$t('停用')" name="scope_row_updalrealStokNum" />
              </template>
              <template slot="updateNum" slot-scope="scope">
                <el-input
                  v-if="scope.row.updalrealStokNum"
                  v-model="scope.row.updateNum"
                  name="scope_row_updateNum"
                  style="width:80px"
                />
              </template>
              <template slot="useDateTime" slot-scope="scope">
                <ody-date-range-picker
                  v-if="scope.row.updalrealStokNum"
                  v-model="scope.row.useDateTime"
                  name="scope_row_useDateTime"
                />
              </template>
            </ody-table>
            <el-form-item class="botton-form">
              <el-button name="resetForm9" @click="resetForm('dynamicValidateForm')">{{ $t('取消') }}</el-button>
              <el-button name="submitForm5" type="primary" @click="submitForm('dynamicValidateForm')">{{ $t('保存') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <i slot="reference" class="el-icon-edit" />
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 商品类型  0-单规格 3-多规格 4-组合
    typeOfProduct: {
      type: [Number, String],
      default: null
    },
    data: {
      type: [Array, Object],
      default: () => {}
    }
  },
  data() {
    return {
      productType: null, // true-多规格 false-单规格
      showModel: false,
      columns: [
        {
          show: true,
          prop: 'skuCode',
          label: this.$t('SKU编码'),
          align: 'center'
        },
        {
          show: true,
          prop: 'spec',
          label: this.$t('规格属性'),
          align: 'center',
          width: '200px'
        },
        {
          show: true,
          slot: 'realStockNum',
          label: this.$t('当前库存'),
          align: 'center',
          width: '200px'
        },
        {
          show: true,
          slot: 'updalrealStokNum',
          label: this.$t('自动更新库存'),
          align: 'center',
          width: '150px'
        },
        {
          show: true,
          slot: 'updateNum',
          label: this.$t('每日自动更新到（件）'),
          align: 'center',
          width: '200px'
        },
        {
          show: true,
          slot: 'useDateTime',
          label: this.$t('有效期'),
          align: 'center',
          width: '360px'
        }
      ],
      warehousingList: [
        {
          skuCode: 'K00001',
          spec: '颜色，红色',
          realStockNum: null,
          updalrealStokNum: false,
          updateNum: null,
          useDateTime: []
        },
        {
          skuCode: 'K00001',
          spec: '颜色，红色',
          realStockNum: null,
          updalrealStokNum: false,
          updateNum: null,
          useDateTime: []
        },
        {
          skuCode: 'K00001',
          spec: '颜色，红色',
          realStockNum: null,
          updalrealStokNum: false,
          updateNum: null,
          useDateTime: []
        }
      ],
      warehousingSku: {
        skuCode: '',
        spec: '',
        realStockNum: null,
        updalrealStokNum: false,
        updateNum: null,
        useDateTime: []
      },
      dynamicValidateForm: {
        warehousingList: '' // 多规格属性
      }
    }
  },
  watch: {
    typeOfProduct: {
      handler(newVal) {
        this.refashData(newVal)
      },
      deep: true
    }
  },
  mounted() {
    if (this.typeOfProduct) {
      this.refashData(this.typeOfProduct)
    }
  },
  methods: {
    refashData(productType) {
      if (productType * 1 === 0) {
        this.productType = false
        this.warehousingSku = this.warehousingList[0]
      } else {
        this.productType = true
        this.$set(
          this.dynamicValidateForm,
          'warehousingList',
          this.warehousingList
        )
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.showModel = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.warehousingSku-switch {
  padding-left: 10px;
}
/deep/.el-form-item__content {
  margin-left: 0px !important;
}
/deep/.warehousingSku-el-input {
  display: flex;
  .el-input__inner {
    width: 100px !important;
  }
}
.botton-form {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
