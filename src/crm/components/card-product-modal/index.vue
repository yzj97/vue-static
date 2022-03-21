<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="title || $t('选择商品')"
      width="65%"
      @open="init"
      @change-max-height="handleMaxHeight">
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form">
            <ody-search-item v-show="searchItems.includes('商品名称')" :label="$t('商品名称')" prop="chineseName">
              <el-input v-model="queryParam.chineseName" name="queryParam_chineseName"/>
            </ody-search-item>
            <ody-search-item v-show="searchItems.includes('商品编码')" :label="$t('商品编码')" prop="code">
              <el-input v-model="queryParam.code" name="queryParam_code"/>
            </ody-search-item>
            <ody-search-item v-show="searchItems.includes('商品类型')" :label="$t('商品类型')" prop="type">
              <el-select :placeholder="$t('全部')" v-model="queryParam.type" name="queryParam_type" filterable>
                <el-option v-for="item in cardTypeList" v-if="type.includes(item.code)" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
          <el-button name="query" size="small" type="primary" @click="query(1)">{{ $t('查询') }}</el-button>
        </div>
      </ody-list-search-area>
      <div>
        <div>
          <ody-table
            v-loading="loading"
            ref="table"
            :checked.sync="checkedList"
            :can-filter="false"
            :multiple="multiple"
            :highlight-current-row="!multiple"
            :columns="columns"
            :data="list"
            :selectable="handleSelectable"
            :max-height="tableMaxHeight"
            name="list387"
            @selection-change="handleSelectionChange"
          />
        </div>
        <div>
          <ody-pagination
            :current-page.sync="page.currentPage"
            :list="list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="page.itemsPerPage"
            :total.sync="page.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="sizeChange"
            @current-change="query"/>

        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
          <el-button :disabled="multiple && checkedList.length === 0" name="handleOk" size="small" type="primary" @click="handleOk">{{ $t('确定') }}</el-button>
        </el-row>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    searchItems: {
      type: Array,
      default: () => {
        return ['商品名称', '商品编码', '商品类型']
      }
    },
    columnItems: {
      type: Array,
      default: () => {
        return ['商品名称', '商品编码', '商家名称', '商品类型', '面值', '兑换商品编码', '兑换商品名称']
      }
    },
    merchantId: {
      type: Number,
      default: null
    },
    type: { // 商品类型:1-常规商品;2卡券;3海购;4赠品;10实体卡;11虚拟卡;20券;5生鲜产品;6增值服务;7其他;21积分商品;31-称重商品;32-餐饮商品
      type: Array,
      default: () => {
        return null
      }
    },
    dataType: { // 商品数据类型:1-运营商品;2-商家商品;3-店铺商品
      type: Number,
      default: 2
    },
    useType: { // 用途类型:0-成品;1-原料
      type: Number,
      default: null
    },
    status: { // 状态
      type: Array,
      default: null
    },
    extraFilters: {
      type: Object,
      default: () => {
        return {}
      }
    },
    productQuery: {
      type: Function,
      default: null
    },
    mpIdLabel: {
      type: String,
      default: 'cardMpId'
    },
    mpCodeLabel: {
      type: String,
      default: 'cardMpCode'
    },
    mpNameLabel: {
      type: String,
      default: 'cardMpName'
    },
    bindMpIdLabel: {
      type: String,
      default: 'giftMpId'
    },
    bindMpCodeLabel: {
      type: String,
      default: 'giftMpCode'
    },
    bindMpNameLabel: {
      type: String,
      default: 'giftMpName'
    },
    checkedMpIds: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    const vue = this
    return {
      cardTypeList: [
        { code: 33, name: this.$t('电子礼品卡') },
        { code: 34, name: this.$t('实体礼品卡') },
        { code: 35, name: this.$t('电子提货卡') },
        { code: 36, name: this.$t('实体提货卡') }
      ],
      tableMaxHeight: 100,
      loading: false,
      list: [],
      checkedList: [],
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 0
      },
      columns: [
        {
          show: this.columnItems.includes('商品名称'),
          label: vue.$t('商品名称'),
          prop: 'chineseName',
          minWidth: 150
        },
        {
          show: this.columnItems.includes('商品编码'),
          label: vue.$t('商品编码'),
          prop: 'code',
          minWidth: 150
        },
        {
          show: this.columnItems.includes('商家名称'),
          label: vue.$t('商家名称'),
          prop: 'merchantName',
          minWidth: 100
        },
        {
          show: this.columnItems.includes('商品类型'),
          label: vue.$t('商品类型'),
          prop: 'typeStr',
          minWidth: 100
        },
        {
          show: this.columnItems.includes('面值'),
          label: vue.$t('面值') + '(' + vue.$t('元') + ')',
          prop: 'faceValue',
          minWidth: 100
        },
        {
          show: this.columnItems.includes('兑换商品编码'),
          label: vue.$t('兑换商品编码'),
          prop: 'bindProductCode',
          minWidth: 100
        },
        {
          show: this.columnItems.includes('兑换商品名称'),
          label: vue.$t('兑换商品名称'),
          prop: 'bindProductName',
          minWidth: 100
        }
      ],
      queryParam: getDefaultForm(),
      defaultFilters: Object.assign({ merchantId: this.merchantId, typeList: this.type, dataType: this.dataType, useType: this.useType, status: this.status }, this.extraFilters)
    }
  },
  async mounted() {
    this.mpApi = this.$crm.$api.product
    this.productQuery = this.productQuery || this.mpApi.product_listMpPage
  },
  methods: {
    init() {
      this.checkedList = []
      this.query()
    },
    handleMaxHeight(maxHeight) {
      this.dialogMaxHeight = maxHeight

      if (maxHeight === 0) {
        this.tableMaxHeight = 1000
        return false
      }

      const dialogHeight = 48
      const dialogPaddingTop = 24
      const dialogPaddingBottom = 12
      const tableMaxHeight =
        maxHeight -
        dialogHeight -
        dialogPaddingTop -
        dialogPaddingBottom -
        270

      this.tableMaxHeight = tableMaxHeight
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      const list = []
      if (this.checkedList && this.checkedList.length > 0) {
        for (let i = 0; i < this.checkedList.length; i++) {
          const item = this.checkedList[i]
          list.push(this._transData(item))
        }
      }
      this.$emit('ok', list)
      this.$emit('update:visible', !this.visible)
    },
    handleSelectionChange(val) {
      if (this.multiple) {
        return
      }
      const list = [this._transData(val)]
      this.$emit('ok', list)
      this.$emit('update:visible', !this.visible)
    },
    _transData(item) {
      const obj = {}
      obj.merchantName = item.merchantName
      obj.merchantId = item.merchantId
      obj.merchantCode = item.merchantCode
      obj[this.mpIdLabel] = item.id
      obj[this.mpCodeLabel] = item.code
      obj[this.mpNameLabel] = item.chineseName
      obj[this.bindMpIdLabel] = item.bindProductId
      obj[this.bindMpCodeLabel] = item.bindProductCode
      obj[this.bindMpNameLabel] = item.bindProductName
      obj.faceValue = item.faceValue
      obj.typeName = item.typeStr
      obj.type = item.type
      return obj
    },
    query(currentPage) {
      if (currentPage) {
        this.page.currentPage = currentPage
      }
      const params = Object.assign({}, this.page, this.queryParam, this.defaultFilters)
      if (!params.chineseName) {
        delete params.chineseName
      }
      if (!params.code) {
        delete params.code
      }
      this.loading = true
      return this.productQuery(params).then(
        res => {
          this.loading = false
          this.list = res.data.listObj
          this.list.forEach(item => {
            if (this.checkedMpIds.length > 0) {
              if (this.checkedMpIds.includes(item.id)) {
                this.checkedList.push(item)
              }
            }
          })
          this.page.total = res.data.total
        }
      )
    },
    selectRow(selection, row) {
      row.checked = !row.checked
    },
    reset() {
      this.queryParam = getDefaultForm()
    },
    sizeChange(val) {
      this.page.itemsPerPage = val
      this.query()
    },
    handleSelectable(row, index) {
      return !this.checkedMpIds.includes(row.id)
    }
  }
}

function getDefaultForm() {
  return Object.assign({}, {
    chineseName: null,
    code: null,
    barCode: null,
    artNo: null,
    dId: null,
    categoryIds: null,
    brandId: null,
    status: 2
  })
}
</script>

<style lang="scss" scoped>

</style>
