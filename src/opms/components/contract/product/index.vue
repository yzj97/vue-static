<template>
  <div>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          :data="list"
          :can-filter="false"
          :columns="columns"
          name="list657" />
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
          prop: 'mpCode',
          label: this.$t('common_mp_code'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'mpName',
          label: this.$t('common_mp_name'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'mpMeasurementUnit',
          label: this.$t('common_mp_unit'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'minOrderQuantity',
          label: this.$t('contractProduct_field_setNum'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'maxOrderQuantity',
          label: this.$t('contractProduct_field_limitedAmount'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'deliveryTerm',
          label: this.$t('contractProduct_field_deliveryTerm'),
          align: 'center',
          minWidth: 120
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
        contractId: vue.contractId,
        currentPage: vue.page.current,
        itemsPerPage: vue.page.size
      }

      vue.$opms.$api.jxContract.queryGoodsPage(params).then(res => {
        if (res && res.code === '0') {
          vue.list = res.data.listObj
          vue.page.total = res.data.total
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
