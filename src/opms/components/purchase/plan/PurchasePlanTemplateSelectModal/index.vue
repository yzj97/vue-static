<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('common_choose_please')"
      width="60%"
      @open="init"
    >
      <section>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="50px" class="form">
              <ody-search-item :label="$t('purchase_plan_filed_code')" prop="templateCode">
                <el-input v-model="templateCode" name="templateCode" />
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button
              name="handleSearchSubmit"
              size="small"
              type="primary"
              @click="handleSearchSubmit"
            >{{ $t('common_search') }}</el-button>
            <el-button
              name="handleSearchReset"
              size="small"
              @click="handleSearchReset"
            >{{ $t('common_reset') }}</el-button>
          </div>
        </ody-list-search-area>

        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="list"
              :columns="columns"
              :multiple="multiple"
              :checked.sync="checked"
              name="list096"
            />
          </div>
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
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_return') }}</el-button>
        <el-button
          :disabled="checked.length === 0"
          name="handleOk"
          size="small"
          type="primary"
          @click="handleOk"
        >{{ $t('common_submit') }}</el-button>
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
    merchantCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      multiple: true,
      loading: false,
      checked: [],
      list: [],
      templateCode: '',
      page: {
        size: 10,
        current: 1,
        total: 0
      },

      columns: [
        {
          label: this.$t('purchase_plan_filed_code'),
          prop: 'templateCode',
          show: true
        },
        {
          label: this.$t('purchase_plan_type'),
          prop: 'planTypeStr',
          show: true
        },
        {
          label: this.$t('common_createTime'),
          prop: 'createTimeStr',
          show: true
        },
        {
          label: this.$t('common_time_createUser'),
          prop: 'createUsername',
          show: true
        }
      ]
    }
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
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.templateCode = ''
    },
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.updateList()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    init() {
      this.handleSearchSubmit()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.checked = []
    },
    handleOk() {
      const vue = this
      vue.$emit('update:visible', !vue.visible)
      vue.$emit('ok', vue.checked)
      vue.checked = []
    }
  }
}

async function loadList(vue) {
  const param = {
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current,
    filters: {
      templateCode: vue.templateCode,
      merchantCode: vue.merchantCode
    }
  }

  const purchasePlanTemplate = vue.$opms.$api.purchasePlanTemplate
  const result = await purchasePlanTemplate.listPage(param)
  if (result && result.data) {
    vue.list = result.data
    vue.page.total = result.total
  }
}
</script>

<style lang="scss" scoped>
</style>
