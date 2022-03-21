<template>
  <div>
    <section class="pg-orderAlertTabCon-list">
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="currentTab.list"
            :columns="columns"
            :operates="operates"
            name="currentTab_list772"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="page.current"
            :list="currentTab.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="page.size"
            :total.sync="currentTab.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"/>

        </div>
      </ody-list-table-area>
    </section>
  </div>
</template>

<script>
import ToOrderDetail from '@/components/so/toDetail'

export default {
  components: {
    ToOrderDetail
  },
  props: {
    currentTab: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      multiple: true,
      selection: [],
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },

      columns: [
        {
          'show': true,
          'prop': 'timeout',
          'label': this.$t('timeoutAlertTimeout'),
          'align': 'center',
          'minWidth': 124,
          render(h, params) {
            return (<span style='color: red'>{ params.row.timeout }</span>)
          }
        },
        {
          'show': true,
          'prop': 'ruleCode',
          'label': this.$t('order_ruleCode'),
          'align': 'center',
          'minWidth': 200
        },
        {
          'show': true,
          'prop': 'ruleName',
          'label': this.$t('order_ruleName'),
          'align': 'center',
          'minWidth': 124
        },
        {
          'show': true,
          'prop': 'orderCode',
          'label': this.$t('order_code'),
          'align': 'center',
          'minWidth': 200,
          render: (h, params) => {
            return (
              <ToOrderDetail orderCode={params.row.orderCode} orderSource={params.row.orderSource} sysSource={params.row.sysSource}>
                <span>{ params.row.orderCode }</span>
              </ToOrderDetail>
            )
          }
        },
        {
          'show': true,
          'prop': 'orderStatusStr',
          'label': this.$t('order_status'),
          'align': 'center',
          'minWidth': 124
        },
        {
          'show': true,
          'prop': 'soErrorTypeStr',
          'label': this.$t('so_error_type'),
          'align': 'center',
          'minWidth': 124
        },
        {
          'show': true,
          'prop': 'errorTypeStr',
          'label': this.$t('errorType'),
          'align': 'center',
          'minWidth': 124
        },
        {
          'show': true,
          'prop': 'errorReasonStr',
          'label': this.$t('errorReason'),
          'align': 'center',
          'minWidth': 200
        },
        {
          'show': true,
          'prop': 'ruleNodeStr',
          'label': this.$t('orderRule_label_watchNode'),
          'align': 'center',
          'minWidth': 124
        },
        {
          'show': true,
          'prop': 'merchantName',
          'label': this.$t('order_ruleMerchant'),
          'align': 'center',
          'minWidth': 124
        },
        {
          'show': true,
          'prop': 'storeName',
          'label': this.$t('sale_store'),
          'align': 'center',
          'minWidth': 124
        },
        {
          'show': true,
          'label': this.$t('timeoutAlertErrorCreateTime'),
          'align': 'center',
          'minWidth': 200,
          render: (h, params) => {
            return (<span>{params.row.extInfo.errorCreateTime}</span>)
          }
        },
        {
          'show': true,
          'prop': 'createTime',
          'label': this.$t('timeoutAlertTime'),
          'align': 'center',
          'minWidth': 200
        }
      ]
    }
  },
  watch: {
    currentTab: {
      handler(newValue, oldValue) {
      },
      deep: true
    }
  },

  methods: {
    async handlePageSizeChange(newSize) {
      try {
        this.page.size = newSize
        this.page.current = 1
        this.$emit('updateList', this.page)
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        this.$emit('updateList', this.page)
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
