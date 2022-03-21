<template>
  <div class>
    <el-form
      ref="storeInfo"
      :model="storeInfo"
      :rules="storeInfoRules"
      :disabled="isView"
      label-width="200px"
      style="width: 960px;"
      class="inner-form"
    >
      <merchant-title>{{ $t('店铺基本信息') }}</merchant-title>
      <el-form-item :label="$t('店铺名称')" prop="orgName">
        <el-input v-model="storeInfo.orgName" name="storeInfo_orgName" show-word-limit maxlength="50"/>
      </el-form-item>
      <el-form-item :label="$t('店铺名称(第二语言)')" prop="orgNameLan2">
        <el-input v-model="storeInfo.orgNameLan2" name="storeInfo_orgNameLan2" show-word-limit maxlength="30"/>
      </el-form-item>
      <el-form-item :label="$t('店铺编码')" prop="orgCode">
        <el-input v-model="storeInfo.orgCode" :disabled="isEdit" name="storeInfo_orgCode" />
      </el-form-item>
      <el-form-item :label="$t('组织架构')" prop="orgCode">
        <el-input v-model="storeInfo.departmentName" name="storeInfo_departmentName" disabled />
      </el-form-item>
      <el-form-item :label="$t('店铺分类')" prop="storeOnlineType">
        <ody-select2
          v-model="storeInfo.storeOnlineType"
          :disabled="isEdit"
          :placeholder="$t('请选择')"
          name="storeInfo_storeOnlineType"
          list-key="storeBigTypeList"
        />
      </el-form-item>
      <el-form-item :label="$t('所属商家')" prop="merchantName">
        <el-input
          v-model="storeInfo.merchantName"
          :disabled="isEdit"
          name="storeInfo_merchantName"
        />
      </el-form-item>
      <el-form-item :label="$t('店铺类型')" prop="storeType">
        <ody-select2
          v-model="storeInfo.storeType"
          :placeholder="$t('请选择')"
          name="storeInfo_storeType"
          list-key="storeTypeList"
        />
      </el-form-item>
      <el-form-item :label="$t('店铺所属渠道')" prop="channelCode">
        <ody-channel-select
          v-if="storeInfo.departmentId"
          v-model="storeInfo.channelCode"
          :department="true"
          :department-id="storeInfo.departmentId"
          :disabled="isEdit"
          :placeholder="$t('请选择')"
          name="storeInfo_channelCode"
        />
      </el-form-item>
      <el-form-item :label="$t('类目是否允许自创')" prop="selfCreateCategory">
        <ody-radio2
          v-model="storeInfo.selfCreateCategory"
          name="storeInfo_selfCreateCategory"
          list-key="allowList"
        />
      </el-form-item>
      <el-form-item v-if="warehouse" :label="$t('店铺对应门店仓')" prop="warehouseId">
        <merchant-select-warehouse
          v-model="storeInfo.warehouseId"
          :placeholder="$t('请选择')"
          :selected.sync="selectedWarehouse"
          name="storeInfo_warehouseId"
          warehouse-type="2"
          value-key="id"
        />
      </el-form-item>
      <el-form-item
        v-if="$portal.hasPermission('MerchantStoreListPricingMethod')&&storeInfo.channelCode!=='120001'"
        :label="$t('积分定价')"
        prop="pricingMode"
      >
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="storeInfo.pricingMode"
          :active-text="storeInfo.pricingMode === 0 ? '停用' : '启用'"
          name="storeInfo_pricingMode"
          @change="change(storeInfo)"
        />
      </el-form-item>
      <el-form-item v-if="storeInfo.storeOnlineType == 1" :label="$t('称重识别码')" prop="weightNo">
        <el-input
          v-model="storeInfo.weightNo"
          :placeholder="$t('支持数字，多个值用逗号隔开')"
          name="storeInfo_weightNo"
        />
      </el-form-item>
      <el-form-item :label="$t('店铺 LOGO')" prop="logoUrl">
        <ody-upload-image
          v-if="loaded"
          v-model="storeInfo.logoUrl"
          :pic-type="['jpg', 'jpeg', 'png']"
          :pic-size="4096"
          :show-tip="true"
          name="storeInfo_logoUrl"
        />
        <el-input
          v-model="storeInfo.logoUrl"
          name="logoUrl"
          type="text"
          style="z-index:-99999;width:10px;"
        />
      </el-form-item>
      <el-form-item v-if="storeLogo" :label="$t('店铺简介')" prop="shortDesc">
        <el-input
          v-model="storeInfo.shortDesc"
          :placeholder="$t('店铺签名、主营宝贝、店铺动态信息，支持填写1-100个字符')"
          name="storeInfo_shortDesc"
          show-word-limit
          maxlength="100"
        />
      </el-form-item>
      <el-form-item v-if="storeLogo" :label="$t('店铺简介(第二语言) ')" prop="shortDescLan2">
        <el-input
          v-model="storeInfo.shortDescLan2"
          :placeholder="$t('支持填写1-300个字符')"
          name="storeInfo_shortDescLan2"
          show-word-limit
          maxlength="300"
        />
      </el-form-item>
      <el-form-item :label="$t('店铺介绍')" prop="desc">
        <el-input
          v-model="storeInfo.desc"
          :placeholder="$t('介绍店铺诚信、服务介绍，支持填写1-300个字符')"
          name="storeInfo_desc"
          show-word-limit
          maxlength="300"
          type="textarea"
        />
      </el-form-item>
      <el-form-item :label="$t('店铺介绍(第二语言)')" prop="descLan2">
        <el-input
          v-model="storeInfo.descLan2"
          :placeholder="$t('介绍店铺诚信、服务介绍，支持填写1-500个字符')"
          name="storeInfo_descLan2"
          show-word-limit
          maxlength="500"
          type="textarea"
        />
      </el-form-item>

      <el-form-item v-if="storeInfo.storeOnlineType == 1" :label="$t('员工数')" prop="staffNums">
        <ody-input-number
          v-model="storeInfo.staffNums"
          :placeholder="$t('可输入0-999999')"
          :min="0"
          :max="999999"
          :decimal="0"
          name="storeInfo_staffNums"
        />
      </el-form-item>

      <el-form-item v-if="storeInfo.storeOnlineType == 1" :label="$t('营业面积')" prop="businessArea">
        <ody-input-number
          v-model="storeInfo.businessArea"
          :min="0"
          :max="999999"
          :placeholder="$t('可输入0-999999.99')"
          :decimal="2"
          name="storeInfo_businessArea"
        >
          <el-select
            slot="append"
            v-model="storeInfo.businessAreaUnits"
            name="storeInfo_businessAreaUnits"
            class="business-area-units"
          >
            <el-option
              v-for="item in businessAreaUnitsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </ody-input-number>
      </el-form-item>

      <el-form-item v-if="storeInfo.storeOnlineType == 1" :label="$t('年租金')" prop="rent">
        <ody-input-number
          v-model="storeInfo.rent"
          :min="0"
          :max="999999"
          :placeholder="$t('可输入0-999999.99')"
          :decimal="2"
          name="storeInfo_rent"
        >
          <template slot="append">CNY</template>
        </ody-input-number>
      </el-form-item>

      <merchant-title>{{ $t('联系信息') }}</merchant-title>
      <el-form-item :label="$t('店铺联系人')" prop="contactName">
        <el-input
          v-model="storeInfo.contactName"
          :placeholder="$t('支持填写1-20个字符')"
          name="storeInfo_contactName"
          show-word-limit
          maxlength="20"
        />
      </el-form-item>
      <el-form-item :label="$t('联系手机')" prop="mobileNo">
        <el-input
          v-model="storeInfo.mobileNo"
          :placeholder="$t('支持填写11个字符')"
          name="storeInfo_mobileNo"
          show-word-limit
          maxlength="11"
        />
      </el-form-item>
      <el-form-item :label="$t('联系人邮箱')" prop="email">
        <el-input
          v-model="storeInfo.email"
          :placeholder="$t('支持填写1-30个字符')"
          name="storeInfo_email"
          show-word-limit
          maxlength="30"
        />
      </el-form-item>
      <el-form-item :label="$t('经营地址')" prop="area">
        <ody-province-city-region-select
          v-if="loaded"
          v-model="storeInfo.area"
          :selected.sync="selectedArea"
          name="storeInfo_area"
        />
      </el-form-item>
      <el-form-item :label="$t('详细地址')" prop="detailAddress">
        <el-input
          v-model="storeInfo.detailAddress"
          :placeholder="$t('支持填写1-100个字符')"
          name="storeInfo_detailAddress"
          show-word-limit
          maxlength="100"
        />
      </el-form-item>
      <el-form-item :label="$t('详细地址(第二语言)')" prop="detailAddressLan2">
        <el-input
          v-model="storeInfo.detailAddressLan2"
          :placeholder="$t('支持填写1-100个字符')"
          name="storeInfo_detailAddressLan2"
          show-word-limit
          maxlength="100"
        />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="entryTermAgree" name="entryTermAgree">{{ $t('我已阅读并同意') }}</el-checkbox>
        <el-link
          name="handleStoreInfoEntryTermOpen"
          @click="handleStoreInfoEntryTermOpen"
        >《{{ entryTerm.title }} 》</el-link>
      </el-form-item>
      <el-form-item>
        <ody-button
          name="MerchantStoreListInfoSave_handleStoreInfoSubmit"
          code="MerchantStoreListInfoSave"
          type="primary"
          @click="handleStoreInfoSubmit"
        >{{ $t('保存') }}</ody-button>
        <!-- <el-button name="resetForm" @click="resetForm('storeInfo')">{{ $t('重置') }}</el-button> -->
      </el-form-item>
    </el-form>
    <ody-dialog
      :visible.sync="entryTerm.visible"
      :before-close="handleEntryTermClose"
      :title="entryTerm.title"
      width="960px"
    >
      <div v-html="entryTerm.content" />
      <span slot="footer">
        <el-button
          name="handleEntryTermClose"
          size="mini"
          type="primary"
          @click="handleEntryTermClose"
        >{{ $t('知道了') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import MerchantTitle from '@/components/title'
import MerchantSelectWarehouse from '@/components/select-warehouse'
import MerchantProvinceCityRegion from '@/components/provinceCityRegion'

export default {
  components: {
    MerchantTitle,
    MerchantSelectWarehouse,
    MerchantProvinceCityRegion
  },
  props: {},
  data() {
    const { status, channelMode } = this.$route.params
    let isView = +status === 2
    let isEdit = +status === 1

    if (isEdit) {
      if (!this.$portal.hasPermission('MerchantStoreListEdit')) {
        isEdit = false
        isView = true
      }
    }

    const validateArea = (rule = {}, value = [], callback) => {
      if (!isEdit) {
        callback()
      } else {
        const len = value.filter(x => x).length
        if (len < 3) {
          callback(new Error('has error'))
        } else {
          callback()
        }
      }
    }

    return {
      selectedArea: [],
      yetai: 1,
      yetais: [
        { value: 1, label: '便利店' },
        { value: 2, label: '折扣店' },
        { value: 3, label: '商超店' },
        { value: 4, label: '视觉无人店' },
        { value: 5, label: 'RFID无人店' },
        { value: 6, label: '快闪店' }
      ],
      businessAreaUnitsOptions: [{ value: 1, label: 'M^2' }],
      selectedWarehouse: {
        label: ''
      },
      loaded: false,
      isEdit,
      isView,
      warehouse: ['POS', 'O+O'].includes(channelMode),
      storeLogo: !['POS'].includes(channelMode),
      entryTermAgree: false,
      storeInfo: {
        orgName: '',
        departmentId: '',
        orgNameLan2: '',
        orgCode: '',
        storeOnlineType: '',
        merchantName: '',
        storeType: '',
        channelCode: '',
        selfCreateCategory: '',
        logoUrl: null,
        shortDesc: '',
        shortDescLan2: '',
        desc: '',
        descLan2: '',
        staffNums: '',
        businessArea: '',
        businessAreaUnits: '1',
        rent: '',
        contactName: '',
        mobileNo: '',
        email: '',
        detailAddress: '',
        detailAddressLan2: '',
        pricingMode: ''
      },
      storeInfoRules: {
        orgName: [
          {
            required: true,
            message: this.$t('请输入店铺名称'),
            trigger: 'change'
          }
        ],
        orgCode: [
          {
            required: true,
            message: this.$t('请输入店铺编码'),
            trigger: 'change'
          }
        ],
        storeOnlineType: [
          {
            required: true,
            message: this.$t('请选择店铺分类'),
            trigger: 'change'
          }
        ],
        merchantName: [
          {
            required: true,
            message: this.$t('请输入所属商家'),
            trigger: 'change'
          }
        ],
        storeType: [
          {
            required: isEdit,
            message: this.$t('请选择店铺类型'),
            trigger: 'change'
          }
        ],
        channelCode: [
          {
            required: true,
            message: this.$t('请选择店铺所属渠道'),
            trigger: 'change'
          }
        ],
        selfCreateCategory: [
          {
            required: true,
            message: this.$t('请选择店类目是否允许自创'),
            trigger: 'change'
          }
        ],
        logoUrl: [
          { required: true, message: this.$t('请上传图片'), trigger: 'change' }
        ],
        contactName: [
          {
            required: isEdit,
            message: this.$t('请输入店铺联系人'),
            trigger: 'change'
          }
        ],
        mobileNo: [
          {
            required: isEdit,
            message: this.$t('请输入联系手机'),
            trigger: 'change',
            pattern: /^1\d{10}$/
          }
        ],
        email: [
          {
            required: isEdit,
            message: this.$t('请输入联系人邮箱'),
            trigger: 'change',
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          }
        ],
        area: [
          {
            trigger: 'change',
            validator: validateArea,
            required: isEdit,
            message: this.$t('请完整选择经营地址')
          }
        ],
        detailAddress: [
          {
            required: isEdit,
            message: this.$t('请输入详细地址'),
            trigger: 'change'
          }
        ]
      },
      entryTerm: {
        visible: false,
        title: '',
        content: ''
      }
    }
  },
  async mounted() {
    try {
      await this.getEntryTerm()
      this.storeInfo = await this.getStoreInfo()
      this.storeInfo.channelCode = await this.getChannelCode()
      this.entryTermAgree = this.getEntryTermAgree()
    } catch (ex) {
      console.error(ex)
    }
    this.loaded = true
  },
  methods: {
    getEntryTermAgree() {
      const storeEntryTermId = this.storeInfo && this.storeInfo.entryTermsId
      const entryTermId = this.entryTerm && this.entryTerm.id
      const isAgree = +storeEntryTermId === +entryTermId

      return isAgree
    },
    async handleStoreInfoSubmit() {
      const [err] = await this.formValidate('storeInfo')
      const entryTermId = this.entryTerm && this.entryTerm.id

      if (err) {
        return
      }

      if (!entryTermId) {
        this.$message({
          type: 'error',
          message: this.$t('没有入驻条款')
        })
        return
      }

      if (!this.entryTermAgree) {
        this.$message({
          type: 'error',
          message: this.$t('请同意条款')
        })
        return
      }

      const {
        area: [provinceCode, cityCode, regionCode],
        channelCode,
        ...params
      } = this.storeInfo

      const provinceName = this.selectedArea[0].name
      const cityName = this.selectedArea[1].name
      const regionName = this.selectedArea[2].name

      const { label: warehouseName } = this.selectedWarehouse || {}

      // params.channelCodes = [channelCode]
      params.channelCode = channelCode
      // params.logoUrl = logoUrl || ''
      params.provinceCode = provinceCode || ''
      params.cityCode = cityCode || ''
      params.regionCode = regionCode || ''
      params.provinceName = provinceName || ''
      params.cityName = cityName || ''
      params.regionName = regionName || ''
      params.entryTermsId = entryTermId
      params.warehouseName = warehouseName || ''

      await this.$merchant.$api.storeService.updateStoreInfo({ ...params })

      this.$message({
        message: this.$t('店铺基本信息保存成功！'),
        type: 'success'
      })
      this.$portal.delActiveViewAndRefresh()
    },
    async getChannelCode() {
      const { orgId: storeId } = this.$route.params

      const {
        data: { listObj: [{ channelCode = '' }] = [] } = {}
      } = await this.$merchant.$api.storeService.queryStoreOrgChannelPage({
        storeId
      })

      return channelCode + ''
    },
    async getStoreInfo() {
      const { orgId, entityType, showTab, channelMode } = this.$route.params
      const { data } = await this.$merchant.$api.storeService.queryStoreInfo({
        orgId,
        entityType,
        showTab,
        channelMode
      })

      data.selfCreateCategory = data.selfCreateCategory || '0'
      data.businessAreaUnits = 1
      data.area = [data.provinceCode, data.cityCode, data.regionCode]

      return data
    },
    async getEntryTerm() {
      const {
        data: [entryTerm]
      } = await this.$merchant.$api.entryTermsService.list({
        filters: {
          entryType: 2,
          status: 1
        }
      })
      const { id, title, content } = entryTerm || {
        id: 0,
        title: '',
        content: ''
      }
      this.entryTerm.id = +id
      this.entryTerm.title = title
      this.entryTerm.content = content
    },
    handleStoreInfoEntryTermOpen() {
      this.entryTerm.visible = true
    },
    handleEntryTermClose() {
      this.entryTerm.visible = false
    },
    change(row) {
      if (row.pricingMode === 1) {
        this.$confirm(this.$t('确定要启用积分定价吗？'), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          // this.storeInfo.pricingMode === '1'
        }).catch(() => {
          row.pricingMode = row.pricingMode === 0 ? 1 : 0
        })
      } else {
        this.$confirm(this.$t('前端将不显示此店铺的积分商品,确定停用吗？'), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          // this.storeInfo.pricingMode === '0'
        }).catch(() => {
          row.pricingMode = row.pricingMode === 0 ? 1 : 0
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.business-area-units {
  width: 95px;
}
</style>
