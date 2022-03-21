<template>
  <section>
    <ody-box :title="$t('类目资质详情')">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-tree :data="categoryData" :props="defaultProps" name="categoryData729" default-expand-all="true" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form ref="form" label-width="120px" class="form">
              <el-form-item :label="$t('common_merchant_name')">
                <el-input v-model="detail.merchantName" :disabled="true" name="detail_merchantName" />
              </el-form-item>
              <el-form-item :label="$t('common_merchant_code')">
                <el-input v-model="detail.merchantCode" :disabled="true" name="detail_merchantCode" />
              </el-form-item>
              <el-form-item :label="$t('Nameofthecategory')">
                <el-input v-model="detail.fullNamePath" :disabled="true" name="detail_fullNamePath" />
              </el-form-item>
              <el-form-item :label="$t('申请时间')">
                <el-input v-model="detail.createTimeStr" :disabled="true" name="detail_createTimeStr" />
              </el-form-item>
              <!-- <el-form-item :label="$t('category_buckle_point')">
                <el-input v-model="bucklePointStr" :disabled="true" name="bucklePointStr" />
              </el-form-item>-->
            </el-form>
          </div>
        </el-col>
      </el-row>
    </ody-box>
    <ody-fixed>
      <ody-button
        v-if="detail.status===1"
        name="MerchantCategoryAuditPass_auditPass"
        size="small"
        type="primary"
        code="MerchantCategoryAuditPass"
        @click="auditPass"
      >{{ $t('common_audit_pass') }}</ody-button>
      <ody-button
        v-if="detail.status===1"
        name="MerchantCategoryAuditReject_auditReject"
        size="small"
        type="primary"
        code="MerchantCategoryAuditReject"
        @click="auditReject"
      >{{ $t('common_status_rejected') }}</ody-button>
      <el-button name="handleBack" size="small" @click="handleBack">{{ $t('common_back') }}</el-button>
    </ody-fixed>
    <ody-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :title="$t('common_audit')"
      width="600px"
    >
      <el-form ref="dialogData" :model="dialogData" :rules="rules" label-width="100px" class="form">
        <el-form-item :label="$t('findings_of_audit')" prop="status">
          <span>{{ statusName }}</span>
        </el-form-item>
        <el-form-item :label="$t('review_of_the_reasons_for_rejection')" prop="message">
          <el-input v-model="dialogData.message" name="dialogData_message" type="textarea" maxlength="100" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <div class="line-top" />
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('cancel') }}</el-button>
        <ody-button
          name="MerchantCategoryAuditReject_confirmDialog"
          size="small"
          type="primary"
          code="MerchantCategoryAuditReject"
          @click="confirmDialog('dialogData')"
        >{{ $t('common_confirm_search') }}</ody-button>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      rules: {
        message: [
          {
            required: true,
            message: this.$t('请输入审核拒绝原因'),
            trigger: 'change'
          }
        ]
      },
      dialogVisible: false,
      loading: false,
      categoryData: [],
      categoryApplyIds: [],
      auditStatus: [],
      status: null,
      statusName: null,
      bucklePointStr: null,
      detail: {
        id: null,
        categoryId: null,
        merchantName: null,
        merchantCode: null,
        fullNamePath: null,
        createTimeStr: null,
        bucklePoint: null
      },
      dialogData: {
        categoryApplyIds: [],
        message: '',
        status: null
      }
    }
  },
  computed: {
    ...mapGetters(['functions'])
  },
  async mounted() {
    try {
      await this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    handleBack() {
      this.$router.push({ name: 'MerchantCategory' })
      this.$portal.delActiveViewAndRefresh()
    },
    async auditPass() {
      const confirm = await this.$confirm(
        this.$t('confirm_pass_audit'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const params = {}
        params.categoryApplyIds = []
        params.categoryApplyIds.push(this.detail.id)
        params.status = 2

        const result = await this.$product.$api.mpApi.auditCategoryApply(params)
        if (result && result.code === '0') {
          this.handleBack()
        }
      }
    },
    auditReject() {
      for (const i in this.auditStatus) {
        if (i === '3') {
          this.statusName = this.auditStatus[i]
        }
      }

      this.dialogVisible = true
    },
    confirmDialog(dialogData) {
      this.$refs['dialogData'].validate(valid => {
        if (valid) {
          const params = {}
          params.categoryApplyIds = []
          params.categoryApplyIds.push(this.detail.id)
          params.status = 3
          params.message = this.dialogData.message
          const merchantCategory = this.$product.$api.mpApi
          merchantCategory.auditCategoryApply(params).then(result => {
            if (result && result.code === '0') {
              this.dialogVisible = false
              this.$refs['dialogData'].resetFields()
              this.handleBack()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClose() {
      this.$refs['dialogData'].resetFields()
      this.dialogVisible = false
    },
    async _initCodes() {
      const vue = this
      this.$product.$api.common
        .listMultiCode({ categorys: ['AUDIT_STATUS'] })
        .then(data => {
          if (data.code === '0') {
            vue.auditStatus = data.data.AUDIT_STATUS
          }
        })
    },
    async init() {
      if (this.$route.params.id) {
        this.detail.id = this.$route.params.id
      }
      const params = {}
      params.id = this.detail.id
      const merchantCategory = this.$product.$api.mpApi
      const result = await merchantCategory.getCategoryApplyInfoById(params)
      if (result && result.code === '0') {
        this.detail = result.data
        this.bucklePointStr = this.detail.bucklePoint * 100 + '%'
      }
      const categoryParams = {}
      categoryParams.id = this.detail.categoryId
      const categoryResult = await merchantCategory.getCategoryApplyTree(
        categoryParams
      )
      if (categoryResult && categoryResult.code === '0') {
        const arr = categoryResult.data
        this.categoryData = toTree(arr)
      }
      await this._initCodes()
    }
  }
}
function toTree(data) {
  data.forEach(function(item) {
    delete item.children
  })
  var map = {}
  data.forEach(function(item) {
    map[item.id] = item
  })
  var val = []
  data.forEach(function(item) {
    var parent = map[item.parentId]
    item.label = item.name
    if (parent) {
      if (parent.children) {
        parent.children.push(item)
      } else {
        parent.children = [item]
      }
    } else {
      val.push(item)
    }
  })
  return val
}
</script>

<style lang="scss" scoped>
</style>
