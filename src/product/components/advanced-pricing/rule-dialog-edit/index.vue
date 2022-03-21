<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('添加条件')"
      @open="init">
      <el-form ref="ruleForm" :model="params" :rules="rules" label-position="right" label-width="150px">
        <el-form-item :label="$t('条件')" prop="optionId">
          <el-select v-model="params.optionId" :disabled="params.isEdit" name="params_optionId" @change="handleChangeOptionId">
            <el-option
              v-for="item in optionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('运算符')" prop="operationCode">
          <el-select v-model="params.operationCode" name="params_operationCode">
            <el-option
              v-for="item in operationType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('条件值')" prop="valueCode">
          <el-select v-if="!(params.optionId === 3)" v-model="params.valueCode" name="params_valueCode" @change="handleChangeOptionValue">
            <el-option
              v-for="item in optionValueList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input v-if="params.optionId === 3" v-model="params.valueCode" name="params_valueCode2" @change="handleInputEnter"/>
        </el-form-item>
      </el-form>
      <el-form ref="contentForm" :model="contentForm">
        <el-table :data="contentTables" name="contentTables183">
          <el-table-column
            :label="this.$t('已添加值')"
            align="center"
            min-width="120"
            prop="name"/>
          <el-table-column
            :label="this.$t('操作')"
            align="center"
            min-width="120">
            <template slot-scope="scope">
              <div><el-button name="removeContent" size="small" type="primary" @click="removeContent(scope.row)" >{{ $t('删除') }}</el-button></div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ody-button code="ui" name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</ody-button>
        <ody-button code="ui" name="handleOk" size="small" type="primary" @click="handleOk">{{ $t('确认') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    merchantId: {
      type: Number,
      default: null
    },
    rule: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      optionList: [
        { value: 1, label: this.$t('渠道') },
        { value: 2, label: this.$t('店铺') },
        { value: 3, label: this.$t('客户编码') },
        { value: 4, label: this.$t('销售区域') },
        { value: 5, label: this.$t('订单类型') }
      ],
      operationType: [
        { value: '=', label: '=' }
      ],
      optionValueList: [],
      channelList: [],
      storeList: [],
      saleAreaList: [],
      soTypeList: [],
      params: {
        optionId: '',
        optionName: '',
        operationCode: '=',
        valueCode: '',
        isEdit: false
      },
      rules: {
        optionId: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ]
      },
      contentForm: {},
      contentTables: []
    }
  },
  methods: {
    async init() {
      await this.loadChannelList()
      await this.loadStoreList()
      await this.loadSoTypeList()
      await this.loadSaleAreaList()
      if (this.rule && this.rule.optionId) {
        this.params.optionId = this.rule.optionId
        this.handleChangeOptionId(this.params.optionId)
        this.params.optionName = this.rule.optionName
        this.params.operationCode = this.rule.operationCode
        this.params.isEdit = true
        if (this.rule.contentTables && this.rule.contentTables.length > 0) {
          this.contentTables = Object.assign([], this.rule.contentTables)
        }
      }
    },
    async loadChannelList() {
      const channel = await this.$product.$api.userApi.queryChannelMap({})
      if (channel && channel.data) {
        this.channelList = []
        for (const c in channel.data) {
          this.channelList.push({ value: channel.data[c].channelCode, label: channel.data[c].channelName })
        }
      }
    },
    async loadStoreList() {
      const store = await this.$product.$api.merchantApi.queryPlatformAuthStorePage(
        { currentPage: 1, itemsPerPage: 500, merchantId: this.merchantId }
      )
      if (store && store.data && store.data.listObj && store.data.listObj.length > 0) {
        this.storeList = []
        store.data.listObj.map(item => {
          this.storeList.push({ value: item.storeId, label: item.storeName })
        })
      }
    },
    async loadSaleAreaList() {
      const saleArea = await this.$product.$api.userApi.querySalesAreaByMerchantId({ merchantId: this.merchantId })
      if (saleArea && saleArea.data && saleArea.data.length > 0) {
        this.saleAreaList = []
        saleArea.data.map(item => {
          this.saleAreaList.push({ value: item.areaCode, label: item.areaName })
        })
      }
    },
    async loadSoTypeList() {
      const soType = await this.$product.$api.common.querySoTypeList({})
      if (soType && soType.data && soType.data.length > 0) {
        this.soTypeList = []
        soType.data.map(item => {
          this.soTypeList.push({ value: item.code, label: item.name })
        })
      }
    },
    handleClose() {
      this.$refs['ruleForm'].resetFields()
      this.params.isEdit = false
      this.params.optionName = ''
      this.contentTables = []
      this.$emit('update:rule', {})
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const selected = Object.assign({}, this.params)
          selected.contentTables = this.contentTables
          this.$emit('ok', selected)
          this.handleClose()
        } else {
          return false
        }
      })
    },
    handleChangeOptionId(value) {
      this.contentTables = []
      this.params.valueCode = ''
      this.optionList.map(item => {
        if (item.value === value) {
          this.params.optionName = item.label
        }
      })
      switch (value) {
        case 1:
          this.optionValueList = this.channelList
          break
        case 2:
          this.optionValueList = this.storeList
          break
        case 3:
          break
        case 4:
          this.optionValueList = this.saleAreaList
          break
        case 5:
          this.optionValueList = this.soTypeList
          break
        default:
          break
      }
    },
    handleChangeOptionValue(value) {
      if (value) {
        let name = ''
        this.optionValueList.map(item => {
          if (item.value === value) {
            name = item.label
          }
        })
        this.addContent({ name: name, value: value })
      }
    },
    handleInputEnter(value) {
      this.addContent({ name: value, value: value })
    },
    addContent(param) {
      let exist = false
      this.contentTables.map(item => {
        if (item.value === param.value) {
          exist = true
        }
      })
      if (!exist) {
        this.contentTables.push({ name: param.name, value: param.value })
      }
    },
    removeContent(row) {
      const index = this.contentTables.indexOf(row)
      this.contentTables.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
