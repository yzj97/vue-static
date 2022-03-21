<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :modal-append-to-body="false"
      :title="$t('商品品牌')"
      width="860px"
      @open="init"
    >
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form" @submit.native.prevent>
            <el-col :span="12">
              <el-form-item :label="$t('品牌名称')">
                <el-input v-model="searchForm.name" :placeholder="$t('请输入品牌名称')" name="searchForm_name" />
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="10">
              <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
              <el-button name="query" size="small" type="primary" @click="query(1)">{{ $t('common_search') }}</el-button>
            </el-col>
          </el-form>
        </div>
      </ody-list-search-area>
      <ody-table
        :data="list"
        :checked="checked"
        :highlight-current-row="true"
        :columns="columns"
        :can-filter="false"
        name="list870"
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
        <el-button name="handleClose" size="mini" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button name="handleOk" size="mini" type="primary" @click="handleOk">{{ $t('common_confirm_search') }}</el-button>
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
    listBrand: {
      type: Object,
      default() {
        return this.$product.$api.mpApi.listBrand
      }
    }
  },
  data() {
    const vue = this
    return {
      searchForm: {
        name: null
      },
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          label: vue.$t('品牌名称'),
          show: true,
          prop: 'name',
          minWidth: 150
        },
        {
          label: vue.$t('品牌名称(第二语言)'),
          show: true,
          prop: 'nameLan2',
          minWidth: 150
        },
        {
          label: vue.$t('品牌LOGO'),
          show: true,
          prop: 'logUrl',
          minWidth: 150,
          formatter(row, column) {
            if (row.logUrl) {
              return `<img src="${row.logUrl}" width="50">`
            }
            return ''
          }
        }
      ],
      selectBrand: {},
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
      this.selectBrand = {}
    },
    handleOk() {
      this.$emit('update:visible', !this.visible)
      this.$emit('ok', this.selectBrand)
      this.selectBrand = {}
    },
    // 入参：newVal改动后的对象，oldVal改动前的对象
    handleCurrentChange(newVal, oldVal) {
      this.selectBrand = newVal
    },
    handleSearchReset() {
      this.searchForm = {
        name: null
      }
      // this.page = {
      //   size: 10,
      //   current: 1,
      //   total: 0
      // }
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
      const param = {
        itemsPerPage: this.page.size,
        currentPage: this.page.current,
        name: this.searchForm.name,
        merchantId: this.merchantId
      }
      const result = await this.listBrand(param)
      if (result && result.data) {
        const data = result.data
        this.list = data.listObj
        this.page.total = data.total
        this.tableLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
