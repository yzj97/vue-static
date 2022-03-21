<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('支付方式') + ':'" prop="methodCode">
            <el-select v-model="search.methodCode" name="search_methodName">
              <el-option
                v-for="item in methodNameList"
                :key="item.name"
                :label="item.name"
                :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('业务类型') + ':'" prop="businessType">
            <el-select v-model="search.businessType" name="search_businessType">
              <el-option
                v-for="item in businessTypeList"
                :key="item.code"
                :label="item.name"
                :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('销售渠道') + ':'" prop="saleChannelCode">
            <ody-channel-select ref="channel" v-model="search.saleChannelCode" name="search_saleChannelCode"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="PaymentMethodQuery" code="PaymentMethodQuery" size="small" type="primary" @click.prevent="handleSubmit">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="PaymentMethodAdd_handleAdd" code="PaymentMethodAdd" size="small" type="primary" @click="handleAdd">{{ $t('新增支付方式') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="table.data"
          :columns="table.columns"
          :operates="table.operates"
          :can-filter="false"
          name="table_data387">
          <template slot="saleChannelCode" slot-scope="scope">
            {{ scope.row.saleChannelCode | keyVal(getChannelCodeMap) }}
          </template>
          <template slot="statusStr" slot-scope="scope">
            <el-switch v-model="scope.row.statusStr" :active-text="$t('启用')" :disabled="functions.indexOf('FinancePaymentMethod_03') <= 0" name="scope_row_statusStr" @change="handleStatusChange($event, scope.row)"/>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="table.data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"/>
      </div>
    </ody-list-table-area>
    <payment-method-edit-dialog
      :visible.sync="showPaymentMethodEditDialogVisible"
      :edit-info.sync="editInfo"
      :method-name-list.sync="methodNameList"
      :business-type-list.sync="businessTypeList"
      @ok="query"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaymentMethodEditDialog from '@/components/payment-method-edit-dialog'

export default {
  name: 'FinancePaymentMethod',
  components: {
    PaymentMethodEditDialog
  },
  data() {
    const self = this
    return {
      loading: false,
      methodNameList: [],
      businessTypeList: [],
      businessTypeMap: {},
      search: {
        merchantId: '',
        methodName: '',
        businessType: '',
        saleChannelCode: ''
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      table: {
        data: [],
        columns: [
          {
            label: this.$t('支付方式'),
            prop: 'methodName',
            show: true,
            align: 'center',
            minWidth: 124
          },
          {
            label: this.$t('支付方式级别'),
            prop: 'level',
            show: true,
            align: 'center',
            minWidth: 124
          },
          {
            label: this.$t('业务类型'),
            prop: 'businessTypeStr',
            minWidth: 124,
            align: 'center',
            show: true
          },
          {
            label: this.$t('销售渠道'),
            slot: 'saleChannelCode',
            minWidth: 124,
            align: 'center',
            show: true
          },
          {
            label: this.$t('商家ID'),
            prop: 'merchantId',
            minWidth: 124,
            align: 'center',
            show: false
          },
          {
            label: this.$t('店铺ID'),
            prop: 'merchantId',
            minWidth: 124,
            align: 'center',
            show: false
          },
          {
            label: this.$t('状态'),
            slot: 'statusStr',
            minWidth: 124,
            align: 'center',
            show: this.$portal.hasPermission('PaymentMethodEdit')
          },
          {
            label: this.$t('创建时间'),
            prop: 'createTimeStr',
            minWidth: 200,
            align: 'center',
            show: true
          },
          {
            label: this.$t('创建人'),
            prop: 'createUsername',
            minWidth: 124,
            align: 'center',
            show: true
          },
          {
            label: this.$t('更新时间'),
            prop: 'updateTimeStr',
            minWidth: 200,
            align: 'center',
            show: true
          },
          {
            label: this.$t('更新人'),
            prop: 'updateUsername',
            minWidth: 124,
            align: 'center',
            show: true
          }
        ],
        operates: {
          width: 124,
          fixed: 'right',
          list: [
            {
              code: 'PaymentMethodEdit',
              label: this.$t('编辑'),
              hidden(index, row) {
                return self.functions.indexOf('PaymentMethodEdit') <= 0
              },
              method: (index, row) => {
                this.editInfo = row
                this.showPaymentMethodEditDialogVisible = true
              }
            },
            {
              code: 'PaymentMethodDelete',
              label: this.$t('删除'),
              hidden(index, row) {
                return self.functions.indexOf('PaymentMethodDelete') <= 0
              },
              method: (index, row) => {
                this.handleDelete(row)
              }
            }
          ]
        }
      },
      editInfo: {},
      showPaymentMethodEditDialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'functions'
    ]),
    getChannelCodeMap() {
      return this.$refs.channel.$refs.select2.options.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.initCode()
      await this.query()
    },
    async initCode() {
      const res = await this.$finance.$api.common.codeListMulti({ categories: ['PAYMENT_METHOD_TYPE', 'PAYMENT_METHOD_BUSINESS_TYPE'] })
      this.methodNameList = res.data.PAYMENT_METHOD_TYPE
      this.businessTypeList = res.data.PAYMENT_METHOD_BUSINESS_TYPE
      this.businessTypeMap = res.data.PAYMENT_METHOD_BUSINESS_TYPE.reduce((m, i) => { m[i.code] = i.name; return m }, {})
    },
    handleReset() {
      this.search.methodCode = null
      this.formReset('search')
    },
    async handleSubmit() {
      await this.query()
    },
    async query() {
      const vue = this
      const params = Object.assign({}, vue.search)
      params.currentPage = vue.page.current
      params.itemsPerPage = vue.page.size

      if (params.methodCode === '') {
        params.methodCode = null
      }

      vue.loading = true
      try {
        const res = await vue.$finance.$api.paymentMethod.queryPaymentMethodPage(params)
        if (res.data.listObj && res.data.listObj.length > 0) {
          res.data.listObj.map(item => {
            item.createTimeStr = resolvingDate(item.createTime)
            item.updateTimeStr = resolvingDate(item.updateTime)
            item.statusStr = item.status === 1
            item.businessTypeStr = vue.businessTypeMap[item.businessType]
          })
        }
        vue.table.data = res.data.listObj
        vue.page.total = res.data.total
      } catch (e) {
        console.log(e)
      } finally {
        vue.loading = false
      }
    },
    handlePageSizeChange() {
      this.query()
    },
    handlePageCurrentChange() {
      this.query()
    },
    handleAdd() {
      this.editInfo = {}
      this.showPaymentMethodEditDialogVisible = true
    },
    handleStatusChange(value, row) {
      if (value) {
        const params = this.$portal.deepClone(row)
        params.status = 1
        this.$finance.$api.paymentMethod.updatePaymentMethod(params).then(res => {
          this.$message.success(this.$t('common_enabled_success'))
          this.query()
        })
      } else {
        const params = this.$portal.deepClone(row)
        params.status = 0
        this.$finance.$api.paymentMethod.updatePaymentMethod(params).then(res => {
          this.$message.success(this.$t('common_disabled_success'))
          this.query()
        })
      }
    },
    handleDelete(row) {
      const vue = this
      vue.$confirm(vue.$t('确认要删除吗?'), vue.$t('删除提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        vue.$finance.$api.paymentMethod.deletedPaymentMethod({ id: row.id, isDeleted: 1 }).then(res => {
          vue.$message.success(vue.$t('删除成功'))
          vue.query()
        })
      })
    }
  }
}

function resolvingDate(date) {
  if (date) {
    const d = new Date(date)
    const month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
    const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
    const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
    const min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
    const sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
    const times = d.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec
    return times
  }
  return ''
}
</script>

<style scoped>

</style>
