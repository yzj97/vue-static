<template>
  <section>
    <el-card shadow="never">
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('purchase_plan_filed_code')">
            <span>{{ formData.planCode }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('execution_status')">
            <span>{{ formData.executionStatusText }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('purchase_plan_type')" required="true" prop="planType">
            <el-select
              v-if="isEdit && platformId === 2"
              v-model="formData.planType"
              :placeholder="$t('common_choose_please')"
              name="formData_planType"
            >
              <el-option
                v-for="item in planTypes"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
            <span v-if="!isEdit || platformId === 1">{{ formData.planTypeText }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('purchase_plan_filed_merchant_name')" required="true" prop="merchantName">
            <el-input
              v-show="!formData.id"
              v-model="formData.merchantName"
              :placeholder="$t('common_choose_please')"
              name="formData_merchantName"
              readonly="true"
              @click.native="showMerchantSelectModal"
            />
            <span v-show="formData.id">{{ formData.merchantName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('purchase_plan_date_validate')" required="true" prop="planDate">
            <el-date-picker
              v-if="isEdit && platformId === 2"
              v-model="formData.planDate"
              :start-placeholder="$t('plan_start_date')"
              :end-placeholder="$t('plan_end_date')"
              name="formData_planDate"
              range-separator="-"
              type="daterange"
            />
            <span
              v-if="!isEdit || platformId === 1"
            >{{ formData.planStartDate + ' - ' + formData.planExpiryDate }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('common_upload_attachment')">
            <el-upload
              ref="upload"
              :file-list="attachments"
              :on-preview="downloadFile"
              :on-success="handleFileUploadSuccess"
              :before-remove="handleFileRemove"
              :auto-upload="true"
              :show-file-list="true"
              :action="'api/' + uploadUrl"
              :disabled="!(isEdit && platformId === 2)"
              name="file"
              multiple="true"
              class="upload-demo"
            >
              <ody-button
                :disabled="!isEdit"
                name="OpmsPurchasePlanList19"
                type="primary"
                code="OpmsPurchasePlanList19"
                size="small"
              >{{ $t('common_import_selectFile') }}</ody-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <MerchantSelectModal :visible.sync="showMerchantModal" @ok="selectMerchant" />
  </section>
</template>

<script>
import MerchantSelectModal from '@/components/merchantModal'
export default {
  components: {
    MerchantSelectModal
  },
  props: {
    formData: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    platformId: {
      type: Number,
      default: null
    },
    attachments: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      planTypes: [],
      uploadUrl: 'opms-web/fileController/uploadFile.do',
      showMerchantModal: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.initCodes()
    },
    initCodes() {
      this.$opms.$api.code
        .listMulti({ categories: ['PLAN_TYPE'] })
        .then(data => {
          this.planTypes = data.data.PLAN_TYPE
        })
    },
    downloadFile(file) {
      window.open(file.url)
    },
    handleFileUploadSuccess(response, file, fileList) {
      if (response && response.code === '0') {
        this.attachments.push({
          url: response.data.fileURL,
          name: response.data.fileName
        })
      }
    },
    handleFileRemove(file, fileList) {
      const index = this.attachments.indexOf(file)
      if (index > -1) {
        this.attachments.splice(index, 1)
      }
    },
    showMerchantSelectModal() {
      this.showMerchantModal = true
    },
    selectMerchant(result) {
      if (result) {
        this.formData.merchantCode = result.merchantCode
        this.formData.merchantId = result.merchantId
        this.formData.merchantName = result.merchantName
      }
    }
  }
}
</script>

<style scoped>
</style>
