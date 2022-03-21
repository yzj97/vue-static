<template>
  <div>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          :data="list"
          :columns="columns"
          :can-filter="false"
          name="list208"/>
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
  </div>
</template>

<script>

export default {
  props: {
    contractId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'operatorUserId',
          label: this.$t('common_operationUserId'),
          align: 'center'
        },
        {
          show: true,
          prop: 'userName',
          label: this.$t('common_operationUser'),
          align: 'center'
        },
        {
          show: true,
          prop: 'timeStr',
          label: this.$t('common_operationTime'),
          align: 'center'
        },
        {
          show: true,
          prop: 'operatorType',
          label: this.$t('common_operation'),
          align: 'center'
        },
        {
          show: true,
          prop: 'note',
          label: this.$t('common_remark'),
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.updateList()
    },
    updateList() {
      const vue = this
      const params = {
        modelId: vue.contractId,
        model: 'Contract',
        page: vue.page.current,
        limit: vue.page.size
      }

      vue.$opms.$api.common.findOplogPage(params).then(res => {
        if (res && res.code === '0') {
          vue.list = res.data
          vue.page.total = res.total
        }
      })
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
    }
  }
}
</script>

<style scoped>

</style>
