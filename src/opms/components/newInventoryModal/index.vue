<!--  -->
<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('common_create')"
      width="60%"
      @open="init"
    >
      <section>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="100px" class="form">
              <!-- 商品编码 -->
              <ody-search-item :label="$t('common_mp_code')" prop="mpCode">
                <el-input v-model="searchForm.mpCode" name="searchForm_mpCode" />
              </ody-search-item>

              <!-- 商品名称 -->
              <ody-search-item :label="$t('distributionOrder_goodName')" prop="chineseName">
                <el-input v-model="searchForm.chineseName" name="searchForm_chineseName" />
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <!-- 查询 -->
            <el-button
              name="handleSearchSubmit"
              size="small"
              type="primary"
              @click="handleSearchSubmit"
            >{{ $t('common_search') }}</el-button>
            <!-- 重置 -->
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
          </div>
        </ody-list-search-area>

        <ody-list-table-area>
          <!-- 表格 -->
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="list"
              :columns="columns"
              :operates="operates"
              :multiple="true"
              :checked.sync="checked"
              :can-filter="false"
              name="list685"
            />
          </div>
          <!-- 分页 -->
          <div slot="page">
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
          </div>
        </ody-list-table-area>
      </section>

      <span slot="footer" class="dialog-footer">
        <!-- 保存 -->
        <el-button
          :disabled="checked.length<=0"
          name="handleSave"
          size="small"
          type="primary"
          @click="handleSave"
        >{{ $t('common_save') }}</el-button>
        <!-- 取消 -->
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
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
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      fileList: [], // 导入
      searchForm: {
        mpCode: null,
        chineseName: null
      },
      loading: false,
      list: [],
      currentRow: {},
      checked: [],
      page: {
        // 分页
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'mpCode',
          label: this.$t('common_product_code'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mpName',
          label: this.$t('common_mp_name'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mpUnit',
          label: this.$t('mp_main_unit'),
          align: 'center'
        }
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    async updateList() {
      try {
        this.loading = true
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },

    init() {
      this.updateList()
    },
    // 取消
    handleClose() {
      this.handleSearchReset()
      this.resetData()
    },
    // 保存
    handleSave() {
      // 发送数据到父组件
      this.$emit('ok', this.checked)
      this.resetData()
    },
    // 重置
    handleSearchReset() {
      this.searchForm = {}
      this.checked = []
    },
    // 查询
    handleSearchSubmit() {
      this.updateList()
    },
    // 分页
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    // 一页显示多少条数据
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.updateList()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    resetData() {
      this.checked = []
      this.list = []
      this.page = {
        size: 10,
        current: 1,
        total: 0
      }
      this.$emit('update:visible', !this.visible)
    }
  }
}

async function loadList(vue) {
  const param = {
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current,
    obj: {
      mpCode: vue.searchForm.mpCode, // 商品code
      chineseName: vue.searchForm.chineseName, // 商品name
      merchantId: vue.merchantId // 商家id
    }
  }

  Object.assign(param.obj, vue.params)
  if (vue.merchantId) {
    const res = await vue.$opms.$api.stockInitialization.productInWarehouse(
      param
    )
    if (res) {
      vue.list = res.data.listObj
      vue.page.total = res.data.total
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-upload-image {
  display: inline-block;
}
.el-button {
  margin-left: 10px !important;
}
</style>
