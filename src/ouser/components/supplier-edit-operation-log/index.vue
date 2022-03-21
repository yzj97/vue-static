<template>
  <div class="supplier-edit-operation-log">
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          :data="listTable.list"
          :can-filter="false"
          :columns="listTable.columns"
          name="listTable_list980"
        />
      </div>
      <div slot="page">
        <div class="block">
          <ody-pagination
            :current-page.sync="currentPage"
            :list="listTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="itemsPerPage"
            :total.sync="listTable.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="query"
            @current-change="query"
          />
        </div>
      </div>
    </ody-list-table-area>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default: () => ['userName', 'timeStr', 'note']
    }
  },
  data() {
    const { editStatus, supplierId, merchant } = this.$route.params
    const isView = +editStatus === 2
    const isEdit = +editStatus === 1
    const isAdd = +editStatus === 0

    return {
      supplierId,
      currentPage: 1,
      itemsPerPage: 10,
      merchant: merchant ? JSON.parse(merchant) : {},
      isEdit,
      isView,
      isAdd,
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            label: this.$t('操作人'),
            prop: 'userName',
            show: true
          },
          {
            label: this.$t('操作时间'),
            prop: 'timeStr',
            show: true
          },
          {
            label: this.$t('操作'),
            prop: 'note',
            show: true
          }
        ]
      }
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    async query() {
      if (this.supplierId) {
        const searchParams = {}
        searchParams.model = 'OrgInfo'
        searchParams.modelId = this.supplierId
        searchParams.page = this.currentPage
        searchParams.limit = this.itemsPerPage
        this.$ouser.$api.supplier.listOperActionPage(searchParams).then(res => {
          this.listTable.list = res.data
          this.listTable.total = res.total
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.supplier-edit-operation-log {
  .cp-box {
    box-shadow: none;
    padding-bottom: 10px;
  }
  .el-pagination {
    text-align: right;
  }
}
</style>
