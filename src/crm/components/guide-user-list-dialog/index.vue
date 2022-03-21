<template>
  <ody-dialog
    :title="$t('发送范围')"
    :visible.sync="visible"
    :before-close="handleBack"
    width="60%"
    @open="init">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="120px" class="form">
          <ody-search-item :label="$t('账号')" prop="userName">
            <el-input v-model="searchForm.userName" :placeholder="$t('请输入账号')" name="searchForm_userName"/>
          </ody-search-item>
          <ody-search-item :label="$t('姓名')" prop="identityCardName">
            <el-input v-model="searchForm.identityCardName" :placeholder="$t('请输入姓名')" name="searchForm_identityCardName"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
        <ody-button name="ui_query" code="ui" size="small" type="primary" @click="query">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :checked.sync="checked"
          :multiple="true"
          :can-filter="false"
          name="data760"/>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>
    <span slot="footer">
      <el-button name="handleBack" size="small" @click="handleBack">{{ $t('cancel') }}</el-button>
      <ody-button name="ui_handleSave" code="ui" size="small" type="primary" @click="handleSave">{{ $t('save') }}</ody-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchForm: {},
      checked: [],
      data: [],
      columns: [
        {
          show: true,
          prop: 'userName',
          label: this.$t('账号'),
          align: 'center',
          minWidth: 140
        },
        {
          show: true,
          prop: 'identityCardName',
          label: this.$t('姓名'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'mobile',
          label: this.$t('手机号'),
          align: 'center',
          minWidth: 120
        }
      ],
      loading: false,
      page: {
        size: 10,
        current: 1,
        total: 0
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    initForm() {
      this.searchForm = {}
    },
    init() {
      this.query()
    },
    async query() {
      // 不排除当前用户
      this.searchForm.excludeUser = false
      const params = {
        currentPage: this.page.current,
        itemsPerPage: this.page.size,
        ...this.searchForm
      }
      try {
        const res = await this.$crm.$api.guideDeviceRel.queryEmployeeForDepartment(params)
        if (res.data) {
          this.data = res.data.listObj
          this.page.total = res.data.total
        }
      } finally {
        this.loading = false
      }
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.query()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.query()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleBack() {
      this.page = {
        size: 10,
        current: 1,
        total: 0
      }
      this.$emit('update:visible', !this.visible)
    },
    handleSave() {
      if (this.checked && this.checked.length > 0) {
        const res = this.$portal.deepClone(this.checked)
        this.$emit('ok', res)
        this.$emit('update:visible', !this.visible)
      } else {
        this.$message.info(this.$t('请选择导购员'))
      }
    }
  }
}
</script>

<style scoped>

</style>
