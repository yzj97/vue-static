<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('审批流ID:')" :space="1">
            <el-input v-model="filters.id" :placeholder="$t('请输入') + $t('审批流ID')" name="searchForm_filters_id" />
          </ody-search-item>
          <ody-search-item :label="$t('审批流名称:')" :space="1">
            <el-input v-model="filters.name" :placeholder="$t('请输入') + $t('审批流名称')" name="searchForm_filters_name" />
          </ody-search-item>
          <ody-search-item :label="$t('状态:')" :space="1">
            <el-select v-model="filters.isAvailable" :placeholder="$t('全部')" name="searchForm_filters_isAvailable">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商家:')" :space="1">
            <ody-merchant-select ref="merchantId" :placeholder="$t('全部')" v-model="filters.merchantId" value-key="merchantId" name="merchantId" />
          </ody-search-item>
          <ody-search-item :label="$t('approval_type_code')+':'" :space="1">
            <el-select v-model="filters.typeCode" :placeholder="$t('全部')" name="searchForm_filters_typeCode">
              <el-option
                v-for="item in typeCodeList"
                :key="item.code"
                :label="item.name"
                :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('创建时间:')">
            <ody-date-range-picker ref="createTimeRange" v-model="createTimeRange" :default="7" name="createTime" type="datetimer" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="AfProcess_listPage_search"
          code="AfProcess_listPage"
          size="small"
          type="primary"
          @click="search"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="clickActiveState">
          <el-tab-pane v-for="tab in tabs" :label="$t(tab.heading) + (tab.total ? ('(' + tab.total + ')') : '')" :key="tab.index" />
        </el-tabs>
      </div>
      <div slot="btn-bottom">
        <ody-button
          name="AfProcess_exportData"
          code="AfProcess_add"
          size="small"
          type="primary"
          @click="add"
        >{{ $t('新增审批流') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :checked.sync="checked"
          :multiple="true"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="true"
          name="afProcessTable"
        >
          <!-- <template slot="id" slot-scope="scope">
            <ody-button type="text" code="AfProcess_listPage" name="afProcessViewDetail" @click="handleViewDetail(scope.row)">{{ scope.row.id }}</ody-button>
          </template> -->
          <template slot="isAvailable" slot-scope="scope">
            <div name="updateStatus" @click="updateStatus(scope.row)">
              <el-switch :disabled="!$portal.hasPermission('AfProcess_updateStatus')" :value="scope.row.isAvailable === 1" :active-text="scope.row.isAvailable === 1 ? $t('enable') : $t('disable')"/>
            </div>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.page"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.limit"
          :total.sync="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="search"
          @current-change="search"
        />
      </div>
    </ody-list-table-area>

    <ody-dialog :visible="showAddAppdflowDialog" :title="$t('新增审批流')" width="600px" @close="handleCancelAddAppdflow" @open="handleOpenAddAppdflow">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="160px"
        class="form"
      >
        <el-form-item :label="$t('商家')" prop="merchantId">
          <ody-merchant-select ref="merchantId" v-model="form.merchantId" :selected.sync="selectedMerchant" :placeholder="$t('请选择')" value-key="merchantId" name="form_merchantId" />
        </el-form-item>
        <el-form-item :label="$t('审批单据')" prop="typeCode">
          <el-select v-model="form.typeCode" :placeholder="$t('请选择')" name="form_typeCode">
            <el-option
              v-for="item in typeCodeList"
              :key="item.code"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('审批流名称')" prop="name">
          <el-input v-model="form.name" name="form_name" max-length="20" show-word-limit/>
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="remark">
          <el-input v-model="form.remark" :rows="2" name="form_remark" type="textarea" max-length="100" show-word-limit/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <div class="line-top"/>
        <el-button name="AddAppdflowDialog_cancel" size="small" @click="handleCancelAddAppdflow">{{ $t('取消') }}</el-button>
        <ody-button
          name="AddAppdflowDialog_save"
          size="small"
          type="primary"
          code="AfProcess_add"
          @click="handleSubmitAddAppdflow"
        >{{ $t('保存') }}</ody-button>
      </span>
    </ody-dialog>
  </section>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'AppdflowProcessList',
  data() {
    const self = this
    return {
      form: {
        merchantId: null,
        name: '',
        remark: '',
        typeCode: ''
      },
      activeState: '0',
      tabs: [
        {
          heading: this.$t('全部'),
          index: '0',
          total: '',
          isAvailableList: [0, 1],
          isAvailable: null
        },
        {
          heading: this.$t('启用'),
          index: '1',
          total: '',
          isAvailableList: [1],
          isAvailable: 1
        },
        {
          heading: this.$t('停用'),
          index: '2',
          total: '',
          isAvailableList: [0],
          isAvailable: 0
        }
      ],
      selectedMerchant: {},
      rules: {
        merchantId: [{ required: true, message: this.$t('请选择商家'), trigger: ['blur', 'change'] }],
        typeCode: [{ required: true, message: this.$t('请选择审批单据'), trigger: ['blur', 'change'] }],
        name: [{ required: true, message: this.$t('请输入审批流名称'), trigger: ['blur', 'change'] }]
      },
      checked: [],
      showAddAppdflowDialog: false,
      statusList: [
        {
          value: 0,
          label: this.$t('停用')
        },
        {
          value: 1,
          label: this.$t('启用')
        }
      ],
      typeCodeList: [],
      typeCodeMap: {},
      loading: false,
      list: [],
      columns: [
        {
          label: this.$t('审批流ID'),
          prop: 'id',
          show: true,
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            const toDetail = self.handleViewDetail
            return (
              <el-link underline='true' type='primary' title={params.row.id} on-click={(e) => toDetail(params.row)}>{params.row.id}</el-link>
            )
          }
        },
        {
          label: this.$t('审批流名称'),
          prop: 'name',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('状态'),
          slot: 'isAvailable',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('商家'),
          prop: 'merchantName',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('approval_type_code'),
          prop: 'typeCode',
          show: true,
          align: 'center',
          formatter: (row, column, cellValue) => {
            if (row.typeCode) {
              return this.typeCodeMap[row.typeCode]
            }
          }
        },
        {
          label: this.$t('备注'),
          prop: 'remark',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('创建人'),
          prop: 'createUsername',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('创建时间'),
          prop: 'createTime',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.createTime) {
              return this.$portal.parseTime(
                row.createTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        },
        {
          label: this.$t('修改人'),
          prop: 'updateUsername',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('修改时间'),
          prop: 'updateTime',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.updateTime) {
              return this.$portal.parseTime(
                row.updateTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('编辑'),
            code: 'AfProcess_saveNode',
            hidden: (index, row) => {
              return row.isAvailable === 1
            },
            method: (index, row) => {
              this.$router.push({
                name: 'AppdflowProcessDetail',
                params: {
                  id: row.id,
                  readOnly: false
                }
              })
            }
          },
          {
            label: this.$t('删除'),
            code: 'AfProcess_delete',
            hidden: (index, row) => {
              return row.isAvailable === 1
            },
            method: (index, row) => {
              this.delete(row)
            }
          }
        ]
      },
      createTimeRange: [],
      filters: this.initFilters(),
      page: {
        page: 1,
        limit: 10
      },
      total: 0
    }
  },
  computed: {
    ...mapState({
      switcherList: state => state.app.switcherList
    })
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.initCode()
      this.search()
    },
    async initCode() {
      const res = await this.$appdflow.$api.afTypeConfig.list({})
      this.typeCodeList = res.data
      this.typeCodeMap = this.typeCodeList.reduce((m, i) => {
        m[i.code] = i.name
        return m
      }, {})
    },
    async search() {
      this.loading = true
      this.activeState = (this.filters.isAvailable === null || this.filters.isAvailable === undefined) ? '0' : (this.filters.isAvailable === 0 ? '2' : '1')
      this.handleFilters()
      const args = { filters: this.formHasValue(this.filters), ...this.page }
      try {
        const res = await this.$appdflow.$api.afProcess.listPage(args)
        this.list = res.data
        this.total = res.total

        this.$appdflow.$api.afProcess.countList({ filters: this.formHasValue(this.filters) }).then(res => {
          let total = 0
          const countMap = res.data.reduce((m, i) => {
            m[i.code] = i.count
            total += i.count
            return m
          }, {})
          for (let i = 0; i < this.tabs.length; i++) {
            const tab = this.tabs[i]
            if (tab.index === '0') {
              tab.total = total
            } else if (tab.index === '1') {
              tab.total = countMap[1]
            } else if (tab.index === '2') {
              tab.total = countMap[0]
            }
          }
        })
      } finally {
        this.loading = false
      }
    },
    handleFilters() {
      if (this.createTimeRange && this.createTimeRange.length > 1) {
        this.filters.startCreateTime = this.createTimeRange[0]
        this.filters.endCreateTime = this.createTimeRange[1]
      } else {
        delete this.filters.startCreateTime
        delete this.filters.endCreateTime
      }
      const tab = this.tabs[this.activeState]
      if (tab) {
        this.filters.isAvailableList = tab.isAvailableList
      }
    },
    clickActiveState() {
      const tab = this.tabs[this.activeState]
      if (tab) {
        this.filters.isAvailable = tab.isAvailable
      }
      this.search()
    },
    reset() {
      this.checked = []
      this.filters = this.initFilters()
      this.createTimeRange = []
      this.$refs.createTimeRange.setDefault(7)
    },
    add() {
      this.showAddAppdflowDialog = true
    },
    async delete(row) {
      const confirm = await this.$confirm(
        this.$t('是否删除当前') + this.$t('审批流'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const ids = []
        ids.push(row.id)
        const result = await this.$appdflow.$api.afProcess.delete(
          ids
        )
        if (result && result.code === '0') {
          this.search()
          this.$message({
            type: 'success',
            message: this.$t('common_delete_success')
          })
        }
      }
    },
    initFilters() {
      return {
        id: null,
        name: null,
        isAvailable: null,
        merchantId: null,
        typeCode: null
      }
    },
    handleCancelAddAppdflow() {
      this.showAddAppdflowDialog = false
    },
    handleOpenAddAppdflow() {
      this.form = {
        merchantId: null,
        name: '',
        remark: '',
        typeCode: ''
      }
      this.selectedMerchant = {}
    },
    handleSubmitAddAppdflow() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.merchantName = this.selectedMerchant.merchantName
          this.form.merchantCode = this.selectedMerchant.merchantCode
          this.$appdflow.$api.afProcess.add(this.form).then(res => {
            this.showAddAppdflowDialog = false
            this.search()
          })
        }
      })
    },
    async updateStatus(row) {
      if (row.isAvailable === 1) {
        const result = await this.$confirm(this.$t('确认停用数据吗？'), this.$t('提示'), {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel')
        })

        if (!result) {
          return
        }
      } else {
        const res = await this.$appdflow.$api.afProcess.existEnableProcess({ id: row.id, typeCode: row.typeCode, merchantId: row.merchantId })
        if (res.data) {
          const result = await this.$confirm(this.$t('已经存在启用状态的该单据类型审批流配置，若启用该数据，原启用状态下的数据将停用，确认启用数据吗？'), this.$t('提示'), {
            confirmButtonText: this.$t('ok'),
            cancelButtonText: this.$t('cancel')
          })

          if (!result) {
            return
          }
        }
      }

      this.$appdflow.$api.afProcess.updateStatus(row).then(res => {
        this.search()
        this.getAppdflowSettings()
      })
    },
    handleViewDetail(row) {
      this.$router.push({
        name: 'AppdflowProcessDetail',
        params: {
          id: row.id,
          readOnly: true
        }
      })
    },
    isSwitcherOn(key) {
      const item = this.switcherList.find(x => x.key === key) || {}
      return item.on
    },
    getAppdflowSettings() {
      const vue = this
      const appdflowOn = vue.isSwitcherOn('appdflow.switch')
      if (appdflowOn) {
        setTimeout(function() {
          vue.$store.dispatch('appdflow/GenerateSettings')
        }, 3000)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
