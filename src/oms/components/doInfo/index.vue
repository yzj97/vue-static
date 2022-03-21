<template>
  <section id="doInfo">
    <el-card>
      <ody-table
        :loading="loading"
        :data="transOrderList"
        :operates="operates"
        :columns="columns"
        name="transOrderList045"
      />
    </el-card>
  </section>
</template>

<script>
export default {
  props: {
    orderCode: {
      type: String,
      required: true
    }
  },
  data() {
    const vue = this
    return {
      transOrderList: [],
      loading: true,
      operates: {
        width: 200,
        align: 'center',
        list: [
          {
            label: this.$t('view'),
            disabled: false,
            method(index, row) {
              vue.$router.push({
                name: 'OmsTransOrderListDetail',
                params: {
                  id: row.doCode,
                  status: row.status
                }
              })
            }
          }]
      },
      columns: [
        {
          show: true,
          prop: 'doCode',
          label: this.$t('do_do_code'),
          align: 'center',
          minWidth: 200
        }, {
          show: true,
          prop: 'statusStr',
          label: this.$t('do_do_status'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            return this.doStautsMap[row.status]
          }
        }, {
          show: true,
          prop: 'warehouseName',
          label: this.$t('do_warehouse'),
          align: 'center',
          minWidth: 200
        }, {
          show: true,
          prop: 'createTime',
          label: this.$t('do_create_time'),
          align: 'center',
          minWidth: 200
        }, {
          show: true,
          prop: 'doLogisticsTime',
          label: this.$t('do_logistics_time'),
          align: 'center',
          minWidth: 200
        }]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      this.$oms.$api.do.transOrdersListListPage({
        filters: { orderCode: this.orderCode }
      }).then((data) => {
        this.transOrderList = data.data
      }).finally(() => {
        this.loading = false
      })
      this.$oms.$api.common.listByCategorysForOrder({ 'categorys': ['DO_STATUS'] }).then((data) => {
        this.doStautsMap = data.data.DO_STATUS.reduce((m, i) => { m[i.code] = i.name; return m }, {})
      })
    }
  }

}
</script>

