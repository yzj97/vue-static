<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleStoreCancel"
      :title="$t('新增店铺')"
      width="600px"
    >
      <el-form ref="store" :model="store" :rules="rules" label-position="right" label-width="150px">
        <el-row>
          <el-col span="22" offset="1">
            <el-form-item :label="$t('组织架构')" prop="departmentId" required>
              <ody-organization-select v-model="store.departmentId" name="store_departmentId" entity-type="2" @select="handleOrganizationSelect" />
            </el-form-item>
            <el-form-item id="addStoreModalStoreOnlineType" :label="$t('店铺分类')" prop="storeOnlineType">
              <ody-select2
                v-model="store.storeOnlineType"
                :disabled="!store.departmentId"
                :placeholder="$t('请选择')"
                name="store_storeOnlineType"
                list-key="storeBigTypeList"/>
            </el-form-item>
            <el-form-item id="channelCode" :label="$t('销售渠道')" prop="channelCode">
              <ody-channel-select
                ref="channel"
                v-model="store.channelCode"
                :department="true"
                :department-id="store.departmentId"
                :placeholder="$t('请选择')"
                name="store_channelCode"/>
            </el-form-item>
            <el-form-item :label="$t('店铺编码')" prop="orgCode">
              <el-input
                id="orgCode"
                v-model="store.orgCode"
                :placeholder="$t('支持填写1-20个字符')"
                name="store_orgCode"
                type="text"
                show-word-limit
                maxlength="20"
              />
            </el-form-item>
            <el-form-item :label="$t('店铺名称')" prop="orgName">
              <el-input
                id="orgName"
                v-model="store.orgName"
                :placeholder="$t('支持填写1-50个字符')"
                name="store_orgName"
                type="text"
                show-word-limit
                maxlength="50"
              />
            </el-form-item>
            <el-form-item :label="$t('店铺名称（第二语言）')" prop="orgNameLan2">
              <el-input
                id="orgNameLan2"
                v-model="store.orgNameLan2"
                :placeholder="$t('支持填写1-30个字符')"
                name="store_orgNameLan2"
                type="text"
                show-word-limit
                maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleStoreCancel" size="mini" @click="handleStoreCancel">{{ $t('取消') }}</el-button>
        <ody-button id="storeSubmit" name="MerchantStoreListSave_handleStoreSubmit" code="MerchantStoreListSave" size="mini" type="primary" @click="handleStoreSubmit">{{ $t('新增') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      store: {
        merchantId: '',
        storeOnlineType: '',
        channelCode: '',
        orgCode: '',
        orgName: '',
        orgNameLan2: '',
        orgSubType: 1,
        orgType: 2
      },
      rules: {
        departmentId: [
          { required: true, message: this.$t('请选择组织架构'), trigger: 'change' }
        ],
        storeOnlineType: [
          { required: true, message: this.$t('请选择店铺分类'), trigger: 'change' }
        ],
        channelCode: [
          { required: true, message: this.$t('请选择销售渠道'), trigger: 'change' }
        ],
        orgCode: [
          { required: true, message: this.$t('请输入店铺编码'), trigger: 'change' },
          { pattern: /^[0-9a-zA-Z_]*$/, message: this.$t('仅支持字母数字下划线'), trigger: 'change' }
        ],
        orgName: [
          { required: true, message: this.$t('请输入店铺名称'), trigger: 'change' }
        ],
        orgNameLan2: [
          { required: true, message: this.$t('请输入店铺名称(第二语言)'), trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
  },
  methods: {
    handleOrganizationSelect() {
      this.store.channelCode = null
    },
    handleStoreCancel() {
      this.$emit('update:visible', false)
    },
    async handleStoreSubmit() {
      const [err] = await this.formValidate('store')

      if (err) {
        return
      }

      await this.$merchant.$api.storeService.addStoreOrgInfo(this.store)
      this.$message({
        message: this.$t('新增店铺成功'),
        type: 'success'
      })
      this.$emit('ok')
    }
  }
}
</script>

<style scoped>

</style>
