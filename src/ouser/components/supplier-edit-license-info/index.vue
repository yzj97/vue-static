<template>
  <div class>
    <el-form
      ref="supplier"
      :model="basicInfo"
      :rules="licenseInfoRules"
      :disabled="isView"
      label-width="240px"
      style="width: 640px;"
      class="inner-form"
    >
      <el-form-item :label="$t('公司名称')" prop="enterpriseName">
        <el-input v-model="basicInfo.enterpriseName" name="basicInfo_enterpriseName" maxlength="100"/>
      </el-form-item>
      <el-form-item :label="$t('企业税号')" prop="enterpriseTaxCode">
        <el-input v-model="basicInfo.enterpriseTaxCode" name="basicInfo_enterpriseTaxCode" maxlength="100"/>
      </el-form-item>
      <el-form-item :label="$t('法定代表人')" prop="legalRepresentativeName">
        <el-input v-model="basicInfo.legalRepresentativeName" name="basicInfo_legalRepresentativeName" maxlength="100"/>
      </el-form-item>
      <el-form-item :label="$t('营业执照号码')" prop="businessLicenceNo">
        <el-input v-model="basicInfo.businessLicenceNo" name="basicInfo_businessLicenceNo" maxlength="50"/>
      </el-form-item>
      <el-form-item :label="$t('企业编码')" prop="enterpriseCode">
        <el-input v-model="basicInfo.enterpriseCode" name="basicInfo_enterpriseCode" maxlength="50"/>
      </el-form-item>
      <el-form-item :label="$t('企业注册资金')" prop="registeredCapital">
        <el-input v-model="basicInfo.registeredCapital" name="basicInfo_registeredCapital" maxlength="13" show-word-limit />
      </el-form-item>
      <el-form-item :label="$t('邮政编码')" prop="enterprisePostcode">
        <el-input v-model="basicInfo.enterprisePostcode" name="basicInfo_enterprisePostcode" maxlength="20"/>
      </el-form-item>
      <el-form-item :label="$t('注册地址 - 省市区')" prop="enterpriseArea">
        <ody-province-city-region-select
          v-model="basicInfo.enterpriseArea"
          :selected.sync="basicInfo.registeredProvinceCityRegion"
          :popper-append-to-body="false"
          name="basicInfo_enterpriseArea"
          value-key="id"
        />
      </el-form-item>
      <el-form-item :label="$t('详细地址')">
        <el-input v-model="basicInfo.registeredDetailAddress" name="basicInfo_registeredDetailAddress" maxlength="200"/>
      </el-form-item>
      <el-form-item :label="$t('主营品类')">
        <el-input v-model="basicInfo.businessScope" name="basicInfo_businessScope" maxlength="1000"/>
      </el-form-item>
      <el-form-item :label="$t('营业执照附件')">
        <ody-upload-image
          :file-list.sync="basicInfo.businessLicence"
          :pic-type="['jpg', 'jpeg', 'png']"
          :show-tip="true"
        />
      </el-form-item>
      <el-form-item :label="$t('法定代表人证件正面（国徽面）')">
        <ody-upload-image
          :file-list.sync="basicInfo.enterpriseLegalFrontAttach"
          :pic-type="['jpg', 'jpeg', 'png']"
          :show-tip="true"
        />
      </el-form-item>
      <el-form-item :label="$t('法定代表人证件反面（头像面）')">
        <ody-upload-image
          :file-list.sync="basicInfo.enterpriseLegalReverseAttach"
          :pic-type="['jpg', 'jpeg', 'png']"
          :show-tip="true"
        />
      </el-form-item>
      <el-form-item :label="$t('营业执照失效时间')">
        <el-date-picker
          v-model="basicInfo.businessLicencePeriodEnd"
          name="basicInfo_businessLicencePeriodEnd"
          value-format="timestamp"
          type="date"
        />
      </el-form-item>
      <el-form-item :label="$t('法定代表人证件失效时间')">
        <el-date-picker
          v-model="basicInfo.enterpriseLegalAttachExpireTime"
          name="basicInfo_enterpriseLegalAttachExpireTime"
          value-format="timestamp"
          type="date"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    basicInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const { editStatus, supplierId, merchant } = this.$route.params
    const isView = +editStatus === 2
    const isEdit = +editStatus === 1
    const isAdd = +editStatus === 0

    return {
      supplierId,
      merchant: merchant ? JSON.parse(merchant) : {},
      isEdit,
      isView,
      isAdd,
      licenseInfoRules: {
        businessLicenceNo: [
          {
            required: true,
            message: this.$t('请输入营业执照号码'),
            trigger: 'change'
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
