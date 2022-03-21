<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form">
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <el-select
              v-model="queryParam.merchantId"
              :placeholder="$t('请选择')"
              name="queryParam_merchantId"
              clearable
              @change="getWarehouseByMerchantId(queryParam.merchantId)"
            >
              <el-option
                v-for="item in merchantList"
                :key="item.merchantId"
                :label="item.merchantName"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('仓库') + ':'" prop="warehouseId">
            <el-select v-model="queryParam.warehouseId" :placeholder="$t('请选择')" name="queryParam_warehouseId" clearable>
              <el-option
                v-for="item in warehouseList"
                :key="item.warehouseId"
                :label="item.warehouseName"
                :value="item.warehouseId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('单据编号') + ':'" prop="billCode">
            <el-input v-model="queryParam.billCode" name="queryParam_billCode" />
          </ody-search-item>
          <ody-search-item :label="$t('单据类型') + ':'" prop="billType">
            <el-select v-model="queryParam.billType" :placeholder="$t('请选择')" name="queryParam_billType" clearable>
              <el-option
                v-for="item in billType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('审核状态') + ':'" prop="billAuditStatus">
            <el-select v-model="queryParam.billAuditStatus" :placeholder="$t('请选择')" name="queryParam_billAuditStatus" clearable>
              <el-option
                v-for="item in billAuditStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('单据状态') + ':'" prop="billStatus">
            <el-select v-model="queryParam.billStatus" :placeholder="$t('请选择')" name="queryParam_billStatus" clearable>
              <el-option
                v-for="item in billStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品名称') + ':'" prop="chineseName">
            <el-input v-model="queryParam.chineseName" name="queryParam_chineseName" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码') + ':'" prop="code">
            <el-input v-model="queryParam.code" name="queryParam_code" />
          </ody-search-item>
          <ody-search-item :label="$t('创建人') + ':'" prop="createUsername">
            <el-input v-model="queryParam.createUsername" name="queryParam_createUsername" />
          </ody-search-item>
          <ody-search-item :label="$t('创建日期') + ':'" prop="dateRangePicker">
            <ody-date-range-picker
              ref="dateRangePicker"
              v-model="dateRangePicker"
              :show-button="false"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="dateRangePicker"
              type="datetimer"
            />
            <!--<el-col :span="10">
              <el-date-picker
                v-model="queryParam.createBeginDate"
                :placeholder="$t('选择日期')"
                name="queryParam_createBeginDate"
                value-format="yyyy-MM-dd"
                type="date"/>
            </el-col>
            <el-col :span="1">{{$t('至')}}</el-col>
            <el-col :span="10">
              <el-date-picker
                v-model="queryParam.createEndDate"
                :placeholder="$t('选择日期')"
                name="queryParam_createEndDate"
                value-format="yyyy-MM-dd"
                type="date"/>
            </el-col>-->
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
        <ody-button
          name="Stock2001Query_handleQuery"
          size="small"
          type="primary"
          code="Stock2001Query"
          @click="handleQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <!-- <router-link
          :to="{ path: '/back-product-static/merchant/stock/receiveUseBill/edit', query: {viewStatus: 1}}"
        >
          <ody-button name="Stock200102" code="Stock200102" size="small" type="primary">{{ $t('新增') }}</ody-button>
        </router-link>-->
        <ody-button name="Stock200102_openAdd" size="small" type="primary" code="Stock200102" @click="openAdd">{{ $t('新增') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :operates="operates" name="list507" />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.currentPage"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.itemsPerPage"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="change"
          @current-change="queryList"
        />
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
import stockConstant from '@/constant/stockConstant.js'
export default {
  data() {
    return {
      billType: [
        {
          label: this.$t('计划领用'),
          value: 'JHLYO'
        },
        {
          label: this.$t('零星领用'),
          value: 'LXLYO'
        }
      ],
      billStatus: [
        {
          label: this.$t('待确认'),
          value: 0
        },
        {
          label: this.$t('待处理'),
          value: 1
        },
        {
          label: this.$t('已完成'),
          value: 2
        },
        {
          label: this.$t('已取消'),
          value: 3
        },
        {
          label: this.$t('已冲红'),
          value: 4
        }
      ],
      billAuditStatus: [
        {
          label: this.$t('待提交'),
          value: 0
        },
        {
          label: this.$t('待审核'),
          value: 1
        },
        {
          label: this.$t('审核通过'),
          value: 2
        },
        {
          label: this.$t('审核不通过'),
          value: 3
        }
      ],
      queryParam: { warehouseId: null },
      warehouseList: [],
      list: [],
      merchantList: [],
      bill: {},
      loading: true,
      dateRangePicker: [],
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 10
      },
      columns: [
        {
          label: '商家',
          prop: 'merchantName',
          show: true
        },
        {
          label: '仓库名称',
          prop: 'warehouseName',
          show: true
        },
        {
          label: '单据类型',
          prop: 'billType',
          show: true,
          formatter: this.formatterBillType
        },
        {
          label: '单据编号',
          prop: 'billCode',
          show: true,
          minWidth: 200
        },
        {
          label: '审核状态',
          prop: 'billAuditStatus',
          show: true,
          formatter: this.formatterBillAuditStatus
        },
        {
          label: '单据状态',
          prop: 'billStatus',
          show: true,
          formatter: this.formatterBillStatus
        },
        {
          label: '创建日期',
          prop: 'createTime',
          show: true,
          minWidth: 200,
          formatter: this.formatterCreateTime
        },
        {
          label: '创建人',
          prop: 'createUsername',
          show: true
        },
        {
          label: '审核日期',
          prop: 'auditTime',
          show: true,
          minWidth: 200,
          formatter: this.formatterAuditTime
        },
        {
          label: '审核人',
          prop: 'auditUsername',
          show: true
        },
        {
          label: '完成日期',
          prop: 'completeTime',
          show: true,
          minWidth: 200,
          formatter: this.formatterCompleteTime
        },
        {
          label: '完成人',
          prop: 'completeUsername',
          show: true
        },
        {
          label: '来源单号',
          prop: 'sourceBillCode',
          show: true,
          minWidth: 200
        },
        {
          label: '红冲原因',
          prop: 'redRushRemark',
          show: true,
          minWidth: 200
        }
      ],
      operates: {
        minWidth: 150,
        fixed: 'right',
        list: [
          {
            label: '查看',
            method: (index, row) => {
              this.$router.push({
                path: '/back-product-static/merchant/stock/receiveUseBill/edit',
                query: {
                  viewStatus: 3,
                  id: row.id
                }
              })
            },
            code: 'Stock2001View'
          },
          {
            label: '编辑',
            hidden: (index, row) => {
              const show =
                (row.billAuditStatus === 0 || row.billAuditStatus === 3) &&
                row.billStatus === 0

              return !show
            },
            method: (index, row) => {
              this.$router.push({
                path: '/back-product-static/merchant/stock/receiveUseBill/edit',
                query: { viewStatus: 2, id: row.id }
              })
            },
            code: 'Stock200103'
          },
          {
            label: '提交',
            hidden: (index, row) => {
              const show =
                (row.billAuditStatus === 0 || row.billAuditStatus === 3) &&
                row.billStatus === 0

              return !show
            },
            method: (index, row) => {
              this.submit(row, index)
            },
            code: 'Stock200104'
          },
          {
            label: '审核',
            hidden: (index, row) => {
              const show = row.billAuditStatus === 1 && row.billStatus === 0

              return !show
            },
            method: (index, row) => {
              this.audit(row, index)
            },
            code: 'Stock200105'
          },
          {
            label: '出库',
            hidden: (index, row) => {
              const show = row.billAuditStatus === 2 && row.billStatus === 1

              return !show
            },
            method: (index, row) => {
              this.stockOut(row, index)
            },
            code: 'Stock200106'
          },
          {
            label: this.$t('取消'),
            hidden: (index, row) => {
              const show = row.billAuditStatus === 2 && row.billStatus === 1

              return !show
            },
            method: (index, row) => {
              this.cancelReceiveUseBill(row, index)
            },
            code: 'Stock200107'
          },
          {
            label: '红冲',
            hidden: (index, row) => {
              const show =
                row.billAuditStatus === 2 &&
                row.billStatus === 2 &&
                row.sourceBillCode === null

              return !show
            },
            method: (index, row) => {
              this.redRush(row, index)
            },
            code: 'Stock200108'
          }
        ]
      }
    }
  },
  async mounted() {
    try {
      this.stockApi = this.$product.$api.stockApi
      this.merchantApi = this.$product.$api.merchantApi
      this.authApi = this.$product.$api.authApi
      this.loading = true
      await this.queryMerchantList()
      await this.queryList()
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async handleQuery() {
      this.page.currentPage = 1
      await this.queryList()
    },
    // 分页查询库存领用单列表
    async queryList(obj) {
      if (this.dateRangePicker && this.dateRangePicker.length > 0) {
        this.queryParam.createBeginDate = this.dateRangePicker[0]
        this.queryParam.createEndDate = this.dateRangePicker[1]
      }
      var param = Object.assign({}, this.queryParam, this.page, obj)
      this.loading = true
      try {
        const res = await this.stockApi.listReceiveUseBillByPage(param)
        this.list = res.data.listObj
        this.page.total = res.data.total
      } finally {
        this.loading = false
      }
    },
    // 查询当前登录用户有权限的商家
    async queryMerchantList() {
      return this.merchantApi
        .queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.merchantList = []
          const merchantIds = []
          for (const warehouse of res.data.listObj) {
            if (merchantIds.indexOf(warehouse.merchantId) === -1) {
              merchantIds.push(warehouse.merchantId)
              this.merchantList.push({
                merchantId: warehouse.merchantId,
                merchantCode: warehouse.merchantCode,
                merchantName: warehouse.merchantName
              })
            }
          }
        })
    },
    getWarehouseByMerchantId(merchantId) {
      this.warehouseList = []
      this.queryParam.warehouseId = null
      if (!merchantId) {
        return
      }
      this.merchantApi
        .queryPlatformAuthWarehousePage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.warehouseList = res.data.listObj.filter(item => {
            return item.merchantId === merchantId
          })
        })
    },
    formatterBillType(row, column) {
      return stockConstant.IM_RECEIVE_USE_BILL_BILL_TYPE[row.billType]
    },
    formatterBillStatus(row, column) {
      return stockConstant.IM_RECEIVE_USE_BILL_BILL_STATUS[row.billStatus]
    },
    formatterBillAuditStatus(row, column) {
      return stockConstant.IM_RECEIVE_USE_BILL_BILL_AUDIT_STATUS[
        row.billAuditStatus
      ]
    },
    formatterCreateTime(row) {
      return this.dateFormat(row.createTime)
    },
    formatterAuditTime(row) {
      return this.dateFormat(row.auditTime)
    },
    formatterCompleteTime(row) {
      return this.dateFormat(row.completeTime)
    },
    dateFormat(time) {
      if (time === null) {
        return null
      }
      var date = new Date(time)
      var year = date.getFullYear()
      var month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minutes =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      // 拼接
      return (
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds
      )
    },
    // 重置
    reset() {
      this.dateRangePicker = []
      this.queryParam = { warehouseId: null }
      this.warehouseList = []
    },
    openAdd() {
      this.$router.push({
        path: '/back-product-static/merchant/stock/receiveUseBill/edit',
        query: { viewStatus: 1 }
      })
    },
    submit(row, index) {
      this.$confirm(this.$t('确认提交选中的单据?'), this.$t('提交'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        row.billAuditStatus = 1
        var param = Object.assign({}, row)
        return this.stockApi.submitAudit(param).then(res => {
          this.queryList()
          this.$message({
            type: 'success',
            message: this.$t('提交完成')
          })
        })
      })
    },
    audit(row, index) {
      // const h = this.$createElement
      this.$prompt('输入备注', '审核', {
        // title: this.$t('审核'),
        // message: h('p', null, [
        //   h('div', { style: 'text-align: center;margin-bottom: 10px' }, this.$t('确认审核通过') + row.billCode + this.$t('单据') + '?'),
        //   h('div', { style: 'float: left' }, this.$t('备注')),
        //   h('textarea', { attrs: { 'maxlength': 255, 'id': 'auditRemark' }, style: { 'width': '350px', 'height': '60px', 'margin-top': '5px' }}, null)
        // ]),
        showCancelButton: true,
        distinguishCancelAndClose: true,
        cancelButtonText: this.$t('审核通过'),
        confirmButtonText: this.$t('审核不通过'),
        inputPattern: /[\s\S]{1,32}/,
        inputErrorMessage: this.$t('请填写备注信息！(32个字符以内)')
      })
        .then(({ value }) => {
          var param = { id: row.id, billAuditStatus: 3, billAuditRemark: value }
          this.stockApi.submitAudit(Object.assign({}, param)).then(res => {
            this.queryList()
            this.$message({
              type: 'info',
              message: this.$t('审核不通过')
            })
          })
        })
        .catch(({ value }) => {
          var param = { id: row.id, billAuditStatus: 2, billAuditRemark: value }
          this.stockApi.submitAudit(param).then(res => {
            this.queryList()
            this.$message({
              type: 'success',
              message: this.$t('审核通过')
            })
          })
        })
    },
    redRush(row, index) {
      const h = this.$createElement
      this.$msgbox({
        title: this.$t('红冲'),
        message: h('p', null, [
          h(
            'div',
            { style: 'text-align: center;margin-bottom: 10px' },
            this.$t('是否红冲') + row.billCode + this.$t('单号') + '!'
          ),
          h('div', { style: 'float: left' }, this.$t('红冲原因')),
          h(
            'textarea',
            {
              attrs: { maxlength: 255, id: 'redRushRemark' },
              style: { width: '330px', height: '60px', 'margin-top': '5px' }
            },
            null
          )
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消')
      }).then(action => {
        var param = {
          id: row.id,
          redRushRemark: document.getElementById('redRushRemark').value
        }
        this.stockApi.redRush(param).then(res => {
          this.queryList()
          this.$message({
            type: 'success',
            message: this.$t('已冲红')
          })
        })
      })
    },
    stockOut(row, index) {
      var param = { id: row.id }
      this.stockApi.stockOut(param).then(res => {
        this.queryList()
        this.$message({
          type: 'success',
          message: this.$t('已出库')
        })
      })
    },
    cancelReceiveUseBill(row, index) {
      var param = { id: row.id }
      this.stockApi.cancelReceiveUseBill(param).then(res => {
        this.queryList()
        this.$message({
          type: 'success',
          message: this.$t('已取消')
        })
      })
    },
    change(val) {
      this.page.itemsPerPage = val
      this.queryList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
