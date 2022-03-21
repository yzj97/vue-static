<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('so_pick_select_picker')"
      width="960px"
      @open="init" >
      <section class="pg-orderPicker-list">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form">
              <ody-search-item :label="$t('so_pick_picker_name')" prop="identityCardName">
                <el-input v-model="searchForm.identityCardName" name="searchForm_identityCardName" maxlength="25"/>
              </ody-search-item>
              <ody-search-item :label="$t('so_pick_picker_phone')" prop="mobile">
                <el-input v-model="searchForm.mobile" name="searchForm_mobile" maxlength="25"/>
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <ody-button name="OmsSoPick_PickUser_Query_handleSearchSubmit" code="OmsSoPick_PickUser_Query" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_select') }}</ody-button>
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="list"
              :columns="columns"
              :operates="operates"
              :multiple="multiple"
              name="list783"
              @selection-change="handleSelectionChange"
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
                @current-change="handlePageCurrentChange"/>
            </div>
          </div>
        </ody-list-table-area>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <ody-button name="OmsSoPick_PickUser_handleOk" code="OmsSoPick_PickUser" size="small" type="primary" @click="handleOk">{{ $t('ok') }}</ody-button>
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
    selectedItem: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      multiple: true,
      searchForm: getDefaultSearchForm(),
      loading: false,
      selection: [],
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },

      columns: [
        {
          show: true,
          prop: 'identityCardName',
          label: this.$t('so_pick_picker_name'),
          align: 'center',
          minWidth: 40
        },
        {
          show: true,
          prop: 'mobile',
          label: this.$t('so_pick_picker_phone'),
          align: 'center',
          minWidth: 40
        }
      ]
    }
  },
  watch: {

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
      this.searchForm = getDefaultSearchForm()
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
      this.updateList()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      const vue = this
      if (this.selection.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('errorSelectAtLeastOne')
        })
      } else if (this.selection.length > 1) {
        this.$message({
          type: 'warning',
          message: this.$t('errorSelectMoreThanOne')
        })
      } else {
        const soPick = this.$oms.$api.soPick
        const pickUserParam = {
          id: this.selectedItem.id,
          pickUserId: this.selection[0].userId,
          pickUserName: this.selection[0].identityCardName
        }
        soPick.soPickUpdatePickUser(pickUserParam).then((res) => {
          vue.$emit('update:visible', !vue.visible)
          vue.$emit('ok', vue.selection)
        })
      }
    },
    handleSelectionChange(val) {
      if (Array.isArray(val)) {
        this.selection = val
      }
    }
  }
}
async function loadList(vue) {
  const param = {
    positionCode: 'orderPicker',
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current,
    queryEmployeeType: 3,
    entityId: vue.selectedItem.storeId,
    isAvailable: 1,
    ...vue.searchForm
  }
  const common = vue.$oms.$api.common
  const result = await common.soPickUserList(param)
  if (result && result.data) {
    const data = result.data
    vue.list = data.listObj
    vue.page.total = data.total
  }
}

function getDefaultSearchForm() {
  return Object.assign({}, {})
}
</script>

<style lang="scss" scoped>

</style>
