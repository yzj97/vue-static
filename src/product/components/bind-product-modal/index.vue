<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :modal-append-to-body="false"
      :title="$t('绑定商品')"
      width="800px"
      @open="init"
    >
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <el-col :span="12">
              <el-form-item :label="$t('商品名称')">
                <el-input v-model="queryParam.chineseName" name="queryParam_chineseName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('商品编码')">
                <el-input v-model="queryParam.code" name="queryParam_code" />
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div slot="btn">
          <el-button
            name="handleSearchReset"
            size="small"
            @click="handleSearchReset()"
          >{{ $t('重置') }}</el-button>
          <el-button name="query" size="small" type="primary" @click="query()">{{ $t('查询') }}</el-button>
        </div>
      </ody-list-search-area>
      <ody-table
        :data="list"
        :checked="checked"
        :highlight-current-row="true"
        :columns="columns"
        :can-filter="false"
        name="list190"
        @selection-change="handleCurrentChange"
      />
      <div class="block">
        <ody-pagination
          :current-page.sync="page.current"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="mini" @click="handleClose()">{{ $t('common_cancel') }}</el-button>
        <el-button
          name="handleOk"
          size="mini"
          type="primary"
          @click="handleOk"
        >{{ $t('common_confirm_search') }}</el-button>
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
      type: Object,
      default: null
    },
    dataType: {
      // 商品数据类型:1-运营商品;2-商家商品;3-店铺商品
      type: Number,
      default: null
    },
    listProductInfo: {
      type: Object,
      default() {
        return this.$product.$api.mpApi.listProductInfoByPage
      }
    }
  },
  data() {
    const vue = this
    return {
      queryParam: {
        chineseName: null,
        code: null,
        merchantId: null,
        dataType: null,
        typeOfProducts: [],
        useType: null
      },
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          label: vue.$t('商品名称'),
          show: true,
          prop: 'chineseName',
          minWidth: 150
        },
        {
          label: vue.$t('商品编码'),
          show: true,
          prop: 'code',
          minWidth: 150
        },
        {
          label: vue.$t('销售价(元)'),
          show: true,
          prop: 'salePriceWithTax',
          minWidth: 150
        }
      ],
      selectProduct: {},
      tableLoading: false
    }
  },
  methods: {
    async init() {
      this.handleSearchReset()
      await this.query()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.selectProduct = {}
    },
    handleOk() {
      this.$emit('update:visible', !this.visible)
      this.$emit('ok', this.selectProduct)
      this.selectProduct = {}
    },
    // 入参：newVal改动后的对象，oldVal改动前的对象
    handleCurrentChange(newVal, oldVal) {
      this.selectProduct = newVal
    },
    handleSearchReset() {
      this.queryParam = {
        chineseName: null,
        code: null,
        merchantId: null,
        dataType: null,
        typeOfProducts: [],
        useType: null
      }
      this.page = {
        size: 10,
        current: 1,
        total: 0
      }
    },
    async handlePageSizeChange(size) {
      this.$nextTick(function() {
        this.query()
      })
    },
    async handlePageCurrentChange() {
      await this.query()
    },
    async query(currentPage) {
      if (currentPage) {
        this.page.current = currentPage
      }
      this.tableLoading = true
      var filters = Object.assign({}, this.queryParam)
      console.info(this.dataType)
      filters.merchantId = this.merchantId
      filters.dataType = this.dataType
      filters.typeOfProducts = [0, 2]
      filters.type = [1, 32, 31]
      filters.useType = 0
      filters.status = 2
      const param = {
        page: this.page.current,
        limit: this.page.size,
        filters: filters
      }
      const result = await this.listProductInfo(param)
      if (result && result.data) {
        this.list = result.data
        this.page.total = result.total
        this.tableLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
