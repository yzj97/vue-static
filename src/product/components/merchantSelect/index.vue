<template>
  <section>
    <el-input v-model="selectedMerchant.merchantName" :placeholder="$t('请选择')" name="selectedMerchant_merchantName" readonly="readonly" @focus="handleOpen"/>
    <ody-dialog
      :title="this.$t('提示')"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="720px">
      <div>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="100px" class="form">
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="$t('商家编码') + ':'">
                    <el-input v-model="search.merchantCode" name="search_merchantCode" size="small"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="$t('商家名称') + ':'">
                    <el-input v-model="search.merchantName" name="search_merchantName" size="small"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div slot="btn">
            <el-button name="handleSelect" size="small" type="primary" @click="handleSelect">{{ $t('查询') }}</el-button>
            <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
          </div>
        </ody-list-search-area>

        <ody-list-table-area>
          <div slot="table">
            <el-table :data="tableList" name="tableList753" size="small" highlight-current-row @row-click="rowClick">
              <el-table-column :label="$t('商家编码')" prop="merchantCode" width="240"/>
              <el-table-column :label="$t('商家名称')" prop="merchantName"/>
            </el-table>
          </div>
          <div slot="page">
            <ody-pagination
              :current-page="page.current"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="page.size"
              :total="page.total"

              layout="total, sizes, prev, pager, next, jumper"
              @size-change="page.handleSizeChange"
              @current-change="page.handleCurrentChange"/>
          </div>
        </ody-list-table-area>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="dialogVisible" size="small" @click="dialogVisible = false">{{ $t('取消') }}</el-button>
        <el-button name="ok" size="small" type="primary" @click="ok">{{ $t('确定') }}</el-button>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  name: 'MerchantSelect',
  props: {
    value: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    const vue = this
    return {
      selectedMerchant: {},
      dialogVisible: false,

      search: {
        merchantCode: null,
        merchantName: null
      },
      tempSelected: null,
      tableList: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
        handleSizeChange(val) {
          vue.page.size = val
          vue.updateList()
        },
        handleCurrentChange(val) {
          vue.page.current = val
          vue.updateList()
        }
      }
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal == null) {
        this.selectedMerchant = {}
        this.$emit('change', this.selectedMerchant)
      } else if (newVal !== this.selectedMerchant.merchantId) {
        this.init(newVal).then(resp => {
          this.$emit('change', this.selectedMerchant)
        })
      }
    }
  },
  created() {
    if (this.value) {
      this.init(this.value)
    }
  },
  methods: {
    async init(merchantId) {
      const { data: { listObj }} = await this.$product.$api.merchantApi.queryPlatformAuthMerchantPage({
        currentPage: 1,
        itemsPerPage: 1,
        merchantId
      })
      if (listObj.length > 0) {
        this.selectedMerchant = listObj[0]
      }
    },

    handleClose() {
      this.dialogVisible = false
    },
    handleOpen() {
      this.dialogVisible = true
      this.page.current = 1
      this.handleReset()
      this.updateList()
    },
    handleSelect() {
      this.page.current = 1
      this.updateList()
    },
    handleReset() {
      this.search.merchantCode = null
      this.search.merchantName = null
    },
    rowClick(row) {
      this.tempSelected = row
    },
    ok() {
      if (this.tempSelected) {
        this.selectedMerchant = this.tempSelected
        this.tempSelected = null
        this.$emit('input', this.selectedMerchant.merchantId)
        this.$emit('change', this.selectedMerchant)
      }
      this.dialogVisible = false
    },
    async updateList() {
      const { data: { listObj, total }} = await this.getMerchantList()
      this.tableList = listObj
      this.page.total = total
    },
    getMerchantList() {
      return this.$product.$api.merchantApi.queryPlatformAuthMerchantPage({
        currentPage: this.page.current,
        itemsPerPage: this.page.size,
        merchantName: this.search.merchantName,
        merchantCode: this.search.merchantCode
      })
    }
  }
}
</script>

<style scoped>

</style>
