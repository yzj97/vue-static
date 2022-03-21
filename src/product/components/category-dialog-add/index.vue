<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('新增类目树')"
      width="600px">
      <el-form ref="ruleForm" :model="params" :rules="rules" label-position="right" label-width="180px">
        <el-form-item v-if="categoryType === 4" :label="$t('商家')" prop="merchantId">
          <ody-merchant-select v-model="params.merchantId" name="params_merchantId" value-key="merchantId" />
        </el-form-item>
        <el-form-item v-if="categoryType === 6" :label="$t('店铺')" prop="storeId">
          <ody-store-select v-model="params.storeId" :selected.sync="selectedStore" name="params_storeId" />
        </el-form-item>
        <el-form-item v-if="params.type === 2" :label="$t('类目树类型')" prop="type">
          <el-select v-model="params.type" :disabled="true" :placeholder="$t('全部')" name="params_type">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('类目树编码')" prop="categoryCode">
          <el-input v-model="params.categoryCode" name="params_categoryCode" maxlength="60"/>
        </el-form-item>
        <el-form-item :label="$t('第三方系统编码')" prop="thirdCode">
          <el-input v-model="params.thirdCode" name="params_thirdCode" maxlength="60"/>
        </el-form-item>
        <el-form-item :label="$t('类目树名称')" prop="name">
          <el-input v-model="params.name" name="params_name" maxlength="20"/>
        </el-form-item>
        <el-form-item :label="$t('类目树名称') + $t('（') + $t(lang) + $t('）')" prop="nameLan2">
          <el-input v-model="params.nameLan2" name="params_nameLan2" maxlength="40"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <el-button name="handleOk" size="small" type="primary" @click="handleOk">{{ $t('确认') }}</el-button>
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
    categoryType: {
      type: Number,
      default: 2
    },
    lang: {
      type: String,
      default: '第二语言'
    }
  },
  data() {
    return {
      categoryOptions: [
        {
          value: 1,
          label: this.$t('后台类目')
        },
        {
          value: 2,
          label: this.$t('前台类目')
        }
      ],
      selectedStore: [],
      params: {
        type: this.categoryType,
        name: null
      },
      rules: {
        merchantId: [
          { required: true, message: this.$t('请选择商家'), trigger: 'blur' }
        ],
        categoryCode: [
          { required: true, message: this.$t('请输入类目树编码'), trigger: 'blur' }
        ],
        name: [
          { required: true, validator: this.validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.mpApi = this.$product.$api.mpApi
  },
  methods: {
    validatePass(rule, value, callback) {
      if (this.params.name === null || this.params.name === '') {
        callback(new Error(this.$t('请输入类目树名称')))
      } else if (this.params.name.indexOf('>') > -1) {
        callback(new Error(this.$t('不能包含') + '>'))
      } else {
        callback()
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.mpApi
            .addRootCategoryTreeBack(this.params)
            .then(res => {
              this.$emit('update:visible', !this.visible)
              this.$emit('ok')
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    getMerchantList() {
      if (this.categoryType === 4 || this.categoryType === 6) {
        this.$product.$api.merchantApi.queryPlatformAuthMerchantPage({
          currentPage: 1,
          itemsPerPage: 500
        }).then(res => {
          this.merchantList = res.data.listObj
          this.merchantList.map((item) => {
            this.merchantMap[item.merchantId] = item
          })
        })
      }
    },
    getStoreList() {
      if (this.categoryType === 6) {
        this.$product.$api.merchantApi.queryPlatformAuthStorePage({
          currentPage: 1,
          itemsPerPage: 500
        }).then(res => {
          this.storeList = res.data.listObj
          this.storeList.map((item) => {
            this.storeMap[item.storeId] = item
          })
        })
      }
    }

  }
}
</script>
