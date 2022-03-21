<template>
  <section class="pg-afterSaleModal-list">
    <el-form ref="afterSaleForm" :model="afterSaleForm" :rules="rules">
      <div>
        <ody-dialog-full-right
          :visible.sync="visible"
          :hide-dialog="handleClose"
          :title="$t('afterSale')"
          @open="init"
        >
          <div>{{ $t('applyAfterSale') }}</div>
          <el-form-item :label="$t('so_return_type')" prop="status">
            <el-radio-group v-model="afterSaleType" name="afterSaleType" @change="onReturnTypeChange()">
              <el-radio
                v-for="item in types"
                :key="item.code"
                :label="item.code"
                :value="item.code"
              >{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <ody-list-table-area>
            <div slot="table">
              <ody-table
                :loading="loading"
                :data="editReturnItemList"
                :columns="columns"
                :multiple="multiple"
                :checked.sync="checked"
                :selectable="handleSelectable"
                name="editReturnItemList240"
                @selection-change="handleSelectionChange"
              />
            </div>
          </ody-list-table-area>
          <div class="apply-description">
            <div>{{ $t('returnApplyDescription') }}</div>
            <el-form-item :label="$t('returnReason')" prop="status">
              <el-select v-model="returnReason" name="returnReason">
                <el-option v-for="item in returnReasonList" :label="item.name" :key="item.code" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" :label="$t('returnRemark')">
              <el-input
                :rows="2"
                v-model="afterSaleData.returnRemark"
                :placeholder="$t('请输入内容')"
                name="afterSaleData_returnRemark"
                type="textarea"
                maxlength="1000"/>
            </el-form-item>
            <el-row class="row_class">
              <el-col>附件：</el-col>
              <el-col>
                <ody-upload-image :limit="3" :file-list.sync="files" :pic-type="['png','jpg','gif']" />
              </el-col>
            </el-row>
          </div>
          <div v-show="isShowGoodsReturnTypeArea()">
            <div>{{ $t('goodsReturnType') }}</div>
            <el-form-item>
              <el-radio-group v-model="goodsReturnType" name="goodsReturnType">
                <el-radio
                  v-for="item in goodsReturnTypes"
                  :key="item.code"
                  :label="item.code"
                  :value="item.code"
                >{{ item.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
            <el-button
              :disabled="subBut === 1"
              name="saveReturn"
              type="primary"
              @click="saveReturn"
            >{{ $t('common_submit') }}</el-button>
          </span>
        </ody-dialog-full-right>
      </div>
    </el-form>
  </section>
</template>
<script>
import API from '@/api/common.js'
export default{
  props: {
    soInfo: {
      type: Object,
      required: true
    },
    orderCode: {
      type: String,
      required: true
    },
    formData: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    supportReturnTypes: {
      type: Object,
      required: true
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vue = this
    return {
      uploadUrl: API.fileUpload.url,
      afterSaleForm: {},
      rules: {
        returnProductItemNum: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { validator: this.validateNum, trigger: 'blur' }
        ]
      },
      multiple: true,
      noSupportsReturn: true,
      orderStatus: '',
      loading: false,
      checked: [],
      checkAll: false,
      subBut: 0,
      types: [],
      files: [], // 附件
      initData: {
        orderCode: this.soInfo.orderCode,
        returnPicList: []
      },
      returnReason: '',
      afterSaleType: '',
      goodsReturnType: '',
      afterSaleData: {
        returnReason: ''
      },
      returnReasonList: [],
      editReturnItemList: [],
      goodsReturnTypes: [],
      tempType: {},
      columns: [
        {
          show: true,
          prop: 'productPicPath',
          label: this.$t('manual_order_product_pic'),
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            return (
              <img src={ params.row.productPicPath } style='width: 40px; height: 40px;'/>
            )
          }
        },
        {
          show: true,
          prop: 'productCname',
          label: this.$t('manual_order_product_name'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('manual_order_product_code'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'extInfoStr', // todo
          label: this.$t('manual_order_product_attr'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'pieceworkUnit',
          label: this.$t('manual_order_bar_code_unit'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'productItemNum',
          label: this.$t('manual_order_purchase_num'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'availReturnNum',
          label: this.$t('canReturnCount'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'returnProductItemNum',
          label: this.$t('returnApplyCount'),
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            const item = params.row
            return (
              <input class='el-input__inner' type='text' name={'returnProductItemNum_' + item.soItemId} rules={vue.rules.returnProductItemNum} disabled={item.type === 31} value={item.returnProductItemNum} on-blur={(event) => {
                this.calcApplyReturnAmount(item)
              }}>
              </input>
            )
          }
        },
        {
          show: true,
          prop: 'applyReturnAmount',
          label: this.$t('applyReturnAmount'),
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            const item = params.row
            const isInput = (<input class='el-input__inner' type='text' ref={'applyReturnAmount_' + item.soItemId} value={item.applyReturnAmount} on-blur={(event) => {
              this.checkApplyReturnAmount(item)
            }}>
            </input>)
            const isShow = <div>{item.applyReturnAmount}</div>
            return this.isGoodsReturnEditable(item) ? isInput : isShow
          }
        },
        {
          show: true,
          prop: 'productTotalAmount',
          label: this.$t('returnInventoryPurchaseAmount'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            return (vue.roundingNum(row.productTotalAmount))
          }
        }
      ]
    }
  },
  computed: {
    checkedMap() {
      return this.checked.reduce((rtv, item) => {
        rtv[item.id] = true
        return rtv
      }, {})
    }
  },
  methods: {
    validateNum(rule, value, callback) {
      const num = parseInt(value)
      if (num > 5 || num <= 0) {
        this.subBut = 1
        return callback(new Error(this.$t('errorReturnCount')))
      }
      return callback(new Error(this.$t('invalid_order_item_num')))
    },
    handleExceed(files, fileList) {
      this.$message.warning(this.$t('upload_pic_max_three'))
    },
    init() {
      this.files = []
      this.checked = []
      if (!this.isEdit) {
        this.multiple = true
        this.getReturnSupportReturn()
      } else {
        this.multiple = false
      }
    },
    getReturnSupportReturn: function() {
      const vue = this
      this.$oms.$api.soReturn.soReturnSupportReturn({ orderCode: this.soInfo.orderCode }).then(result => {
        if (result.code === '0') {
          vue.isEdit = false
          vue.afterSaleData = null
          vue.afterSaleData = Object.assign({}, Object.assign({}, vue.initData))
          vue.loadTypeList().then(function() {
            vue.loadReturnReasonList()
            vue.loadReturnItemList()
          })
          vue.loadReturnPicList()
        }
      })
    },
    handleClose() {
      this.subBut = 0
      this.$emit('update:visible', !this.visible)
      this.visible = false
    },
    handleOk() {
      this.subBut = 0
      this.$emit('update:visible', !this.visible)
      this.$emit('ok', this.checked)
    },
    roundingNum(value) {
      value = Number(value)
      return value.toFixed(2)
    },
    loadTypeList: function() {
      const vue = this
      const baseUrl = '/oms-web/public/order/code/listByCategory'
      return this.$portal.get(baseUrl + '/RETURN_TYPE', {}).then(result => {
        vue.types = result.data
        if (vue.supportReturnTypes) {
          vue.types = []
          result.data.forEach(function(type) {
            if (vue.supportReturnTypes[type.code + '']) {
              vue.types.push(type)
            }
          })
        }
        if (!vue.isEdit) {
          vue.afterSaleType = vue.types[0].code
          vue.afterSaleData.type = vue.types[0].code
        } else {
          vue.afterSaleType = vue.afterSaleType + ''
          vue.afterSaleData.type = vue.afterSaleData.type + ''
        }
      })
    },
    loadReturnReasonList: function() {
      const vue = this
      this.$oms.$api.common.selectCodes({ category: 'RETURN_REASON_' + vue.afterSaleType }).then(result => {
        vue.returnReasonList = result.data
        if (!vue.isEdit || !vue.afterSaleData.returnReason) {
          vue.afterSaleData.returnReason = vue.returnReasonList[0].code
          vue.returnReason = vue.returnReasonList[0].code
        } else {
          vue.afterSaleData.returnReason = vue.afterSaleData.returnReason + ''
          vue.returnReason = vue.afterSaleData.returnReason + ''
        }
      })
    },
    loadGoodsReturnTypeList: function() {
      const vue = this
      const baseUrl = '/oms-web/public/order/code/listByCategory'
      return this.$portal.get(baseUrl + '/GOODS_RETURN_TYPE', {}).then(result => {
        vue.goodsReturnTypes = result.data
        if (!vue.isEdit || vue.afterSaleData.returnReason || !vue.goodsReturnType) {
          vue.goodsReturnType = vue.goodsReturnTypes[0].code
          vue.afterSaleData.goodsReturnType = vue.goodsReturnTypes[0].code
        } else {
          vue.goodsReturnType = vue.goodsReturnType + ''
          vue.afterSaleData.goodsReturnType = vue.afterSaleData.goodsReturnType + ''
        }
      })
    },
    loadReturnItemList: function() {
      const vue = this
      if (this.isEdit) {
        this.$oms.$api.soReturnItem.soReturnItemList({
          filters: { returnId: this.afterSaleData.id, isAvailable: 1 }
        }).then(result => {
          vue.editReturnItemList = result.data
          vue.editReturnItemList.forEach(item => {
            item.availReturnAmount = item.originalApplyReturnAmount
            item.availReturnNum = item.originalReturnProductItemNum
          })
        })
      } else {
        this.listOrderItems()
      }
    },
    listOrderItems: function() {
      const vue = this
      this.$oms.$api.soReturnItem.soReturnItemListSoItem({
        orderCode: this.soInfo.orderCode,
        type: this.afterSaleType,
        sysSource: null
      }).then(result => {
        vue.editReturnItemList = []
        if (result.data.length === 0 && !vue.isEdit) {
          // todo,提示当前售后类型无可售后的商品
          vue.$message({ type: 'error', message: vue.$t('errorNoInventoryCanAfterSale') })
          return
        }
        result.data.forEach(item => {
          item.soItemId = item.id
          item.availReturnNum = item.availableReturnProductItemNum
          item.availReturnAmount = (item.availableReturnProductAmount).toFixed(2)
          item.productTotalAmount = item.productItemAmount
          item.returnProductItemNum = item.availReturnNum
          item.applyReturnAmount = item.availReturnAmount
          item.pieceworkUnit = item.unit
          this.editReturnItemList.push(item)
          vue.$nextTick(() => {
            this.doCalcApplyReturnAmount(item)
          })
        })
      })
    },
    loadReturnPicList: function() {
      if (this.isEdit) {
        const vue = this
        this.$oms.$api.soReturnPic.soReturnPicList({
          filters: {
            returnId: this.afterSaleData.id, isAvailable: 1
          }
        }).then(result => {
          result.data.forEach(item => {
            var file = {}
            file.url = item.picUrl
            vue.files.push(file)
          })
        })
      }
    },
    doCalcApplyReturnAmount: function(item) {
    },
    isGoodsReturnEditable: function(item) {
      if (((this.afterSaleType === '2' || this.afterSaleType === '3' || this.afterSaleType === '4') && this.checkedMap[item.id]) || (this.isEdit && (this.afterSaleType === '2' || this.afterSaleType === '3' || this.afterSaleType === '4'))) {
        return true
      } else {
        return false
      }
    },
    onReturnTypeChange: function() {
      if (this.isShowGoodsReturnTypeArea()) {
        this.loadGoodsReturnTypeList()
      } else {
        delete this.afterSaleData.goodsReturnType
      }
      delete this.afterSaleData.returnReason
      this.loadReturnReasonList()
      this.loadReturnItemList()
      this.checked = []
    },
    isShowGoodsReturnTypeArea: function() {
      if (this.afterSaleType === '3' || this.afterSaleType === '4') {
        return true
      } else {
        return false
      }
    },
    isReturnTypeEditable: function(returnType) {
      if (!this.isEdit) {
        return false
      }
      if ((this.afterSaleType === '2' && returnType === '3') ||
          (this.afterSaleType === '3' && returnType === '2') ||
          this.afterSaleType === returnType) {
        return false
      }
      return true
    },
    // 取消或保存售后单调用
    loadReturnList: function() {
      this.$emit('soReturnChange')
    },
    calcApplyReturnAmount: function(item) {
      const value = event.target.value
      this.subBut = 0
      if (!/^\d{1,9}$/.test(value) || Number(value) <= 0 || value > item.availReturnNum) {
        this.$message({
          type: 'warn',
          message: this.$t('errorReturnCount')
        })
        event.target.value = item.availReturnNum
        // this.subBut = 1
      } else {
        item.returnProductItemNum = value
        this.subBut = 0
        // this.doCalcApplyReturnAmount(item)
        if (item.returnProductItemNum === item.availReturnNum) {
          item.applyReturnAmount = item.availReturnAmount
        } else {
          item.calculatedApplyReturnAmount = (item.availReturnAmount * item.returnProductItemNum / item.availReturnNum).toFixed(2)
          item.applyReturnAmount = item.calculatedApplyReturnAmount
        }
      }
    },
    hasInvalid: function() {
      if (this.isEdit) {
        return false
      } else {
        var checkedItems = this.getCheckedItems(this.editReturnItemList)
        for (var i = 0; i < checkedItems.length; i++) {
          var item = checkedItems[i]
          var applyReturnAmountFormat = parseFloat(item.applyReturnAmount)
          var availReturnAmountFormat = parseFloat(item.availReturnAmount)
          var returnProductItemNumFormat = parseInt(item.returnProductItemNum)
          var availReturnNumFormat = parseInt(item.availReturnNum)
          if (returnProductItemNumFormat <= 0 || returnProductItemNumFormat > availReturnNumFormat || applyReturnAmountFormat > availReturnAmountFormat) {
            return true
          }
        }
      }
    },
    saveReturn: function() {
      const vue = this
      this.subBut = 1
      var saveData = []
      if (vue.files && vue.files.length > 0) {
        for (let i = 0; i < vue.files.length; i++) {
          vue.afterSaleData.returnPicList.push(vue.files[i].url)
        }
      }
      vue.afterSaleData.returnReason = vue.returnReason
      vue.afterSaleData.type = vue.afterSaleType
      if (this.isEdit) {
        vue.afterSaleData.returnItems = vue.editReturnItemList
        saveData = [vue.afterSaleData]
      } else {
        var checkedItems = this.checked
        if (checkedItems.length === 0) {
          vue.$message({ type: 'error', message: vue.$t('errorAtleastSelectOneInventory') })
          this.subBut = 0
          return
        }
        var dto = Object.assign({}, vue.afterSaleData)
        dto.returnItems = checkedItems
        saveData.push(dto)
      }
      let promise = vue.$oms.$api.soReturn.soReturnBatchAdd
      if (vue.isEdit) {
        promise = vue.$oms.$api.soReturn.soReturnBatchUpdate
      }
      promise(JSON.stringify(saveData)).then((res) => {
        vue.$message({
          type: 'success',
          message: this.$t('common_save_success')
        })
        this.$emit('update:visible', !this.visible)
        vue.loadReturnList()
        this.subBut = 0
      }).finally(() => {
      })
    },
    async returnEdit(item) {
      this.files = []
      this.subBut = 0
      this.afterSaleData = Object.assign(Object.assign({}, item), this.initData)

      this.types = []
      const baseUrl = '/oms-web/public/order/code/listByCategory'
      const result = await this.$portal.get(baseUrl + '/RETURN_TYPE', {})
      this.types = result.data || []
      if (!item.allowModificationType) {
        item.allowModificationType = []
      }
      item.allowModificationType = item.allowModificationType.map(i => i + '')
      // 售后类型为可替换的类型以及当前售后类型
      item.type = item.type + ''
      this.types = this.types.filter(i => item.type === i.code || item.allowModificationType.indexOf(i.code) >= 0)
      this.afterSaleData.type = item.type
      this.isEdit = true
      this.afterSaleType = this.afterSaleData.type

      if (this.isShowGoodsReturnTypeArea()) {
        await this.loadGoodsReturnTypeList()
      }
      this.loadReturnReasonList()
      this.loadReturnItemList()
      this.loadReturnPicList()
      this.visible = true
    },
    checkApplyReturnAmount: function(item) {
      const value = event.target.value
      this.subBut = 0
      if (!value) {
        this.subBut = 1
        return
      }
      if (!/^\d{1,9}(\.?\d{1,})?$/.test(value) || Number(value) === 0 || Number(value) > this.getAvailableReturnAmount(item)) {
        this.$message({
          type: 'warn',
          message: this.$t('errorReturnAmount')
        })
        event.target.value = this.getAvailableReturnAmount(item)
        // this.subBut = 1
      } else {
        item.applyReturnAmount = value
      }
    },
    getAvailableReturnAmount(item) {
      if (item.returnProductItemNum === item.availReturnNum) {
        return item.availReturnAmount
      } else {
        return (item.availReturnAmount * item.returnProductItemNum / item.availReturnNum).toFixed(2)
      }
    },
    deleteAttachment(file) {
      this.$oms.$api.soAttachment.deleteSoAttachment({ id: file.id }).then(resp => {
        var index = this.afterSaleData.returnPicList.indexOf(file)
        if (index > -1) {
          this.afterSaleData.returnPicList.splice(index, 1)
        }
        this.$message(this.$t('common_delete_success'))
      }).catch(e => {
        this.$message(this.$t('common_delete_fail'))
      })
    },
    downloadFile(file) {
      window.open(file.path)
    },
    uploadCallback(resp, file, fileList) {
      this.$oms.$api.soAttachment.addSoAttachment({
        name: resp.data[0].name,
        orderCode: this.soInfo.orderCode,
        path: resp.data[0].url
      }).then(resp => {
        file.id = resp.data.id
        file.path = resp.data.path
        file.name = resp.data.name
        this.afterSaleData.returnPicList.push(file.path)
      })
    },
    getAttributes(val) {
      var value = ''
      if (val === null || val === undefined || val === '' || val.length === 0) {
        // return this.$message(this.$('no_exist'))
        return ''
      }
      var json = JSON.parse(val)
      if (json && json['attributeList']) {
        for (var i = 0; i < json['attributeList'].length; i++) {
          value = value + json['attributeList'][i].name + ':' + json['attributeList'][i].value + ';'
        }
        return value
      }
      return ''
    }
  }
}
</script>

<style scoped>
  .apply-description{
    margin-top: 20px;
  }
</style>
