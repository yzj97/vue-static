<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('选择用户')"
      width="800px"
      @open="init" >
      <section class="pg-userModal-list">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="100px" class="form">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('用户账号')">
                    <el-input v-model="searchForm.username" name="searchForm_username"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('手机号')">
                    <el-input v-model="searchForm.mobile" name="searchForm_mobile" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('注册时间')">
                    <ody-date-range-picker v-model="searchForm.data" name="searchForm_data"/>
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
              v-loading="loading"
              :data="list"
              :columns="columns"
              :multiple="multiple"
              :checked.sync="checked"
              name="list967"
              height="400"
              style="width: 100%" />
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
          prop: 'userId',
          label: this.$t('用户ID'),
          align: 'center',
          minWidth: 160
        },
        {
          show: true,
          prop: 'userName',
          label: this.$t('用户账号'),
          align: 'center',
          minWidth: 140
        },
        {
          show: true,
          prop: 'mobile',
          label: this.$t('手机号'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('注册时间'),
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            if (row.createTime) {
              return this.$portal.parseTime(row.createTime, '{y}-{m}-{d}')
            }
            return ''
          }
        }
      ],
      loading: false,
      list: [],
      searchForm: getDefaultPage(),
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
      this.searchForm = getDefaultPage()
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
      const vue = this
      var commissionUsers = []
      vue.checked.forEach((item) => {
        var param = {
          userId: item.userId,
          username: (item.username) ? item.username : ''
        }
        commissionUsers.push(param)
      })
      this.$emit('ok', commissionUsers)
      this.$emit('update:visible', !this.visible)
    },
    init() {
      this.checked = []
      this.handleSearchSubmit()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
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
    identityTypeCodeList: [4, 41, 42, 43, 44, 45],
    offset: 0,
    memberTypeList: []
  }
  for (const p in vue.searchForm) {
    if (p && vue.searchForm[p]) {
      searchInfo[p] = vue.searchForm[p]
    }
  }
  if (vue.searchForm.data) {
    searchInfo.startTime = vue.searchForm.data[0]
    searchInfo.endTime = vue.searchForm.data[1]
  }
  const param = {
    currentPage: vue.page.current,
    itemsPerPage: vue.page.size,
    limit: vue.page.size,
    ...searchInfo
  }
  const res = await vue.$ouserCenter.$api.points.searchUserIdentityInfoList(param)

  if (res.code === '0') {
    vue.list = res.data.listObj
    vue.page.total = res.data.total
  }
}
function getDefaultPage() {
  return Object.assign({}, {
    username: null,
    mobile: null,
    data: []
  })
}

</script>

<style lang="less" scoped>
  .pg-userModal-list{
    .cp-search-item{
      width: 33.33333%;
    }
  }
</style>
