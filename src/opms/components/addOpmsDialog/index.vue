<template>
  <div>
    <ody-dialog :visible="visible" :before-close="closeAddMerchant" :title="$t('新增联系人信息')">
      <el-form ref="newMerchant" :model="newMerchant" :rules="rules" label-position="right" label-width="100px">
        <el-row>
          <el-col span="20" offset="2">
            <el-form-item :label="$t('组织架构')" prop="departmentId" required>
              <ody-organization-select v-model="newMerchant.departmentId" name="newMerchant_departmentId" entity-type="1" />
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
                v-model="newMerchant.orgCode"
                :placeholder="$t('请输入商家编码')"
                name="newMerchant_orgCode"
                type="text"
                show-word-limit
                maxlength="20"/>
            </el-form-item>
            <el-form-item :label="$t('商家名称：')" prop="orgName">
              <el-input
                v-model="newMerchant.orgName"
                :placeholder="$t('请输入商家名称')"
                name="newMerchant_orgName"
                type="text"
                show-word-limit
                maxlength="20"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="closeAddMerchant" @click="closeAddMerchant">{{ $t('取消') }}</el-button>
        <el-button name="saveNewMerchant" type="primary" @click="saveNewMerchant">{{ $t('新增') }}</el-button>
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
        merchantType: 11
      },
      orgType: [],
      rules: {
        orgCode: [
          { required: true, message: '请输入商家编码', trigger: 'change' },
          { pattern: /^[0-9a-zA-Z]*$/, message: '仅支持数字、字母', trigger: 'change' }
        ],
        orgName: [
          { required: true, message: '请输入商家名称', trigger: 'change' }
        ],
        merchantType: [
          { required: true, message: '请选择商家类型', trigger: 'change' }
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
    },
    closeAddMerchant() {
      const self = this
      self.$emit('update:visible', !self.visible)
      self.resetForm()
    },
    saveNewMerchant() {
      const self = this
      this.$refs['newMerchant'].validate((valid) => {
        if (valid) {
          const merchantService = this.$merchant.$api.merchantService
          merchantService.addRegisterMerchantInfo(self.newMerchant).then(res => {
            if (res && res.code === '0') {
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
