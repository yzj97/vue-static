<template>
  <UploadFile
    ref="upload"
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
    :check-merchant="checkMerchant"
    @beforeUpload="beforeUpload"
    @merchantChange="handlerMerchantChange"
    @downloadTemplate="downloadTemplate">
    <template slot="top-right">
      <el-link name="showUploadHistory" type="primary" @click="showUploadHistory">{{ $t('商品上传历史') }}</el-link>
    </template>
    <template slot="form-items" slot-scope="scope">
      <el-form-item v-show="scope.active < 2" :label="$t('商品类型')" :rules="[{required: true, message: $t('请选择商品类型'), trigger: 'change'}]" prop="type">
        <el-col :span="8">
          <el-select
            v-model="formData.type"
            :placeholder="$t('请选择')"
            name="formData_type"
            @change="changeType(formData.type)"
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
      <el-form-item v-if="scope.active < 2" :label="$t('商品形式')" :rules="[{required: true, message: $t('请选择商品形式'), trigger: 'change'}]" prop="typeOfProduct">
        <el-col :span="8">
          <el-select v-model="formData.typeOfProduct" :placeholder="$t('请选择')" name="formData_typeOfProduct">
            <el-option
              v-for="item in typeOfProductOptionList"
              :disabled="item.code === 3 && formData.type ===31"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('选择类目')" :rules="[{required: true, message: $t('请选择类目'), trigger: 'change, blur'}]" prop="categoryId">
        <el-col :span="8">
          <!-- 由于第三方组件vue-treeselect有bug，先用临时方案修改不能clearable -->
          <ody-tree-select
            :normalizer="normalizer"
            :disable-branch-nodes="true"
            :show-count="true"
            :append-to-body="true"
            :z-index="10000"
            v-model="formData.categoryId"
            :selected.sync="categoryItem"
            :clearable="false"
            :multiple="false"
            :options="categoryTreeData"
            name="formData_categoryId"
          />
        </el-col>
      </el-form-item>
    </template>
    <template slot="template-tip">
      <span>
        <el-link name="downloadTemplate" type="primary" @click="downloadTemplate">{{ $t('生成模板并下载') }}</el-link>
        <span class="link-tip">({{ $t('提示：下载模板时请先选择商品类型、商品形式、商品类目') }})</span>
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

const typeOfProductOption1 = [{ code: 0, name: '单规格' }]
const giftCardProductTypes = ['33', '34', '35', '36', '31', '32', '37'] // 礼品卡商品类型,
function isGiftCard(typeCode) {
  return giftCardProductTypes.indexOf(typeCode) > -1
}

