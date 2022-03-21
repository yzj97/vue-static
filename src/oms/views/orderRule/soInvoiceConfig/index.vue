<template>
  <section class>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('order_ruleCode') + ':'" prop="code">
            <el-input v-model="searchForm.code" name="searchForm_code" maxlength="25" />
          </ody-search-item>
          <ody-search-item v-show="platformId == 1" :label="$t('order_ruleMerchant') + ':'" prop="merchantId">
            <el-select v-model="searchForm.merchantId" :popper-append-to-body="false" :placeholder="$t('common_all')" name="searchForm_merchantId">
              <el-option
                v-for="item in merchantList"
                :label="item.merchantName"
                :key="item.merchantId"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('manual_order_order_syssource') + ':'" prop="appChannels">
            <el-select v-model="searchForm.appChannels" :placeholder="$t('common_all')" name="searchForm_appChannels">
              <el-option
                v-for="item in allChannels"
                :label="item.channelName"
                :key="item.channelCode"
                :value="item.channelCode"
              />
            </el-select>
          </ody-search-item>
        </el-form>
        <el-form ref="form" label-width="100px" class="form" />
      </div>
      <div slot="btn">
        <ody-button
          name="OmsSoInvoiceConfig_Reset_handleSearchReset"
          code="OmsSoInvoiceConfig_Reset"
          size="small"
          @click="handleSearchReset"
        >{{ $t('common_reset') }}</ody-button>
        <ody-button
          name="OmsSoInvoiceConfig_Query_handleSearchSubmit"
          code="OmsSoInvoiceConfig_Query"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div v-show="platformId == 2" slot="btn">
        <ody-button
          name="OmsSoInvoiceConfig_Deleted_batchDeleted"
          code="OmsSoInvoiceConfig_Deleted"
          size="small"
          type="primary"
          @click="batchDeleted"
        >{{ $t('common_batch_delete') }}</ody-button>
        <ody-button
          name="OmsSoInvoiceConfig_Add_showEditOrAdd"
          code="OmsSoInvoiceConfig_Add"
          size="small"
          type="primary"
          @click="showEditOrAdd"
        >{{ $t('add') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="data"
          :columns="columns"
          :operates="showOperates()"
          :multiple="platformId == 2"
          :checked.sync="checked"
          :can-filter="false"
          name="data326"
          @custom-sort-change="hanleCustomSortChange"
          @selection-change="handleSelectionChange"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="current"
          :list="data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="size"
          :total.sync="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>

    <!--新增编辑弹窗-->
    <ody-dialog
      :visible.sync="dialogFormVisible"
      :before-close="closeEditOrAdd"
      :title="$t('common_operations')"
      width="952px"
    >
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" :label="$t('order_ruleCode')">{{ form.code }}</el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('order_ruleMerchant')">
          <el-select v-model="form.merchantId" name="form_merchantId">
            <el-option
              v-for="item in merchantList"
              :label="item.merchantName"
              :key="item.merchantId"
              :value="item.merchantId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('manual_order_order_syssource')">
          <el-select v-model="oneChannel" name="oneChannel" @change="selectOneChannel">
            <el-option
              v-for="item in allChannels"
              :label="item.channelName"
              :key="item.channelCode"
              :value="item.channelCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label>
          {{ $t('order_sum') }} {{ channelTagsLength }} {{ $t('order_one') }}
          <ody-button
            name="OmsSoInvoiceConfig_DeletedChannel_cleanTags"
            size="small"
            code="OmsSoInvoiceConfig_DeletedChannel"
            @click="cleanTags"
          >{{ $t('order_delete_all') }}</ody-button>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label>
          <el-tag
            v-for="tag in channelTags"
            :key="tag"
            style="margin-right:10px"
            closable
            @close="closeTag(tag)"
          >{{ tag }}</el-tag>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('invoice_config_start_end')">
          <el-row :gutter="20">
            <el-col :span="2">{{ $t('invoice_config_receive') }}</el-col>
            <el-col :span="5">
              <ody-input-number v-model="form.allowHours" :min="0" :decimal="1" :placeholder="$t('please_input')" name="form_allowHours" />
            </el-col>
            <el-col :span="5">{{ $t('invoice_config_later') }}</el-col>
            <el-col :span="5">
              <ody-input-number v-model="form.forbiddenDays" :min="0" :placeholder="$t('please_input')" name="form_forbiddenDays" />
            </el-col>
            <el-col :span="5">{{ $t('invoice_config_day_not') }}</el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label>{{ $t('invoice_config_remarkinfo') }}</el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('状态')">
          <el-radio v-model="form.isDisable" :label="0" name="form_isDisable">{{ $t('available') }}</el-radio>
          <el-radio v-model="form.isDisable" :label="1" name="form_isDisable0">{{ $t('Unavailable') }}</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="closeEditOrAdd" @click="closeEditOrAdd">{{ $t('cancel') }}</el-button>
        <ody-button
          name="OmsSoInvoiceConfig_Save_saveOrUpdate"
          code="OmsSoInvoiceConfig_Save"
          type="primary"
          @click="saveOrUpdate"
        >{{ $t('ok') }}</ody-button>
      </div>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  name: 'OmsSoInvoiceConfig',
  data() {
    const self = this
    return {
      loading: false,
      appChannelMap: {},
      allChannels: [],
      dialogFormVisible: false,
      channelTags: [],
      channelTagsVal: [],
      channelTagsLength: 0,
      oneChannel: '',
      form: {
        id: null,
        code: '',
        merchantId: null,
        allowHours: null,
        forbiddenDays: null,
        appChannels: '',
        isDisable: 1,
        merchantName: ''
      },
      formLabelWidth: '120px',
      platformId: null,

      checked: [],
      data: [],
      merchantList: [],
      checkAll: false,
      searchForm: getDefaultSearchForm(),
      isDisableList: [],
      page: 1,
      size: 10,
      total: 1,
      current: 1,
      columns: [
        {
          show: true,
          prop: 'code',
          label: this.$t('order_ruleCode'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'appChannelsStr',
          label: this.$t('manual_order_order_syssource'),
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            return (
              <div style='white-space:normal;'>{params.row.appChannelsStr}</div>
            )
          }
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('规则适用商家'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'orderInvoiceNodeStr',
          label: this.$t('invoice_config_invoice_node'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'allowHours',
          label: this.$t('invoice_config_hours_later'),
          align: 'center'
        },
        {
          show: true,
          prop: 'forbiddenDays',
          label: this.$t('invoice_config_days_later'),
          align: 'center'
        },
        {
          show: true,
          prop: 'isDisableStr',
          label: this.$t('状态'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column, cellValue) => {
            return self.isDisableMap[row.isDisable]
          }
        }
      ], // 需要展示的列
      operates: {
        fixed: 'right',
        list: [
          {
            label: this.$t('edit'),
            disabled: false,
            method(index, row) {
              self.handleEdit(index, row)
            },
            code: 'OmsSoInvoiceConfig_Edit'
          },
          {
            label: this.$t('delete'),
            disabled: false,
            method(index, row) {
              self.handleDel(index, row)
            },
            code: 'OmsSoInvoiceConfig_Deleted'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
    this.initAllChannels()
    this._initPlatform()
  },
  methods: {
    checkParam() {
      if (!this.form.merchantId) {
        this.$message({
          type: 'warning',
          message: this.$t('common_request_fail')
        })
        return false
      }

      if (!this.form.appChannels || this.form.appChannels === '') {
        this.$message({
          type: 'warning',
          message: this.$t('channelCode_not_null')
        })
        return false
      }

      if (!this.form.allowHours || !this.form.forbiddenDays) {
        this.$message({
          type: 'warning',
          message: this.$t('invoice_config_time_range')
        })
        return false
      }

      return true
    },
    saveOrUpdate() {
      var vue = this
      if (!this.checkParam()) {
        return
      }

      this.form.merchantName = this.merchantMap[this.form.merchantId]

      if (this.form.id) {
        // 存在id update
        const soInvoiceConfig = vue.$oms.$api.soInvoiceConfig
        soInvoiceConfig.soInvoiceConfigUpdate(this.form).then(res => {
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('common_save_success')
            })
            this.closeEditOrAdd()
            getList(vue)
          } else {
            this.$message({
              type: 'error',
              message: this.$t('common_request_fail')
            })
          }
        })
      } else {
        // 不存在 add
        const soInvoiceConfig = vue.$oms.$api.soInvoiceConfig
        soInvoiceConfig.soInvoiceConfigAdd(this.form).then(res => {
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('common_save_success')
            })
            this.closeEditOrAdd()
            getList(vue)
          } else {
            this.$message({
              type: 'error',
              message: this.$t('common_request_fail')
            })
          }
        })
      }
    },
    selectOneChannel() {
      var str = this.appChannelMap[this.oneChannel]
      if (this.channelTags.indexOf(str) !== -1) {
        return
      }
      this.channelTagsVal.push(this.oneChannel)
      this.channelTags.push(str)
      this.channelTagsLength = this.channelTags.length
      this.oneChannel = ''

      // 赋值
      this.form.appChannels = this.channelTagsVal.join(',')
    },
    cleanTags() {
      this.channelTags = []
      this.channelTagsVal = []
      this.channelTagsLength = 0
      this.form.appChannels = ''
    },
    closeTag(tag) {
      var ind = this.channelTags.indexOf(tag)
      this.channelTags.splice(ind, 1)
      this.channelTagsVal.splice(ind, 1)
      this.channelTagsLength = this.channelTags.length

      // 赋值
      this.form.appChannels = this.channelTagsVal.join(',')
    },
    showOperates() {
      if (this.platformId === 2) {
        return this.operates
      } else {
        return []
      }
    },
    async _initPlatform() {
      const result = await this.$oms.$api.common.platformGetPlatformId({})
      this.platformId = result.data
    },
    // 加载渠道
    initAllChannels() {
      var vue = this
      this.$oms.$api.common.listAllChannels({}).then(data => {
        vue.allChannels = [] // {channelCode: {channelCode, channelName}}
        // vue.allChannels.push({ channelCode: 'all', channelName: this.$t('common_all') })
        for (var p in data.data) {
          var o = data.data[p]
          vue.allChannels.push({
            channelCode: o.channelCode,
            channelName: o.channelName
          })
          vue.appChannelMap[o.channelCode] = o.channelName
        }
        console.log(vue.appChannelMap)
      })
    },
    // 获取渠道中文
    getAppChannelsStr(appChannels) {
      if (appChannels instanceof Array) {
        var strs = []
        for (var i = 0; i < appChannels.length; i++) {
          if (this.appChannelMap[appChannels[i]] == null) {
            continue
          }
          strs.push(this.appChannelMap[appChannels[i]])
        }
        return strs.join(',')
      }
      return this.appChannelMap[appChannels]
    },
    deletedRule(id) {
      var vue = this
      this.$confirm(this.$t('delete_confirm'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          // 开始删除
          const soInvoiceConfig = vue.$oms.$api.soInvoiceConfig
          var idArr = []
          if (id && id !== null) {
            // 单个删除
            idArr.push(id)
          } else {
            // 批量删除
            for (var j = 0; j < this.checked.length; j++) {
              idArr.push(this.checked[j].id)
            }
          }

          soInvoiceConfig.soInvoiceConfigDelete(idArr).then(res => {
            if (res.code === '0') {
              this.$message({
                type: 'success',
                message: this.$t('common_delete_success')
              })
              this.checked = []
              getList(vue)
            } else {
              this.$message({
                type: 'error',
                message: this.$t('common_delete_fail')
              })
            }
          })
        })
        .catch(() => {})
    },
    // 批量删除
    batchDeleted() {
      if (this.checked.length <= 0) {
        // 至少选择一条数据
        this.$message({
          type: 'warning',
          message: this.$t('errorAuditSelectAtLeastOne')
        })
        return
      }

      for (var i = 0; i < this.checked.length; i++) {
        var item = this.checked[i]
        if (item.isDisable === 0) {
          // 不能删除以启用的规则
          this.$message({
            type: 'warning',
            message: this.$t('invoice_config_dont_delete')
          })
          return
        }
      }

      this.deletedRule()
    },
    createCode() {
      var vue = this
      const soInvoiceConfig = vue.$oms.$api.soInvoiceConfig
      soInvoiceConfig.soInvoiceConfigCreateCode().then(res => {
        if (res.code === '0') {
          vue.form.code = res.data
        }
      })
    },
    // 编辑
    handleEdit(index, row) {
      this.form.id = row.id
      this.form.code = row.code
      this.form.merchantId = row.merchantId
      this.form.allowHours = row.allowHours
      this.form.isDisable = row.isDisable
      this.form.forbiddenDays = row.forbiddenDays
      this.form.appChannels = row.appChannels

      var channelArr = this.form.appChannels.split(',')

      this.channelTags = this.getAppChannelsStr(channelArr).split(',')
      this.channelTagsVal = channelArr
      this.channelTagsLength = channelArr.length

      this.form.merchantName = row.merchantName
      this.showEditOrAdd()
    },
    // show 弹窗
    showEditOrAdd() {
      this.dialogFormVisible = true

      if (!this.form.id) {
        this.createCode()
      }
    },
    // clouse
    closeEditOrAdd() {
      this.dialogFormVisible = false
      // 清空数据
      this.form = {
        id: null,
        code: '',
        merchantId: null,
        merchantName: '',
        allowHours: null,
        forbiddenDays: null,
        appChannels: '',
        isDisable: 1
      }
      this.channelTags = []
      this.channelTagsVal = []
      this.channelTagsLength = 0
    },

    // 删除
    handleDel(index, row) {
      if (row.isDisable === 0) {
        // 不能删除以启用的规则
        this.$message({
          type: 'warning',
          message: this.$t('invoice_config_dont_delete')
        })
        return
      }
      this.deletedRule(row.id)
    },
    initCodes() {
      this.$oms.$api.common
        .listByCategorysForOrder({ categorys: ['IS_DISABLE'] })
        .then(data => {
          this.isDisableList = data.data.IS_DISABLE
          this.isDisableMap = data.data.IS_DISABLE.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
        })
    },
    initMerchants() {
      this.$oms.$api.common
        .merchantList({ currentPage: 1, itemsPerPage: 1000 })
        .then(data => {
          this.merchantList = data.data.listObj
          this.merchantMap = data.data.listObj.reduce((m, i) => {
            m[i.merchantId] = i.merchantName
            return m
          }, {})
        })
    },
    async handleSearchSubmit() {
      this.current = 1
      await this.updateList()
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
    },
    async handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async updateList() {
      try {
        this.loading = true
        await getList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    init() {
      this.initCodes()
      this.initMerchants()
      getList(this)
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign({}, {})
}

async function getList(vue) {
  const param = {
    page: vue.current,
    limit: vue.size,
    filters: vue.searchForm
  }
  const soInvoiceConfig = vue.$oms.$api.soInvoiceConfig
  try {
    const res = await soInvoiceConfig.soInvoiceConfigListPage(param)
    const data = res.data
    vue.data = data
    vue.total = res.total
    for (var i = 0; i < vue.data.length; i++) {
      var item = vue.data[i]
      item.appChannelsStr = vue.getAppChannelsStr(item.appChannels.split(','))
    }
  } catch (e) {
    console.log(e)
  }
}
</script>

<style lang="scss" scoped>
</style>
