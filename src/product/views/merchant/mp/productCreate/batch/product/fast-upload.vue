<template>
  <UploadFile
    ref="uploadFile"
    :form-data.sync="formData"
    :title="title"
    :import-type="importType"
    :platform-type="dataType"
    :task-type="taskType"
    :file-size-limit="fileSizeLimit"
    :history-visible.sync="historyVisible"
    :upload-path="uploadPath"
    :input-validated.sync="validated"
    :is-data-task="true"
    :span="6"
    :file-name="fileName"
    :check-merchant="checkMerchant"
    upload-file-label=""
    @beforeUpload="beforeUpload"
    @merchantChange="handlerMerchantChange"
    @downloadTemplate="downloadTemplate">
    <template slot="top-right">
      <el-link name="showUploadHistory" type="primary" @click="showUploadHistory">{{ $t('商品上传历史') }}</el-link>
    </template>
    <template slot="form-items" slot-scope="scope">
      <el-form-item v-show="scope.active < 2" :label="$t('商品类型')" :rules="[{required: true, message: $t('请选择商品类型'), trigger: 'change'}]" prop="type">
        <el-col :span="6">
          <el-select
            v-model="formData.type"
            :placeholder="$t('请选择')"
            name="formData_type"
            @change="handleTypeChange"
          >
            <el-option
              v-for="item in typeOption"
              :disabled="item.code === 31 && formData.typeOfProduct === 3"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-col>
      </el-form-item>
      <el-radio-group v-show="scope.active < 2" v-model="formData.uploadType" @change="handleUploadTypeChange">
        <el-form-item :label="$t('商品数据上传')" prop="uploadType">
          <el-col v-for="item in uploadTypeGroup" :span="24" :key="item.code" :disabled="item.cond()">
            <el-radio :label="item.code">{{ item.name }}</el-radio>
          </el-col>
        </el-form-item>
      </el-radio-group>
    </template>
    <template slot="below-template" slot-scope="scope">
      <el-form-item v-show="scope.active < 2" :label="$t('商品相关数据')">
        <el-col :span="16">
          <span>
            <span>{{ $t('商品类目属性主数据') }}</span>
            <el-link name="downloadMainData" type="primary" @click="downloadMainData">{{ $t('导出文件') }}</el-link>
          </span>
        </el-col>
      </el-form-item>
    </template>
    <template slot="template-tip">
      <span>
        <el-link name="downloadTemplate" type="primary" @click="downloadTemplate">{{ $t('模板下载') }}</el-link>
      </span>
    </template>
    <template slot="upload-tip">
      <div>
        <div>{{ $t('温馨提示：') }}</div>
        <div>{{ $t('1. 支持xls或者xlsx格式的excel文件，大小≤2M，建议商品条数≤1000条。') }}</div>
        <div>{{ $t('2. 商品名称、商品编码、商品类目必填，且商品编码不可重复，否则将导入失败。') }}</div>
      </div>
    </template>
  </UploadFile>
</template>
<script>
import UploadFile from '@/components/uploadFile'
import fastUploadTemplate from '@/excelFile/fastUploadTemplate.xlsx'
import fastUploadWeightTemplate from '@/excelFile/fastUploadWeightTemplate.xlsx'
import fastUploadGiftCardTemplate from '@/excelFile/fastUploadGiftCardTemplate.xlsx'
import fastUploadMultipleTemplate from '@/excelFile/fastUploadMultipleTemplate.xlsx'
import fastUploadMpAttrTemplate from '@/excelFile/fastUploadMpAttrTemplate.xlsx'

const giftCardProductTypes = ['33', '34', '35', '36', '31', '32', '37'] // 礼品卡商品类型,
function isGiftCard(typeCode) {
  return giftCardProductTypes.indexOf(typeCode) > -1
}

const uploadPaths = {
  uploadType1: 'back-product-web/back/mp/batchCreateProduct/importData',
  uploadType2: 'back-product-web/back/mp/batchCreateProduct/importData',
  uploadType3: 'back-product-web/back/mp/batchCreateProduct/importMpAttributeData'
}