export default {
  name: 'ProductUpload',
  components: {
    UploadFile
  },
  data() {
    return {
      categoryTreeData: [],
      typeOfProductOptionList: [],
      categoryItem: null,
      typeOption: [],
      typeOfProductOption: [
        { code: 0, name: this.$t('单规格') },
        { code: 3, name: this.$t('多规格') }
      ],
      formData: {
        categoryId: null,
        type: '',
        typeOfProduct: ''
      },

      title: this.$t('商品'),
      importType: '12', // 商品导入类型 12
      dataType: 1, // 运营平台，商家平台
      taskType: 'productImport',
      uploadPath: '/back-product-web/back/mp/batchCreateProduct/importMpTemplate.do',
      historyVisible: false,
      checkMerchant: false
    }
  },
  computed: {
    validated() {
      if (this.formData.typeOfProduct === '') {
        return false
      }
      if (this.formData.type === '') {
        return false
      }
      if (
        this.formData.categoryId === '' ||
        this.formData.categoryId === null
      ) {
        return false
      }
      return true
    }
  },
  watch: {
    'formData.categoryId': {
      handler(newValue) {
        this.$refs.upload.$refs.form.validateField(['categoryId'])
      },
      deep: true
    }
  },
  async mounted() {
    try {
      this.init()
      Promise.all([this.initGiftCardSwitch(), this.initCodes()]).then(([giftCardSwitch, typeList]) => {
        this.typeOption = typeList.filter(item => {
          if (item.code !== '32') {
            return !isGiftCard(item.code) || giftCardSwitch
          }
        })
      })
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    handlerMerchantChange(merchantId) {
      if (merchantId) {
        if (this.dataType === 1) {
          this.getListBackCategoryTree()
        } else {
          this.getMerchantBackCategoryTree(merchantId)
        }
      }
    },
    showUploadHistory() {
      this.historyVisible = true
    },
    beforeUpload(uploadParam) {
      uploadParam.append('dataType', this.dataType)
      uploadParam.append('type', this.formData.type)
      uploadParam.append('typeOfProduct', this.formData.typeOfProduct)
      uploadParam.append(
        'categoryFullIdPath',
        this.getCategoryFullIdPath(this.formData.categoryId)
      )
      uploadParam.append('categoryId', this.formData.categoryId)
      uploadParam.append(
        'categoryName',
        this.getCategoryName(this.formData.categoryId)
      )
    },
    getListBackCategoryTree() {
      this.$product.$api.mpApi.listBackCategoryTree({}).then(res => {
        var loopFun = function(list) {
          list.map(item => {
            if (
              (item.children && item.children.length === 0) ||
              item.children == null
            ) {
              delete item['children']
              return
            }
            loopFun(item.children)
          })
        }
        var list = [res.data]
        loopFun(list)

        this.categoryTreeData = [res.data]
      })
    },
    getMerchantBackCategoryTree(merchantId) {
      this.$product.$api.mpApi
        .queryGrantedCategoryListByMerchant({ merchantId })
        .then(res => {
          this.categoryTreeData = toTree(res.data)
        })
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    changeType(type) {
      if (isGiftCard(type) || type === '31' || type === '37') {
        this.typeOfProductOptionList = typeOfProductOption1
        this.formData.typeOfProduct = typeOfProductOption1[0].code
      } else {
        this.typeOfProductOptionList = this.typeOfProductOption
        this.formData.typeOfProduct = ''
      }
    },
    async initCodes() {
      const { data } = await this.$product.$api.common.listMultiCode({ categorys: ['PRODUCT_TYPE'] })
      return Object.keys(data.PRODUCT_TYPE).map(row => {
        return { code: row, name: data.PRODUCT_TYPE[row] }
      })
    },
    async validDownloadTemplate() {
      if (this.formData.typeOfProduct === 3) {
        if ((await this.queryCategoryAttribute()) === false) {
          this.$message({
            type: 'warn',
            message: this.$t('当前选择的类目没有销售属性不能创建多规格商品')
          })
          return false
        }
      }
      if (isGiftCard(this.formData.type)) {
        if (this.formData.typeOfProduct === 3) {
          this.$message({
            type: 'warn',
            message: this.$t('当前商品类型只支持单规格')
          })
          return false
        }
      }
      return true
    },
    async downloadTemplate() {
      const flag = await this.validDownloadTemplate()
      if (!flag) {
        return
      }
      if (this.checkMerchant) {
        this.$refs.upload.$refs.form.validateField(['merchantId'])
        if (!this.formData.merchantId) {
          return
        }
      }
      this.$refs.upload.$refs.form.validateField(['type'])
      if (!this.formData.type) {
        return
      }
      this.$refs.upload.$refs.form.validateField(['typeOfProduct'])
      if (this.formData.typeOfProduct === '') {
        console.log(this.formData.typeOfProduct)
        return
      }
      this.$refs.upload.$refs.form.validateField(['categoryId'])
      if (this.formData.categoryId === null) {
        console.log(this.formData.categoryId)
        return
      }
      var params = { ...this.formData, ...{ dataType: this.dataType }}
      params.categoryName = this.getCategoryName(this.formData.categoryId)
      this.$portal.downloadFileByPost(
        '/api/back-product-web/back/mp/batchCreateProduct/exportMpTemplate.do',
        params,
        'test123.xls',
        'ajax'
      )
    },
    // 根据类目id查询类目属性列表
    async queryCategoryAttribute() {
      const result = await this.$product.$api.mpApi.queryCategoryAttribute({
        categoryId: this.formData.categoryId,
        attType: 2
      })
      if (result.code === '0' && result.data && result.data.length > 0) {
        return true
      } else {
        return false
      }
    },
    getCategoryName(id) {
      var arr1 = this.$portal.tree2arr(this.categoryTreeData)
      var objArr = this.$portal.groupBy(arr1, 'id')
      var name = ''
      if (objArr[id]) {
        name = objArr[id][0].name
      }
      return name
    },
    getCategoryFullIdPath(id) {
      var arr1 = this.$portal.tree2arr(this.categoryTreeData)
      var objArr = this.$portal.groupBy(arr1, 'id')
      var arr = [id]
      var loopFun = id => {
        if (objArr[id] !== undefined) {
          arr.push(objArr[id][0].parentId)
          loopFun(objArr[id][0].parentId)
        } else {
          return
        }
      }
      loopFun(id)
      arr.reverse().shift(0)
      return arr.join('-')
    },
    async init() {
      this.dataType = Number(this.$route.query.dataType)
      this.typeOfProductOptionList = this.typeOfProductOption
      this.checkMerchant = this.dataType > 1
      if (this.dataType === 1) {
        this.getListBackCategoryTree()
      }
    },
    async initGiftCardSwitch() {
      const { data } = await this.$product.$api.productApi.getBooleanSwitcher({ key: 'giftCard.switch' })
      return !!data
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
      (parent.children || (parent.children = [])).push(item)
    } else {
      val.push(item)
    }
  })
  return val
}
</script>

<style lang="less" scoped>
</style>
