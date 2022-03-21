<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('选择店铺')"
      width="800px"
      @open="init" >
      <section class="pg-shopModal-list">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="100px" class="form">
              <el-row>
                <!--<el-col :span="8">
                  <el-form-item :label="$t('所属渠道')">
                    <el-input v-model="search.channelCode" name="search_channelCode"/>
                  </el-form-item>
                </el-col>-->
                <el-col :span="8">
                  <el-form-item :label="$t('所属商家')">
                    <el-input v-model="search.parentOrgName" name="search_parentOrgName" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('店铺名称')">
                    <el-input v-model="search.orgName" name="search_orgName" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('店铺编码')">
                    <el-input v-model="search.orgCode" name="search_orgCode" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div slot="btn">
            <el-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('query') }}</el-button>
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('reset') }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="list"
              :columns="columns"
              :checked="checked"
              :highlight-current-row="true"
              name="list055"
              @selection-change="handleSelectionChange" />
          </div>
          <div slot="page">
            <div class="block">
              <ody-pagination
                v-if="list && list.length"
                :current-page.sync="page.current"
                :list="list"
                :page-sizes="[10, 20, 30, 50, 100]"
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
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('return') }}</el-button>
        <el-button :disabled="checked.length === 0" name="onSubmit" size="small" type="primary" @click="onSubmit" >{{ $t('确定') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>

export default {
  props: {
    collect: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    isGiftMode: { // 赠品，只是隐藏最小起订量，订货倍数，订购数量字段
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      multiple: true,
      checked: [],
      columns: [
        {
          show: true,
          prop: 'orgCode',
          label: this.$t('店铺编码'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'orgName',
          label: this.$t('店铺名称'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'parentOrgName',
          label: this.$t('所属商家'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'contactName',
          label: this.$t('店铺联系人'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'mobileNo',
          label: this.$t('联系人手机'),
          align: 'center',
          minWidth: 120
        }
      ],
      loading: false,
      list: [],
      search: getDefaultPage(),
      page: {
        size: 10,
        itemsPerPage: 10,
        current: 1,
        total: 0
      }
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
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
      this.search = getDefaultPage()
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.updateList()
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
    onSubmit() {
      var shopInfo = this.checked[0]
      this.$emit('ok', shopInfo)
      this.$emit('update:visible', !this.visible)
    },
    init() {
      this.handleSearchSubmit()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleSelectionChange(val) {
      this.checked = [val]
    },
    handleOk(item) {
      this.$emit('ok', item)
    }
  }
}
async function loadList(vue) {
  queryProductInner(vue)
}
async function queryProductInner(vue) {
  const searchInfo = {
    memberTypeList: []
  }
  for (const p in vue.search) {
    if (p && vue.search[p]) {
      searchInfo[p] = vue.search[p]
    }
  }
  const param = {
    currentPage: vue.page.current,
    itemsPerPage: vue.page.size,
    ...searchInfo
  }
  const res = await vue.$ouserCenter.$api.userService.queryStoreInfoList(param)

  if (res.code === '0') {
    vue.list = res.data.listObj
    vue.page.total = res.data.total
  }
}
function getDefaultPage() {
  return Object.assign({}, {
    channelCode: null,
    parentOrgName: null,
    orgName: null,
    orgCode: null,
    data: []
  })
}

</script>

<style lang="less" scoped>
  .pg-shopModal-list{
    .cp-search-item{
      width: 33.33333%;
    }
  }
</style>