export default {
  name: 'ProductUpload',
  components: {
    UploadFile
  },
  data() {
    return {
      categoryTreeData: [],
      categoryItem: null,
      typeOption: [],
      formData: {
        categoryId: null,
        type: '',
        typeOfProduct: '',
        uploadType: 1
      },
      uploadTypeGroup: [],
      uploadTypeGroupDataSource: [
        { code: 1, name: this.$t('单规格商品'), cond: () => true },
        {
          code: 2,
          name: this.$t('多规格商品'),
          cond: () => {
            const type = Number(this.formData.type)
            return type === null || type === 1 || type === 32
          }
        },
        { code: 3, name: this.$t('商品属性'), cond: () => true }
      ],
      title: this.$t('商品'),
      importType: '12', // 商品导入类型 12
      dataType: 1, // 运营平台，商家平台
      taskType: ['productSingleImport', 'productAttributeImport', 'productFastImport'],
      uploadPath: uploadPaths.uploadType1,
      historyVisible: false,
      checkMerchant: false,
      fileName: 'fastUpload'
    }
  },
  computed: {
    validated() {
      if (this.formData.uploadType === 1 && this.formData.type === '') {
        return false
      }
      return true
    }
  },
  async mounted() {
    try {
      this.init()
      Promise.all([this.initGiftCardSwitch(), this.initCodes()]).then(([giftCardSwitch, typeList]) => {
        this.typeOption = typeList.filter(item => {
          return !isGiftCard(item.code) || giftCardSwitch
        })
      })
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    showUploadHistory() {
      this.historyVisible = true
    },
    beforeUpload(uploadParam) {
      uploadParam.append('dataType', this.dataType)
      uploadParam.append('type', this.formData.type)
      uploadParam.append('uploadType', this.formData.uploadType)
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    async initCodes() {
      const { data } = await this.$product.$api.common.listMultiCode({ categorys: ['PRODUCT_TYPE'] })
      return Object.keys(data.PRODUCT_TYPE).map(row => {
        return { code: row, name: data.PRODUCT_TYPE[row] }
      })
    },
    async downloadMainData() {
      if (this.checkMerchant) {
        this.$refs.uploadFile.$refs.form.validateField(['merchantId'])
        if (!this.formData.merchantId) {
          return
        }
      }
      var params = { dataType: this.dataType, merchantId: this.formData.merchantId }
      this.$portal.downloadFileByPost(
        '/api/back-product-web/back/mp/batchCreateProduct/exportCategoryAttribute',
        params,
        'productMainData.xls',
        'ajax'
      )
    },
    async downloadTemplate() {
      if (this.formData.uploadType === 1) {
        this.$refs.uploadFile.$refs.form.validateField(['type'])
        if (!this.formData.type) {
          return
        }
      }
      this.$portal.downloadFileByGet(this.getTemplate(this.formData.uploadType, this.formData.type),
        {}, this.title + this.$t('导入模板') + '.xlsx')
    },
    handleUploadTypeChange() {
      this.uploadPath = uploadPaths['uploadType' + this.formData.uploadType]
      this.title = this.getTitle(this.formData.uploadType, this.formData.type)
      this.$refs.uploadFile.resetUploadFile()
    },
    handleTypeChange() {
      this.title = this.getTitle(this.formData.uploadType, this.formData.type)
      this.uploadTypeGroup = this.uploadTypeGroupDataSource.filter(item => item.cond())
      this.formData.uploadType = this.uploadTypeGroup[0].code
      this.$refs.uploadFile.resetUploadFile()
    },
    async init() {
      this.dataType = Number(this.$route.query.dataType)
      this.checkMerchant = this.dataType > 1
      this.uploadTypeGroup = this.uploadTypeGroupDataSource.filter(item => item.cond())
      this.formData.uploadType = this.uploadTypeGroup[0].code
    },
    async initGiftCardSwitch() {
      const { data } = await this.$product.$api.productApi.getBooleanSwitcher({ key: 'giftCard.switch' })
      return !!data
    },
    getTitle(uploadType, type) {
      uploadType = Number(uploadType)
      type = Number(type)
      if (uploadType === 1) {
        if (type === 1 || type === 32 || type === 37) {
          return this.$t('单规格商品导入模板-常规&餐饮&服务')
        } else if (type === 31) {
          return this.$t('单规格商品导入模板-称重')
        } else {
          return this.$t('单规格商品导入模板-礼品卡&提货卡')
        }
      } else if (uploadType === 2) {
        return this.$t('多规格商品导入模板-常规&餐饮')
      }
      return this.$t('商品属性导入模板')
    },
    getTemplate(uploadType, type) {
      uploadType = Number(uploadType)
      type = Number(type)
      if (uploadType === 1) {
        if (type === 1 || type === 32 || type === 37) {
          return fastUploadTemplate
        } else if (type === 31) {
          return fastUploadWeightTemplate
        } else {
          return fastUploadGiftCardTemplate
        }
      } else if (uploadType === 2) {
        return fastUploadMultipleTemplate
      }
      return fastUploadMpAttrTemplate
    }
  }
}
</script>

<style lang="less" scoped>
</style>
