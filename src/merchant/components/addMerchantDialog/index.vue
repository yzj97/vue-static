<template>
  <div>
    <ody-dialog :visible="visible" :before-close="closeAddMerchant" :title="$t('添加商家')">
      <el-form
        ref="newMerchant"
        :model="newMerchant"
        :rules="rules"
        label-position="right"
        label-width="120px"
      >
        <el-row>
          <el-col span="20" offset="2">
            <el-form-item :label="$t('组织架构')" prop="departmentId">
              <ody-organization-select id="addMerchantDialogDepartmentId" v-model="newMerchant.departmentId" name="newMerchant_departmentId" entity-type="1" />
            </el-form-item>
            <el-form-item :label="$t('商家分类：')" prop="merchantType">
              <el-select v-model="newMerchant.merchantType" :placeholder="$t('请选择')" name="newMerchant_merchantType">
                <el-option
                  v-for="one in orgType"
                  :key="one.value"
                  :label="one.label"
                  :value="one.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('商家编码：')" prop="orgCode">
              <el-input
                id="addMerchantDialogOrgCode"
                v-model="newMerchant.orgCode"
                :placeholder="$t('请输入商家编码')"
                name="newMerchant_orgCode"
                type="text"
                show-word-limit
                maxlength="20"
              />
            </el-form-item>
            <el-form-item :label="$t('商家名称：')" prop="orgName">
              <el-input
                id="addMerchantDialogOrgName"
                v-model="newMerchant.orgName"
                :placeholder="$t('请输入商家名称')"
                name="newMerchant_orgName"
                type="text"
                show-word-limit
                maxlength="20"
              />
            </el-form-item>
            <el-form-item :label="$t('商家价格策略：')" prop="priceStrategy">
              <el-select v-model="newMerchant.priceStrategy" :placeholder="$t('请选择')" name="newMerchant_priceStrategy">
                <el-option
                  v-for="one in priceStrategyList"
                  :key="one.code"
                  :label="one.name"
                  :value="one.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button id="addMerchantDialogClose" name="closeAddMerchant" @click="closeAddMerchant">{{ $t('取消') }}</el-button>
        <ody-button id="addMerchantDialogAdd" name="MerchantManageSave_saveNewMerchant" code="MerchantManageSave" type="primary" @click="saveNewMerchant">{{ $t('新增') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import constants from '@/utils/constants'

export default {
  components: {
    constants
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newMerchant: {
        orgCode: '',
        orgName: '',
        merchantType: 11,
        priceStrategy: '3'
      },
      priceStrategyList: [],
      orgType: [],
      rules: {
        departmentId: [
          { required: true, message: this.$t('请输入组织架构'), trigger: 'change' }
        ],
        orgCode: [
          { required: true, message: this.$t('请输入商家编码'), trigger: 'change' },
          {
            pattern: /^[0-9a-zA-Z]*$/,
            message: this.$t('仅支持数字、字母'),
            trigger: 'change'
          }
        ],
        orgName: [
          { required: true, message: this.$t('请输入商家名称'), trigger: 'change' }
        ],
        merchantType: [
          { required: true, message: this.$t('请选择商家类型'), trigger: 'change' }
        ],
        priceStrategy: [
          { required: true, message: this.$t('请选择商家价格策略'), trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.orgType = constants.orgType
      this.$merchant.$api.commonService
        .listMultiCode({ categories: ['MERCHANT_PRICE_STRATEGY'] })
        .then(res => {
          this.priceStrategyList = res.data.MERCHANT_PRICE_STRATEGY
        })
    },
    closeAddMerchant() {
      const self = this
      self.$emit('update:visible', !self.visible)
      self.resetForm()
    },
    saveNewMerchant() {
      const self = this
      this.$refs['newMerchant'].validate(valid => {
        if (valid) {
          const merchantService = this.$merchant.$api.merchantService
          merchantService
            .addRegisterMerchantInfo(self.newMerchant)
            .then(res => {
              if (res && res.code === '0') {
                self.resetForm()
                self.$message({
                  message: '添加成功',
                  type: 'success'
                })
                self.$emit('update:visible', !self.visible)
                self.$emit('ok', {})
              }
            })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs['newMerchant'].resetFields()
    }
  }
}
</script>

<style scoped>
</style>
